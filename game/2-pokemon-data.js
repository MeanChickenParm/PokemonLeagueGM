// ================= POKÉMON DATA =================
// Pokémon League GM's reference tables: species, legendaries, base stats, Paradox Pokémon, baby legendaries,
// Mega forms, moves, signature moves and ability slots. Every table is plain text, one entry per line,
// and the engine reads them when the game starts. This file loads before the engine (see build.py).

// ---------- SPECIES_RAW (regular species) ----------
// name|type1|type2|bst|evolution@level|flags (r=rare in the wild, s=starter)
const SPECIES_RAW = `Rattata|Normal||253|Raticate@20
Raticate|Normal||413
Pidgey|Normal|Flying|251|Pidgeotto@18
Pidgeotto|Normal|Flying|349|Pidgeot@36
Pidgeot|Normal|Flying|479
Spearow|Normal|Flying|262|Fearow@20
Fearow|Normal|Flying|442
Eevee|Normal||325|Vaporeon@25/Jolteon@25/Flareon@25/Espeon@25/Umbreon@25/Leafeon@25/Glaceon@25/Sylveon@25
Porygon|Normal||395|Porygon2@35
Tauros|Normal||490
Kangaskhan|Normal||490||r
Snorlax|Normal||540
Charmander|Fire||309|Charmeleon@16|s
Charmeleon|Fire||405|Charizard@36
Charizard|Fire|Flying|534
Cyndaquil|Fire||309|Quilava@14|s
Quilava|Fire||405|Typhlosion@36/Hisuian Typhlosion@36
Typhlosion|Fire||534
Growlithe|Fire||350|Arcanine@32
Arcanine|Fire||555
Vulpix|Fire||299|Ninetales@30
Ninetales|Fire||505
Ponyta|Fire||410|Rapidash@40
Rapidash|Fire||500
Magmar|Fire||495|Magmortar@45
Houndour|Dark|Fire|330|Houndoom@24
Houndoom|Dark|Fire|500
Squirtle|Water||314|Wartortle@16|s
Wartortle|Water||405|Blastoise@36
Blastoise|Water||530
Totodile|Water||314|Croconaw@18|s
Croconaw|Water||405|Feraligatr@30
Feraligatr|Water||530
Psyduck|Water||320|Golduck@33
Golduck|Water||500
Poliwag|Water||300|Poliwhirl@25
Poliwhirl|Water||385|Poliwrath@36/Politoed@36
Poliwrath|Water|Fighting|510
Magikarp|Water||200|Gyarados@20
Gyarados|Water|Flying|540
Staryu|Water||340|Starmie@30
Starmie|Water|Psychic|520
Seel|Water||325|Dewgong@34
Dewgong|Water|Ice|475
Marill|Water|Fairy|250|Azumarill@18
Azumarill|Water|Fairy|420
Lapras|Water|Ice|535||r
Omanyte|Rock|Water|355|Omastar@40
Omastar|Rock|Water|495
Bulbasaur|Grass|Poison|318|Ivysaur@16|s
Ivysaur|Grass|Poison|405|Venusaur@32
Venusaur|Grass|Poison|525
Chikorita|Grass||318|Bayleef@16|s
Bayleef|Grass||405|Meganium@32
Meganium|Grass||525
Oddish|Grass|Poison|320|Gloom@21
Gloom|Grass|Poison|395|Vileplume@32/Bellossom@32
Vileplume|Grass|Poison|490
Bellsprout|Grass|Poison|300|Weepinbell@21
Weepinbell|Grass|Poison|390|Victreebel@32
Victreebel|Grass|Poison|490
Exeggcute|Grass|Psychic|325|Exeggutor@30/Alolan Exeggutor@30
Exeggutor|Grass|Psychic|530
Tangela|Grass||435|Tangrowth@40
Pikachu|Electric||320|Raichu@30/Alolan Raichu@30
Raichu|Electric||485
Magnemite|Electric|Steel|325|Magneton@30
Magneton|Electric|Steel|465|Magnezone@45
Voltorb|Electric||330|Electrode@30
Electrode|Electric||490
Mareep|Electric||280|Flaaffy@15
Flaaffy|Electric||365|Ampharos@30
Ampharos|Electric||510
Electabuzz|Electric||490|Electivire@45
Jynx|Ice|Psychic|455
Swinub|Ice|Ground|250|Piloswine@33
Piloswine|Ice|Ground|450|Mamoswine@45
Sneasel|Dark|Ice|430|Weavile@40
Snorunt|Ice||300|Glalie@42/Froslass@42
Glalie|Ice||480
Machop|Fighting||305|Machoke@28
Machoke|Fighting||405|Machamp@40
Machamp|Fighting||505
Mankey|Fighting||305|Primeape@28
Primeape|Fighting||455|Annihilape@45
Hitmonlee|Fighting||455
Riolu|Fighting||285|Lucario@30
Lucario|Fighting|Steel|525
Heracross|Bug|Fighting|500||r
Ekans|Poison||288|Arbok@22
Arbok|Poison||448
Grimer|Poison||325|Muk@38
Muk|Poison||500
Koffing|Poison||340|Weezing@35/Galarian Weezing@35
Weezing|Poison||490
Venonat|Bug|Poison|305|Venomoth@31
Venomoth|Bug|Poison|450
Sandshrew|Ground||300|Sandslash@22
Sandslash|Ground||450
Diglett|Ground||265|Dugtrio@26
Dugtrio|Ground||425
Cubone|Ground||320|Marowak@28/Alolan Marowak@28
Marowak|Ground||425
Rhyhorn|Ground|Rock|345|Rhydon@42
Rhydon|Ground|Rock|485|Rhyperior@55
Gible|Dragon|Ground|300|Gabite@24|r
Gabite|Dragon|Ground|410|Garchomp@48
Garchomp|Dragon|Ground|600
Aerodactyl|Rock|Flying|515||r
Skarmory|Steel|Flying|465
Murkrow|Dark|Flying|405|Honchkrow@40
Abra|Psychic||310|Kadabra@16
Kadabra|Psychic||400|Alakazam@36
Alakazam|Psychic||500
Drowzee|Psychic||328|Hypno@26
Hypno|Psychic||483
Ralts|Psychic|Fairy|198|Kirlia@20
Kirlia|Psychic|Fairy|278|Gardevoir@30/Gallade@30
Gardevoir|Psychic|Fairy|518
Scyther|Bug|Flying|500|Scizor@35/Kleavor@35|r
Pinsir|Bug||500
Geodude|Rock|Ground|300|Graveler@25
Graveler|Rock|Ground|390|Golem@36
Golem|Rock|Ground|495
Onix|Rock|Ground|385|Steelix@35
Larvitar|Rock|Ground|300|Pupitar@30|r
Pupitar|Rock|Ground|410|Tyranitar@55
Tyranitar|Rock|Dark|600
Gastly|Ghost|Poison|310|Haunter@25
Haunter|Ghost|Poison|405|Gengar@38
Gengar|Ghost|Poison|500
Misdreavus|Ghost||435|Mismagius@40
Shuppet|Ghost||295|Banette@37
Banette|Ghost||455
Duskull|Ghost||295|Dusclops@37
Dusclops|Ghost||455|Dusknoir@50
Swablu|Normal|Flying|310|Altaria@35
Altaria|Dragon|Flying|490
Horsea|Water||295|Seadra@32
Seadra|Water||440|Kingdra@45
Kingdra|Water|Dragon|540
Trapinch|Ground||290|Vibrava@35
Vibrava|Ground|Dragon|340|Flygon@45
Flygon|Ground|Dragon|520
Axew|Dragon||320|Fraxure@38
Fraxure|Dragon||410|Haxorus@48
Haxorus|Dragon||540
Dratini|Dragon||300|Dragonair@30|r
Dragonair|Dragon||420|Dragonite@55
Dragonite|Dragon|Flying|600
Bagon|Dragon||300|Shelgon@30|r
Shelgon|Dragon||420|Salamence@50
Salamence|Dragon|Flying|600
Umbreon|Dark||525
Absol|Dark||465
Bronzor|Steel|Psychic|300|Bronzong@33
Bronzong|Steel|Psychic|500
Aron|Steel|Rock|330|Lairon@32
Lairon|Steel|Rock|430|Aggron@42
Aggron|Steel|Rock|530
Beldum|Steel|Psychic|300|Metang@20|r
Metang|Steel|Psychic|420|Metagross@45
Metagross|Steel|Psychic|600
Mawile|Steel|Fairy|380
Clefairy|Fairy||323|Clefable@30
Clefable|Fairy||483
Snubbull|Fairy||300|Granbull@23
Granbull|Fairy||450
Pichu|Electric||205|Pikachu@12
Cleffa|Fairy||218|Clefairy@12
Azurill|Normal|Fairy|190|Marill@10
Smoochum|Ice|Psychic|305|Jynx@30
Elekid|Electric||360|Electabuzz@30
Magby|Fire||365|Magmar@30
Tyrogue|Fighting||210|Hitmonlee@20/Hitmonchan@20/Hitmontop@20
Hitmonchan|Fighting||455
Hitmontop|Fighting||455
Munchlax|Normal||390|Snorlax@30|r
Vaporeon|Water||525
Jolteon|Electric||525
Flareon|Fire||525
Espeon|Psychic||525
Leafeon|Grass||525
Glaceon|Ice||525
Sylveon|Fairy||525
Porygon2|Normal||515|Porygon-Z@50
Porygon-Z|Normal||535
Magmortar|Fire||540
Electivire|Electric||540
Bellossom|Grass||490
Tangrowth|Grass||535
Magnezone|Electric|Steel|535
Mamoswine|Ice|Ground|530
Weavile|Dark|Ice|510
Froslass|Ice|Ghost|480
Annihilape|Fighting|Ghost|535
Rhyperior|Ground|Rock|535
Honchkrow|Dark|Flying|505
Gallade|Psychic|Fighting|518
Scizor|Bug|Steel|500
Kleavor|Bug|Rock|500
Steelix|Steel|Ground|510
Mismagius|Ghost||495
Dusknoir|Ghost||525
Politoed|Water||500
Snivy|Grass||308|Servine@17|s
Servine|Grass||413|Serperior@36
Serperior|Grass||528
Tepig|Fire||308|Pignite@17|s
Pignite|Fire|Fighting|418|Emboar@36
Emboar|Fire|Fighting|528
Oshawott|Water||308|Dewott@17|s
Dewott|Water||413|Samurott@36/Hisuian Samurott@36
Samurott|Water||528
Patrat|Normal||255|Watchog@20
Watchog|Normal||420
Lillipup|Normal||275|Herdier@16
Herdier|Normal||370|Stoutland@32
Stoutland|Normal||500
Purrloin|Dark||281|Liepard@20
Liepard|Dark||446
Pansage|Grass||316|Simisage@30
Simisage|Grass||498
Pansear|Fire||316|Simisear@30
Simisear|Fire||498
Panpour|Water||316|Simipour@30
Simipour|Water||498
Munna|Psychic||292|Musharna@30
Musharna|Psychic||487
Pidove|Normal|Flying|264|Tranquill@21
Tranquill|Normal|Flying|358|Unfezant@32
Unfezant|Normal|Flying|488
Blitzle|Electric||295|Zebstrika@27
Zebstrika|Electric||497
Roggenrola|Rock||280|Boldore@25
Boldore|Rock||390|Gigalith@40
Gigalith|Rock||515
Woobat|Psychic|Flying|323|Swoobat@25
Swoobat|Psychic|Flying|425
Drilbur|Ground||328|Excadrill@31
Excadrill|Ground|Steel|508
Audino|Normal||445
Timburr|Fighting||305|Gurdurr@25
Gurdurr|Fighting||405|Conkeldurr@40
Conkeldurr|Fighting||505
Tympole|Water||294|Palpitoad@25
Palpitoad|Water|Ground|384|Seismitoad@36
Seismitoad|Water|Ground|509
Throh|Fighting||465
Sawk|Fighting||465
Sewaddle|Bug|Grass|310|Swadloon@20
Swadloon|Bug|Grass|380|Leavanny@30
Leavanny|Bug|Grass|500
Venipede|Bug|Poison|260|Whirlipede@22
Whirlipede|Bug|Poison|360|Scolipede@30
Scolipede|Bug|Poison|485
Cottonee|Grass|Fairy|280|Whimsicott@30
Whimsicott|Grass|Fairy|480
Petilil|Grass||280|Lilligant@30/Hisuian Lilligant@30
Lilligant|Grass||480
Basculin|Water||460
Basculegion|Water|Ghost|530
Sandile|Ground|Dark|292|Krokorok@29
Krokorok|Ground|Dark|351|Krookodile@40
Krookodile|Ground|Dark|519
Darumaka|Fire||315|Darmanitan@35
Darmanitan|Fire||480
Maractus|Grass||461
Dwebble|Bug|Rock|325|Crustle@34
Crustle|Bug|Rock|485
Scraggy|Dark|Fighting|348|Scrafty@39
Scrafty|Dark|Fighting|488
Sigilyph|Psychic|Flying|490
Yamask|Ghost||303|Cofagrigus@34
Cofagrigus|Ghost||483
Tirtouga|Water|Rock|355|Carracosta@37
Carracosta|Water|Rock|495
Archen|Rock|Flying|401|Archeops@37|r
Archeops|Rock|Flying|567
Trubbish|Poison||329|Garbodor@36
Garbodor|Poison||474
Zorua|Dark||330|Zoroark@30|r
Zoroark|Dark||510
Minccino|Normal||300|Cinccino@30
Cinccino|Normal||470
Gothita|Psychic||290|Gothorita@32
Gothorita|Psychic||390|Gothitelle@41
Gothitelle|Psychic||490
Solosis|Psychic||290|Duosion@32
Duosion|Psychic||370|Reuniclus@41
Reuniclus|Psychic||490
Ducklett|Water|Flying|305|Swanna@35
Swanna|Water|Flying|473
Vanillite|Ice||305|Vanillish@35
Vanillish|Ice||395|Vanilluxe@47
Vanilluxe|Ice||535
Deerling|Normal|Grass|335|Sawsbuck@34
Sawsbuck|Normal|Grass|475
Emolga|Electric|Flying|428
Karrablast|Bug||315|Escavalier@35
Escavalier|Bug|Steel|495
Foongus|Grass|Poison|294|Amoonguss@39
Amoonguss|Grass|Poison|464
Frillish|Water|Ghost|335|Jellicent@40
Jellicent|Water|Ghost|480
Alomomola|Water||470
Joltik|Bug|Electric|319|Galvantula@36
Galvantula|Bug|Electric|472
Ferroseed|Grass|Steel|305|Ferrothorn@40
Ferrothorn|Grass|Steel|489
Klink|Steel||300|Klang@38
Klang|Steel||440|Klinklang@49
Klinklang|Steel||520
Tynamo|Electric||275|Eelektrik@39
Eelektrik|Electric||405|Eelektross@45
Eelektross|Electric||515
Elgyem|Psychic||335|Beheeyem@42
Beheeyem|Psychic||485
Litwick|Ghost|Fire|275|Lampent@41
Lampent|Ghost|Fire|370|Chandelure@48
Chandelure|Ghost|Fire|520
Cubchoo|Ice||305|Beartic@37
Beartic|Ice||505
Cryogonal|Ice||515
Shelmet|Bug||305|Accelgor@35
Accelgor|Bug||495
Stunfisk|Ground|Electric|471
Mienfoo|Fighting||350|Mienshao@50
Mienshao|Fighting||510
Druddigon|Dragon||485||r
Golett|Ground|Ghost|303|Golurk@43
Golurk|Ground|Ghost|483
Pawniard|Dark|Steel|340|Bisharp@52
Bisharp|Dark|Steel|490|Kingambit@64
Kingambit|Dark|Steel|550
Bouffalant|Normal||490
Rufflet|Normal|Flying|350|Braviary@54/Hisuian Braviary@54
Braviary|Normal|Flying|510
Vullaby|Dark|Flying|370|Mandibuzz@54
Mandibuzz|Dark|Flying|510
Heatmor|Fire||484
Durant|Bug|Steel|484
Deino|Dark|Dragon|300|Zweilous@50|r
Zweilous|Dark|Dragon|420|Hydreigon@64
Hydreigon|Dark|Dragon|600
Larvesta|Bug|Fire|360|Volcarona@59|r
Volcarona|Bug|Fire|550
Caterpie|Bug||195|Metapod@7
Metapod|Bug||205|Butterfree@10
Butterfree|Bug|Flying|395
Weedle|Bug|Poison|195|Kakuna@7
Kakuna|Bug|Poison|205|Beedrill@10
Beedrill|Bug|Poison|395
Krabby|Water||325|Kingler@28
Kingler|Water||475
Hoothoot|Normal|Flying|262|Noctowl@20
Noctowl|Normal|Flying|452
Phanpy|Ground||330|Donphan@25
Donphan|Ground||500
Treecko|Grass||310|Grovyle@16|s
Grovyle|Grass||405|Sceptile@36
Sceptile|Grass||530
Torchic|Fire||310|Combusken@16|s
Combusken|Fire|Fighting|405|Blaziken@36
Blaziken|Fire|Fighting|530
Mudkip|Water||310|Marshtomp@16|s
Marshtomp|Water|Ground|405|Swampert@36
Swampert|Water|Ground|535
Taillow|Normal|Flying|270|Swellow@22
Swellow|Normal|Flying|455
Corphish|Water||308|Crawdaunt@30
Crawdaunt|Water|Dark|468
Torkoal|Fire||470
Zubat|Poison|Flying|245|Golbat@22
Golbat|Poison|Flying|455|Crobat@35
Crobat|Poison|Flying|535
Pineco|Bug||290|Forretress@31
Forretress|Bug|Steel|465
Lotad|Water|Grass|220|Lombre@14
Lombre|Water|Grass|340|Ludicolo@35
Ludicolo|Water|Grass|480
Bonsly|Rock||290|Sudowoodo@20
Sudowoodo|Rock||410
Croagunk|Poison|Fighting|300|Toxicroak@37
Toxicroak|Poison|Fighting|490
Goldeen|Water||320|Seaking@33
Seaking|Water||450
Togepi|Fairy||245|Togetic@20|r
Togetic|Fairy|Flying|405|Togekiss@40
Togekiss|Fairy|Flying|545
Corsola|Water|Rock|410
Luvdisc|Water||330
Hoppip|Grass|Flying|250|Skiploom@18
Skiploom|Grass|Flying|340|Jumpluff@27
Jumpluff|Grass|Flying|460
Spinarak|Bug|Poison|250|Ariados@22
Ariados|Bug|Poison|400
Mime Jr.|Psychic|Fairy|310|Mr. Mime@20/Galarian Mr. Mime@20
Mr. Mime|Psychic|Fairy|460
Slugma|Fire||250|Magcargo@38
Magcargo|Fire|Rock|430
Nidoran♀|Poison||275|Nidorina@16
Nidorina|Poison||365|Nidoqueen@36
Nidoqueen|Poison|Ground|505
Nidoran♂|Poison||273|Nidorino@16
Nidorino|Poison||365|Nidoking@36
Nidoking|Poison|Ground|505
Meowth|Normal||290|Persian@28
Persian|Normal||440
Doduo|Normal|Flying|310|Dodrio@31
Dodrio|Normal|Flying|470
Miltank|Normal||490
Nosepass|Rock||375|Probopass@40
Probopass|Rock|Steel|525
Makuhita|Fighting||237|Hariyama@24
Hariyama|Fighting||474
Meditite|Fighting|Psychic|280|Medicham@37
Medicham|Fighting|Psychic|410
Electrike|Electric||295|Manectric@26
Manectric|Electric||475
Numel|Fire|Ground|305|Camerupt@33
Camerupt|Fire|Ground|460
Slakoth|Normal||280|Vigoroth@18|r
Vigoroth|Normal||440|Slaking@36
Slaking|Normal||560
Spinda|Normal||360
Zigzagoon|Normal||240|Linoone@20
Linoone|Normal||420
Wingull|Water|Flying|270|Pelipper@25
Pelipper|Water|Flying|440
Tropius|Grass|Flying|460
Lunatone|Rock|Psychic|460
Solrock|Rock|Psychic|460
Baltoy|Ground|Psychic|300|Claydol@36
Claydol|Ground|Psychic|500
Natu|Psychic|Flying|320|Xatu@25
Xatu|Psychic|Flying|470
Feebas|Water||200|Milotic@30|r
Milotic|Water||540
Wailmer|Water||400|Wailord@40
Wailord|Water||500
Carvanha|Water|Dark|305|Sharpedo@30
Sharpedo|Water|Dark|460
Barboach|Water|Ground|288|Whiscash@30
Whiscash|Water|Ground|468
Tentacool|Water|Poison|335|Tentacruel@30
Tentacruel|Water|Poison|515
Spheal|Ice|Water|290|Sealeo@32
Sealeo|Ice|Water|410|Walrein@44
Walrein|Ice|Water|530
Igglybuff|Normal|Fairy|210|Jigglypuff@15
Jigglypuff|Normal|Fairy|270|Wigglytuff@30
Wigglytuff|Normal|Fairy|435
Paras|Bug|Grass|285|Parasect@24
Parasect|Bug|Grass|405
Slowpoke|Water|Psychic|315|Slowbro@37/Slowking@37
Slowbro|Water|Psychic|490
Slowking|Water|Psychic|490
Farfetch'd|Normal|Flying|377
Shellder|Water||305|Cloyster@30
Cloyster|Water|Ice|525
Lickitung|Normal||385|Lickilicky@33
Lickilicky|Normal||515
Happiny|Normal||220|Chansey@15
Chansey|Normal||450|Blissey@40
Blissey|Normal||540
Ditto|Normal||288
Kabuto|Rock|Water|355|Kabutops@40|r
Kabutops|Rock|Water|495
Sentret|Normal||215|Furret@15
Furret|Normal||415
Ledyba|Bug|Flying|265|Ledian@18
Ledian|Bug|Flying|390
Chinchou|Water|Electric|330|Lanturn@27
Lanturn|Water|Electric|460
Aipom|Normal||360|Ambipom@32
Ambipom|Normal||482
Sunkern|Grass||180|Sunflora@25
Sunflora|Grass||425
Yanma|Bug|Flying|390|Yanmega@33
Yanmega|Bug|Flying|515
Wooper|Water|Ground|210|Quagsire@20
Quagsire|Water|Ground|430
Unown|Psychic||336
Wynaut|Psychic||260|Wobbuffet@15
Wobbuffet|Psychic||405
Girafarig|Normal|Psychic|455|Farigiraf@40
Farigiraf|Normal|Psychic|520
Dunsparce|Normal||415|Dudunsparce@40
Dudunsparce|Normal||520
Gligar|Ground|Flying|430|Gliscor@40
Gliscor|Ground|Flying|510
Qwilfish|Water|Poison|440
Shuckle|Bug|Rock|360
Teddiursa|Normal||330|Ursaring@30
Ursaring|Normal||500|Ursaluna@50
Ursaluna|Ground|Normal|550
Remoraid|Water||300|Octillery@25
Octillery|Water||480
Delibird|Ice|Flying|330
Mantyke|Water|Flying|345|Mantine@25
Mantine|Water|Flying|485
Stantler|Normal||465|Wyrdeer@40
Wyrdeer|Normal|Psychic|525
Smeargle|Normal||250
Poochyena|Dark||220|Mightyena@18
Mightyena|Dark||420
Wurmple|Bug||195|Silcoon@7/Cascoon@7
Silcoon|Bug||205|Beautifly@10
Beautifly|Bug|Flying|395
Cascoon|Bug||205|Dustox@10
Dustox|Bug|Poison|385
Seedot|Grass||220|Nuzleaf@14
Nuzleaf|Grass|Dark|340|Shiftry@32
Shiftry|Grass|Dark|480
Surskit|Bug|Water|269|Masquerain@22
Masquerain|Bug|Flying|454
Shroomish|Grass||295|Breloom@23
Breloom|Grass|Fighting|460
Nincada|Bug|Ground|266|Ninjask@20
Ninjask|Bug|Flying|456
Shedinja|Bug|Ghost|236||r
Whismur|Normal||240|Loudred@20
Loudred|Normal||360|Exploud@40
Exploud|Normal||490
Skitty|Normal||260|Delcatty@25
Delcatty|Normal||400
Sableye|Dark|Ghost|380
Plusle|Electric||405
Minun|Electric||405
Volbeat|Bug||430
Illumise|Bug||430
Budew|Grass|Poison|280|Roselia@15
Roselia|Grass|Poison|400|Roserade@35
Roserade|Grass|Poison|515
Gulpin|Poison||302|Swalot@26
Swalot|Poison||467
Spoink|Psychic||330|Grumpig@32
Grumpig|Psychic||470
Cacnea|Grass||335|Cacturne@32
Cacturne|Grass|Dark|475
Zangoose|Normal||458
Seviper|Poison||458
Lileep|Rock|Grass|355|Cradily@40|r
Cradily|Rock|Grass|495
Anorith|Rock|Bug|355|Armaldo@40|r
Armaldo|Rock|Bug|495
Castform|Normal||420
Kecleon|Normal||440
Chingling|Psychic||285|Chimecho@20
Chimecho|Psychic||455
Clamperl|Water||345|Huntail@30/Gorebyss@30
Huntail|Water||485
Gorebyss|Water||485
Relicanth|Water|Rock|485
Turtwig|Grass||318|Grotle@18|s
Grotle|Grass||405|Torterra@32
Torterra|Grass|Ground|525
Chimchar|Fire||309|Monferno@14|s
Monferno|Fire|Fighting|405|Infernape@36
Infernape|Fire|Fighting|534
Piplup|Water||314|Prinplup@16|s
Prinplup|Water||405|Empoleon@36
Empoleon|Water|Steel|530
Starly|Normal|Flying|245|Staravia@14
Staravia|Normal|Flying|340|Staraptor@34
Staraptor|Normal|Flying|485
Bidoof|Normal||250|Bibarel@15
Bibarel|Normal|Water|410
Kricketot|Bug||194|Kricketune@10
Kricketune|Bug||384
Shinx|Electric||263|Luxio@15
Luxio|Electric||363|Luxray@30
Luxray|Electric||523
Cranidos|Rock||350|Rampardos@30|r
Rampardos|Rock||495
Shieldon|Rock|Steel|350|Bastiodon@30|r
Bastiodon|Rock|Steel|495
Burmy|Bug||224|Wormadam@20/Mothim@20
Wormadam|Bug|Grass|424
Mothim|Bug|Flying|424
Combee|Bug|Flying|244|Vespiquen@21
Vespiquen|Bug|Flying|474
Pachirisu|Electric||405
Buizel|Water||330|Floatzel@26
Floatzel|Water||495
Cherubi|Grass||275|Cherrim@25
Cherrim|Grass||450
Shellos|Water||325|Gastrodon@30
Gastrodon|Water|Ground|475
Drifloon|Ghost|Flying|348|Drifblim@28
Drifblim|Ghost|Flying|498
Buneary|Normal||350|Lopunny@30
Lopunny|Normal||480
Glameow|Normal||310|Purugly@38
Purugly|Normal||452
Stunky|Poison|Dark|329|Skuntank@34
Skuntank|Poison|Dark|479
Chatot|Normal|Flying|411
Spiritomb|Ghost|Dark|485||r
Hippopotas|Ground||330|Hippowdon@34
Hippowdon|Ground||525
Skorupi|Poison|Bug|330|Drapion@40
Drapion|Poison|Dark|500
Carnivine|Grass||454
Finneon|Water||330|Lumineon@31
Lumineon|Water||460
Snover|Grass|Ice|334|Abomasnow@40
Abomasnow|Grass|Ice|494
Rotom|Electric|Ghost|440
Goomy|Dragon||300|Sliggoo@40/Hisuian Sliggoo@40|r
Sliggoo|Dragon||452|Goodra@50
Goodra|Dragon||600
Noibat|Flying|Dragon|245|Noivern@48
Noivern|Flying|Dragon|535
Tyrunt|Rock|Dragon|362|Tyrantrum@39|r
Tyrantrum|Rock|Dragon|521
Skrelp|Poison|Water|320|Dragalge@48
Dragalge|Poison|Dragon|494
Jangmo-o|Dragon||300|Hakamo-o@35|r
Hakamo-o|Dragon|Fighting|420|Kommo-o@45
Kommo-o|Dragon|Fighting|600
Turtonator|Fire|Dragon|485||r
Drampa|Normal|Dragon|485||r
Applin|Grass|Dragon|260|Flapple@30/Appletun@30/Dipplin@30
Flapple|Grass|Dragon|485
Appletun|Grass|Dragon|485
Dipplin|Grass|Dragon|485|Hydrapple@45
Hydrapple|Grass|Dragon|540
Dracozolt|Electric|Dragon|505||r
Arctozolt|Electric|Ice|505||r
Dracovish|Water|Dragon|505||r
Arctovish|Water|Ice|505||r
Duraludon|Steel|Dragon|535|Archaludon@50|r
Archaludon|Steel|Dragon|600
Dreepy|Dragon|Ghost|270|Drakloak@50|r
Drakloak|Dragon|Ghost|410|Dragapult@60
Dragapult|Dragon|Ghost|600
Cyclizar|Dragon|Normal|501
Tatsugiri|Dragon|Water|475
Frigibax|Dragon|Ice|320|Arctibax@35|r
Arctibax|Dragon|Ice|423|Baxcalibur@54
Baxcalibur|Dragon|Ice|600
Chespin|Grass||313|Quilladin@16|s
Quilladin|Grass||405|Chesnaught@36
Chesnaught|Grass|Fighting|530
Fennekin|Fire||307|Braixen@16|s
Braixen|Fire||409|Delphox@36
Delphox|Fire|Psychic|534
Froakie|Water||314|Frogadier@16|s
Frogadier|Water||405|Greninja@36
Greninja|Water|Dark|530
Bunnelby|Normal||237|Diggersby@20
Diggersby|Normal|Ground|423
Fletchling|Normal|Flying|278|Fletchinder@17
Fletchinder|Fire|Flying|382|Talonflame@35
Talonflame|Fire|Flying|499
Scatterbug|Bug||200|Spewpa@9
Spewpa|Bug||213|Vivillon@12
Vivillon|Bug|Flying|411
Litleo|Fire|Normal|369|Pyroar@35
Pyroar|Fire|Normal|507
Flabébé|Fairy||303|Floette@19
Floette|Fairy||371|Florges@40
Florges|Fairy||552
Skiddo|Grass||350|Gogoat@32
Gogoat|Grass||531
Pancham|Fighting||348|Pangoro@32
Pangoro|Fighting|Dark|495
Furfrou|Normal||472
Espurr|Psychic||355|Meowstic@25
Meowstic|Psychic||466
Honedge|Steel|Ghost|325|Doublade@35
Doublade|Steel|Ghost|448|Aegislash@45
Aegislash|Steel|Ghost|500
Spritzee|Fairy||341|Aromatisse@30
Aromatisse|Fairy||462
Swirlix|Fairy||341|Slurpuff@30
Slurpuff|Fairy||480
Inkay|Dark|Psychic|288|Malamar@30
Malamar|Dark|Psychic|482
Binacle|Rock|Water|306|Barbaracle@39
Barbaracle|Rock|Water|500
Clauncher|Water||330|Clawitzer@37
Clawitzer|Water||500
Helioptile|Electric|Normal|289|Heliolisk@30
Heliolisk|Electric|Normal|481
Amaura|Rock|Ice|362|Aurorus@39|r
Aurorus|Rock|Ice|521
Hawlucha|Fighting|Flying|500
Dedenne|Electric|Fairy|431
Carbink|Rock|Fairy|400
Klefki|Steel|Fairy|470
Phantump|Ghost|Grass|309|Trevenant@30
Trevenant|Ghost|Grass|474
Pumpkaboo|Ghost|Grass|335|Gourgeist@30
Gourgeist|Ghost|Grass|494
Bergmite|Ice||304|Avalugg@37/Hisuian Avalugg@37
Avalugg|Ice||514
Rowlet|Grass|Flying|320|Dartrix@17|s
Dartrix|Grass|Flying|420|Decidueye@34/Hisuian Decidueye@34
Decidueye|Grass|Ghost|530
Litten|Fire||320|Torracat@17|s
Torracat|Fire||420|Incineroar@34
Incineroar|Fire|Dark|530
Popplio|Water||320|Brionne@17|s
Brionne|Water||420|Primarina@34
Primarina|Water|Fairy|530
Pikipek|Normal|Flying|265|Trumbeak@14
Trumbeak|Normal|Flying|355|Toucannon@28
Toucannon|Normal|Flying|485
Yungoos|Normal||253|Gumshoos@20
Gumshoos|Normal||418
Grubbin|Bug||300|Charjabug@20
Charjabug|Bug|Electric|400|Vikavolt@35
Vikavolt|Bug|Electric|500
Crabrawler|Fighting||338|Crabominable@30
Crabominable|Fighting|Ice|478
Oricorio|Fire|Flying|476
Cutiefly|Bug|Fairy|304|Ribombee@25
Ribombee|Bug|Fairy|464
Rockruff|Rock||280|Lycanroc@25
Lycanroc|Rock||487
Wishiwashi|Water||450||r
Mareanie|Poison|Water|305|Toxapex@38
Toxapex|Poison|Water|495
Mudbray|Ground||385|Mudsdale@30
Mudsdale|Ground||500
Dewpider|Water|Bug|269|Araquanid@22
Araquanid|Water|Bug|454
Fomantis|Grass||250|Lurantis@34
Lurantis|Grass||480
Morelull|Grass|Fairy|285|Shiinotic@24
Shiinotic|Grass|Fairy|405
Salandit|Poison|Fire|320|Salazzle@33
Salazzle|Poison|Fire|480
Stufful|Normal|Fighting|340|Bewear@27
Bewear|Normal|Fighting|500
Bounsweet|Grass||210|Steenee@18
Steenee|Grass||290|Tsareena@29
Tsareena|Grass||510
Comfey|Fairy||485
Oranguru|Normal|Psychic|490
Passimian|Fighting||490
Wimpod|Bug|Water|230|Golisopod@30
Golisopod|Bug|Water|530
Sandygast|Ghost|Ground|320|Palossand@42
Palossand|Ghost|Ground|480
Pyukumuku|Water||410
Minior|Rock|Flying|440||r
Komala|Normal||480
Togedemaru|Electric|Steel|435
Mimikyu|Ghost|Fairy|476||r
Bruxish|Water|Psychic|475
Dhelmise|Ghost|Grass|517||r
Grookey|Grass||310|Thwackey@16|s
Thwackey|Grass||420|Rillaboom@35
Rillaboom|Grass||530
Scorbunny|Fire||310|Raboot@16|s
Raboot|Fire||420|Cinderace@35
Cinderace|Fire||530
Sobble|Water||310|Drizzile@16|s
Drizzile|Water||420|Inteleon@35
Inteleon|Water||530
Skwovet|Normal||275|Greedent@24
Greedent|Normal||460
Rookidee|Flying||245|Corvisquire@18
Corvisquire|Flying||365|Corviknight@38
Corviknight|Flying|Steel|495
Blipbug|Bug||180|Dottler@10
Dottler|Bug|Psychic|335|Orbeetle@30
Orbeetle|Bug|Psychic|505
Nickit|Dark||245|Thievul@18
Thievul|Dark||455
Gossifleur|Grass||250|Eldegoss@20
Eldegoss|Grass||460
Wooloo|Normal||270|Dubwool@24
Dubwool|Normal||490
Chewtle|Water||284|Drednaw@22
Drednaw|Water|Rock|485
Yamper|Electric||270|Boltund@25
Boltund|Electric||490
Rolycoly|Rock||240|Carkol@18
Carkol|Rock|Fire|410|Coalossal@34
Coalossal|Rock|Fire|510
Silicobra|Ground||315|Sandaconda@36
Sandaconda|Ground||510
Cramorant|Flying|Water|475
Arrokuda|Water||280|Barraskewda@26
Barraskewda|Water||490
Toxel|Electric|Poison|242|Toxtricity@30
Toxtricity|Electric|Poison|502
Sizzlipede|Fire|Bug|305|Centiskorch@28
Centiskorch|Fire|Bug|525
Clobbopus|Fighting||310|Grapploct@35
Grapploct|Fighting||480
Sinistea|Ghost||308|Polteageist@30
Polteageist|Ghost||508
Hatenna|Psychic||265|Hattrem@32
Hattrem|Psychic||370|Hatterene@42
Hatterene|Psychic|Fairy|510
Impidimp|Dark|Fairy|265|Morgrem@32
Morgrem|Dark|Fairy|370|Grimmsnarl@42
Grimmsnarl|Dark|Fairy|510
Obstagoon|Dark|Normal|520
Perrserker|Steel||440
Cursola|Ghost||510
Sirfetch'd|Fighting||507
Mr. Rime|Ice|Psychic|520
Runerigus|Ground|Ghost|483
Milcery|Fairy||270|Alcremie@30
Alcremie|Fairy||495
Falinks|Fighting||470||r
Pincurchin|Electric||435
Snom|Ice|Bug|185|Frosmoth@30
Frosmoth|Ice|Bug|475
Stonjourner|Rock||470||r
Eiscue|Ice||470||r
Indeedee|Psychic|Normal|475||r
Morpeko|Electric|Dark|436
Cufant|Steel||330|Copperajah@34
Copperajah|Steel||500
Sneasler|Fighting|Poison|510
Overqwil|Dark|Poison|510
Sprigatito|Grass||310|Floragato@16|s
Floragato|Grass||410|Meowscarada@36
Meowscarada|Grass|Dark|530
Fuecoco|Fire||310|Crocalor@16|s
Crocalor|Fire||411|Skeledirge@36
Skeledirge|Fire|Ghost|530
Quaxly|Water||310|Quaxwell@16|s
Quaxwell|Water||410|Quaquaval@36
Quaquaval|Water|Fighting|530
Lechonk|Normal||254|Oinkologne@18
Oinkologne|Normal||489
Tarountula|Bug||210|Spidops@15
Spidops|Bug||404
Nymble|Bug||210|Lokix@24
Lokix|Bug|Dark|450
Pawmi|Electric||240|Pawmo@18
Pawmo|Electric|Fighting|350|Pawmot@32
Pawmot|Electric|Fighting|490
Tandemaus|Normal||305|Maushold@25
Maushold|Normal||470
Fidough|Fairy||312|Dachsbun@26
Dachsbun|Fairy||477
Smoliv|Grass|Normal|260|Dolliv@25
Dolliv|Grass|Normal|354|Arboliva@35
Arboliva|Grass|Normal|510
Squawkabilly|Normal|Flying|417
Nacli|Rock||280|Naclstack@24
Naclstack|Rock||355|Garganacl@38
Garganacl|Rock||500
Charcadet|Fire||255|Armarouge@35/Ceruledge@35
Armarouge|Fire|Psychic|525
Ceruledge|Fire|Ghost|525
Tadbulb|Electric||272|Bellibolt@30
Bellibolt|Electric||495
Wattrel|Electric|Flying|280|Kilowattrel@25
Kilowattrel|Electric|Flying|490
Maschiff|Dark||340|Mabosstiff@30
Mabosstiff|Dark||505
Shroodle|Poison|Normal|290|Grafaiai@28
Grafaiai|Poison|Normal|485
Bramblin|Grass|Ghost|275|Brambleghast@30
Brambleghast|Grass|Ghost|480
Toedscool|Ground|Grass|335|Toedscruel@30
Toedscruel|Ground|Grass|515
Klawf|Rock||450
Capsakid|Grass||304|Scovillain@30
Scovillain|Grass|Fire|486
Rellor|Bug||270|Rabsca@30
Rabsca|Bug|Psychic|470
Flittle|Psychic||255|Espathra@35
Espathra|Psychic||481
Tinkatink|Fairy|Steel|297|Tinkatuff@24
Tinkatuff|Fairy|Steel|380|Tinkaton@38
Tinkaton|Fairy|Steel|506
Wiglett|Water||245|Wugtrio@26
Wugtrio|Water||425
Bombirdier|Flying|Dark|485
Finizen|Water||315|Palafin@38
Palafin|Water||550
Varoom|Steel|Poison|300|Revavroom@40
Revavroom|Steel|Poison|500
Orthworm|Steel||480
Glimmet|Rock|Poison|350|Glimmora@35
Glimmora|Rock|Poison|525
Greavard|Ghost||290|Houndstone@30
Houndstone|Ghost||488
Flamigo|Flying|Fighting|500
Cetoddle|Ice||334|Cetitan@30
Cetitan|Ice||521
Veluza|Water|Psychic|478
Dondozo|Water||530||r
Clodsire|Poison|Ground|430
Gimmighoul|Ghost||300|Gholdengo@40|r
Gholdengo|Steel|Ghost|550
Poltchageist|Grass|Ghost|308|Sinistcha@30
Sinistcha|Grass|Ghost|508
Galarian Meowth|Steel||290|Perrserker@28
Galarian Zigzagoon|Dark|Normal|240|Galarian Linoone@20
Galarian Linoone|Dark|Normal|420|Obstagoon@35
Galarian Farfetch'd|Fighting||377|Sirfetch'd@35
Galarian Mr. Mime|Ice|Psychic|460|Mr. Rime@42
Galarian Yamask|Ground|Ghost|303|Runerigus@34
Galarian Corsola|Ghost||410|Cursola@38
Hisuian Sneasel|Fighting|Poison|430|Sneasler@40
Hisuian Qwilfish|Dark|Poison|440|Overqwil@40
Paldean Wooper|Poison|Ground|210|Clodsire@20
White-Striped Basculin|Water||460|Basculegion@40
Alolan Rattata|Dark|Normal|253|Alolan Raticate@20
Alolan Raticate|Dark|Normal|413
Alolan Raichu|Electric|Psychic|485
Alolan Sandshrew|Ice|Steel|300|Alolan Sandslash@22
Alolan Sandslash|Ice|Steel|450
Alolan Vulpix|Ice||299|Alolan Ninetales@30
Alolan Ninetales|Ice|Fairy|505
Alolan Diglett|Ground|Steel|265|Alolan Dugtrio@26
Alolan Dugtrio|Ground|Steel|425
Alolan Meowth|Dark||290|Alolan Persian@28
Alolan Persian|Dark||440
Alolan Geodude|Rock|Electric|300|Alolan Graveler@25
Alolan Graveler|Rock|Electric|390|Alolan Golem@36
Alolan Golem|Rock|Electric|495
Alolan Grimer|Poison|Dark|325|Alolan Muk@38
Alolan Muk|Poison|Dark|500
Alolan Exeggutor|Grass|Dragon|530
Alolan Marowak|Fire|Ghost|425
Galarian Ponyta|Psychic||410|Galarian Rapidash@40
Galarian Rapidash|Psychic|Fairy|500
Galarian Slowpoke|Psychic||315|Galarian Slowbro@37/Galarian Slowking@37
Galarian Slowbro|Poison|Psychic|490
Galarian Slowking|Poison|Psychic|490
Galarian Weezing|Poison|Fairy|490
Galarian Darumaka|Ice||315|Galarian Darmanitan@35
Galarian Darmanitan|Ice||480
Galarian Stunfisk|Ground|Steel|471
Hisuian Growlithe|Fire|Rock|350|Hisuian Arcanine@32
Hisuian Arcanine|Fire|Rock|555
Hisuian Voltorb|Electric|Grass|330|Hisuian Electrode@30
Hisuian Electrode|Electric|Grass|460
Hisuian Typhlosion|Fire|Ghost|534
Hisuian Samurott|Water|Dark|528
Hisuian Decidueye|Grass|Fighting|530
Hisuian Lilligant|Grass|Fighting|480
Hisuian Zorua|Normal|Ghost|330|Hisuian Zoroark@30|r
Hisuian Zoroark|Normal|Ghost|510
Hisuian Braviary|Psychic|Flying|510
Hisuian Sliggoo|Steel|Dragon|452|Hisuian Goodra@50
Hisuian Goodra|Steel|Dragon|600
Hisuian Avalugg|Ice|Rock|514
Paldean Tauros (Combat)|Fighting||490
Paldean Tauros (Blaze)|Fighting|Fire|490||r
Paldean Tauros (Aqua)|Fighting|Water|490||r`;

