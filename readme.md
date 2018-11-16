* for requests to the bot two functions are used:
1. score - for stake evaluation. Has two parameters - "stakes" and "hand". Function will return "score" = 0,1,2 or 3
1. shot - game play. Has four parameters - "table_cards", "hand", "moves" and "wild_cards". Function will return "shot" - array of numbers (empty array for pass)

* all parameters are array of numbers (use json format):
1. stakes - stakes made by other players, for example - [1] or [] or [2,0] etc.
1. hand - cards in the player's hand
1. table_cards - cards on the table
1. moves - made moves is an array of arrays, for examle [[5],[6],[9],[10],[51],[27],[3,16,29,42],[],[]]
1. wild_cards - the three leftover wild cards are revealed to all players before being dealt to the landlord.

* saving game history:
* save_logs - 9 parameters:
1. random_position - id игроков за столом (первый тот, с кого начинаются торги) `["PlayerB", "PlayerC", "PlayerA"]`
1. stakes - сделанные игроками ставки (в том же порядке что они определены в random_position) `[0, 3]`
1. landlord - игрок победивший в торговле (можно однозначно вычислить по random_position и stakes) `"PlayerC"`
1. call_score - максимальная ставка (также однозначно определяется по stakes) `3`
1. multiple - коэффициент зависящий от действий игроков, см правила (так же может быть посчитан на основе полной информации в moves). `4`
1. winner - id победителя (точнее кто раньше всех скинул карты, помним, что фермеры побеждают вместе) `"PlayerA"`
1. moves - последовательность всех действий совершенных игроками
1. wild_cards - the three leftover wild cards are revealed to all players before being dealt to the landlord.
1. starting_hands - карты игроков начиная с лорда  `[[0, 1, 2, 7, 14, 17, 23, 24, 30, 32, 33, 37, 41, 48, 49, 51, 53], [3, 8, 11, 12, 16, 18, 21, 26, 29, 31, 35, 38, 44, 45, 46, 47, 52], [4, 5, 6, 9, 10, 13, 15, 19, 20, 22, 25, 27, 28, 34, 36, 40, 50]]`

* tests:
1. select_combination - for check shot. Has one parameters - "hand". Function will return number of rule ("result":37 for example or "result":"ERROR" if combination not exists)
1. compare_combinations - for compare cards. Has two parameters - "handA" and "handB". Function will return "result" = -1,0,1 or null if it is impossible to compare

* dockerized:
1. sudo docker build -t minibox .
1. sudo docker run -it -d --restart=always --name miniNN minibox

1. sudo docker build -t minibox3nn .

###config

"saveLogs" for save logs in db

"bots"."paths"."log" - individual bot information 

*card numbering (suits are not important):
* 1   A
* 2   2
* 3   3
* 4   4
* 5   5
* 6   6
* 7   7
* 8   8
* 9   9
* 10 10
* 11  J
* 12  Q
* 13  K
* 14  A 
* 15  2
* 16  3
* 17  4
* 18  5
* 19  6
* 20  7
* 21  8
* 22  9
* 23 10
* 24  J
* 25  Q
* 26  K
* 27  A
* 28  2
* 29  3
* 30  4
* 31  5
* 32  6
* 33  7
* 34  8
* 35  9
* 36 10 
* 37  J
* 38  Q
* 39  K
* 40  A
* 41  2
* 42  3
* 43  4
* 44  5
* 45  6
* 46  7
* 47  8
* 48  9
* 49 10
* 50  J
* 51  Q
* 52  K
* 53 Black Joker
* 54 Colored Joker
