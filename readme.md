* for requests to the bot two functions are used:
1. score - for stake evaluation. Has two parameters - "stakes" and "hand". Function will return "score" = 0,1,2 or 3
1. shot - game play. Has four parameters - "table_cards", "hand", "moves" and "wild_cards". Function will return "shot" - array of numbers (empty array for pass)

* all parameters are array of numbers (use json format):
1. stakes - stakes made by other players, for example - [1] or [] or [2,0] etc.
1. hand - cards in the player's hand
1. table_cards - cards on the table
1. moves - made moves is an array of arrays, for examle [[5],[6],[9],[10],[51],[27],[3,16,29,42],[],[]]
1.wild_cards - the three leftover wild cards are revealed to all players before being dealt to the landlord.

*card numbering:
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
* 52 Colored Joker
* 53 Black & White Joker