// ---------- LEGENDS_RAW (legendaries and mythicals) ----------
// Legendary and mythical Pokémon: never found in the wild; only awarded to the Champion's team
const LEGENDS_RAW = `Articuno|Ice|Flying|580
Zapdos|Electric|Flying|580
Moltres|Fire|Flying|580
Mewtwo|Psychic||680
Mew|Psychic||600
Raikou|Electric||580
Entei|Fire||580
Suicune|Water||580
Lugia|Psychic|Flying|680
Ho-Oh|Fire|Flying|680
Celebi|Psychic|Grass|600
Regirock|Rock||580
Regice|Ice||580
Registeel|Steel||580
Latias|Dragon|Psychic|600
Latios|Dragon|Psychic|600
Kyogre|Water||670
Groudon|Ground||670
Rayquaza|Dragon|Flying|680
Jirachi|Steel|Psychic|600
Deoxys|Psychic||600
Uxie|Psychic||580
Mesprit|Psychic||580
Azelf|Psychic||580
Dialga|Steel|Dragon|680
Palkia|Water|Dragon|680
Heatran|Fire|Steel|600
Giratina|Ghost|Dragon|680
Cresselia|Psychic||600
Darkrai|Dark||600
Shaymin|Grass||600
Manaphy|Water||600
Victini|Psychic|Fire|600
Cobalion|Steel|Fighting|580
Terrakion|Rock|Fighting|580
Virizion|Grass|Fighting|580
Tornadus|Flying||580
Thundurus|Electric|Flying|580
Reshiram|Dragon|Fire|680
Zekrom|Dragon|Electric|680
Landorus|Ground|Flying|600
Kyurem|Dragon|Ice|660
Keldeo|Water|Fighting|580
Meloetta|Normal|Psychic|600
Genesect|Bug|Steel|600
Regigigas|Normal||600
Arceus|Normal||680
Zygarde|Dragon|Ground|600
Naganadel|Poison|Dragon|540
Eternatus|Poison|Dragon|680
Regidrago|Dragon||580
Koraidon|Fighting|Dragon|670
Miraidon|Electric|Dragon|670
Xerneas|Fairy||680
Yveltal|Dark|Flying|680
Diancie|Rock|Fairy|600
Hoopa|Psychic|Ghost|600
Volcanion|Fire|Water|600
Silvally|Normal||570
Tapu Koko|Electric|Fairy|570
Tapu Lele|Psychic|Fairy|570
Tapu Bulu|Grass|Fairy|570
Tapu Fini|Water|Fairy|570
Solgaleo|Psychic|Steel|680
Lunala|Psychic|Ghost|680
Nihilego|Rock|Poison|570
Buzzwole|Bug|Fighting|570
Pheromosa|Bug|Fighting|570
Xurkitree|Electric||570
Celesteela|Steel|Flying|570
Kartana|Grass|Steel|570
Guzzlord|Dark|Dragon|570
Necrozma|Psychic||600
Magearna|Steel|Fairy|600
Marshadow|Fighting|Ghost|600
Stakataka|Rock|Steel|570
Blacephalon|Fire|Ghost|570
Zeraora|Electric||600
Melmetal|Steel||600
Urshifu (Single Strike)|Fighting|Dark|550
Urshifu (Rapid Strike)|Fighting|Water|550
Zacian|Fairy||670
Zamazenta|Fighting||670
Zarude|Dark|Grass|600
Regieleki|Electric||580
Glastrier|Ice||580
Spectrier|Ghost||580
Enamorus|Fairy|Flying|580
Wo-Chien|Dark|Grass|570
Chien-Pao|Dark|Ice|570
Ting-Lu|Dark|Ground|570
Chi-Yu|Dark|Fire|570
Okidogi|Poison|Fighting|555
Munkidori|Poison|Psychic|555
Fezandipiti|Poison|Fairy|555
Ogerpon|Grass||550
Terapagos|Normal||550
Pecharunt|Poison|Ghost|600
Galarian Articuno|Psychic|Flying|580
Galarian Zapdos|Fighting|Flying|580
Galarian Moltres|Dark|Flying|580`;

