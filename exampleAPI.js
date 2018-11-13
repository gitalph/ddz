const http = require("http")
const gameConf = require('./config.json')

const isDebug = process.argv.includes('-d')
const isLoop = process.argv.includes('-l')

let multiple = 1
let log_moves = []

const cards_to_string = (hand) => // B = Black & White Joker' C = 'Colored Joker
    hand.map(p => p == 53 ? 'B' : p == 54 ? 'C' : 'A234567890JQK'[(p - 1) % 13]).sort(
        (a, b) => '34567890JQKA2BC'.indexOf(a) - '34567890JQKA2BC'.indexOf(b))

async function POST_req(options, path, data) {
    data = JSON.stringify(data)
    if (isDebug) console.log(data);
    return new Promise(resolve => {
        const req = http.request({...options, path, method: 'POST', headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
          }}, (res) => {
            if (isDebug) {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            }
            res.setEncoding('utf8');
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
          });
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
        
        req.write(data);
        req.end();
    })
}

async function stakesRound(params) {
    let {players, stakes, starting_hands} = params
    let player_id = 0
    let lord_id = 0
    let maxScore = 0
    let starting_hands2 = starting_hands.map(h => [...h])
    while (player_id < players.length) {
        let req = await POST_req(players[player_id], players[player_id].paths.score, {stakes, 
                                              hand: players[player_id].cards, starting_hands: starting_hands2})
        stakes.push(req.score)
        console.log(`${players[player_id].botId} call ${req.score} with hand ${cards_to_string(players[player_id].cards).join('')}`);
        if (req.score == 3) return player_id
        if (req.score > maxScore) {
            maxScore = req.score
            lord_id = player_id
        }
        player_id++
        starting_hands2.push(starting_hands2.shift())
    }
    if (maxScore) return lord_id
    return -1
}

async function playGame(params) {
    let {players, current_player_id, wild_cards, moves, table_cards, starting_hands} = params
    let req = await POST_req(players[current_player_id], players[current_player_id].paths.shot, {table_cards, 
                                        hand: players[current_player_id].cards,
                                        moves,
                                        wild_cards, starting_hands,
                                    deep: 1})
    moves.push(req.shot)
    console.log(`${players[current_player_id].botId} shot '${cards_to_string(req.shot).join('')}'  ${cards_to_string(players[current_player_id].cards).join('')}`);
    if (req.shot.length) {
        players[current_player_id].cards = players[current_player_id].cards.filter(c => !req.shot.includes(c))
        table_cards = req.shot
    } else {// pass
        try {
            if (moves[moves.length - 2].length == 0) table_cards = [] // two players pass 
        } catch {

        }
    }
    log_moves = moves
    if (!players[current_player_id].cards.length) return current_player_id //win id
    return playGame({
        players, 
        current_player_id: (current_player_id + 1) % 3, 
        wild_cards, 
        table_cards, 
        moves,
        starting_hands
    })
}

async function oneGame() {
    do {
        const players = gameConf.bots.map(b => ({...b, cards:[]}))
        let iterCnt = Math.floor(Math.random() * 3)
        while (iterCnt--) players.push(players.shift())
        let deck = []
        for (let i = 0; i < 54; i++) deck.push(i + 1)
        let current_player_id = 0
        for (let i = 0; i < 51; i++) {
            let rnd = Math.floor(Math.random() * deck.length)
            players[current_player_id].cards.push(deck[rnd])
            deck.splice(rnd, 1)
            current_player_id = (current_player_id + 1) % 3
        }

        let starting_hands = players.map(player => [...player.cards])

        console.log('stakes round...')

        let stakes = []

        let lord_id = await stakesRound({players, stakes, starting_hands})

        if (lord_id === -1) continue

        if (lord_id > 0) starting_hands.push(starting_hands.shift())
        if (lord_id === 2) starting_hands.push(starting_hands.shift())
        let call_score = Math.max(...stakes)
        players[lord_id].cards.push(...deck)
        console.log(`${players[lord_id].botId} is Lord, wild cards = ${cards_to_string(deck).join('')}`);
        let winner_id = await playGame({players, 
                    current_player_id: lord_id, 
                    wild_cards: deck, // the three leftover wild cards
                    table_cards: [], 
                    moves: [],
                    starting_hands})
        
        if (winner_id === lord_id) console.log('Game Over! Landlord Win')
        else console.log('Game Over! Peasants Win')
        
        await POST_req(gameConf.saveLogs, gameConf.saveLogs.path, {random_position: players.map(b => b.botId), 
            landlord: players[lord_id].botId, 
            stakes, call_score, multiple, 
            winner: players[winner_id].botId,
            moves: log_moves,
            wild_cards: deck,
            starting_hands})
    } while (isLoop)
}

oneGame()
