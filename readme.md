* for requests to the bot two functions are used:
1. score - for stake evaluation. Has two parameters - "stakes" and "hand". Function will return "score" = 0,1,2 or 3
1. shot - game play. Has four parameters - "table_cards", "hand", "moves" and "wild_cards". Function will return "shot" - array of numbers (empty array for pass)

* all parameters are array of numbers (use json format):
1. stakes - stakes made by other players, for example - [1] or [] or [2,0] etc.
1. hand - cards in the player's hand
1. table_cards - cards on the table
1. moves - made moves is an array of arrays, for examle [[5],[6],[9],[10],[51],[27],[3,16,29,42],[],[]]
1.wild_cards - the three leftover wild cards are revealed to all players before being dealt to the landlord.

* saving game history:
* save_logs - 7 parameters:
1. random_position - id игроков за столом (первый тот, с кого начинаются торги) `["PlayerB", "PlayerC", "PlayerA"]`
1. stakes - сделанные игроками ставки (в том же порядке что они определены в random_position) `[0, 3]`
1. landlord - игрок победивший в торговле (можно однозначно вычислить по random_position и stakes) `"PlayerC"`
1. call_score - максимальная ставка (также однозначно определяется по stakes) `3`
1. multiple - коэффициент зависящий от действий игроков, см правила (так же может быть посчитан на основе полной информации в moves). `4`
1. winner - id победителя (точнее кто раньше всех скинул карты, помним, что фермеры побеждают вместе) `"PlayerA"`
1. moves - последовательность всех действий совершенных игроками


* tests:
1. select_combination - for check shot. Has one parameters - "hand". Function will return number of rule ("result":37 for example or "result":"ERROR" if combination not exists)
1. compare_combinations - for compare cards. Has two parameters - "handA" and "handB". Function will return "result" = -1,0,1 or null if it is impossible to compare

*card numbering (suits are not important):
* 0 A♥
* 1 2♥
* 2 3♥
* 3 4♥
* 4 5♥
* 5 6♥
* 6 7♥
* 7 8♥
* 8 9♥
* 9 0♥
* 10 J♥
* 11 Q♥
* 12 K♥
* 13 A♦
* 14 2♦
* 15 3♦
* 16 4♦
* 17 5♦
* 18 6♦
* 19 7♦
* 20 8♦
* 21 9♦
* 22 0♦
* 23 J♦
* 24 Q♦
* 25 K♦
* 26 A♠
* 27 2♠
* 28 3♠
* 29 4♠
* 30 5♠
* 31 6♠
* 32 7♠
* 33 8♠
* 34 9♠
* 35 0♠
* 36 J♠
* 37 Q♠
* 38 K♠
* 39 A♣
* 40 2♣
* 41 3♣
* 42 4♣
* 43 5♣
* 44 6♣
* 45 7♣
* 46 8♣
* 47 9♣
* 48 0♣
* 49 J♣
* 50 Q♣
* 51 K♣
* 52 Black Joker
* 53 Colored Joker