// ---------- BASE_STATS_RAW (six-stat spreads) ----------
// ---------- base stats ----------
// Real six-stat spreads (HP, Atk, Def, Sp. Atk, Sp. Def, Speed) from the main games, via Pokémon Showdown's data.
// Each spread is scaled to the game's own BST for that species, so a species keeps the overall power the game gave it
// (a few BSTs were set by hand for balance: Shuckle, Slaking, Wishiwashi…) but gets the real shape.
const BASE_STATS_RAW = `Rattata|30|56|35|25|35|72
Raticate|55|81|60|50|70|97
Pidgey|40|45|40|35|35|56
Pidgeotto|63|60|55|50|50|71
Pidgeot|83|80|75|70|70|101
Spearow|40|60|30|31|31|70
Fearow|65|90|65|61|61|100
Eevee|55|55|50|45|65|55
Porygon|65|60|70|85|75|40
Tauros|75|100|95|40|70|110
Kangaskhan|105|95|80|40|80|90
Snorlax|160|110|65|65|110|30
Charmander|39|52|43|60|50|65
Charmeleon|58|64|58|80|65|80
Charizard|78|84|78|109|85|100
Cyndaquil|39|52|43|60|50|65
Quilava|58|64|58|80|65|80
Typhlosion|78|84|78|109|85|100
Growlithe|55|70|45|70|50|60
Arcanine|90|110|80|100|80|95
Vulpix|38|41|40|50|65|65
Ninetales|73|76|75|81|100|100
Ponyta|50|85|55|65|65|90
Rapidash|65|100|70|80|80|105
Magmar|65|95|57|100|85|93
Houndour|45|60|30|80|50|65
Houndoom|75|90|50|110|80|95
Squirtle|44|48|65|50|64|43
Wartortle|59|63|80|65|80|58
Blastoise|79|83|100|85|105|78
Totodile|50|65|64|44|48|43
Croconaw|65|80|80|59|63|58
Feraligatr|85|105|100|79|83|78
Psyduck|50|52|48|65|50|55
Golduck|80|82|78|95|80|85
Poliwag|40|50|40|40|40|90
Poliwhirl|65|65|65|50|50|90
Poliwrath|90|95|95|70|90|70
Magikarp|20|10|55|15|20|80
Gyarados|95|125|79|60|100|81
Staryu|30|45|55|70|55|85
Starmie|60|75|85|100|85|115
Seel|65|45|55|45|70|45
Dewgong|90|70|80|70|95|70
Marill|70|20|50|20|50|40
Azumarill|100|50|80|60|80|50
Lapras|130|85|80|85|95|60
Omanyte|35|40|100|90|55|35
Omastar|70|60|125|115|70|55
Bulbasaur|45|49|49|65|65|45
Ivysaur|60|62|63|80|80|60
Venusaur|80|82|83|100|100|80
Chikorita|45|49|65|49|65|45
Bayleef|60|62|80|63|80|60
Meganium|80|82|100|83|100|80
Oddish|45|50|55|75|65|30
Gloom|60|65|70|85|75|40
Vileplume|75|80|85|110|90|50
Bellsprout|50|75|35|70|30|40
Weepinbell|65|90|50|85|45|55
Victreebel|80|105|65|100|70|70
Exeggcute|60|40|80|60|45|40
Exeggutor|95|95|85|125|75|55
Tangela|65|55|115|100|40|60
Pikachu|35|55|40|50|50|90
Raichu|60|90|55|90|80|110
Magnemite|25|35|70|95|55|45
Magneton|50|60|95|120|70|70
Voltorb|40|30|50|55|55|100
Electrode|60|50|70|80|80|150
Mareep|55|40|40|65|45|35
Flaaffy|70|55|55|80|60|45
Ampharos|90|75|85|115|90|55
Electabuzz|65|83|57|95|85|105
Jynx|65|50|35|115|95|95
Swinub|50|50|40|30|30|50
Piloswine|100|100|80|60|60|50
Sneasel|55|95|55|35|75|115
Snorunt|50|50|50|50|50|50
Glalie|80|80|80|80|80|80
Machop|70|80|50|35|35|35
Machoke|80|100|70|50|60|45
Machamp|90|130|80|65|85|55
Mankey|40|80|35|35|45|70
Primeape|65|105|60|60|70|95
Hitmonlee|50|120|53|35|110|87
Riolu|40|70|40|35|40|60
Lucario|70|110|70|115|70|90
Heracross|80|125|75|40|95|85
Ekans|35|60|44|40|54|55
Arbok|60|95|69|65|79|80
Grimer|80|80|50|40|50|25
Muk|105|105|75|65|100|50
Koffing|40|65|95|60|45|35
Weezing|65|90|120|85|70|60
Venonat|60|55|50|40|55|45
Venomoth|70|65|60|90|75|90
Sandshrew|50|75|85|20|30|40
Sandslash|75|100|110|45|55|65
Diglett|10|55|25|35|45|95
Dugtrio|35|100|50|50|70|120
Cubone|50|50|95|40|50|35
Marowak|60|80|110|50|80|45
Rhyhorn|80|85|95|30|30|25
Rhydon|105|130|120|45|45|40
Gible|58|70|45|40|45|42
Gabite|68|90|65|50|55|82
Garchomp|108|130|95|80|85|102
Aerodactyl|80|105|65|60|75|130
Skarmory|65|80|140|40|70|70
Murkrow|60|85|42|85|42|91
Abra|25|20|15|105|55|90
Kadabra|40|35|30|120|70|105
Alakazam|55|50|45|135|95|120
Drowzee|60|48|45|43|90|42
Hypno|85|73|70|73|115|67
Ralts|28|25|25|45|35|40
Kirlia|38|35|35|65|55|50
Gardevoir|68|65|65|125|115|80
Scyther|70|110|80|55|80|105
Pinsir|65|125|100|55|70|85
Geodude|40|80|100|30|30|20
Graveler|55|95|115|45|45|35
Golem|80|120|130|55|65|45
Onix|35|45|160|30|45|70
Larvitar|50|64|50|45|50|41
Pupitar|70|84|70|65|70|51
Tyranitar|100|134|110|95|100|61
Gastly|30|35|30|100|35|80
Haunter|45|50|45|115|55|95
Gengar|60|65|60|130|75|110
Misdreavus|60|60|60|85|85|85
Shuppet|44|75|35|63|33|45
Banette|64|115|65|83|63|65
Duskull|20|40|90|30|90|25
Dusclops|40|70|130|60|130|25
Swablu|45|40|60|40|75|50
Altaria|75|70|90|70|105|80
Horsea|30|40|70|70|25|60
Seadra|55|65|95|95|45|85
Kingdra|75|95|95|95|95|85
Trapinch|45|100|45|45|45|10
Vibrava|50|70|50|50|50|70
Flygon|80|100|80|80|80|100
Axew|46|87|60|30|40|57
Fraxure|66|117|70|40|50|67
Haxorus|76|147|90|60|70|97
Dratini|41|64|45|50|50|50
Dragonair|61|84|65|70|70|70
Dragonite|91|134|95|100|100|80
Bagon|45|75|60|40|30|50
Shelgon|65|95|100|60|50|50
Salamence|95|135|80|110|80|100
Umbreon|95|65|110|60|130|65
Absol|65|130|60|75|60|75
Bronzor|57|24|86|24|86|23
Bronzong|67|89|116|79|116|33
Aron|50|70|100|40|40|30
Lairon|60|90|140|50|50|40
Aggron|70|110|180|60|60|50
Beldum|40|55|80|35|60|30
Metang|60|75|100|55|80|50
Metagross|80|135|130|95|90|70
Mawile|50|85|85|55|55|50
Clefairy|70|45|48|60|65|35
Clefable|95|70|73|95|90|60
Snubbull|60|80|50|40|40|30
Granbull|90|120|75|60|60|45
Pichu|20|40|15|35|35|60
Cleffa|50|25|28|45|55|15
Azurill|50|20|40|20|40|20
Smoochum|45|30|15|85|65|65
Elekid|45|63|37|65|55|95
Magby|45|75|37|70|55|83
Tyrogue|35|35|35|35|35|35
Hitmonchan|50|105|79|35|110|76
Hitmontop|50|95|95|35|110|70
Munchlax|135|85|40|40|85|5
Vaporeon|130|65|60|110|95|65
Jolteon|65|65|60|110|95|130
Flareon|65|130|60|95|110|65
Espeon|65|65|60|130|95|110
Leafeon|65|110|130|60|65|95
Glaceon|65|60|110|130|95|65
Sylveon|95|65|65|110|130|60
Porygon2|85|80|90|105|95|60
Porygon-Z|85|80|70|135|75|90
Magmortar|75|95|67|125|95|83
Electivire|75|123|67|95|85|95
Bellossom|75|80|95|90|100|50
Tangrowth|100|100|125|110|50|50
Magnezone|70|70|115|130|90|60
Mamoswine|110|130|80|70|60|80
Weavile|70|120|65|45|85|125
Froslass|70|80|70|80|70|110
Annihilape|110|115|80|50|90|90
Rhyperior|115|140|130|55|55|40
Honchkrow|100|125|52|105|52|71
Gallade|68|125|65|65|115|80
Scizor|70|130|100|55|80|65
Kleavor|70|135|95|45|70|85
Steelix|75|85|200|55|65|30
Mismagius|60|60|60|105|105|105
Dusknoir|45|100|135|65|135|45
Politoed|90|75|75|90|100|70
Snivy|45|45|55|45|55|63
Servine|60|60|75|60|75|83
Serperior|75|75|95|75|95|113
Tepig|65|63|45|45|45|45
Pignite|90|93|55|70|55|55
Emboar|110|123|65|100|65|65
Oshawott|55|55|45|63|45|45
Dewott|75|75|60|83|60|60
Samurott|95|100|85|108|70|70
Patrat|45|55|39|35|39|42
Watchog|60|85|69|60|69|77
Lillipup|45|60|45|25|45|55
Herdier|65|80|65|35|65|60
Stoutland|85|110|90|45|90|80
Purrloin|41|50|37|50|37|66
Liepard|64|88|50|88|50|106
Pansage|50|53|48|53|48|64
Simisage|75|98|63|98|63|101
Pansear|50|53|48|53|48|64
Simisear|75|98|63|98|63|101
Panpour|50|53|48|53|48|64
Simipour|75|98|63|98|63|101
Munna|76|25|45|67|55|24
Musharna|116|55|85|107|95|29
Pidove|50|55|50|36|30|43
Tranquill|62|77|62|50|42|65
Unfezant|80|115|80|65|55|93
Blitzle|45|60|32|50|32|76
Zebstrika|75|100|63|80|63|116
Roggenrola|55|75|85|25|25|15
Boldore|70|105|105|50|40|20
Gigalith|85|135|130|60|80|25
Woobat|65|45|43|55|43|72
Swoobat|67|57|55|77|55|114
Drilbur|60|85|40|30|45|68
Excadrill|110|135|60|50|65|88
Audino|103|60|86|60|86|50
Timburr|75|80|55|25|35|35
Gurdurr|85|105|85|40|50|40
Conkeldurr|105|140|95|55|65|45
Tympole|50|50|40|50|40|64
Palpitoad|75|65|55|65|55|69
Seismitoad|105|95|75|85|75|74
Throh|120|100|85|30|85|45
Sawk|75|125|75|30|75|85
Sewaddle|45|53|70|40|60|42
Swadloon|55|63|90|50|80|42
Leavanny|75|103|80|70|80|92
Venipede|30|45|59|30|39|57
Whirlipede|40|55|99|40|79|47
Scolipede|60|100|89|55|69|112
Cottonee|40|27|60|37|50|66
Whimsicott|60|67|85|77|75|116
Petilil|45|35|50|70|50|30
Lilligant|70|60|75|110|75|90
Basculin|70|92|65|80|55|98
Basculegion|120|112|65|80|75|78
Sandile|50|72|35|35|35|65
Krokorok|60|82|45|45|45|74
Krookodile|95|117|80|65|70|92
Darumaka|70|90|45|15|45|50
Darmanitan|105|140|55|30|55|95
Maractus|75|86|67|106|67|60
Dwebble|50|65|85|35|35|55
Crustle|70|105|125|65|75|45
Scraggy|50|75|70|35|70|48
Scrafty|65|90|115|45|115|58
Sigilyph|72|58|80|103|80|97
Yamask|38|30|85|55|65|30
Cofagrigus|58|50|145|95|105|30
Tirtouga|54|78|103|53|45|22
Carracosta|74|108|133|83|65|32
Archen|55|112|45|74|45|70
Archeops|75|140|65|112|65|110
Trubbish|50|50|62|40|62|65
Garbodor|80|95|82|60|82|75
Zorua|40|65|40|80|40|65
Zoroark|60|105|60|120|60|105
Minccino|55|50|40|40|40|75
Cinccino|75|95|60|65|60|115
Gothita|45|30|50|55|65|45
Gothorita|60|45|70|75|85|55
Gothitelle|70|55|95|95|110|65
Solosis|45|30|40|105|50|20
Duosion|65|40|50|125|60|30
Reuniclus|110|65|75|125|85|30
Ducklett|62|44|50|44|50|55
Swanna|75|87|63|87|63|98
Vanillite|36|50|50|65|60|44
Vanillish|51|65|65|80|75|59
Vanilluxe|71|95|85|110|95|79
Deerling|60|60|50|40|50|75
Sawsbuck|80|100|70|60|70|95
Emolga|55|75|60|75|60|103
Karrablast|50|75|45|40|45|60
Escavalier|70|135|105|60|105|20
Foongus|69|55|45|55|55|15
Amoonguss|114|85|70|85|80|30
Frillish|55|40|50|65|85|40
Jellicent|100|60|70|85|105|60
Alomomola|165|75|80|40|45|65
Joltik|50|47|50|57|50|65
Galvantula|70|77|60|97|60|108
Ferroseed|44|50|91|24|86|10
Ferrothorn|74|94|131|54|116|20
Klink|40|55|70|45|60|30
Klang|60|80|95|70|85|50
Klinklang|60|100|115|70|85|90
Tynamo|35|55|40|45|40|60
Eelektrik|65|85|70|75|70|40
Eelektross|85|115|80|105|80|50
Elgyem|55|55|55|85|55|30
Beheeyem|75|75|75|125|95|40
Litwick|50|30|55|65|55|20
Lampent|60|40|60|95|60|55
Chandelure|60|55|90|145|90|80
Cubchoo|55|70|40|60|40|40
Beartic|95|130|80|70|80|50
Cryogonal|80|50|50|95|135|105
Shelmet|50|40|85|40|65|25
Accelgor|80|70|40|100|60|145
Stunfisk|109|66|84|81|99|32
Mienfoo|45|85|50|55|50|65
Mienshao|65|125|60|95|60|105
Druddigon|77|120|90|60|90|48
Golett|59|74|50|35|50|35
Golurk|89|124|80|55|80|55
Pawniard|45|85|70|40|40|60
Bisharp|65|125|100|60|70|70
Kingambit|100|135|120|60|85|50
Bouffalant|95|110|95|40|95|55
Rufflet|70|83|50|37|50|60
Braviary|100|123|75|57|75|80
Vullaby|70|55|75|45|65|60
Mandibuzz|110|65|105|55|95|80
Heatmor|85|97|66|105|66|65
Durant|58|109|112|48|48|109
Deino|52|65|50|45|50|38
Zweilous|72|85|70|65|70|58
Hydreigon|92|105|90|125|90|98
Larvesta|55|85|55|50|55|60
Volcarona|85|60|65|135|105|100
Caterpie|45|30|35|20|20|45
Metapod|50|20|55|25|25|30
Butterfree|60|45|50|90|80|70
Weedle|40|35|30|20|20|50
Kakuna|45|25|50|25|25|35
Beedrill|65|90|40|45|80|75
Krabby|30|105|90|25|25|50
Kingler|55|130|115|50|50|75
Hoothoot|60|30|30|36|56|50
Noctowl|100|50|50|86|96|70
Phanpy|90|60|60|40|40|40
Donphan|90|120|120|60|60|50
Treecko|40|45|35|65|55|70
Grovyle|50|65|45|85|65|95
Sceptile|70|85|65|105|85|120
Torchic|45|60|40|70|50|45
Combusken|60|85|60|85|60|55
Blaziken|80|120|70|110|70|80
Mudkip|50|70|50|50|50|40
Marshtomp|70|85|70|60|70|50
Swampert|100|110|90|85|90|60
Taillow|40|55|30|30|30|85
Swellow|60|85|60|75|50|125
Corphish|43|80|65|50|35|35
Crawdaunt|63|120|85|90|55|55
Torkoal|70|85|140|85|70|20
Zubat|40|45|35|30|40|55
Golbat|75|80|70|65|75|90
Crobat|85|90|80|70|80|130
Pineco|50|65|90|35|35|15
Forretress|75|90|140|60|60|40
Lotad|40|30|30|40|50|30
Lombre|60|50|50|60|70|50
Ludicolo|80|70|70|90|100|70
Bonsly|50|80|95|10|45|10
Sudowoodo|70|100|115|30|65|30
Croagunk|48|61|40|61|40|50
Toxicroak|83|106|65|86|65|85
Goldeen|45|67|60|35|50|63
Seaking|80|92|65|65|80|68
Togepi|35|20|65|40|65|20
Togetic|55|40|85|80|105|40
Togekiss|85|50|95|120|115|80
Corsola|65|55|95|65|95|35
Luvdisc|43|30|55|40|65|97
Hoppip|35|35|40|35|55|50
Skiploom|55|45|50|45|65|80
Jumpluff|75|55|70|55|95|110
Spinarak|40|60|40|40|40|30
Ariados|70|90|70|60|70|40
Mime Jr.|20|25|45|70|90|60
Mr. Mime|40|45|65|100|120|90
Slugma|40|40|40|70|40|20
Magcargo|60|50|120|90|80|30
Nidoran♀|55|47|52|40|40|41
Nidorina|70|62|67|55|55|56
Nidoqueen|90|92|87|75|85|76
Nidoran♂|46|57|40|40|40|50
Nidorino|61|72|57|55|55|65
Nidoking|81|102|77|85|75|85
Meowth|40|45|35|40|40|90
Persian|65|70|60|65|65|115
Doduo|35|85|45|35|35|75
Dodrio|60|110|70|60|60|110
Miltank|95|80|105|40|70|100
Nosepass|30|45|135|45|90|30
Probopass|60|55|145|75|150|40
Makuhita|72|60|30|20|30|25
Hariyama|144|120|60|40|60|50
Meditite|30|40|55|40|55|60
Medicham|60|60|75|60|75|80
Electrike|40|45|40|65|40|65
Manectric|70|75|60|105|60|105
Numel|60|60|40|65|45|35
Camerupt|70|100|70|105|75|40
Slakoth|60|60|60|35|35|30
Vigoroth|80|80|80|55|55|90
Slaking|150|160|100|95|65|100
Spinda|60|60|60|60|60|60
Zigzagoon|38|30|41|30|41|60
Linoone|78|70|61|50|61|100
Wingull|40|30|30|55|30|85
Pelipper|60|50|100|95|70|65
Tropius|99|68|83|72|87|51
Lunatone|90|55|65|95|85|70
Solrock|90|95|85|55|65|70
Baltoy|40|40|55|40|70|55
Claydol|60|70|105|70|120|75
Natu|40|50|45|70|45|70
Xatu|65|75|70|95|70|95
Feebas|20|15|20|10|55|80
Milotic|95|60|79|100|125|81
Wailmer|130|70|35|70|35|60
Wailord|170|90|45|90|45|60
Carvanha|45|90|20|65|20|65
Sharpedo|70|120|40|95|40|95
Barboach|50|48|43|46|41|60
Whiscash|110|78|73|76|71|60
Tentacool|40|40|35|50|100|70
Tentacruel|80|70|65|80|120|100
Spheal|70|40|50|55|50|25
Sealeo|90|60|70|75|70|45
Walrein|110|80|90|95|90|65
Igglybuff|90|30|15|40|20|15
Jigglypuff|115|45|20|45|25|20
Wigglytuff|140|70|45|85|50|45
Paras|35|70|55|45|55|25
Parasect|60|95|80|60|80|30
Slowpoke|90|65|65|40|40|15
Slowbro|95|75|110|100|80|30
Slowking|95|75|80|100|110|30
Farfetch'd|52|90|55|58|62|60
Shellder|30|65|100|45|25|40
Cloyster|50|95|180|85|45|70
Lickitung|90|55|75|60|75|30
Lickilicky|110|85|95|80|95|50
Happiny|100|5|5|15|65|30
Chansey|250|5|5|35|105|50
Blissey|255|10|10|75|135|55
Ditto|48|48|48|48|48|48
Kabuto|30|80|90|55|45|55
Kabutops|60|115|105|65|70|80
Sentret|35|46|34|35|45|20
Furret|85|76|64|45|55|90
Ledyba|40|20|30|40|80|55
Ledian|55|35|50|55|110|85
Chinchou|75|38|38|56|56|67
Lanturn|125|58|58|76|76|67
Aipom|55|70|55|40|55|85
Ambipom|75|100|66|60|66|115
Sunkern|30|30|30|30|30|30
Sunflora|75|75|55|105|85|30
Yanma|65|65|45|75|45|95
Yanmega|86|76|86|116|56|95
Wooper|55|45|45|25|25|15
Quagsire|95|85|85|65|65|35
Unown|48|72|48|72|48|48
Wynaut|95|23|48|23|48|23
Wobbuffet|190|33|58|33|58|33
Girafarig|70|80|65|90|65|85
Farigiraf|120|90|70|110|70|60
Dunsparce|100|70|70|65|65|45
Dudunsparce|125|100|80|85|75|55
Gligar|65|75|105|35|65|85
Gliscor|75|95|125|45|75|95
Qwilfish|65|95|85|55|55|85
Shuckle|20|10|230|10|230|5
Teddiursa|60|80|50|50|50|40
Ursaring|90|130|75|75|75|55
Ursaluna|130|140|105|45|80|50
Remoraid|35|65|35|65|35|65
Octillery|75|105|75|105|75|45
Delibird|45|55|45|65|45|75
Mantyke|45|20|50|60|120|50
Mantine|85|40|70|80|140|70
Stantler|73|95|62|85|65|85
Wyrdeer|103|105|72|105|75|65
Smeargle|55|20|35|20|45|75
Poochyena|35|55|35|30|30|35
Mightyena|70|90|70|60|60|70
Wurmple|45|45|35|20|30|20
Silcoon|50|35|55|25|25|15
Beautifly|60|70|50|100|50|65
Cascoon|50|35|55|25|25|15
Dustox|60|50|70|50|90|65
Seedot|40|40|50|30|30|30
Nuzleaf|70|70|40|60|40|60
Shiftry|90|100|60|90|60|80
Surskit|40|30|32|50|52|65
Masquerain|70|60|62|100|82|80
Shroomish|60|40|60|40|60|35
Breloom|60|130|80|60|60|70
Nincada|31|45|90|30|30|40
Ninjask|61|90|45|50|50|160
Shedinja|1|90|45|30|30|40
Whismur|64|51|23|51|23|28
Loudred|84|71|43|71|43|48
Exploud|104|91|63|91|73|68
Skitty|50|45|45|35|35|50
Delcatty|70|65|65|55|55|90
Sableye|50|75|75|65|65|50
Plusle|60|50|40|85|75|95
Minun|60|40|50|75|85|95
Volbeat|65|73|75|47|85|85
Illumise|65|47|75|73|85|85
Budew|40|30|35|50|70|55
Roselia|50|60|45|100|80|65
Roserade|60|70|65|125|105|90
Gulpin|70|43|53|43|53|40
Swalot|100|73|83|73|83|55
Spoink|60|25|35|70|80|60
Grumpig|80|45|65|90|110|80
Cacnea|50|85|40|85|40|35
Cacturne|70|115|60|115|60|55
Zangoose|73|115|60|60|60|90
Seviper|73|100|60|100|60|65
Lileep|66|41|77|61|87|23
Cradily|86|81|97|81|107|43
Anorith|45|95|50|40|50|75
Armaldo|75|125|100|70|80|45
Castform|70|70|70|70|70|70
Kecleon|60|90|70|60|120|40
Chingling|45|30|50|65|50|45
Chimecho|75|50|80|95|90|65
Clamperl|35|64|85|74|55|32
Huntail|55|104|105|94|75|52
Gorebyss|55|84|105|114|75|52
Relicanth|100|90|130|45|65|55
Turtwig|55|68|64|45|55|31
Grotle|75|89|85|55|65|36
Torterra|95|109|105|75|85|56
Chimchar|44|58|44|58|44|61
Monferno|64|78|52|78|52|81
Infernape|76|104|71|104|71|108
Piplup|53|51|53|61|56|40
Prinplup|64|66|68|81|76|50
Empoleon|84|86|88|111|101|60
Starly|40|55|30|30|30|60
Staravia|55|75|50|40|40|80
Staraptor|85|120|70|50|60|100
Bidoof|59|45|40|35|40|31
Bibarel|79|85|60|55|60|71
Kricketot|37|25|41|25|41|25
Kricketune|77|85|51|55|51|65
Shinx|45|65|34|40|34|45
Luxio|60|85|49|60|49|60
Luxray|80|120|79|95|79|70
Cranidos|67|125|40|30|30|58
Rampardos|97|165|60|65|50|58
Shieldon|30|42|118|42|88|30
Bastiodon|60|52|168|47|138|30
Burmy|40|29|45|29|45|36
Wormadam|60|59|85|79|105|36
Mothim|70|94|50|94|50|66
Combee|30|30|42|30|42|70
Vespiquen|70|80|102|80|102|40
Pachirisu|60|45|70|45|90|95
Buizel|55|65|35|60|30|85
Floatzel|85|105|55|85|50|115
Cherubi|45|35|45|62|53|35
Cherrim|70|60|70|87|78|85
Shellos|76|48|48|57|62|34
Gastrodon|111|83|68|92|82|39
Drifloon|90|50|34|60|44|70
Drifblim|150|80|44|90|54|80
Buneary|55|66|44|44|56|85
Lopunny|65|76|84|54|96|105
Glameow|49|55|42|42|37|85
Purugly|71|82|64|64|59|112
Stunky|63|63|47|41|41|74
Skuntank|103|93|67|71|61|84
Chatot|76|65|45|92|42|91
Spiritomb|50|92|108|92|108|35
Hippopotas|68|72|78|38|42|32
Hippowdon|108|112|118|68|72|47
Skorupi|40|50|90|30|55|65
Drapion|70|90|110|60|75|95
Carnivine|74|100|72|90|72|46
Finneon|49|49|56|49|61|66
Lumineon|69|69|76|69|86|91
Snover|60|62|50|62|60|40
Abomasnow|90|92|75|92|85|60
Rotom|50|50|77|95|77|91
Goomy|45|50|35|55|75|40
Sliggoo|68|75|53|83|113|60
Goodra|90|100|70|110|150|80
Noibat|40|30|35|45|40|55
Noivern|85|70|80|97|80|123
Tyrunt|58|89|77|45|45|48
Tyrantrum|82|121|119|69|59|71
Skrelp|50|60|60|60|60|30
Dragalge|65|75|90|97|123|44
Jangmo-o|45|55|65|45|45|45
Hakamo-o|55|75|90|65|70|65
Kommo-o|75|110|125|100|105|85
Turtonator|60|78|135|91|85|36
Drampa|78|60|85|135|91|36
Applin|40|40|80|40|40|20
Flapple|70|110|80|95|60|70
Appletun|110|85|80|100|80|30
Dipplin|80|80|110|95|80|40
Hydrapple|106|80|110|120|80|44
Dracozolt|90|100|90|80|70|75
Arctozolt|90|100|90|90|80|55
Dracovish|90|90|100|70|80|75
Arctovish|90|90|100|80|90|55
Duraludon|70|95|115|120|50|85
Archaludon|90|105|130|125|65|85
Dreepy|28|60|30|40|30|82
Drakloak|68|80|50|60|50|102
Dragapult|88|120|75|100|75|142
Cyclizar|70|95|65|85|65|121
Tatsugiri|68|50|60|120|95|82
Frigibax|65|75|45|35|45|55
Arctibax|90|95|66|45|65|62
Baxcalibur|115|145|92|75|86|87
Chespin|56|61|65|48|45|38
Quilladin|61|78|95|56|58|57
Chesnaught|88|107|122|74|75|64
Fennekin|40|45|40|62|60|60
Braixen|59|59|58|90|70|73
Delphox|75|69|72|114|100|104
Froakie|41|56|40|62|44|71
Frogadier|54|63|52|83|56|97
Greninja|72|95|67|103|71|122
Bunnelby|38|36|38|32|36|57
Diggersby|85|56|77|50|77|78
Fletchling|45|50|43|40|38|62
Fletchinder|62|73|55|56|52|84
Talonflame|78|81|71|74|69|126
Scatterbug|38|35|40|27|25|35
Spewpa|45|22|60|27|30|29
Vivillon|80|52|50|90|50|89
Litleo|62|50|58|73|54|72
Pyroar|86|68|72|109|66|106
Flabébé|44|38|39|61|79|42
Floette|54|45|47|75|98|52
Florges|78|65|68|112|154|75
Skiddo|66|65|48|62|57|52
Gogoat|123|100|62|97|81|68
Pancham|67|82|62|46|48|43
Pangoro|95|124|78|69|71|58
Furfrou|75|80|60|65|90|102
Espurr|62|48|54|63|60|68
Meowstic|74|48|76|83|81|104
Honedge|45|80|100|35|37|28
Doublade|59|110|150|45|49|35
Aegislash|60|50|140|50|140|60
Spritzee|78|52|60|63|65|23
Aromatisse|101|72|72|99|89|29
Swirlix|62|48|66|59|57|49
Slurpuff|82|80|86|85|75|72
Inkay|53|54|53|37|46|45
Malamar|86|92|88|68|75|73
Binacle|42|52|67|39|56|50
Barbaracle|72|105|115|54|86|68
Clauncher|50|53|62|58|63|44
Clawitzer|71|73|88|120|89|59
Helioptile|44|38|33|61|43|70
Heliolisk|62|55|52|109|94|109
Amaura|77|59|50|67|63|46
Aurorus|123|77|72|99|92|58
Hawlucha|78|92|75|74|63|118
Dedenne|67|58|57|81|67|101
Carbink|50|50|150|50|150|50
Klefki|57|80|91|80|87|75
Phantump|43|70|48|50|60|38
Trevenant|85|110|76|65|82|56
Pumpkaboo|49|66|70|44|55|51
Gourgeist|65|90|122|58|75|84
Bergmite|55|69|85|32|35|28
Avalugg|95|117|184|44|46|28
Rowlet|68|55|55|50|50|42
Dartrix|78|75|75|70|70|52
Decidueye|78|107|75|100|100|70
Litten|45|65|40|60|40|70
Torracat|65|85|50|80|50|90
Incineroar|95|115|90|80|90|60
Popplio|50|54|54|66|56|40
Brionne|60|69|69|91|81|50
Primarina|80|74|74|126|116|60
Pikipek|35|75|30|30|30|65
Trumbeak|55|85|50|40|50|75
Toucannon|80|120|75|75|75|60
Yungoos|48|70|30|30|30|45
Gumshoos|88|110|60|55|60|45
Grubbin|47|62|45|55|45|46
Charjabug|57|82|95|55|75|36
Vikavolt|77|70|90|145|75|43
Crabrawler|47|82|57|42|47|63
Crabominable|97|132|77|62|67|43
Oricorio|75|70|70|98|70|93
Cutiefly|40|45|40|55|40|84
Ribombee|60|55|60|95|70|124
Rockruff|45|65|40|30|40|60
Lycanroc|75|115|65|55|65|112
Wishiwashi|45|140|130|140|135|30
Mareanie|50|53|62|43|52|45
Toxapex|50|63|152|53|142|35
Mudbray|70|100|70|45|55|45
Mudsdale|100|125|100|55|85|35
Dewpider|38|40|52|40|72|27
Araquanid|68|70|92|50|132|42
Fomantis|40|55|35|50|35|35
Lurantis|70|105|90|80|90|45
Morelull|40|35|55|65|75|15
Shiinotic|60|45|80|90|100|30
Salandit|48|44|40|71|40|77
Salazzle|68|64|60|111|60|117
Stufful|70|75|50|45|50|50
Bewear|120|125|80|55|60|60
Bounsweet|42|30|38|30|38|32
Steenee|52|40|48|40|48|62
Tsareena|72|120|98|50|98|72
Comfey|51|52|90|82|110|100
Oranguru|90|60|80|90|110|60
Passimian|100|120|90|40|60|80
Wimpod|25|35|40|20|30|80
Golisopod|75|125|140|60|90|40
Sandygast|55|55|80|70|45|15
Palossand|85|75|110|100|75|35
Pyukumuku|55|60|130|30|130|5
Minior|60|60|100|60|100|60
Komala|65|115|65|75|95|65
Togedemaru|65|98|63|40|73|96
Mimikyu|55|90|80|50|105|96
Bruxish|68|105|70|70|70|92
Dhelmise|70|131|100|86|90|40
Grookey|50|65|50|40|40|65
Thwackey|70|85|70|55|60|80
Rillaboom|100|125|90|60|70|85
Scorbunny|50|71|40|40|40|69
Raboot|65|86|60|55|60|94
Cinderace|80|116|75|65|75|119
Sobble|50|40|40|70|40|70
Drizzile|65|60|55|95|55|90
Inteleon|70|85|65|125|65|120
Skwovet|70|55|55|35|35|25
Greedent|120|95|95|55|75|20
Rookidee|38|47|35|33|35|57
Corvisquire|68|67|55|43|55|77
Corviknight|98|87|105|53|85|67
Blipbug|25|20|20|25|45|45
Dottler|50|35|80|50|90|30
Orbeetle|60|45|110|80|120|90
Nickit|40|28|28|47|52|50
Thievul|70|58|58|87|92|90
Gossifleur|40|40|60|40|60|10
Eldegoss|60|50|90|80|120|60
Wooloo|42|40|55|40|45|48
Dubwool|72|80|100|60|90|88
Chewtle|50|64|50|38|38|44
Drednaw|90|115|90|48|68|74
Yamper|59|45|50|40|50|26
Boltund|69|90|60|90|60|121
Rolycoly|30|40|50|40|50|30
Carkol|80|60|90|60|70|50
Coalossal|110|80|120|80|90|30
Silicobra|52|57|75|35|50|46
Sandaconda|72|107|125|65|70|71
Cramorant|70|85|55|85|95|85
Arrokuda|41|63|40|40|30|66
Barraskewda|61|123|60|60|50|136
Toxel|40|38|35|54|35|40
Toxtricity|75|98|70|114|70|75
Sizzlipede|50|65|45|50|50|45
Centiskorch|100|115|65|90|90|65
Clobbopus|50|68|60|50|50|32
Grapploct|80|118|90|70|80|42
Sinistea|40|45|45|74|54|50
Polteageist|60|65|65|134|114|70
Hatenna|42|30|45|56|53|39
Hattrem|57|40|65|86|73|49
Hatterene|57|90|95|136|103|29
Impidimp|45|45|30|55|40|50
Morgrem|65|60|45|75|55|70
Grimmsnarl|95|120|65|95|75|60
Obstagoon|93|90|101|60|81|95
Perrserker|70|110|100|50|60|50
Cursola|60|95|50|145|130|30
Sirfetch'd|62|135|95|68|82|65
Mr. Rime|80|85|75|110|100|70
Runerigus|58|95|145|50|105|30
Milcery|45|40|40|50|61|34
Alcremie|65|60|75|110|121|64
Falinks|65|100|100|70|60|75
Pincurchin|48|101|95|91|85|15
Snom|30|25|35|45|30|20
Frosmoth|70|65|60|125|90|65
Stonjourner|100|125|135|20|20|70
Eiscue|75|80|110|65|90|50
Indeedee|60|65|55|105|95|95
Morpeko|58|95|58|70|58|97
Cufant|72|80|49|40|49|40
Copperajah|122|130|69|80|69|30
Sneasler|80|130|60|40|80|120
Overqwil|85|115|95|65|65|85
Sprigatito|40|61|54|45|45|65
Floragato|61|80|63|60|63|83
Meowscarada|76|110|70|81|70|123
Fuecoco|67|45|59|63|40|36
Crocalor|81|55|78|90|58|49
Skeledirge|104|75|100|110|75|66
Quaxly|55|65|45|50|45|50
Quaxwell|70|85|65|65|60|65
Quaquaval|85|120|80|85|75|85
Lechonk|54|45|40|35|45|35
Oinkologne|110|100|75|59|80|65
Tarountula|35|41|45|29|40|20
Spidops|60|79|92|52|86|35
Nymble|33|46|40|21|25|45
Lokix|71|102|78|52|55|92
Pawmi|45|50|20|40|25|60
Pawmo|60|75|40|50|40|85
Pawmot|70|115|70|70|60|105
Tandemaus|50|50|45|40|45|75
Maushold|74|75|70|65|75|111
Fidough|37|55|70|30|55|65
Dachsbun|57|80|115|50|80|95
Smoliv|41|35|45|58|51|30
Dolliv|52|53|60|78|78|33
Arboliva|78|69|90|125|109|39
Squawkabilly|82|96|51|45|51|92
Nacli|55|55|75|35|35|25
Naclstack|60|60|100|35|65|35
Garganacl|100|100|130|45|90|35
Charcadet|40|50|40|50|40|35
Armarouge|85|60|100|125|80|75
Ceruledge|75|125|80|60|100|85
Tadbulb|61|31|41|59|35|45
Bellibolt|109|64|91|103|83|45
Wattrel|40|40|35|55|40|70
Kilowattrel|70|70|60|105|60|125
Maschiff|60|78|60|40|51|51
Mabosstiff|80|120|90|60|70|85
Shroodle|40|65|35|40|35|75
Grafaiai|63|95|65|80|72|110
Bramblin|40|65|30|45|35|60
Brambleghast|55|115|70|80|70|90
Toedscool|40|40|35|50|100|70
Toedscruel|80|70|65|80|120|100
Klawf|70|100|115|35|55|75
Capsakid|50|62|40|62|40|50
Scovillain|65|108|65|108|65|75
Rellor|41|50|60|31|58|30
Rabsca|75|50|85|115|100|45
Flittle|30|35|30|55|30|75
Espathra|95|60|60|101|60|105
Tinkatink|50|45|45|35|64|58
Tinkatuff|65|55|55|45|82|78
Tinkaton|85|75|77|70|105|94
Wiglett|10|55|25|35|25|95
Wugtrio|35|100|50|50|70|120
Bombirdier|70|103|85|60|85|82
Finizen|70|45|40|45|40|75
Palafin|100|160|97|106|87|100
Varoom|45|70|63|30|45|47
Revavroom|80|119|90|54|67|90
Orthworm|70|85|145|60|55|65
Glimmet|48|35|42|105|60|60
Glimmora|83|55|90|130|81|86
Greavard|50|61|60|30|55|34
Houndstone|72|101|100|50|97|68
Flamigo|82|115|74|75|64|90
Cetoddle|108|68|45|30|40|43
Cetitan|170|113|65|45|55|73
Veluza|90|102|73|78|65|70
Dondozo|150|100|115|65|65|35
Clodsire|130|75|60|45|100|20
Gimmighoul|45|30|70|75|70|10
Gholdengo|87|60|95|133|91|84
Poltchageist|40|45|45|74|54|50
Sinistcha|71|60|106|121|80|70
Galarian Meowth|50|65|55|40|40|40
Galarian Zigzagoon|38|30|41|30|41|60
Galarian Linoone|78|70|61|50|61|100
Galarian Farfetch'd|52|95|55|58|62|55
Galarian Mr. Mime|50|65|65|90|90|100
Galarian Yamask|38|55|85|30|65|30
Galarian Corsola|60|55|100|65|100|30
Hisuian Sneasel|55|95|55|35|75|115
Hisuian Qwilfish|65|95|85|55|55|85
Paldean Wooper|55|45|45|25|25|15
White-Striped Basculin|70|92|65|80|55|98
Alolan Rattata|30|56|35|25|35|72
Alolan Raticate|75|71|70|40|80|77
Alolan Raichu|60|85|50|95|85|110
Alolan Sandshrew|50|75|90|10|35|40
Alolan Sandslash|75|100|120|25|65|65
Alolan Vulpix|38|41|40|50|65|65
Alolan Ninetales|73|67|75|81|100|109
Alolan Diglett|10|55|30|35|45|90
Alolan Dugtrio|35|100|60|50|70|110
Alolan Meowth|40|35|35|50|40|90
Alolan Persian|65|60|60|75|65|115
Alolan Geodude|40|80|100|30|30|20
Alolan Graveler|55|95|115|45|45|35
Alolan Golem|80|120|130|55|65|45
Alolan Grimer|80|80|50|40|50|25
Alolan Muk|105|105|75|65|100|50
Alolan Exeggutor|95|105|85|125|75|45
Alolan Marowak|60|80|110|50|80|45
Galarian Ponyta|50|85|55|65|65|90
Galarian Rapidash|65|100|70|80|80|105
Galarian Slowpoke|90|65|65|40|40|15
Galarian Slowbro|95|100|95|100|70|30
Galarian Slowking|95|65|80|110|110|30
Galarian Weezing|65|90|120|85|70|60
Galarian Darumaka|70|90|45|15|45|50
Galarian Darmanitan|105|140|55|30|55|95
Galarian Stunfisk|109|81|99|66|84|32
Hisuian Growlithe|60|75|45|65|50|55
Hisuian Arcanine|95|115|80|95|80|90
Hisuian Voltorb|40|30|50|55|55|100
Hisuian Electrode|60|50|70|80|80|150
Hisuian Typhlosion|73|84|78|119|85|95
Hisuian Samurott|90|108|80|100|65|85
Hisuian Decidueye|88|112|80|95|95|60
Hisuian Lilligant|70|105|75|50|75|105
Hisuian Zorua|35|60|40|85|40|70
Hisuian Zoroark|55|100|60|125|60|110
Hisuian Braviary|110|83|70|112|70|65
Hisuian Sliggoo|58|75|83|83|113|40
Hisuian Goodra|80|100|100|110|150|60
Hisuian Avalugg|95|127|184|34|36|38
Paldean Tauros (Combat)|75|110|105|30|70|100
Paldean Tauros (Blaze)|75|110|105|30|70|100
Paldean Tauros (Aqua)|75|110|105|30|70|100
Great Tusk|115|131|131|53|53|87
Scream Tail|115|65|99|65|115|111
Brute Bonnet|111|127|99|79|99|55
Flutter Mane|55|55|55|135|135|135
Slither Wing|85|135|79|85|105|81
Sandy Shocks|85|81|97|121|85|101
Roaring Moon|105|139|71|55|101|119
Walking Wake|99|83|91|125|83|109
Gouging Fire|105|115|121|65|93|91
Raging Bolt|125|73|91|137|89|75
Iron Treads|90|112|120|72|70|106
Iron Bundle|56|80|114|124|60|136
Iron Hands|154|140|108|50|68|50
Iron Jugulis|94|80|86|122|80|108
Iron Moth|80|70|60|140|110|110
Iron Thorns|100|134|110|70|84|72
Iron Valiant|74|130|90|120|60|116
Iron Leaves|90|130|88|70|108|104
Iron Boulder|90|120|80|68|108|124
Iron Crown|90|72|100|122|108|98
Articuno|90|85|100|95|125|85
Zapdos|90|90|85|125|90|100
Moltres|90|100|90|125|85|90
Mewtwo|106|110|90|154|90|130
Mew|100|100|100|100|100|100
Raikou|90|85|75|115|100|115
Entei|115|115|85|90|75|100
Suicune|100|75|115|90|115|85
Lugia|106|90|130|90|154|110
Ho-Oh|106|130|90|110|154|90
Celebi|100|100|100|100|100|100
Regirock|80|100|200|50|100|50
Regice|80|50|100|100|200|50
Registeel|80|75|150|75|150|50
Latias|80|80|90|110|130|110
Latios|80|90|80|130|110|110
Kyogre|100|100|90|150|140|90
Groudon|100|150|140|100|90|90
Rayquaza|105|150|90|150|90|95
Jirachi|100|100|100|100|100|100
Deoxys|50|150|50|150|50|150
Uxie|75|75|130|75|130|95
Mesprit|80|105|105|105|105|80
Azelf|75|125|70|125|70|115
Dialga|100|120|120|150|100|90
Palkia|90|120|100|150|120|100
Heatran|91|90|106|130|106|77
Giratina|150|100|120|100|120|90
Cresselia|120|70|110|75|120|85
Darkrai|70|90|90|135|90|125
Shaymin|100|100|100|100|100|100
Manaphy|100|100|100|100|100|100
Victini|100|100|100|100|100|100
Cobalion|91|90|129|90|72|108
Terrakion|91|129|90|72|90|108
Virizion|91|90|72|90|129|108
Tornadus|79|115|70|125|80|111
Thundurus|79|115|70|125|80|111
Reshiram|100|120|100|150|120|90
Zekrom|100|150|120|120|100|90
Landorus|89|125|90|115|80|101
Kyurem|125|130|90|130|90|95
Keldeo|91|72|90|129|90|108
Meloetta|100|77|77|128|128|90
Genesect|71|120|95|120|95|99
Regigigas|110|160|110|80|110|100
Arceus|120|120|120|120|120|120
Zygarde|108|100|121|81|95|95
Naganadel|73|73|73|127|73|121
Eternatus|140|85|95|145|95|130
Regidrago|200|100|50|100|50|80
Koraidon|100|135|115|85|100|135
Miraidon|100|85|100|135|115|135
Xerneas|126|131|95|131|98|99
Yveltal|126|131|95|131|98|99
Diancie|50|100|150|100|150|50
Hoopa|80|110|60|150|130|70
Volcanion|80|110|120|130|90|70
Silvally|95|95|95|95|95|95
Tapu Koko|70|115|85|95|75|130
Tapu Lele|70|85|75|130|115|95
Tapu Bulu|70|130|115|85|95|75
Tapu Fini|70|75|115|95|130|85
Solgaleo|137|137|107|113|89|97
Lunala|137|113|89|137|107|97
Nihilego|109|53|47|127|131|103
Buzzwole|107|139|139|53|53|79
Pheromosa|71|137|37|137|37|151
Xurkitree|83|89|71|173|71|83
Celesteela|97|101|103|107|101|61
Kartana|59|181|131|59|31|109
Guzzlord|223|101|53|97|53|43
Necrozma|97|107|101|127|89|79
Magearna|80|95|115|130|115|65
Marshadow|90|125|80|90|90|125
Stakataka|61|131|211|53|101|13
Blacephalon|53|127|53|151|79|107
Zeraora|88|112|75|102|80|143
Melmetal|135|143|143|80|65|34
Urshifu (Single Strike)|100|130|100|63|60|97
Urshifu (Rapid Strike)|100|130|100|63|60|97
Zacian|92|120|115|80|115|138
Zamazenta|92|120|115|80|115|138
Zarude|105|120|105|70|95|105
Regieleki|80|100|50|100|50|200
Glastrier|100|145|130|65|110|30
Spectrier|100|65|60|145|80|130
Enamorus|74|115|70|135|80|106
Wo-Chien|85|85|100|95|135|70
Chien-Pao|80|120|80|90|65|135
Ting-Lu|155|110|125|55|80|45
Chi-Yu|55|80|80|135|120|100
Okidogi|88|128|115|58|86|80
Munkidori|88|75|66|130|90|106
Fezandipiti|88|91|82|70|125|99
Ogerpon|80|120|84|60|96|110
Terapagos|95|95|110|105|110|85
Pecharunt|88|88|160|88|88|88
Galarian Articuno|90|85|85|125|100|95
Galarian Zapdos|90|125|90|85|90|100
Galarian Moltres|90|85|90|100|125|90
Cosmog|43|29|31|29|31|37
Cosmoem|43|29|131|29|131|37
Poipole|67|73|67|73|67|73
Meltan|46|65|65|55|35|34
Kubfu|60|90|60|53|50|72
Type: Null|95|95|95|95|95|59
Zygarde 10%|54|100|71|61|85|115
Phione|80|80|80|80|80|80
Bloodmoon Ursaluna|113|70|120|135|65|52
Eternal Flower Floette|74|65|67|125|128|92
Calyrex|100|80|80|80|80|80
Mega Venusaur|80|100|123|122|120|80
Mega Charizard X|78|130|111|130|85|100
Mega Charizard Y|78|104|78|159|115|100
Mega Blastoise|79|103|120|135|115|78
Mega Beedrill|65|150|40|15|80|145
Mega Pidgeot|83|80|80|135|80|121
Mega Alakazam|55|50|65|175|105|150
Mega Slowbro|95|75|180|130|80|30
Mega Gengar|60|65|80|170|95|130
Mega Kangaskhan|105|125|100|60|100|100
Mega Pinsir|65|155|120|65|90|105
Mega Gyarados|95|155|109|70|130|81
Mega Aerodactyl|80|135|85|70|95|150
Mega Mewtwo X|106|190|100|154|100|130
Mega Mewtwo Y|106|150|70|194|120|140
Mega Ampharos|90|95|105|165|110|45
Mega Steelix|75|125|230|55|95|30
Mega Scizor|70|150|140|65|100|75
Mega Heracross|80|185|115|40|105|75
Mega Houndoom|75|90|90|140|90|115
Mega Tyranitar|100|164|150|95|120|71
Mega Sceptile|70|110|75|145|85|145
Mega Blaziken|80|160|80|130|80|100
Mega Swampert|100|150|110|95|110|70
Mega Gardevoir|68|85|65|165|135|100
Mega Sableye|50|85|125|85|115|20
Mega Mawile|50|105|125|55|95|50
Mega Aggron|70|140|230|60|80|50
Mega Medicham|60|100|85|80|85|100
Mega Manectric|70|75|80|135|80|135
Mega Sharpedo|70|140|70|110|65|105
Mega Camerupt|70|120|100|145|105|20
Mega Altaria|75|110|110|110|105|80
Mega Banette|64|165|75|93|83|75
Mega Absol|65|150|60|115|60|115
Mega Absol Z|65|154|60|75|60|151
Mega Glalie|80|120|80|120|80|100
Mega Salamence|95|145|130|120|90|120
Mega Metagross|80|145|150|105|110|110
Mega Latias|80|100|120|140|150|110
Mega Latios|80|130|100|160|120|110
Mega Rayquaza|105|180|100|180|100|115
Mega Lopunny|65|136|94|54|96|135
Mega Garchomp|108|170|115|120|95|92
Mega Garchomp Z|108|130|85|141|85|151
Mega Lucario|70|145|88|140|70|112
Mega Lucario Z|70|100|70|164|70|151
Mega Abomasnow|90|132|105|132|105|30
Mega Gallade|68|165|95|65|115|110
Mega Audino|103|60|126|80|126|50
Mega Diancie|50|160|110|160|110|110
Mega Clefable|95|80|93|135|110|70
Mega Victreebel|80|125|85|135|95|70
Mega Starmie|60|100|105|130|105|120
Mega Dragonite|91|124|115|145|125|100
Mega Meganium|80|92|115|143|115|80
Mega Feraligatr|85|160|125|89|93|78
Mega Skarmory|65|140|110|40|100|110
Mega Froslass|70|80|70|140|100|120
Mega Emboar|110|148|75|110|110|75
Mega Excadrill|110|165|100|65|65|103
Mega Scolipede|60|140|149|75|99|62
Mega Scrafty|65|130|135|55|135|68
Mega Eelektross|85|145|80|135|90|80
Mega Chandelure|60|75|110|175|110|90
Mega Chesnaught|88|137|172|74|115|44
Mega Delphox|75|69|72|159|125|134
Mega Greninja|72|125|77|133|81|142
Mega Pyroar|86|88|92|129|86|126
Mega Malamar|86|102|88|98|120|88
Mega Barbaracle|72|140|130|64|106|88
Mega Dragalge|65|85|105|132|163|44
Mega Hawlucha|78|137|100|74|93|118
Mega Zygarde|216|70|91|216|85|100
Mega Drampa|78|85|110|160|116|36
Mega Falinks|65|135|135|70|65|100
Mega Raichu X|60|135|95|90|95|110
Mega Raichu Y|60|100|55|160|80|130
Mega Chimecho|75|50|110|135|120|65
Mega Staraptor|85|140|100|60|90|110
Mega Heatran|91|120|106|175|141|67
Mega Darkrai|70|120|130|165|130|85
Mega Golurk|89|159|105|70|105|55
Mega Meowstic|74|48|76|143|101|124
Mega Crabominable|97|157|122|62|107|33
Mega Golisopod|75|150|175|70|120|40
Mega Magearna|80|125|115|170|115|95
Mega Zeraora|88|157|75|147|80|153
Mega Scovillain|65|138|85|138|85|75
Mega Glimmora|83|90|105|150|96|101
Mega Tatsugiri|68|65|90|135|125|92
Mega Baxcalibur|115|175|117|105|101|87
Mega Eternal Flower Floette|74|85|87|155|148|102`;

