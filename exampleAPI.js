const http = require("http")
const urls = {score: '/score_test395', shot: '/shot_test395'}
const options = {
    hostname: 'localhost',
    port: 8080,
    method: 'POST'
  };

if (~process.argv.indexOf('--port')) options.port = process.argv[process.argv.indexOf('--port') + 1];
if (~process.argv.indexOf('--host')) options.hostname = process.argv[process.argv.indexOf('--host') + 1];

function cards_to_string(hand) {
    // B = Black & White Joker' C = 'Colored Joker
    cards = hand.map(p => p == 52 ? 'B' : p == 53 ? 'C' : 'A234567890JQK'[p % 13])
    cards.sort((a, b) => '34567890JQKA2BC'.indexOf(a) - '34567890JQKA2BC'.indexOf(b))
    return cards
}

async function POST_req(path, data) {
    data = JSON.stringify(data)
    // console.log(data);
    return new Promise(resolve => {
        const req = http.request({...options, path, headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
          }}, (res) => {
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
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
    let stakes = []
    let {players} = params
    let player_id = 0
    let lord_id = 0
    while (player_id < players.length) {
        let req = await POST_req(urls.score, {stakes, 
                                              hand: players[player_id].cards})
        stakes.push(req.score)
        console.log(`player: ${player_id} call ${req.score} with hand ${cards_to_string(players[player_id].cards).join('')}`);
        if (req.score == 3) return player_id
        if (req.score > 0) lord_id = player_id
        player_id++
    }
    return lord_id
}

async function playGame(params) {
    let {players, current_player_id, wild_cards, moves, table_cards} = params
    let req = await POST_req(urls.shot, {table_cards, 
                                        hand: players[current_player_id].cards,
                                        moves,
                                        wild_cards})
    moves.push(req.shot)
    console.log(`player: ${current_player_id} shot '${cards_to_string(req.shot).join('')}'  ${cards_to_string(players[current_player_id].cards).join('')}`);
    if (req.shot.length) {
        players[current_player_id].cards = players[current_player_id].cards.filter(c => !req.shot.includes(c))
        table_cards = req.shot
    } else {// pass
        if (moves[moves.length - 2].length == 0) table_cards = [] // two players pass 
    }
    if (!players[current_player_id].cards.length) return current_player_id //win id
    return playGame({
        players, 
        current_player_id: (current_player_id + 1) % 3, 
        wild_cards, 
        table_cards, 
        moves
    })
}

const players = [{cards:[]}, {cards:[]}, {cards:[]}]
let deck = []
for (let i = 0; i < 54; i++) deck.push(i)
let current_player_id = 0
for (let i = 0; i < 51; i++) {
    let rnd = Math.floor(Math.random() * deck.length)
    players[current_player_id].cards.push(deck[rnd])
    deck.splice(rnd, 1)
    current_player_id = (current_player_id + 1) % 3
}
console.log('stakes round...')

stakesRound({players}).then(lord_id => {
    players[lord_id].cards.push(...deck)
    console.log(`player: ${lord_id} is Lord, wild cards = ${cards_to_string(deck).join('')}`);
    playGame({players, 
            current_player_id: lord_id, 
            wild_cards: deck, // the three leftover wild cards
            table_cards: [], 
            moves: []}).then(res => {
                if (res === lord_id) console.log('Game Over! Landlord Win')
                else console.log('Game Over! Peasants Win')
            })
})