// ---------- PARADOX_RAW (Paradox Pokémon) ----------
// Paradox Pokémon: never wild, never in the legendary pool. The League assigns one to a new Elite Four member
// to replace the Pokémon they left with their old team, and the Champion's team gives one as its reward (v182).
const PARADOX_RAW = `Great Tusk|Ground|Fighting|570
Scream Tail|Fairy|Psychic|570
Brute Bonnet|Grass|Dark|570
Flutter Mane|Ghost|Fairy|570
Slither Wing|Bug|Fighting|570
Sandy Shocks|Electric|Ground|570
Roaring Moon|Dragon|Dark|590
Walking Wake|Water|Dragon|590
Gouging Fire|Fire|Dragon|590
Raging Bolt|Electric|Dragon|590
Iron Treads|Ground|Steel|570
Iron Bundle|Ice|Water|570
Iron Hands|Fighting|Electric|570
Iron Jugulis|Dark|Flying|570
Iron Moth|Fire|Poison|570
Iron Thorns|Rock|Electric|570
Iron Valiant|Fairy|Fighting|590
Iron Leaves|Grass|Psychic|590
Iron Boulder|Rock|Psychic|590
Iron Crown|Steel|Psychic|590`;

// ---------- BABY_RAW (baby legendaries and rare finds) ----------
// Baby legendaries: a very rare find when exploring, one of each line in the world at a time. They evolve by level as normal.
const BABY_RAW = `Cosmog|Psychic||200|Cosmoem@43
Cosmoem|Psychic||400|Solgaleo@53/Lunala@53
Poipole|Poison||420|Naganadel@40
Meltan|Steel||300|Melmetal@45
Kubfu|Fighting||385|Urshifu (Single Strike)@50/Urshifu (Rapid Strike)@50
Type: Null|Normal||534|Silvally@45
Zygarde 10%|Dragon|Ground|486|Zygarde@55
Phione|Water||480||Mythical
Bloodmoon Ursaluna|Ground|Normal|555||One of a kind
Eternal Flower Floette|Fairy||551||One of a kind
Calyrex|Psychic|Grass|500||Rare find`;

// ---------- MEGA_RAW (Mega forms) ----------
const MEGA_RAW = `Venusaur||Grass|Poison|625
Charizard|X|Fire|Dragon|634
Charizard|Y|Fire|Flying|634
Blastoise||Water||630
Beedrill||Bug|Poison|495
Pidgeot||Normal|Flying|579
Alakazam||Psychic||600
Slowbro||Water|Psychic|590
Gengar||Ghost|Poison|600
Kangaskhan||Normal||590
Pinsir||Bug|Flying|600
Gyarados||Water|Dark|640
Aerodactyl||Rock|Flying|615
Mewtwo|X|Psychic|Fighting|780
Mewtwo|Y|Psychic||780
Ampharos||Electric|Dragon|610
Steelix||Steel|Ground|610
Scizor||Bug|Steel|600
Heracross||Bug|Fighting|600
Houndoom||Dark|Fire|600
Tyranitar||Rock|Dark|700
Sceptile||Grass|Dragon|630
Blaziken||Fire|Fighting|630
Swampert||Water|Ground|635
Gardevoir||Psychic|Fairy|618
Sableye||Dark|Ghost|480
Mawile||Steel|Fairy|480
Aggron||Steel||630
Medicham||Fighting|Psychic|510
Manectric||Electric||575
Sharpedo||Water|Dark|560
Camerupt||Fire|Ground|560
Altaria||Dragon|Fairy|590
Banette||Ghost||555
Absol||Dark||565
Glalie||Ice||580
Salamence||Dragon|Flying|700
Metagross||Steel|Psychic|700
Latias||Dragon|Psychic|700
Latios||Dragon|Psychic|700
Rayquaza||Dragon|Flying|780
Lopunny||Normal|Fighting|580
Garchomp||Dragon|Ground|700
Lucario||Fighting|Steel|625
Abomasnow||Grass|Ice|594
Gallade||Psychic|Fighting|618
Audino||Normal|Fairy|545
Diancie||Rock|Fairy|700
Clefable||Fairy|Flying|583
Victreebel||Grass|Poison|590
Starmie||Water|Psychic|660
Dragonite||Dragon|Flying|700
Meganium||Grass|Fairy|625
Feraligatr||Water|Dragon|638
Skarmory||Steel|Flying|565
Froslass||Ice|Ghost|580
Emboar||Fire|Fighting|628
Excadrill||Ground|Steel|608
Scolipede||Bug|Poison|585
Scrafty||Dark|Fighting|588
Eelektross||Electric||610
Chandelure||Ghost|Fire|620
Chesnaught||Grass|Fighting|630
Delphox||Fire|Psychic|634
Greninja||Water|Dark|630
Pyroar||Fire|Normal|607
Malamar||Dark|Psychic|582
Barbaracle||Rock|Fighting|600
Dragalge||Poison|Dragon|594
Hawlucha||Fighting|Flying|600
Zygarde||Dragon|Ground|778
Drampa||Normal|Dragon|585
Falinks||Fighting||570
Raichu|X|Electric||585
Raichu|Y|Electric||585
Chimecho||Psychic|Steel|555
Absol|Z|Dark|Ghost|565
Staraptor||Fighting|Flying|585
Garchomp|Z|Dragon||700
Lucario|Z|Fighting|Steel|625
Heatran||Fire|Steel|700
Darkrai||Dark||700
Golurk||Ground|Ghost|583
Meowstic||Psychic||566
Crabominable||Fighting|Ice|578
Golisopod||Bug|Steel|630
Magearna||Steel|Fairy|700
Zeraora||Electric||700
Scovillain||Grass|Fire|586
Glimmora||Rock|Poison|625
Tatsugiri||Dragon|Water|575
Baxcalibur||Dragon|Ice|700
Eternal Flower Floette||Fairy||651`;

// ---------- MOVES_RAW (the move list) ----------
// name | type | P(hysical)/S(pecial) | power | accuracy | tier | flags | effect
// flags: c contact, p punch, b bite, u pulse, s sound, o ball/bomb, x slicing, k priority, n can't miss or be dodged, r recharge next turn,
//   g signature (only the species in SIG_MOVES learn it; it never enters the shared type pools),
//   m hits 2–5 times, d hits twice, t hits three times (power is per hit)
// effects: st:X:N status X at N% (par brn psn tox slp) · fl:N flinch · drain:N · recoil:N · self:stat-n,… · foe:stat-n:N
//   crit (high crit) · facade · hex · knock · boost:stat · boost2:a,b · dance:a,b,c (+1 to one at random) · heal:25
//   protect · hazard:rocks|spikes · weather:rain|sun|sand|snow · seed (Leech Seed)
//   up:stat+n,…:N raise the user's own stats at N% when the attack lands
const MOVES_RAW = `Tackle|Normal|P|40|100|1|c|
Quick Attack|Normal|P|40|100|1|ck|
Headbutt|Normal|P|70|100|2|c|fl:30
Body Slam|Normal|P|85|100|2|c|st:par:30
Double-Edge|Normal|P|120|100|3|c|recoil:33
Facade|Normal|P|70|100|2|c|facade
Swift|Normal|S|60|100|1|n|
Hyper Voice|Normal|S|90|100|3|s|
Hyper Beam|Normal|S|150|90|3|r|
Giga Impact|Normal|P|150|90|3|cr|
Swords Dance|Normal|P|30|100|2||boost:atk
Recover|Normal|S|30|100|2||heal:25
Protect|Normal|S|20|100|1||protect
Sing|Normal|S|20|60|1|s|st:slp:75
Ember|Fire|S|40|100|1||st:brn:10
Fire Fang|Fire|P|65|95|2|cb|st:brn:10
Fire Punch|Fire|P|75|100|2|cp|st:brn:10
Flamethrower|Fire|S|90|100|3||st:brn:10
Flare Blitz|Fire|P|120|100|3|c|recoil:33
Fire Blast|Fire|S|110|85|3||st:brn:10
Overheat|Fire|S|130|90|3||self:spa-2
Will-O-Wisp|Fire|S|20|85|1||st:brn:80
Sunny Day|Fire|S|20|100|1||weather:sun
Water Gun|Water|S|40|100|1||
Aqua Jet|Water|P|40|100|1|ck|
Water Pulse|Water|S|60|100|2|u|
Bubble Beam|Water|S|65|100|2||foe:spe-1:10
Waterfall|Water|P|80|100|2|c|fl:20
Scald|Water|S|80|100|2||st:brn:30
Liquidation|Water|P|85|100|3|c|foe:def-1:20
Surf|Water|S|90|100|3||
Hydro Pump|Water|S|110|80|3||
Rain Dance|Water|S|20|100|1||weather:rain
Thunder Shock|Electric|S|40|100|1||st:par:10
Spark|Electric|P|65|100|2|c|st:par:30
Thunder Fang|Electric|P|65|95|2|cb|st:par:10
Thunder Punch|Electric|P|75|100|2|cp|st:par:10
Thunderbolt|Electric|S|90|100|3||st:par:10
Wild Charge|Electric|P|90|100|3|c|recoil:25
Thunder|Electric|S|110|70|3||st:par:30
Thunder Wave|Electric|S|20|90|1||st:par:80
Vine Whip|Grass|P|45|100|1|c|
Mega Drain|Grass|S|40|100|1||drain:50
Razor Leaf|Grass|P|55|95|1|x|crit
Giga Drain|Grass|S|75|100|2||drain:50
Seed Bomb|Grass|P|80|100|2|o|
Energy Ball|Grass|S|90|100|3|o|foe:spd-1:10
Leaf Blade|Grass|P|90|100|3|cx|crit
Solar Beam|Grass|S|110|100|3||
Wood Hammer|Grass|P|120|100|3|c|recoil:33
Leech Seed|Grass|S|20|90|1||seed
Sleep Powder|Grass|S|20|75|1||st:slp:75
Stun Spore|Grass|S|20|75|1||st:par:75
Ice Shard|Ice|P|40|100|1|k|
Powder Snow|Ice|S|40|100|1||
Icy Wind|Ice|S|55|95|1||foe:spe-1:100
Ice Fang|Ice|P|65|95|2|cb|fl:10
Ice Punch|Ice|P|75|100|2|cp|
Icicle Crash|Ice|P|85|90|3||fl:30
Ice Beam|Ice|S|90|100|3||
Blizzard|Ice|S|110|70|3||
Snowscape|Ice|S|20|100|1||weather:snow
Mach Punch|Fighting|P|40|100|1|cpk|
Low Kick|Fighting|P|50|100|1|c|
Brick Break|Fighting|P|75|100|2|c|
Drain Punch|Fighting|P|75|100|2|cp|drain:50
Aura Sphere|Fighting|S|80|100|3|uno|
Close Combat|Fighting|P|120|100|3|c|self:def-1,spd-1
Focus Blast|Fighting|S|120|70|3|o|foe:spd-1:10
Bulk Up|Fighting|P|35|100|2||boost2:atk,def
Detect|Fighting|S|20|100|1||protect
Poison Sting|Poison|P|40|100|1||st:psn:30
Acid|Poison|S|40|100|1||foe:spd-1:10
Poison Fang|Poison|P|50|100|1|cb|st:tox:50
Poison Jab|Poison|P|80|100|2|c|st:psn:30
Sludge Bomb|Poison|S|90|100|3|o|st:psn:30
Gunk Shot|Poison|P|120|80|3||st:psn:30
Toxic|Poison|S|20|90|1||st:tox:85
Mud Shot|Ground|S|55|95|1||foe:spe-1:100
Bulldoze|Ground|P|60|100|2||foe:spe-1:100
Dig|Ground|P|80|100|2|c|
Earth Power|Ground|S|90|100|3||foe:spd-1:10
Earthquake|Ground|P|100|100|3||
Spikes|Ground|P|20|100|1||hazard:spikes
Gust|Flying|S|40|100|1||
Wing Attack|Flying|P|60|100|1|c|
Aerial Ace|Flying|P|60|100|2|cnx|
Air Slash|Flying|S|75|95|2|x|fl:30
Drill Peck|Flying|P|80|100|2|c|
Brave Bird|Flying|P|120|100|3|c|recoil:33
Hurricane|Flying|S|110|70|3||
Roost|Flying|S|30|100|2||heal:25
Confusion|Psychic|S|50|100|1||
Psybeam|Psychic|S|65|100|2||
Psycho Cut|Psychic|P|70|100|2|x|crit
Zen Headbutt|Psychic|P|80|90|2|c|fl:20
Psychic|Psychic|S|90|100|3||foe:spd-1:10
Calm Mind|Psychic|S|35|100|2||boost2:spa,spd
Hypnosis|Psychic|S|20|60|1||st:slp:75
Bug Bite|Bug|P|60|100|1|c|
Struggle Bug|Bug|S|50|100|1||foe:spa-1:100
U-turn|Bug|P|70|100|2|c|
X-Scissor|Bug|P|80|100|2|cx|
Leech Life|Bug|P|80|100|3|c|drain:50
Bug Buzz|Bug|S|90|100|3|s|foe:spd-1:10
Megahorn|Bug|P|120|85|3|c|
Quiver Dance|Bug|S|30|100|2||dance:spa,spd,spe
Rock Throw|Rock|P|50|90|1||
Rock Tomb|Rock|P|60|95|1||foe:spe-1:100
Rock Slide|Rock|P|75|90|2||fl:30
Power Gem|Rock|S|80|100|2||
Stone Edge|Rock|P|100|80|3||crit
Head Smash|Rock|P|150|80|3|c|recoil:50
Stealth Rock|Rock|P|20|100|1||hazard:rocks
Sandstorm|Rock|S|20|100|1||weather:sand
Lick|Ghost|P|30|100|1|c|st:par:30
Astonish|Ghost|P|40|100|1|c|fl:30
Shadow Sneak|Ghost|P|40|100|1|ck|
Hex|Ghost|S|65|100|2||hex
Shadow Claw|Ghost|P|70|100|2|c|crit
Shadow Ball|Ghost|S|80|100|3|o|foe:spd-1:20
Phantom Force|Ghost|P|90|100|3|c|
Twister|Dragon|S|40|100|1||fl:20
Dragon Breath|Dragon|S|60|100|1||st:par:30
Dragon Claw|Dragon|P|80|100|2|c|
Dragon Pulse|Dragon|S|85|100|3|u|
Outrage|Dragon|P|120|100|3|c|
Draco Meteor|Dragon|S|130|90|3||self:spa-2
Dragon Dance|Dragon|P|30|100|2||dance:atk,spe
Bite|Dark|P|60|100|1|cb|fl:30
Snarl|Dark|S|55|95|1|s|foe:spa-1:100
Knock Off|Dark|P|65|100|2|c|knock
Night Slash|Dark|P|70|100|2|cx|crit
Sucker Punch|Dark|P|70|100|2|ck|
Crunch|Dark|P|80|100|2|cb|foe:def-1:20
Dark Pulse|Dark|S|80|100|3|u|fl:20
Nasty Plot|Dark|S|30|100|2||boost:spa
Bullet Punch|Steel|P|40|100|1|cpk|
Metal Claw|Steel|P|50|95|1|c|up:atk+1:10
Iron Head|Steel|P|80|100|2|c|fl:30
Flash Cannon|Steel|S|80|100|3||foe:spd-1:10
Meteor Mash|Steel|P|90|90|3|cp|up:atk+1:20
Iron Defense|Steel|P|30|100|2||boost:def
Fairy Wind|Fairy|S|40|100|1||
Disarming Voice|Fairy|S|40|100|1|sn|
Draining Kiss|Fairy|S|50|100|1||drain:75
Dazzling Gleam|Fairy|S|80|100|2||
Play Rough|Fairy|P|90|90|3|c|foe:atk-1:10
Moonblast|Fairy|S|95|100|3||foe:spa-1:30
Moonlight|Fairy|S|30|100|2||heal:25
Slash|Normal|P|70|100|2|cx|crit
Crush Claw|Normal|P|75|95|2|c|foe:def-1:50
Mega Kick|Normal|P|120|75|3|c|
Thrash|Normal|P|120|100|3|c|
Work Up|Normal|S|30|100|2||boost2:atk,spa
Flame Wheel|Fire|P|60|100|1|c|st:brn:10
Lava Plume|Fire|S|80|100|2||st:brn:30
Fire Lash|Fire|P|80|100|2|c|foe:def-1:100
Mystical Fire|Fire|S|75|100|2||foe:spa-1:100
Blaze Kick|Fire|P|85|90|3|c|crit
Heat Wave|Fire|S|95|90|3||st:brn:10
Chilling Water|Water|S|50|100|1||foe:atk-1:100
Flip Turn|Water|P|60|100|1|c|
Razor Shell|Water|P|75|95|2|cx|foe:def-1:50
Dive|Water|P|80|100|2|c|
Aqua Tail|Water|P|90|90|3|c|
Wave Crash|Water|P|120|100|3|c|recoil:33
Electroweb|Electric|S|55|95|1||foe:spe-1:100
Volt Switch|Electric|S|70|100|2||
Discharge|Electric|S|80|100|2||st:par:30
Magical Leaf|Grass|S|60|100|1|n|
Horn Leech|Grass|P|75|100|2|c|drain:50
Petal Blizzard|Grass|P|90|100|3||
Power Whip|Grass|P|120|85|3|c|
Leaf Storm|Grass|S|130|90|3||self:spa-2
Synthesis|Grass|S|30|100|2||heal:25
Frost Breath|Ice|S|60|90|1||crit
Aurora Beam|Ice|S|65|100|2||foe:atk-1:10
Ice Spinner|Ice|P|80|100|2|c|
Ice Hammer|Ice|P|100|90|3|cp|self:spe-1
Rock Smash|Fighting|P|40|100|1|c|foe:def-1:50
Vacuum Wave|Fighting|S|40|100|1|k|
Karate Chop|Fighting|P|50|100|1|c|crit
Force Palm|Fighting|P|60|100|1|c|st:par:30
Low Sweep|Fighting|P|65|100|2|c|foe:spe-1:100
Sky Uppercut|Fighting|P|85|90|2|cp|
Cross Chop|Fighting|P|100|80|3|c|crit
Hammer Arm|Fighting|P|100|90|3|cp|self:spe-1
Superpower|Fighting|P|120|100|3|c|self:atk-1,def-1
Acid Spray|Poison|S|40|100|1|o|foe:spd-2:100
Poison Tail|Poison|P|50|100|1|c|crit
Sludge|Poison|S|65|100|2||st:psn:30
Cross Poison|Poison|P|70|100|2|cx|crit
Sludge Wave|Poison|S|95|100|3||st:psn:10
Scorching Sands|Ground|S|70|100|2||st:brn:30
Stomping Tantrum|Ground|P|75|100|2|c|
Drill Run|Ground|P|80|95|2|c|crit
High Horsepower|Ground|P|95|95|3|c|
Shore Up|Ground|S|30|100|2||heal:25
Peck|Flying|P|35|100|1|c|
Pluck|Flying|P|60|100|1|c|
Air Cutter|Flying|S|60|95|1|x|crit
Bounce|Flying|P|85|85|3|c|st:par:30
Fly|Flying|P|90|95|3|c|
Heart Stamp|Psychic|P|60|100|1|c|fl:30
Extrasensory|Psychic|S|80|100|2||fl:10
Agility|Psychic|S|30|100|2||boost:spe
Cosmic Power|Psychic|S|30|100|2||boost2:def,spd
Pounce|Bug|P|50|100|1|c|foe:spe-1:100
Steamroller|Bug|P|65|100|2|c|fl:30
Skitter Smack|Bug|P|70|90|2|c|foe:spa-1:100
Lunge|Bug|P|80|100|2|c|foe:atk-1:100
Pollen Puff|Bug|S|90|100|3|o|
Smack Down|Rock|P|50|100|1||
Rock Polish|Rock|P|30|100|2||boost:spe
Rock Wrecker|Rock|P|150|90|3|or|
Shadow Punch|Ghost|P|60|100|1|cpn|
Poltergeist|Ghost|P|110|90|3||
Breaking Swipe|Dragon|P|60|100|1|c|foe:atk-1:100
Dragon Hammer|Dragon|P|90|100|3|c|
Dragon Rush|Dragon|P|100|75|3|c|fl:20
Payback|Dark|P|50|100|1|c|
Feint Attack|Dark|P|60|100|1|cn|
Throat Chop|Dark|P|80|100|2|c|
Darkest Lariat|Dark|P|85|100|3|c|
Hone Claws|Dark|P|30|100|2||boost:atk
Magnet Bomb|Steel|P|60|100|1|on|
Smart Strike|Steel|P|70|100|2|cn|
Anchor Shot|Steel|P|80|100|2|c|
Iron Tail|Steel|P|100|75|3|c|foe:def-1:30
Spin Out|Steel|P|100|100|3|c|self:spe-2
Steel Beam|Steel|S|140|95|3||recoil:50
Autotomize|Steel|P|30|100|2||boost:spe
Strange Steam|Fairy|S|90|95|3||
Extreme Speed|Normal|P|80|100|3|ckg|
Hyper Fang|Normal|P|80|90|2|cbg|fl:10
Boomburst|Normal|S|140|100|3|sg|
Soft-Boiled|Normal|S|30|100|2|g|heal:25
Milk Drink|Normal|S|30|100|2|g|heal:25
Slack Off|Normal|S|30|100|2|g|heal:25
Pyro Ball|Fire|P|120|90|3|og|st:brn:10
Bitter Blade|Fire|P|90|100|3|cxg|drain:50
Armor Cannon|Fire|S|120|100|3|g|self:def-1,spd-1
Sacred Fire|Fire|P|100|95|3|g|st:brn:50
Blue Flare|Fire|S|130|85|3|g|st:brn:20
Crabhammer|Water|P|100|90|3|cg|crit
Snipe Shot|Water|S|80|100|2|g|crit
Jet Punch|Water|P|60|100|2|cpkg|
Water Shuriken|Water|S|20|100|1|kmg|
Sparkling Aria|Water|S|90|100|3|sg|
Fishious Rend|Water|P|85|100|3|cbg|
Origin Pulse|Water|S|110|85|3|ug|
Steam Eruption|Water|S|110|95|3|g|st:brn:30
Surging Strikes|Water|P|25|100|3|cptg|crit
Zing Zap|Electric|P|80|100|2|cg|fl:30
Overdrive|Electric|S|80|100|2|sg|
Bolt Beak|Electric|P|85|100|3|cg|
Double Shock|Electric|P|120|100|3|cg|
Bolt Strike|Electric|P|130|85|3|cg|st:par:20
Electro Drift|Electric|S|100|100|3|g|
Plasma Fists|Electric|P|100|100|3|cpg|
Drum Beating|Grass|P|80|100|2|g|foe:spe-1:100
Flower Trick|Grass|P|70|100|2|ng|crit
Apple Acid|Grass|S|80|100|2|g|foe:spd-1:100
Grav Apple|Grass|P|80|100|2|g|foe:def-1:100
Seed Flare|Grass|S|120|85|3|g|foe:spd-2:40
Mountain Gale|Ice|P|100|85|3|g|fl:30
Glacial Lance|Ice|P|120|100|3|g|
Triple Arrows|Fighting|P|90|100|3|g|foe:def-1:50
Collision Course|Fighting|P|100|100|3|cg|
Barb Barrage|Poison|P|60|100|2|g|st:psn:50
Bone Club|Ground|P|65|85|2|g|fl:10
Headlong Rush|Ground|P|120|100|3|cpg|self:def-1,spd-1
Precipice Blades|Ground|P|120|85|3|g|
Aeroblast|Flying|S|100|95|3|ug|crit
Dragon Ascent|Flying|P|120|100|3|cg|self:def-1,spd-1
Oblivion Wing|Flying|S|80|100|2|g|drain:75
Lumina Crash|Psychic|S|80|100|2|g|foe:spd-2:100
Psycho Boost|Psychic|S|140|90|3|g|self:spa-2
Mist Ball|Psychic|S|95|100|3|og|foe:spa-1:50
Luster Purge|Psychic|S|95|100|3|g|foe:spd-1:50
Attack Order|Bug|P|90|100|3|g|crit
Heal Order|Bug|S|30|100|2|g|heal:25
Accelerock|Rock|P|40|100|1|kg|
Shadow Bone|Ghost|P|85|100|3|g|foe:def-1:20
Infernal Parade|Ghost|S|60|100|2|g|hex
Bitter Malice|Ghost|S|75|100|2|g|foe:atk-1:100
Shadow Force|Ghost|P|120|100|3|cg|
Moongeist Beam|Ghost|S|100|100|3|g|
Astral Barrage|Ghost|S|120|100|3|g|
Spectral Thief|Ghost|P|90|100|3|cg|
Clanging Scales|Dragon|S|110|100|3|sg|self:def-1
Dragon Darts|Dragon|P|50|100|3|dg|
Roar of Time|Dragon|S|150|90|3|rg|
Spacial Rend|Dragon|S|100|95|3|g|crit
Night Daze|Dark|S|85|95|3|g|
Kowtow Cleave|Dark|P|85|100|3|cnxg|
Obstruct|Dark|S|20|100|1|g|protect
Wicked Blow|Dark|P|75|100|3|cpg|crit
Shift Gear|Steel|P|30|100|2|g|boost2:atk,spe
Make It Rain|Steel|S|120|100|3|g|self:spa-1
Gigaton Hammer|Steel|P|160|100|3|g|
Sunsteel Strike|Steel|P|100|100|3|cg|
Doom Desire|Steel|S|140|100|3|g|
Behemoth Blade|Steel|P|100|100|3|cxg|
Behemoth Bash|Steel|P|100|100|3|cg|
Spirit Break|Fairy|P|75|100|2|cg|foe:spa-1:100
Fleur Cannon|Fairy|S|130|90|3|g|self:spa-2
Rapid Spin|Normal|P|50|100|1|c|up:spe+1:100
Flame Charge|Fire|P|50|100|1|c|up:spe+1:100
Charge Beam|Electric|S|50|90|1||up:spa+1:70
Trailblaze|Grass|P|50|100|1|c|up:spe+1:100
Power-Up Punch|Fighting|P|40|100|1|cp|up:atk+1:100
Ancient Power|Rock|S|60|100|1||up:atk+1,def+1,spa+1,spd+1,spe+1:10
Silver Wind|Bug|S|60|100|1||up:atk+1,def+1,spa+1,spd+1,spe+1:10
Ominous Wind|Ghost|S|60|100|1||up:atk+1,def+1,spa+1,spd+1,spe+1:10
Steel Wing|Steel|P|70|90|2|c|up:def+1:10
Torch Song|Fire|S|80|100|2|sg|up:spa+1:100
Fiery Dance|Fire|S|80|100|2|g|up:spa+1:50
Aqua Step|Water|P|80|100|2|cg|up:spe+1:100
Aura Wheel|Electric|P|110|100|3|g|up:spe+1:100
Esper Wing|Psychic|S|80|100|2|xg|up:spe+1:100
Psyshield Bash|Psychic|P|70|90|2|cg|up:def+1:100
Diamond Storm|Rock|P|100|95|3|g|up:def+2:50
Arm Thrust|Fighting|P|15|100|1|cm|
Fury Swipes|Normal|P|18|80|1|cm|
Spike Cannon|Normal|P|20|100|1|m|
Double Kick|Fighting|P|30|100|1|cd|
Twineedle|Bug|P|25|100|1|d|st:psn:20
Bullet Seed|Grass|P|25|100|2|om|
Icicle Spear|Ice|P|25|100|2|m|
Rock Blast|Rock|P|25|90|2|om|
Pin Missile|Bug|P|25|95|2|m|
Bone Rush|Ground|P|25|90|2|m|
Tail Slap|Normal|P|25|85|2|cm|
Scale Shot|Dragon|P|25|90|2|m|up:spe+1:100
Double Hit|Normal|P|35|90|2|cd|
Dual Chop|Dragon|P|40|90|2|cd|
Dual Wingbeat|Flying|P|40|90|2|cd|
Twin Beam|Psychic|S|40|100|2|d|
Bonemerang|Ground|P|50|90|3|d|
Triple Dive|Water|P|30|95|3|ct|
Triple Axel|Ice|P|40|90|3|ct|
Population Bomb|Normal|P|30|90|3|cmg|
Gear Grind|Steel|P|50|85|3|cdg|
Double Iron Bash|Steel|P|60|100|3|cpdg|fl:30
Sky Attack|Flying|P|140|90|3|g|fl:30
??????|Bird|S|55|100|1|g|`;

// ---------- SIG_MOVES (signature moves) ----------
// signature moves: which species learn each one (the move is theirs alone, and it takes the slot of its type)
const SIG_MOVES = {
  "Extreme Speed": ["Arcanine", "Hisuian Arcanine", "Dragonite"],
  "Hyper Fang": ["Raticate", "Alolan Raticate"],
  "Boomburst": ["Exploud"],
  "Soft-Boiled": ["Chansey", "Blissey"],
  "Milk Drink": ["Miltank"],
  "Slack Off": ["Slowbro", "Slowking", "Slaking"],
  "Pyro Ball": ["Cinderace"],
  "Bitter Blade": ["Ceruledge"],
  "Armor Cannon": ["Armarouge"],
  "Sacred Fire": ["Ho-Oh"],
  "Blue Flare": ["Reshiram"],
  "Crabhammer": ["Kingler", "Crawdaunt"],
  "Snipe Shot": ["Inteleon"],
  "Jet Punch": ["Palafin"],
  "Water Shuriken": ["Greninja"],
  "Sparkling Aria": ["Primarina"],
  "Fishious Rend": ["Dracovish", "Arctovish"],
  "Origin Pulse": ["Kyogre"],
  "Steam Eruption": ["Volcanion"],
  "Surging Strikes": ["Urshifu (Rapid Strike)"],
  "Zing Zap": ["Togedemaru"],
  "Overdrive": ["Toxtricity"],
  "Bolt Beak": ["Dracozolt", "Arctozolt"],
  "Double Shock": ["Pawmot"],
  "Bolt Strike": ["Zekrom"],
  "Electro Drift": ["Miraidon"],
  "Plasma Fists": ["Zeraora"],
  "Drum Beating": ["Rillaboom"],
  "Flower Trick": ["Meowscarada"],
  "Apple Acid": ["Flapple"],
  "Grav Apple": ["Appletun"],
  "Seed Flare": ["Shaymin"],
  "Mountain Gale": ["Hisuian Avalugg"],
  "Glacial Lance": ["Glastrier"],
  "Triple Arrows": ["Sirfetch'd"],
  "Collision Course": ["Koraidon"],
  "Barb Barrage": ["Hisuian Qwilfish", "Overqwil"],
  "Bone Club": ["Cubone", "Marowak"],
  "Headlong Rush": ["Great Tusk"],
  "Precipice Blades": ["Groudon"],
  "Aeroblast": ["Lugia"],
  "Dragon Ascent": ["Rayquaza"],
  "Oblivion Wing": ["Yveltal"],
  "Lumina Crash": ["Espathra"],
  "Psycho Boost": ["Deoxys"],
  "Mist Ball": ["Latias"],
  "Luster Purge": ["Latios"],
  "Attack Order": ["Vespiquen"],
  "Heal Order": ["Vespiquen"],
  "Accelerock": ["Lycanroc"],
  "Shadow Bone": ["Alolan Marowak"],
  "Infernal Parade": ["Hisuian Typhlosion"],
  "Bitter Malice": ["Hisuian Zoroark"],
  "Shadow Force": ["Giratina"],
  "Moongeist Beam": ["Lunala"],
  "Astral Barrage": ["Spectrier"],
  "Spectral Thief": ["Marshadow"],
  "Clanging Scales": ["Kommo-o"],
  "Dragon Darts": ["Dragapult"],
  "Roar of Time": ["Dialga"],
  "Spacial Rend": ["Palkia"],
  "Night Daze": ["Zoroark"],
  "Kowtow Cleave": ["Kingambit"],
  "Obstruct": ["Obstagoon"],
  "Wicked Blow": ["Urshifu (Single Strike)"],
  "Shift Gear": ["Klinklang"],
  "Make It Rain": ["Gholdengo"],
  "Gigaton Hammer": ["Tinkaton"],
  "Sunsteel Strike": ["Solgaleo"],
  "Doom Desire": ["Jirachi"],
  "Behemoth Blade": ["Zacian"],
  "Behemoth Bash": ["Zamazenta"],
  "Spirit Break": ["Grimmsnarl"],
  "Fleur Cannon": ["Magearna"],
  "Torch Song": ["Skeledirge"],
  "Fiery Dance": ["Volcarona"],
  "Aqua Step": ["Quaquaval"],
  "Aura Wheel": ["Morpeko"],
  "Esper Wing": ["Hisuian Braviary"],
  "Psyshield Bash": ["Wyrdeer"],
  "Diamond Storm": ["Diancie"],
  "Population Bomb": ["Maushold"],
  "Gear Grind": ["Klinklang"],
  "Double Iron Bash": ["Melmetal"]
};

// ---------- ABILITY_RAW (ability slots) ----------
// Every species' real ability slots (regular 1, regular 2, hidden), from Pokémon Showdown's data. A Pokémon keeps its
// slot when it evolves. Only abilities in ABILITIES are live; a slot whose ability isn't built yet falls back to another
// of the species' built abilities, and a species with none shows "No ability yet".
const ABILITY_RAW = `Missingno|Glitch||
Rattata|Run Away|Guts|Hustle
Raticate|Run Away|Guts|Hustle
Pidgey|Keen Eye|Tangled Feet|Big Pecks
Pidgeotto|Keen Eye|Tangled Feet|Big Pecks
Pidgeot|Keen Eye|Tangled Feet|Big Pecks
Spearow|Keen Eye||Sniper
Fearow|Keen Eye||Sniper
Eevee|Run Away|Adaptability|Anticipation
Porygon|Trace|Download|Analytic
Tauros|Intimidate|Anger Point|Sheer Force
Kangaskhan|Early Bird|Scrappy|Inner Focus
Snorlax|Immunity|Thick Fat|Gluttony
Charmander|Blaze||Solar Power
Charmeleon|Blaze||Solar Power
Charizard|Blaze||Solar Power
Cyndaquil|Blaze||Flash Fire
Quilava|Blaze||Flash Fire
Typhlosion|Blaze||Flash Fire
Growlithe|Intimidate|Flash Fire|Justified
Arcanine|Intimidate|Flash Fire|Justified
Vulpix|Flash Fire||Drought
Ninetales|Flash Fire||Drought
Ponyta|Run Away|Flash Fire|Flame Body
Rapidash|Run Away|Flash Fire|Flame Body
Magmar|Flame Body||Vital Spirit
Houndour|Early Bird|Flash Fire|Unnerve
Houndoom|Early Bird|Flash Fire|Unnerve
Squirtle|Torrent||Rain Dish
Wartortle|Torrent||Rain Dish
Blastoise|Torrent||Rain Dish
Totodile|Torrent||Sheer Force
Croconaw|Torrent||Sheer Force
Feraligatr|Torrent||Sheer Force
Psyduck|Damp|Cloud Nine|Swift Swim
Golduck|Damp|Cloud Nine|Swift Swim
Poliwag|Water Absorb|Damp|Swift Swim
Poliwhirl|Water Absorb|Damp|Swift Swim
Poliwrath|Water Absorb|Damp|Swift Swim
Magikarp|Swift Swim||Rattled
Gyarados|Intimidate||Moxie
Staryu|Illuminate|Natural Cure|Analytic
Starmie|Illuminate|Natural Cure|Analytic
Seel|Thick Fat|Hydration|Ice Body
Dewgong|Thick Fat|Hydration|Ice Body
Marill|Thick Fat|Huge Power|Sap Sipper
Azumarill|Thick Fat|Huge Power|Sap Sipper
Lapras|Water Absorb|Shell Armor|Hydration
Omanyte|Swift Swim|Shell Armor|Weak Armor
Omastar|Swift Swim|Shell Armor|Weak Armor
Bulbasaur|Overgrow||Chlorophyll
Ivysaur|Overgrow||Chlorophyll
Venusaur|Overgrow||Chlorophyll
Chikorita|Overgrow||Leaf Guard
Bayleef|Overgrow||Leaf Guard
Meganium|Overgrow||Leaf Guard
Oddish|Chlorophyll||Run Away
Gloom|Chlorophyll||Stench
Vileplume|Chlorophyll||Effect Spore
Bellsprout|Chlorophyll||Gluttony
Weepinbell|Chlorophyll||Gluttony
Victreebel|Chlorophyll||Gluttony
Exeggcute|Chlorophyll||Harvest
Exeggutor|Chlorophyll||Harvest
Tangela|Chlorophyll|Leaf Guard|Regenerator
Pikachu|Static||Lightning Rod
Raichu|Static||Lightning Rod
Magnemite|Magnet Pull|Sturdy|Analytic
Magneton|Magnet Pull|Sturdy|Analytic
Voltorb|Soundproof|Static|Aftermath
Electrode|Soundproof|Static|Aftermath
Mareep|Static||Plus
Flaaffy|Static||Plus
Ampharos|Static||Plus
Electabuzz|Static||Vital Spirit
Jynx|Oblivious|Forewarn|Dry Skin
Swinub|Oblivious|Snow Cloak|Thick Fat
Piloswine|Oblivious|Snow Cloak|Thick Fat
Sneasel|Inner Focus|Keen Eye|Pickpocket
Snorunt|Inner Focus|Ice Body|Moody
Glalie|Inner Focus|Ice Body|Moody
Machop|Guts|No Guard|Steadfast
Machoke|Guts|No Guard|Steadfast
Machamp|Guts|No Guard|Steadfast
Mankey|Vital Spirit|Anger Point|Defiant
Primeape|Vital Spirit|Anger Point|Defiant
Hitmonlee|Limber|Reckless|Unburden
Riolu|Steadfast|Inner Focus|Prankster
Lucario|Steadfast|Inner Focus|Justified
Heracross|Swarm|Guts|Moxie
Ekans|Intimidate|Shed Skin|Unnerve
Arbok|Intimidate|Shed Skin|Unnerve
Grimer|Stench|Sticky Hold|Poison Touch
Muk|Stench|Sticky Hold|Poison Touch
Koffing|Levitate|Neutralizing Gas|Stench
Weezing|Levitate|Neutralizing Gas|Stench
Venonat|Compound Eyes|Tinted Lens|Run Away
Venomoth|Shield Dust|Tinted Lens|Wonder Skin
Sandshrew|Sand Veil||Sand Rush
Sandslash|Sand Veil||Sand Rush
Diglett|Sand Veil|Arena Trap|Sand Force
Dugtrio|Sand Veil|Arena Trap|Sand Force
Cubone|Rock Head|Lightning Rod|Battle Armor
Marowak|Rock Head|Lightning Rod|Battle Armor
Rhyhorn|Lightning Rod|Rock Head|Reckless
Rhydon|Lightning Rod|Rock Head|Reckless
Gible|Sand Veil||Rough Skin
Gabite|Sand Veil||Rough Skin
Garchomp|Sand Veil||Rough Skin
Aerodactyl|Rock Head|Pressure|Unnerve
Skarmory|Keen Eye|Sturdy|Weak Armor
Murkrow|Insomnia|Super Luck|Prankster
Abra|Synchronize|Inner Focus|Magic Guard
Kadabra|Synchronize|Inner Focus|Magic Guard
Alakazam|Synchronize|Inner Focus|Magic Guard
Drowzee|Insomnia|Forewarn|Inner Focus
Hypno|Insomnia|Forewarn|Inner Focus
Ralts|Synchronize|Trace|Telepathy
Kirlia|Synchronize|Trace|Telepathy
Gardevoir|Synchronize|Trace|Telepathy
Scyther|Swarm|Technician|Steadfast
Pinsir|Hyper Cutter|Mold Breaker|Moxie
Geodude|Rock Head|Sturdy|Sand Veil
Graveler|Rock Head|Sturdy|Sand Veil
Golem|Rock Head|Sturdy|Sand Veil
Onix|Rock Head|Sturdy|Weak Armor
Larvitar|Guts||Sand Veil
Pupitar|Shed Skin||
Tyranitar|Sand Stream||Unnerve
Gastly|Levitate||
Haunter|Levitate||
Gengar|Cursed Body||
Misdreavus|Levitate||
Shuppet|Insomnia|Frisk|Cursed Body
Banette|Insomnia|Frisk|Cursed Body
Duskull|Levitate||Frisk
Dusclops|Pressure||Frisk
Swablu|Natural Cure||Cloud Nine
Altaria|Natural Cure||Cloud Nine
Horsea|Swift Swim|Sniper|Damp
Seadra|Poison Point|Sniper|Damp
Kingdra|Swift Swim|Sniper|Damp
Trapinch|Hyper Cutter|Arena Trap|Sheer Force
Vibrava|Levitate||
Flygon|Levitate||
Axew|Rivalry|Mold Breaker|Unnerve
Fraxure|Rivalry|Mold Breaker|Unnerve
Haxorus|Rivalry|Mold Breaker|Unnerve
Dratini|Shed Skin||Marvel Scale
Dragonair|Shed Skin||Marvel Scale
Dragonite|Inner Focus||Multiscale
Bagon|Rock Head||Sheer Force
Shelgon|Rock Head||Overcoat
Salamence|Intimidate||Moxie
Umbreon|Synchronize||Inner Focus
Absol|Pressure|Super Luck|Justified
Bronzor|Levitate|Heatproof|Heavy Metal
Bronzong|Levitate|Heatproof|Heavy Metal
Aron|Sturdy|Rock Head|Heavy Metal
Lairon|Sturdy|Rock Head|Heavy Metal
Aggron|Sturdy|Rock Head|Heavy Metal
Beldum|Clear Body||Light Metal
Metang|Clear Body||Light Metal
Metagross|Clear Body||Light Metal
Mawile|Hyper Cutter|Intimidate|Sheer Force
Clefairy|Cute Charm|Magic Guard|Friend Guard
Clefable|Cute Charm|Magic Guard|Unaware
Snubbull|Intimidate|Run Away|Rattled
Granbull|Intimidate|Quick Feet|Rattled
Pichu|Static||Lightning Rod
Cleffa|Cute Charm|Magic Guard|Friend Guard
Azurill|Thick Fat|Huge Power|Sap Sipper
Smoochum|Oblivious|Forewarn|Hydration
Elekid|Static||Vital Spirit
Magby|Flame Body||Vital Spirit
Tyrogue|Guts|Steadfast|Vital Spirit
Hitmonchan|Keen Eye|Iron Fist|Inner Focus
Hitmontop|Intimidate|Technician|Steadfast
Munchlax|Pickup|Thick Fat|Gluttony
Vaporeon|Water Absorb||Hydration
Jolteon|Volt Absorb||Quick Feet
Flareon|Flash Fire||Guts
Espeon|Synchronize||Magic Bounce
Leafeon|Leaf Guard||Chlorophyll
Glaceon|Snow Cloak||Ice Body
Sylveon|Cute Charm||Pixilate
Porygon2|Trace|Download|Analytic
Porygon-Z|Adaptability|Download|Analytic
Magmortar|Flame Body||Vital Spirit
Electivire|Motor Drive||Vital Spirit
Bellossom|Chlorophyll||Healer
Tangrowth|Chlorophyll|Leaf Guard|Regenerator
Magnezone|Magnet Pull|Sturdy|Analytic
Mamoswine|Oblivious|Snow Cloak|Thick Fat
Weavile|Pressure||Pickpocket
Froslass|Snow Cloak||Cursed Body
Annihilape|Vital Spirit|Inner Focus|Defiant
Rhyperior|Lightning Rod|Solid Rock|Reckless
Honchkrow|Insomnia|Super Luck|Moxie
Gallade|Steadfast|Sharpness|Justified
Scizor|Swarm|Technician|Light Metal
Kleavor|Swarm|Sheer Force|Sharpness
Steelix|Rock Head|Sturdy|Sheer Force
Mismagius|Levitate||
Dusknoir|Pressure||Frisk
Politoed|Water Absorb|Damp|Drizzle
Snivy|Overgrow||Contrary
Servine|Overgrow||Contrary
Serperior|Overgrow||Contrary
Tepig|Blaze||Thick Fat
Pignite|Blaze||Thick Fat
Emboar|Blaze||Reckless
Oshawott|Torrent||Shell Armor
Dewott|Torrent||Shell Armor
Samurott|Torrent||Shell Armor
Patrat|Run Away|Keen Eye|Analytic
Watchog|Illuminate|Keen Eye|Analytic
Lillipup|Vital Spirit|Pickup|Run Away
Herdier|Intimidate|Sand Rush|Scrappy
Stoutland|Intimidate|Sand Rush|Scrappy
Purrloin|Limber|Unburden|Prankster
Liepard|Limber|Unburden|Prankster
Pansage|Gluttony||Overgrow
Simisage|Gluttony||Overgrow
Pansear|Gluttony||Blaze
Simisear|Gluttony||Blaze
Panpour|Gluttony||Torrent
Simipour|Gluttony||Torrent
Munna|Forewarn|Synchronize|Telepathy
Musharna|Forewarn|Synchronize|Telepathy
Pidove|Big Pecks|Super Luck|Rivalry
Tranquill|Big Pecks|Super Luck|Rivalry
Unfezant|Big Pecks|Super Luck|Rivalry
Blitzle|Lightning Rod|Motor Drive|Sap Sipper
Zebstrika|Lightning Rod|Motor Drive|Sap Sipper
Roggenrola|Sturdy|Weak Armor|Sand Force
Boldore|Sturdy|Weak Armor|Sand Force
Gigalith|Sturdy|Sand Stream|Sand Force
Woobat|Unaware|Klutz|Simple
Swoobat|Unaware|Klutz|Simple
Drilbur|Sand Rush|Sand Force|Mold Breaker
Excadrill|Sand Rush|Sand Force|Mold Breaker
Audino|Healer|Regenerator|Klutz
Timburr|Guts|Sheer Force|Iron Fist
Gurdurr|Guts|Sheer Force|Iron Fist
Conkeldurr|Guts|Sheer Force|Iron Fist
Tympole|Swift Swim|Hydration|Water Absorb
Palpitoad|Swift Swim|Hydration|Water Absorb
Seismitoad|Swift Swim|Poison Touch|Water Absorb
Throh|Guts|Inner Focus|Mold Breaker
Sawk|Sturdy|Inner Focus|Mold Breaker
Sewaddle|Swarm|Chlorophyll|Overcoat
Swadloon|Leaf Guard|Chlorophyll|Overcoat
Leavanny|Swarm|Chlorophyll|Overcoat
Venipede|Poison Point|Swarm|Speed Boost
Whirlipede|Poison Point|Swarm|Speed Boost
Scolipede|Poison Point|Swarm|Speed Boost
Cottonee|Prankster|Infiltrator|Chlorophyll
Whimsicott|Prankster|Infiltrator|Chlorophyll
Petilil|Chlorophyll|Own Tempo|Leaf Guard
Lilligant|Chlorophyll|Own Tempo|Leaf Guard
Basculin|Reckless|Adaptability|Mold Breaker
Basculegion|Swift Swim|Adaptability|Mold Breaker
Sandile|Intimidate|Moxie|Anger Point
Krokorok|Intimidate|Moxie|Anger Point
Krookodile|Intimidate|Moxie|Anger Point
Darumaka|Hustle||Inner Focus
Darmanitan|Sheer Force||Zen Mode
Maractus|Water Absorb|Chlorophyll|Storm Drain
Dwebble|Sturdy|Shell Armor|Weak Armor
Crustle|Sturdy|Shell Armor|Weak Armor
Scraggy|Shed Skin|Moxie|Intimidate
Scrafty|Shed Skin|Moxie|Intimidate
Sigilyph|Wonder Skin|Magic Guard|Tinted Lens
Yamask|Mummy||
Cofagrigus|Mummy||
Tirtouga|Solid Rock|Sturdy|Swift Swim
Carracosta|Solid Rock|Sturdy|Swift Swim
Archen|Defeatist||
Archeops|Defeatist||
Trubbish|Stench|Sticky Hold|Aftermath
Garbodor|Stench|Weak Armor|Aftermath
Zorua|Illusion||
Zoroark|Illusion||
Minccino|Cute Charm|Technician|Skill Link
Cinccino|Cute Charm|Technician|Skill Link
Gothita|Frisk|Competitive|Shadow Tag
Gothorita|Frisk|Competitive|Shadow Tag
Gothitelle|Frisk|Competitive|Shadow Tag
Solosis|Overcoat|Magic Guard|Regenerator
Duosion|Overcoat|Magic Guard|Regenerator
Reuniclus|Overcoat|Magic Guard|Regenerator
Ducklett|Keen Eye|Big Pecks|Hydration
Swanna|Keen Eye|Big Pecks|Hydration
Vanillite|Ice Body|Snow Cloak|Weak Armor
Vanillish|Ice Body|Snow Cloak|Weak Armor
Vanilluxe|Ice Body|Snow Warning|Weak Armor
Deerling|Chlorophyll|Sap Sipper|Serene Grace
Sawsbuck|Chlorophyll|Sap Sipper|Serene Grace
Emolga|Static||Motor Drive
Karrablast|Swarm|Shed Skin|No Guard
Escavalier|Swarm|Shell Armor|Overcoat
Foongus|Effect Spore||Regenerator
Amoonguss|Effect Spore||Regenerator
Frillish|Water Absorb|Cursed Body|Damp
Jellicent|Water Absorb|Cursed Body|Damp
Alomomola|Healer|Hydration|Regenerator
Joltik|Compound Eyes|Unnerve|Swarm
Galvantula|Compound Eyes|Unnerve|Swarm
Ferroseed|Iron Barbs||
Ferrothorn|Iron Barbs||Anticipation
Klink|Plus|Minus|Clear Body
Klang|Plus|Minus|Clear Body
Klinklang|Plus|Minus|Clear Body
Tynamo|Levitate||
Eelektrik|Levitate||
Eelektross|Levitate||
Elgyem|Telepathy|Synchronize|Analytic
Beheeyem|Telepathy|Synchronize|Analytic
Litwick|Flash Fire|Flame Body|Infiltrator
Lampent|Flash Fire|Flame Body|Infiltrator
Chandelure|Flash Fire|Flame Body|Infiltrator
Cubchoo|Snow Cloak|Slush Rush|Rattled
Beartic|Snow Cloak|Slush Rush|Swift Swim
Cryogonal|Levitate||
Shelmet|Hydration|Shell Armor|Overcoat
Accelgor|Hydration|Sticky Hold|Unburden
Stunfisk|Static|Limber|Sand Veil
Mienfoo|Inner Focus|Regenerator|Reckless
Mienshao|Inner Focus|Regenerator|Reckless
Druddigon|Rough Skin|Sheer Force|Mold Breaker
Golett|Iron Fist|Klutz|No Guard
Golurk|Iron Fist|Klutz|No Guard
Pawniard|Defiant|Inner Focus|Pressure
Bisharp|Defiant|Inner Focus|Pressure
Kingambit|Defiant|Supreme Overlord|Pressure
Bouffalant|Reckless|Sap Sipper|Soundproof
Rufflet|Keen Eye|Sheer Force|Hustle
Braviary|Keen Eye|Sheer Force|Defiant
Vullaby|Big Pecks|Overcoat|Weak Armor
Mandibuzz|Big Pecks|Overcoat|Weak Armor
Heatmor|Gluttony|Flash Fire|White Smoke
Durant|Swarm|Hustle|Truant
Deino|Hustle||
Zweilous|Hustle||
Hydreigon|Levitate||
Larvesta|Flame Body||Swarm
Volcarona|Flame Body||Swarm
Caterpie|Shield Dust||Run Away
Metapod|Shed Skin||
Butterfree|Compound Eyes||Tinted Lens
Weedle|Shield Dust||Run Away
Kakuna|Shed Skin||
Beedrill|Swarm||Sniper
Krabby|Hyper Cutter|Shell Armor|Sheer Force
Kingler|Hyper Cutter|Shell Armor|Sheer Force
Hoothoot|Insomnia|Keen Eye|Tinted Lens
Noctowl|Insomnia|Keen Eye|Tinted Lens
Phanpy|Pickup||Sand Veil
Donphan|Sturdy||Sand Veil
Treecko|Overgrow||Unburden
Grovyle|Overgrow||Unburden
Sceptile|Overgrow||Unburden
Torchic|Blaze||Speed Boost
Combusken|Blaze||Speed Boost
Blaziken|Blaze||Speed Boost
Mudkip|Torrent||Damp
Marshtomp|Torrent||Damp
Swampert|Torrent||Damp
Taillow|Guts||Scrappy
Swellow|Guts||Scrappy
Corphish|Hyper Cutter|Shell Armor|Adaptability
Crawdaunt|Hyper Cutter|Shell Armor|Adaptability
Torkoal|White Smoke|Drought|Shell Armor
Zubat|Inner Focus||Infiltrator
Golbat|Inner Focus||Infiltrator
Crobat|Inner Focus||Infiltrator
Pineco|Sturdy||Overcoat
Forretress|Sturdy||Overcoat
Lotad|Swift Swim|Rain Dish|Own Tempo
Lombre|Swift Swim|Rain Dish|Own Tempo
Ludicolo|Swift Swim|Rain Dish|Own Tempo
Bonsly|Sturdy|Rock Head|Rattled
Sudowoodo|Sturdy|Rock Head|Rattled
Croagunk|Anticipation|Dry Skin|Poison Touch
Toxicroak|Anticipation|Dry Skin|Poison Touch
Goldeen|Swift Swim|Water Veil|Lightning Rod
Seaking|Swift Swim|Water Veil|Lightning Rod
Togepi|Hustle|Serene Grace|Super Luck
Togetic|Hustle|Serene Grace|Super Luck
Togekiss|Hustle|Serene Grace|Super Luck
Corsola|Hustle|Natural Cure|Regenerator
Luvdisc|Swift Swim||Hydration
Hoppip|Chlorophyll|Leaf Guard|Infiltrator
Skiploom|Chlorophyll|Leaf Guard|Infiltrator
Jumpluff|Chlorophyll|Leaf Guard|Infiltrator
Spinarak|Swarm|Insomnia|Sniper
Ariados|Swarm|Insomnia|Sniper
Mime Jr.|Soundproof|Filter|Technician
Mr. Mime|Soundproof|Filter|Technician
Slugma|Magma Armor|Flame Body|Weak Armor
Magcargo|Magma Armor|Flame Body|Weak Armor
Nidoran♀|Poison Point|Rivalry|Hustle
Nidorina|Poison Point|Rivalry|Hustle
Nidoqueen|Poison Point|Rivalry|Sheer Force
Nidoran♂|Poison Point|Rivalry|Hustle
Nidorino|Poison Point|Rivalry|Hustle
Nidoking|Poison Point|Rivalry|Sheer Force
Meowth|Pickup|Technician|Unnerve
Persian|Limber|Technician|Unnerve
Doduo|Run Away|Early Bird|Tangled Feet
Dodrio|Run Away|Early Bird|Tangled Feet
Miltank|Thick Fat|Scrappy|Sap Sipper
Nosepass|Sturdy|Magnet Pull|Sand Force
Probopass|Sturdy|Magnet Pull|Sand Force
Makuhita|Thick Fat|Guts|Sheer Force
Hariyama|Thick Fat|Guts|Sheer Force
Meditite|Pure Power||Telepathy
Medicham|Pure Power||Telepathy
Electrike|Static|Lightning Rod|Minus
Manectric|Static|Lightning Rod|Minus
Numel|Oblivious|Simple|Own Tempo
Camerupt|Magma Armor|Solid Rock|Anger Point
Slakoth|Truant||
Vigoroth|Vital Spirit||
Slaking|Truant||
Spinda|Own Tempo|Tangled Feet|Contrary
Zigzagoon|Pickup|Gluttony|Quick Feet
Linoone|Pickup|Gluttony|Quick Feet
Wingull|Keen Eye|Hydration|Rain Dish
Pelipper|Keen Eye|Drizzle|Rain Dish
Tropius|Chlorophyll|Solar Power|Harvest
Lunatone|Levitate||
Solrock|Levitate||
Baltoy|Levitate||
Claydol|Levitate||
Natu|Synchronize|Early Bird|Magic Bounce
Xatu|Synchronize|Early Bird|Magic Bounce
Feebas|Swift Swim|Oblivious|Adaptability
Milotic|Marvel Scale|Competitive|Cute Charm
Wailmer|Water Veil|Oblivious|Pressure
Wailord|Water Veil|Oblivious|Pressure
Carvanha|Rough Skin||Speed Boost
Sharpedo|Rough Skin||Speed Boost
Barboach|Oblivious|Anticipation|Hydration
Whiscash|Oblivious|Anticipation|Hydration
Tentacool|Clear Body|Liquid Ooze|Rain Dish
Tentacruel|Clear Body|Liquid Ooze|Rain Dish
Spheal|Thick Fat|Ice Body|Oblivious
Sealeo|Thick Fat|Ice Body|Oblivious
Walrein|Thick Fat|Ice Body|Oblivious
Igglybuff|Cute Charm|Competitive|Friend Guard
Jigglypuff|Cute Charm|Competitive|Friend Guard
Wigglytuff|Cute Charm|Competitive|Frisk
Paras|Effect Spore|Dry Skin|Damp
Parasect|Effect Spore|Dry Skin|Damp
Slowpoke|Oblivious|Own Tempo|Regenerator
Slowbro|Oblivious|Own Tempo|Regenerator
Slowking|Oblivious|Own Tempo|Regenerator
Farfetch'd|Keen Eye|Inner Focus|Defiant
Shellder|Shell Armor|Skill Link|Overcoat
Cloyster|Shell Armor|Skill Link|Overcoat
Lickitung|Own Tempo|Oblivious|Cloud Nine
Lickilicky|Own Tempo|Oblivious|Cloud Nine
Happiny|Natural Cure|Serene Grace|Friend Guard
Chansey|Natural Cure|Serene Grace|Healer
Blissey|Natural Cure|Serene Grace|Healer
Ditto|Limber||Imposter
Kabuto|Swift Swim|Battle Armor|Weak Armor
Kabutops|Swift Swim|Battle Armor|Weak Armor
Sentret|Run Away|Keen Eye|Frisk
Furret|Run Away|Keen Eye|Frisk
Ledyba|Swarm|Early Bird|Rattled
Ledian|Swarm|Early Bird|Iron Fist
Chinchou|Volt Absorb|Illuminate|Water Absorb
Lanturn|Volt Absorb|Illuminate|Water Absorb
Aipom|Run Away|Pickup|Skill Link
Ambipom|Technician|Pickup|Skill Link
Sunkern|Chlorophyll|Solar Power|Early Bird
Sunflora|Chlorophyll|Solar Power|Early Bird
Yanma|Speed Boost|Compound Eyes|Frisk
Yanmega|Speed Boost|Tinted Lens|Frisk
Wooper|Damp|Water Absorb|Unaware
Quagsire|Damp|Water Absorb|Unaware
Unown|Levitate||
Wynaut|Shadow Tag||Telepathy
Wobbuffet|Shadow Tag||Telepathy
Girafarig|Inner Focus|Early Bird|Sap Sipper
Farigiraf|Cud Chew|Armor Tail|Sap Sipper
Dunsparce|Serene Grace|Run Away|Rattled
Dudunsparce|Serene Grace|Run Away|Rattled
Gligar|Hyper Cutter|Sand Veil|Immunity
Gliscor|Hyper Cutter|Sand Veil|Poison Heal
Qwilfish|Poison Point|Swift Swim|Intimidate
Shuckle|Sturdy|Gluttony|Contrary
Teddiursa|Pickup|Quick Feet|Honey Gather
Ursaring|Guts|Quick Feet|Unnerve
Ursaluna|Guts|Bulletproof|Unnerve
Remoraid|Hustle|Sniper|Moody
Octillery|Suction Cups|Sniper|Moody
Delibird|Vital Spirit|Hustle|Insomnia
Mantyke|Swift Swim|Water Absorb|Water Veil
Mantine|Swift Swim|Water Absorb|Water Veil
Stantler|Intimidate|Frisk|Sap Sipper
Wyrdeer|Intimidate|Frisk|Sap Sipper
Smeargle|Own Tempo|Technician|Moody
Poochyena|Run Away|Quick Feet|Rattled
Mightyena|Intimidate|Quick Feet|Moxie
Wurmple|Shield Dust||Run Away
Silcoon|Shed Skin||
Beautifly|Swarm||Rivalry
Cascoon|Shed Skin||
Dustox|Shield Dust||Compound Eyes
Seedot|Chlorophyll|Early Bird|Pickpocket
Nuzleaf|Chlorophyll|Early Bird|Pickpocket
Shiftry|Chlorophyll|Wind Rider|Pickpocket
Surskit|Swift Swim||Rain Dish
Masquerain|Intimidate||Unnerve
Shroomish|Effect Spore|Poison Heal|Quick Feet
Breloom|Effect Spore|Poison Heal|Technician
Nincada|Compound Eyes||Run Away
Ninjask|Speed Boost||Infiltrator
Shedinja|Wonder Guard||
Whismur|Soundproof||Rattled
Loudred|Soundproof||Scrappy
Exploud|Soundproof||Scrappy
Skitty|Cute Charm|Normalize|Wonder Skin
Delcatty|Cute Charm|Normalize|Wonder Skin
Sableye|Keen Eye|Stall|Prankster
Plusle|Plus||Lightning Rod
Minun|Minus||Volt Absorb
Volbeat|Illuminate|Swarm|Prankster
Illumise|Oblivious|Tinted Lens|Prankster
Budew|Natural Cure|Poison Point|Leaf Guard
Roselia|Natural Cure|Poison Point|Leaf Guard
Roserade|Natural Cure|Poison Point|Technician
Gulpin|Liquid Ooze|Sticky Hold|Gluttony
Swalot|Liquid Ooze|Sticky Hold|Gluttony
Spoink|Thick Fat|Own Tempo|Gluttony
Grumpig|Thick Fat|Own Tempo|Gluttony
Cacnea|Sand Veil||Water Absorb
Cacturne|Sand Veil||Water Absorb
Zangoose|Immunity||Toxic Boost
Seviper|Shed Skin||Infiltrator
Lileep|Suction Cups||Storm Drain
Cradily|Suction Cups||Storm Drain
Anorith|Battle Armor||Swift Swim
Armaldo|Battle Armor||Swift Swim
Castform|Forecast||
Kecleon|Color Change||Protean
Chingling|Levitate||
Chimecho|Levitate||
Clamperl|Shell Armor||Rattled
Huntail|Swift Swim||Water Veil
Gorebyss|Swift Swim||Hydration
Relicanth|Swift Swim|Rock Head|Sturdy
Turtwig|Overgrow||Shell Armor
Grotle|Overgrow||Shell Armor
Torterra|Overgrow||Shell Armor
Chimchar|Blaze||Iron Fist
Monferno|Blaze||Iron Fist
Infernape|Blaze||Iron Fist
Piplup|Torrent||Competitive
Prinplup|Torrent||Competitive
Empoleon|Torrent||Competitive
Starly|Keen Eye||Reckless
Staravia|Intimidate||Reckless
Staraptor|Intimidate||Reckless
Bidoof|Simple|Unaware|Moody
Bibarel|Simple|Unaware|Moody
Kricketot|Shed Skin||Run Away
Kricketune|Swarm||Technician
Shinx|Rivalry|Intimidate|Guts
Luxio|Rivalry|Intimidate|Guts
Luxray|Rivalry|Intimidate|Guts
Cranidos|Mold Breaker||Sheer Force
Rampardos|Mold Breaker||Sheer Force
Shieldon|Sturdy||Soundproof
Bastiodon|Sturdy||Soundproof
Burmy|Shed Skin||Overcoat
Wormadam|Anticipation||Overcoat
Mothim|Swarm||Tinted Lens
Combee|Honey Gather||Hustle
Vespiquen|Pressure||Unnerve
Pachirisu|Run Away|Pickup|Volt Absorb
Buizel|Swift Swim||Water Veil
Floatzel|Swift Swim||Water Veil
Cherubi|Chlorophyll||
Cherrim|Flower Gift||
Shellos|Sticky Hold|Storm Drain|Sand Force
Gastrodon|Sticky Hold|Storm Drain|Sand Force
Drifloon|Aftermath|Unburden|Flare Boost
Drifblim|Aftermath|Unburden|Flare Boost
Buneary|Run Away|Klutz|Limber
Lopunny|Cute Charm|Klutz|Limber
Glameow|Limber|Own Tempo|Keen Eye
Purugly|Thick Fat|Own Tempo|Defiant
Stunky|Stench|Aftermath|Keen Eye
Skuntank|Stench|Aftermath|Keen Eye
Chatot|Keen Eye|Tangled Feet|Big Pecks
Spiritomb|Pressure||Infiltrator
Hippopotas|Sand Stream||Sand Force
Hippowdon|Sand Stream||Sand Force
Skorupi|Battle Armor|Sniper|Keen Eye
Drapion|Battle Armor|Sniper|Keen Eye
Carnivine|Levitate||
Finneon|Swift Swim|Storm Drain|Water Veil
Lumineon|Swift Swim|Storm Drain|Water Veil
Snover|Snow Warning||Soundproof
Abomasnow|Snow Warning||Soundproof
Rotom|Levitate||
Goomy|Sap Sipper|Hydration|Gooey
Sliggoo|Sap Sipper|Hydration|Gooey
Goodra|Sap Sipper|Hydration|Gooey
Noibat|Frisk|Infiltrator|Telepathy
Noivern|Frisk|Infiltrator|Telepathy
Tyrunt|Strong Jaw||Sturdy
Tyrantrum|Strong Jaw||Rock Head
Skrelp|Poison Point|Poison Touch|Adaptability
Dragalge|Poison Point|Poison Touch|Adaptability
Jangmo-o|Bulletproof|Soundproof|Overcoat
Hakamo-o|Bulletproof|Soundproof|Overcoat
Kommo-o|Bulletproof|Soundproof|Overcoat
Turtonator|Shell Armor||
Drampa|Berserk|Sap Sipper|Cloud Nine
Applin|Ripen|Gluttony|Bulletproof
Flapple|Ripen|Gluttony|Hustle
Appletun|Ripen|Gluttony|Thick Fat
Dipplin|Supersweet Syrup|Gluttony|Sticky Hold
Hydrapple|Supersweet Syrup|Regenerator|Sticky Hold
Dracozolt|Volt Absorb|Hustle|Sand Rush
Arctozolt|Volt Absorb|Static|Slush Rush
Dracovish|Water Absorb|Strong Jaw|Sand Rush
Arctovish|Water Absorb|Ice Body|Slush Rush
Duraludon|Light Metal|Heavy Metal|Stalwart
Archaludon|Stamina|Sturdy|Stalwart
Dreepy|Clear Body|Infiltrator|Cursed Body
Drakloak|Clear Body|Infiltrator|Cursed Body
Dragapult|Clear Body|Infiltrator|Cursed Body
Cyclizar|Shed Skin||Regenerator
Tatsugiri|Commander||Storm Drain
Frigibax|Thermal Exchange||Ice Body
Arctibax|Thermal Exchange||Ice Body
Baxcalibur|Thermal Exchange||Ice Body
Chespin|Overgrow||Bulletproof
Quilladin|Overgrow||Bulletproof
Chesnaught|Overgrow||Bulletproof
Fennekin|Blaze||Magician
Braixen|Blaze||Magician
Delphox|Blaze||Magician
Froakie|Torrent||Protean
Frogadier|Torrent||Protean
Greninja|Torrent||Protean
Bunnelby|Pickup|Cheek Pouch|Huge Power
Diggersby|Pickup|Cheek Pouch|Huge Power
Fletchling|Big Pecks||Gale Wings
Fletchinder|Flame Body||Gale Wings
Talonflame|Flame Body||Gale Wings
Scatterbug|Shield Dust|Compound Eyes|Friend Guard
Spewpa|Shed Skin||Friend Guard
Vivillon|Shield Dust|Compound Eyes|Friend Guard
Litleo|Rivalry|Unnerve|Moxie
Pyroar|Rivalry|Unnerve|Moxie
Flabébé|Flower Veil||Symbiosis
Floette|Flower Veil||Symbiosis
Florges|Flower Veil||Symbiosis
Skiddo|Sap Sipper||Grass Pelt
Gogoat|Sap Sipper||Grass Pelt
Pancham|Iron Fist|Mold Breaker|Scrappy
Pangoro|Iron Fist|Mold Breaker|Scrappy
Furfrou|Fur Coat||
Espurr|Keen Eye|Infiltrator|Own Tempo
Meowstic|Keen Eye|Infiltrator|Prankster
Honedge|No Guard||
Doublade|No Guard||
Aegislash|Stance Change||
Spritzee|Healer||Aroma Veil
Aromatisse|Healer||Aroma Veil
Swirlix|Sweet Veil||Unburden
Slurpuff|Sweet Veil||Unburden
Inkay|Contrary|Suction Cups|Infiltrator
Malamar|Contrary|Suction Cups|Infiltrator
Binacle|Tough Claws|Sniper|Pickpocket
Barbaracle|Tough Claws|Sniper|Pickpocket
Clauncher|Mega Launcher||
Clawitzer|Mega Launcher||
Helioptile|Dry Skin|Sand Veil|Solar Power
Heliolisk|Dry Skin|Sand Veil|Solar Power
Amaura|Refrigerate||Snow Warning
Aurorus|Refrigerate||Snow Warning
Hawlucha|Limber|Unburden|Mold Breaker
Dedenne|Cheek Pouch|Pickup|Plus
Carbink|Clear Body||Sturdy
Klefki|Prankster||Magician
Phantump|Natural Cure|Frisk|Harvest
Trevenant|Natural Cure|Frisk|Harvest
Pumpkaboo|Pickup|Frisk|Insomnia
Gourgeist|Pickup|Frisk|Insomnia
Bergmite|Own Tempo|Ice Body|Sturdy
Avalugg|Own Tempo|Ice Body|Sturdy
Rowlet|Overgrow||Long Reach
Dartrix|Overgrow||Long Reach
Decidueye|Overgrow||Long Reach
Litten|Blaze||Intimidate
Torracat|Blaze||Intimidate
Incineroar|Blaze||Intimidate
Popplio|Torrent||Liquid Voice
Brionne|Torrent||Liquid Voice
Primarina|Torrent||Liquid Voice
Pikipek|Keen Eye|Skill Link|Pickup
Trumbeak|Keen Eye|Skill Link|Pickup
Toucannon|Keen Eye|Skill Link|Sheer Force
Yungoos|Stakeout|Strong Jaw|Adaptability
Gumshoos|Stakeout|Strong Jaw|Adaptability
Grubbin|Swarm||
Charjabug|Battery||
Vikavolt|Levitate||
Crabrawler|Hyper Cutter|Iron Fist|Anger Point
Crabominable|Hyper Cutter|Iron Fist|Anger Point
Oricorio|Dancer||
Cutiefly|Honey Gather|Shield Dust|Sweet Veil
Ribombee|Honey Gather|Shield Dust|Sweet Veil
Rockruff|Keen Eye|Vital Spirit|Steadfast
Lycanroc|Keen Eye|Sand Rush|Steadfast
Wishiwashi|Schooling||
Mareanie|Merciless|Limber|Regenerator
Toxapex|Merciless|Limber|Regenerator
Mudbray|Own Tempo|Stamina|Inner Focus
Mudsdale|Own Tempo|Stamina|Inner Focus
Dewpider|Water Bubble||Water Absorb
Araquanid|Water Bubble||Water Absorb
Fomantis|Leaf Guard||Contrary
Lurantis|Leaf Guard||Contrary
Morelull|Illuminate|Effect Spore|Rain Dish
Shiinotic|Illuminate|Effect Spore|Rain Dish
Salandit|Corrosion||Oblivious
Salazzle|Corrosion||Oblivious
Stufful|Fluffy|Klutz|Cute Charm
Bewear|Fluffy|Klutz|Unnerve
Bounsweet|Leaf Guard|Oblivious|Sweet Veil
Steenee|Leaf Guard|Oblivious|Sweet Veil
Tsareena|Leaf Guard|Queenly Majesty|Sweet Veil
Comfey|Flower Veil|Triage|Natural Cure
Oranguru|Inner Focus|Telepathy|Symbiosis
Passimian|Receiver||Defiant
Wimpod|Wimp Out||
Golisopod|Emergency Exit||
Sandygast|Water Compaction||Sand Veil
Palossand|Water Compaction||Sand Veil
Pyukumuku|Innards Out||Unaware
Minior|Shields Down||
Komala|Comatose||
Togedemaru|Iron Barbs|Lightning Rod|Sturdy
Mimikyu|Disguise||
Bruxish|Dazzling|Strong Jaw|Wonder Skin
Dhelmise|Steelworker||
Grookey|Overgrow||Grassy Surge
Thwackey|Overgrow||Grassy Surge
Rillaboom|Overgrow||Grassy Surge
Scorbunny|Blaze||Libero
Raboot|Blaze||Libero
Cinderace|Blaze||Libero
Sobble|Torrent||Sniper
Drizzile|Torrent||Sniper
Inteleon|Torrent||Sniper
Skwovet|Cheek Pouch||Gluttony
Greedent|Cheek Pouch||Gluttony
Rookidee|Keen Eye|Unnerve|Big Pecks
Corvisquire|Keen Eye|Unnerve|Big Pecks
Corviknight|Pressure|Unnerve|Mirror Armor
Blipbug|Swarm|Compound Eyes|Telepathy
Dottler|Swarm|Compound Eyes|Telepathy
Orbeetle|Swarm|Frisk|Telepathy
Nickit|Run Away|Unburden|Stakeout
Thievul|Run Away|Unburden|Stakeout
Gossifleur|Cotton Down|Regenerator|Effect Spore
Eldegoss|Cotton Down|Regenerator|Effect Spore
Wooloo|Fluffy|Run Away|Bulletproof
Dubwool|Fluffy|Steadfast|Bulletproof
Chewtle|Strong Jaw|Shell Armor|Swift Swim
Drednaw|Strong Jaw|Shell Armor|Swift Swim
Yamper|Ball Fetch||Rattled
Boltund|Strong Jaw||Competitive
Rolycoly|Steam Engine|Heatproof|Flash Fire
Carkol|Steam Engine|Flame Body|Flash Fire
Coalossal|Steam Engine|Flame Body|Flash Fire
Silicobra|Sand Spit|Shed Skin|Sand Veil
Sandaconda|Sand Spit|Shed Skin|Sand Veil
Cramorant|Gulp Missile||
Arrokuda|Swift Swim||Propeller Tail
Barraskewda|Swift Swim||Propeller Tail
Toxel|Rattled|Static|Klutz
Toxtricity|Punk Rock|Plus|Technician
Sizzlipede|Flash Fire|White Smoke|Flame Body
Centiskorch|Flash Fire|White Smoke|Flame Body
Clobbopus|Limber||Technician
Grapploct|Limber||Technician
Sinistea|Weak Armor||Cursed Body
Polteageist|Weak Armor||Cursed Body
Hatenna|Healer|Anticipation|Magic Bounce
Hattrem|Healer|Anticipation|Magic Bounce
Hatterene|Healer|Anticipation|Magic Bounce
Impidimp|Prankster|Frisk|Pickpocket
Morgrem|Prankster|Frisk|Pickpocket
Grimmsnarl|Prankster|Frisk|Pickpocket
Obstagoon|Reckless|Guts|Defiant
Perrserker|Battle Armor|Tough Claws|Steely Spirit
Cursola|Weak Armor||Perish Body
Sirfetch'd|Steadfast||Scrappy
Mr. Rime|Tangled Feet|Screen Cleaner|Ice Body
Runerigus|Wandering Spirit||
Milcery|Sweet Veil||Aroma Veil
Alcremie|Sweet Veil||Aroma Veil
Falinks|Battle Armor||Defiant
Pincurchin|Lightning Rod||Electric Surge
Snom|Shield Dust||Ice Scales
Frosmoth|Shield Dust||Ice Scales
Stonjourner|Power Spot||
Eiscue|Ice Face||
Indeedee|Inner Focus|Synchronize|Psychic Surge
Morpeko|Hunger Switch||
Cufant|Sheer Force||Heavy Metal
Copperajah|Sheer Force||Heavy Metal
Sneasler|Pressure|Unburden|Poison Touch
Overqwil|Poison Point|Swift Swim|Intimidate
Sprigatito|Overgrow||Protean
Floragato|Overgrow||Protean
Meowscarada|Overgrow||Protean
Fuecoco|Blaze||Unaware
Crocalor|Blaze||Unaware
Skeledirge|Blaze||Unaware
Quaxly|Torrent||Moxie
Quaxwell|Torrent||Moxie
Quaquaval|Torrent||Moxie
Lechonk|Aroma Veil|Gluttony|Thick Fat
Oinkologne|Lingering Aroma|Gluttony|Thick Fat
Tarountula|Insomnia||Stakeout
Spidops|Insomnia||Stakeout
Nymble|Swarm||Tinted Lens
Lokix|Swarm||Tinted Lens
Pawmi|Static|Natural Cure|Iron Fist
Pawmo|Volt Absorb|Natural Cure|Iron Fist
Pawmot|Volt Absorb|Natural Cure|Iron Fist
Tandemaus|Run Away|Pickup|Own Tempo
Maushold|Friend Guard|Cheek Pouch|Technician
Fidough|Own Tempo||Klutz
Dachsbun|Well-Baked Body||Aroma Veil
Smoliv|Early Bird||Harvest
Dolliv|Early Bird||Harvest
Arboliva|Seed Sower||Harvest
Squawkabilly|Intimidate|Hustle|Guts
Nacli|Purifying Salt|Sturdy|Clear Body
Naclstack|Purifying Salt|Sturdy|Clear Body
Garganacl|Purifying Salt|Sturdy|Clear Body
Charcadet|Flash Fire||Flame Body
Armarouge|Flash Fire||Weak Armor
Ceruledge|Flash Fire||Weak Armor
Tadbulb|Own Tempo|Static|Damp
Bellibolt|Electromorphosis|Static|Damp
Wattrel|Wind Power|Volt Absorb|Competitive
Kilowattrel|Wind Power|Volt Absorb|Competitive
Maschiff|Intimidate|Run Away|Stakeout
Mabosstiff|Intimidate|Guard Dog|Stakeout
Shroodle|Unburden|Pickpocket|Prankster
Grafaiai|Unburden|Poison Touch|Prankster
Bramblin|Wind Rider||Infiltrator
Brambleghast|Wind Rider||Infiltrator
Toedscool|Mycelium Might||
Toedscruel|Mycelium Might||
Klawf|Anger Shell|Shell Armor|Regenerator
Capsakid|Chlorophyll|Insomnia|Klutz
Scovillain|Chlorophyll|Insomnia|Moody
Rellor|Compound Eyes||Shed Skin
Rabsca|Synchronize||Telepathy
Flittle|Anticipation|Frisk|Speed Boost
Espathra|Opportunist|Frisk|Speed Boost
Tinkatink|Mold Breaker|Own Tempo|Pickpocket
Tinkatuff|Mold Breaker|Own Tempo|Pickpocket
Tinkaton|Mold Breaker|Own Tempo|Pickpocket
Wiglett|Gooey|Rattled|Sand Veil
Wugtrio|Gooey|Rattled|Sand Veil
Bombirdier|Big Pecks|Keen Eye|Rocky Payload
Finizen|Water Veil||
Palafin|Zero to Hero||
Varoom|Overcoat||Slow Start
Revavroom|Overcoat||Filter
Orthworm|Earth Eater||Sand Veil
Glimmet|Toxic Debris||Corrosion
Glimmora|Toxic Debris||Corrosion
Greavard|Pickup||Fluffy
Houndstone|Sand Rush||Fluffy
Flamigo|Scrappy|Tangled Feet|Costar
Cetoddle|Thick Fat|Snow Cloak|Sheer Force
Cetitan|Thick Fat|Slush Rush|Sheer Force
Veluza|Mold Breaker||Sharpness
Dondozo|Unaware|Oblivious|Water Veil
Clodsire|Poison Point|Water Absorb|Unaware
Gimmighoul|Rattled||
Gholdengo|Good as Gold||
Poltchageist|Hospitality||Heatproof
Sinistcha|Hospitality||Heatproof
Galarian Meowth|Pickup|Tough Claws|Unnerve
Galarian Zigzagoon|Pickup|Gluttony|Quick Feet
Galarian Linoone|Pickup|Gluttony|Quick Feet
Galarian Farfetch'd|Steadfast||Scrappy
Galarian Mr. Mime|Vital Spirit|Screen Cleaner|Ice Body
Galarian Yamask|Wandering Spirit||
Galarian Corsola|Weak Armor||Cursed Body
Hisuian Sneasel|Inner Focus|Keen Eye|Pickpocket
Hisuian Qwilfish|Poison Point|Swift Swim|Intimidate
Paldean Wooper|Poison Point|Water Absorb|Unaware
White-Striped Basculin|Rattled|Adaptability|Mold Breaker
Alolan Rattata|Gluttony|Hustle|Thick Fat
Alolan Raticate|Gluttony|Hustle|Thick Fat
Alolan Raichu|Surge Surfer||
Alolan Sandshrew|Snow Cloak||Slush Rush
Alolan Sandslash|Snow Cloak||Slush Rush
Alolan Vulpix|Snow Cloak||Snow Warning
Alolan Ninetales|Snow Cloak||Snow Warning
Alolan Diglett|Sand Veil|Tangling Hair|Sand Force
Alolan Dugtrio|Sand Veil|Tangling Hair|Sand Force
Alolan Meowth|Pickup|Technician|Rattled
Alolan Persian|Fur Coat|Technician|Rattled
Alolan Geodude|Magnet Pull|Sturdy|Galvanize
Alolan Graveler|Magnet Pull|Sturdy|Galvanize
Alolan Golem|Magnet Pull|Sturdy|Galvanize
Alolan Grimer|Poison Touch|Gluttony|Power of Alchemy
Alolan Muk|Poison Touch|Gluttony|Power of Alchemy
Alolan Exeggutor|Frisk||Harvest
Alolan Marowak|Cursed Body|Lightning Rod|Rock Head
Galarian Ponyta|Run Away|Pastel Veil|Anticipation
Galarian Rapidash|Run Away|Pastel Veil|Anticipation
Galarian Slowpoke|Gluttony|Own Tempo|Regenerator
Galarian Slowbro|Quick Draw|Own Tempo|Regenerator
Galarian Slowking|Curious Medicine|Own Tempo|Regenerator
Galarian Weezing|Levitate|Neutralizing Gas|Misty Surge
Galarian Darumaka|Hustle||Inner Focus
Galarian Darmanitan|Gorilla Tactics||Zen Mode
Galarian Stunfisk|Mimicry||
Hisuian Growlithe|Intimidate|Flash Fire|Rock Head
Hisuian Arcanine|Intimidate|Flash Fire|Rock Head
Hisuian Voltorb|Soundproof|Static|Aftermath
Hisuian Electrode|Soundproof|Static|Aftermath
Hisuian Typhlosion|Blaze||Frisk
Hisuian Samurott|Torrent||Sharpness
Hisuian Decidueye|Overgrow||Scrappy
Hisuian Lilligant|Chlorophyll|Hustle|Leaf Guard
Hisuian Zorua|Illusion||
Hisuian Zoroark|Illusion||
Hisuian Braviary|Keen Eye|Sheer Force|Tinted Lens
Hisuian Sliggoo|Sap Sipper|Shell Armor|Gooey
Hisuian Goodra|Sap Sipper|Shell Armor|Gooey
Hisuian Avalugg|Strong Jaw|Ice Body|Sturdy
Paldean Tauros (Combat)|Intimidate|Anger Point|Cud Chew
Paldean Tauros (Blaze)|Intimidate|Anger Point|Cud Chew
Paldean Tauros (Aqua)|Intimidate|Anger Point|Cud Chew
Great Tusk|Protosynthesis||
Scream Tail|Protosynthesis||
Brute Bonnet|Protosynthesis||
Flutter Mane|Protosynthesis||
Slither Wing|Protosynthesis||
Sandy Shocks|Protosynthesis||
Roaring Moon|Protosynthesis||
Walking Wake|Protosynthesis||
Gouging Fire|Protosynthesis||
Raging Bolt|Protosynthesis||
Iron Treads|Quark Drive||
Iron Bundle|Quark Drive||
Iron Hands|Quark Drive||
Iron Jugulis|Quark Drive||
Iron Moth|Quark Drive||
Iron Thorns|Quark Drive||
Iron Valiant|Quark Drive||
Iron Leaves|Quark Drive||
Iron Boulder|Quark Drive||
Iron Crown|Quark Drive||
Articuno|Pressure||Snow Cloak
Zapdos|Pressure||Static
Moltres|Pressure||Flame Body
Mewtwo|Pressure||Unnerve
Mew|Synchronize||
Raikou|Pressure||Inner Focus
Entei|Pressure||Inner Focus
Suicune|Pressure||Inner Focus
Lugia|Pressure||Multiscale
Ho-Oh|Pressure||Regenerator
Celebi|Natural Cure||
Regirock|Clear Body||Sturdy
Regice|Clear Body||Ice Body
Registeel|Clear Body||Light Metal
Latias|Levitate||
Latios|Levitate||
Kyogre|Drizzle||
Groudon|Drought||
Rayquaza|Air Lock||
Jirachi|Serene Grace||
Deoxys|Pressure||
Uxie|Levitate||
Mesprit|Levitate||
Azelf|Levitate||
Dialga|Pressure||Telepathy
Palkia|Pressure||Telepathy
Heatran|Flash Fire||Flame Body
Giratina|Pressure||Telepathy
Cresselia|Levitate||
Darkrai|Bad Dreams||
Shaymin|Natural Cure||
Manaphy|Hydration||
Victini|Victory Star||
Cobalion|Justified||
Terrakion|Justified||
Virizion|Justified||
Tornadus|Prankster||Defiant
Thundurus|Prankster||Defiant
Reshiram|Turboblaze||
Zekrom|Teravolt||
Landorus|Sand Force||Sheer Force
Kyurem|Pressure||
Keldeo|Justified||
Meloetta|Serene Grace||
Genesect|Download||
Regigigas|Slow Start||
Arceus|Multitype||
Zygarde|Aura Break||
Naganadel|Beast Boost||
Eternatus|Pressure||
Regidrago|Dragon's Maw||
Koraidon|Orichalcum Pulse||
Miraidon|Hadron Engine||
Xerneas|Fairy Aura||
Yveltal|Dark Aura||
Diancie|Clear Body||
Hoopa|Magician||
Volcanion|Water Absorb||
Silvally|RKS System||
Tapu Koko|Electric Surge||Telepathy
Tapu Lele|Psychic Surge||Telepathy
Tapu Bulu|Grassy Surge||Telepathy
Tapu Fini|Misty Surge||Telepathy
Solgaleo|Full Metal Body||
Lunala|Shadow Shield||
Nihilego|Beast Boost||
Buzzwole|Beast Boost||
Pheromosa|Beast Boost||
Xurkitree|Beast Boost||
Celesteela|Beast Boost||
Kartana|Beast Boost||
Guzzlord|Beast Boost||
Necrozma|Prism Armor||
Magearna|Soul-Heart||
Marshadow|Technician||
Stakataka|Beast Boost||
Blacephalon|Beast Boost||
Zeraora|Volt Absorb||
Melmetal|Iron Fist||
Urshifu (Single Strike)|Unseen Fist||
Urshifu (Rapid Strike)|Unseen Fist||
Zacian|Intrepid Sword||
Zamazenta|Dauntless Shield||
Zarude|Leaf Guard||
Regieleki|Transistor||
Glastrier|Chilling Neigh||
Spectrier|Grim Neigh||
Enamorus|Cute Charm||Contrary
Wo-Chien|Tablets of Ruin||
Chien-Pao|Sword of Ruin||
Ting-Lu|Vessel of Ruin||
Chi-Yu|Beads of Ruin||
Okidogi|Toxic Chain||Guard Dog
Munkidori|Toxic Chain||Frisk
Fezandipiti|Toxic Chain||Technician
Ogerpon|Defiant||
Terapagos|Tera Shell||
Pecharunt|Poison Puppeteer||
Galarian Articuno|Competitive||
Galarian Zapdos|Defiant||
Galarian Moltres|Berserk||
Cosmog|Unaware||
Cosmoem|Sturdy||
Poipole|Beast Boost||
Meltan|Magnet Pull||
Kubfu|Inner Focus||
Type: Null|Battle Armor||
Zygarde 10%|Aura Break||
Phione|Hydration||
Bloodmoon Ursaluna|Mind's Eye||
Eternal Flower Floette|Flower Veil||Symbiosis
Calyrex|Unnerve||`;
