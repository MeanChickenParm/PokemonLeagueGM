// ================= DRAFT =================
// ================= FAMOUS TRAINERS =================
// Rarely, a draft prospect or a founding Elite Four member is a trainer from the games or anime.
const FAMOUS = [
  { name: 'Ash', cls: 'Pokémon Trainer', spec: null, age: 10, g: 'm', team: ['Pikachu', ['Charmander', 'Bulbasaur', 'Squirtle', 'Caterpie', 'Pidgey', 'Krabby']] },
  // Kanto
  { name: 'Brock', cls: 'Kanto Leader', spec: 'Rock', age: 15, g: 'm', team: ['Onix', ['Geodude', 'Zubat', 'Vulpix']] },
  { name: 'Misty', cls: 'Kanto Leader', spec: 'Water', age: 12, g: 'f', team: ['Staryu', ['Psyduck', 'Goldeen', 'Togepi', 'Horsea']] },
  { name: 'Lt. Surge', cls: 'Kanto Leader', spec: 'Electric', age: 32, g: 'm', team: ['Pikachu', 'Voltorb'] },
  { name: 'Erika', cls: 'Kanto Leader', spec: 'Grass', age: 18, g: 'f', team: ['Oddish', ['Tangela', 'Bellsprout', 'Hoppip']] },
  { name: 'Koga', cls: 'Kanto Leader', spec: 'Poison', age: 40, g: 'm', team: ['Koffing', ['Grimer', 'Venonat', 'Zubat']] },
  { name: 'Sabrina', cls: 'Kanto Leader', spec: 'Psychic', age: 21, g: 'f', team: ['Abra', ['Mime Jr.', 'Venonat']] },
  { name: 'Blaine', cls: 'Kanto Leader', spec: 'Fire', age: 55, g: 'm', team: ['Growlithe', ['Ponyta', 'Magby']] },
  { name: 'Giovanni', cls: 'Kanto Leader', spec: 'Ground', age: 45, g: 'm', team: ['Rhyhorn', ['Nidoran♂', 'Nidoran♀', 'Meowth', 'Diglett']] },
  // Johto
  { name: 'Falkner', cls: 'Johto Leader', spec: 'Flying', age: 18, g: 'm', team: ['Pidgey', ['Hoothoot', 'Doduo']] },
  { name: 'Bugsy', cls: 'Johto Leader', spec: 'Bug', age: 14, g: 'm', team: ['Scyther', ['Caterpie', 'Weedle']] },
  { name: 'Whitney', cls: 'Johto Leader', spec: 'Normal', age: 15, g: 'f', team: ['Miltank', 'Clefairy'] },
  { name: 'Morty', cls: 'Johto Leader', spec: 'Ghost', age: 20, g: 'm', team: ['Gastly', 'Misdreavus'] },
  { name: 'Chuck', cls: 'Johto Leader', spec: 'Fighting', age: 38, g: 'm', team: ['Mankey', 'Poliwag'] },
  { name: 'Jasmine', cls: 'Johto Leader', spec: 'Steel', age: 16, g: 'f', team: ['Magnemite', 'Onix'] },
  { name: 'Pryce', cls: 'Johto Leader', spec: 'Ice', age: 70, g: 'm', team: ['Swinub', 'Seel'] },
  { name: 'Clair', cls: 'Johto Leader', spec: 'Dragon', age: 20, g: 'f', team: ['Dratini', 'Horsea'] },
  { name: 'Janine', cls: 'Johto Leader', spec: 'Poison', age: 16, g: 'f', team: ['Spinarak', ['Zubat', 'Venonat']] },
  // Hoenn
  { name: 'Roxanne', cls: 'Hoenn Leader', spec: 'Rock', age: 15, g: 'f', team: ['Nosepass', 'Geodude'] },
  { name: 'Brawly', cls: 'Hoenn Leader', spec: 'Fighting', age: 20, g: 'm', team: ['Makuhita', 'Meditite'] },
  { name: 'Wattson', cls: 'Hoenn Leader', spec: 'Electric', age: 60, g: 'm', team: ['Electrike', 'Magnemite'] },
  { name: 'Flannery', cls: 'Hoenn Leader', spec: 'Fire', age: 17, g: 'f', team: ['Torkoal', ['Slugma', 'Numel']] },
  { name: 'Norman', cls: 'Hoenn Leader', spec: 'Normal', age: 38, g: 'm', team: ['Slakoth', ['Zigzagoon', 'Spinda']] },
  { name: 'Winona', cls: 'Hoenn Leader', spec: 'Flying', age: 25, g: 'f', team: ['Swablu', ['Taillow', 'Wingull']] },
  { name: 'Tate & Liza', cls: 'Hoenn Leaders', spec: 'Psychic', age: 12, g: 'm', team: ['Solrock', 'Lunatone'] },
  { name: 'Wallace', cls: 'Hoenn Leader', spec: 'Water', age: 26, g: 'm', team: ['Feebas', ['Wailmer', 'Carvanha', 'Lotad']] },
  { name: 'Juan', cls: 'Hoenn Leader', spec: 'Water', age: 50, g: 'm', team: ['Luvdisc', ['Spheal', 'Corphish', 'Barboach']] },
  // Kanto and Johto Elite Four, Champions and rivals
  { name: 'Lorelei', cls: 'Elite Four', spec: 'Ice', age: 30, g: 'f', team: ['Lapras', ['Dewgong', 'Cloyster', 'Jynx']] },
  { name: 'Bruno', cls: 'Elite Four', spec: 'Fighting', age: 34, g: 'm', team: ['Machop', ['Onix', 'Hitmonlee', 'Hitmonchan']] },
  { name: 'Agatha', cls: 'Elite Four', spec: 'Ghost', age: 66, g: 'f', team: ['Gastly', ['Golbat', 'Arbok', 'Misdreavus']] },
  { name: 'Lance', cls: 'Dragon Master', spec: 'Dragon', age: 27, g: 'm', team: ['Dratini', ['Gyarados', 'Aerodactyl', 'Charizard']] },
  { name: 'Will', cls: 'Elite Four', spec: 'Psychic', age: 25, g: 'm', team: ['Natu', ['Exeggcute', 'Slowpoke', 'Jynx']] },
  { name: 'Karen', cls: 'Elite Four', spec: 'Dark', age: 26, g: 'f', team: ['Umbreon', ['Murkrow', 'Houndour', 'Sneasel']] },
  { name: 'Blue', cls: 'Rival', spec: null, age: 11, g: 'm', team: ['Eevee', ['Pidgey', 'Abra', 'Rattata']] },
  { name: 'Gary', cls: 'Pokémon Researcher', spec: null, age: 10, g: 'm', team: ['Squirtle', ['Eevee', 'Nidoran♂', 'Krabby']] },
  { name: 'Red', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'm', team: ['Pikachu', ['Charmander', 'Bulbasaur', 'Squirtle', 'Snorlax']] },
  { name: 'Silver', cls: 'Rival', spec: 'Dark', age: 11, g: 'm', team: ['Totodile', ['Sneasel', 'Gastly', 'Zubat']] },
  // Hoenn Elite Four and Champions, rivals
  { name: 'Sidney', cls: 'Elite Four', spec: 'Dark', age: 26, g: 'm', team: ['Poochyena', ['Absol', 'Sableye', 'Cacnea']] },
  { name: 'Phoebe', cls: 'Elite Four', spec: 'Ghost', age: 19, g: 'f', team: ['Duskull', ['Shuppet', 'Sableye']] },
  { name: 'Glacia', cls: 'Elite Four', spec: 'Ice', age: 32, g: 'f', team: ['Snorunt', ['Spheal', 'Glalie']] },
  { name: 'Drake', cls: 'Elite Four', spec: 'Dragon', age: 52, g: 'm', team: ['Bagon', ['Swablu', 'Trapinch', 'Horsea']] },
  { name: 'Steven', cls: 'Champion', spec: 'Steel', age: 25, g: 'm', team: ['Beldum', ['Skarmory', 'Aron', 'Cradily']] },
  { name: 'May', cls: 'Coordinator', spec: null, age: 10, g: 'f', team: ['Torchic', ['Skitty', 'Eevee', 'Wurmple']] },
  { name: 'Brendan', cls: 'Rival', spec: null, age: 11, g: 'm', team: ['Mudkip', ['Treecko', 'Wingull', 'Lotad']] },
  { name: 'Wally', cls: 'Rival', spec: 'Psychic', age: 10, g: 'm', team: ['Ralts', ['Roselia', 'Magnemite', 'Altaria']] },
  // Sinnoh
  { name: 'Roark', cls: 'Sinnoh Leader', spec: 'Rock', age: 19, g: 'm', team: ['Cranidos', ['Geodude', 'Onix']] },
  { name: 'Gardenia', cls: 'Sinnoh Leader', spec: 'Grass', age: 20, g: 'f', team: ['Turtwig', ['Cherubi', 'Budew']] },
  { name: 'Maylene', cls: 'Sinnoh Leader', spec: 'Fighting', age: 16, g: 'f', team: ['Riolu', ['Meditite', 'Machop']] },
  { name: 'Crasher Wake', cls: 'Sinnoh Leader', spec: 'Water', age: 40, g: 'm', team: ['Buizel', ['Gyarados', 'Wooper']] },
  { name: 'Fantina', cls: 'Sinnoh Leader', spec: 'Ghost', age: 30, g: 'f', team: ['Drifloon', ['Gastly', 'Misdreavus']] },
  { name: 'Byron', cls: 'Sinnoh Leader', spec: 'Steel', age: 50, g: 'm', team: ['Shieldon', ['Bronzor', 'Magnemite']] },
  { name: 'Candice', cls: 'Sinnoh Leader', spec: 'Ice', age: 17, g: 'f', team: ['Snover', ['Sneasel', 'Snorunt']] },
  { name: 'Volkner', cls: 'Sinnoh Leader', spec: 'Electric', age: 24, g: 'm', team: ['Shinx', ['Electabuzz', 'Pachirisu']] },
  { name: 'Aaron', cls: 'Elite Four', spec: 'Bug', age: 21, g: 'm', team: ['Combee', ['Skorupi', 'Heracross', 'Yanma']] },
  { name: 'Bertha', cls: 'Elite Four', spec: 'Ground', age: 64, g: 'f', team: ['Hippopotas', ['Wooper', 'Gligar', 'Sudowoodo']] },
  { name: 'Flint', cls: 'Elite Four', spec: 'Fire', age: 27, g: 'm', team: ['Chimchar', ['Ponyta', 'Houndour', 'Magby']] },
  { name: 'Lucian', cls: 'Elite Four', spec: 'Psychic', age: 35, g: 'm', team: ['Chingling', ['Girafarig', 'Bronzor', 'Abra']] },
  { name: 'Cynthia', cls: 'Champion', spec: null, age: 26, g: 'f', team: ['Gible', ['Spiritomb', 'Roselia', 'Riolu', 'Munchlax']] },
  { name: 'Dawn', cls: 'Coordinator', spec: null, age: 10, g: 'f', team: ['Piplup', ['Buneary', 'Pachirisu', 'Swinub']] },
  { name: 'Barry', cls: 'Rival', spec: null, age: 11, g: 'm', team: ['Chimchar', ['Starly', 'Buizel', 'Munchlax']] },
  // Unova
  { name: 'Cilan', cls: 'Unova Leader', spec: 'Grass', age: 15, g: 'm', team: ['Pansage', ['Lillipup', 'Petilil']] },
  { name: 'Chili', cls: 'Unova Leader', spec: 'Fire', age: 15, g: 'm', team: ['Pansear', ['Lillipup', 'Darumaka']] },
  { name: 'Cress', cls: 'Unova Leader', spec: 'Water', age: 15, g: 'm', team: ['Panpour', ['Lillipup', 'Tympole']] },
  { name: 'Lenora', cls: 'Unova Leader', spec: 'Normal', age: 34, g: 'f', team: ['Lillipup', ['Patrat', 'Minccino']] },
  { name: 'Burgh', cls: 'Unova Leader', spec: 'Bug', age: 27, g: 'm', team: ['Sewaddle', ['Dwebble', 'Venipede']] },
  { name: 'Elesa', cls: 'Unova Leader', spec: 'Electric', age: 22, g: 'f', team: ['Emolga', ['Blitzle', 'Joltik']] },
  { name: 'Clay', cls: 'Unova Leader', spec: 'Ground', age: 48, g: 'm', team: ['Drilbur', ['Sandile', 'Palpitoad']] },
  { name: 'Skyla', cls: 'Unova Leader', spec: 'Flying', age: 23, g: 'f', team: ['Ducklett', ['Woobat', 'Pidove']] },
  { name: 'Brycen', cls: 'Unova Leader', spec: 'Ice', age: 45, g: 'm', team: ['Cubchoo', ['Vanillite', 'Cryogonal']] },
  { name: 'Drayden', cls: 'Unova Leader', spec: 'Dragon', age: 55, g: 'm', team: ['Axew', ['Druddigon', 'Deino']] },
  { name: 'Iris', cls: 'Unova Leader', spec: 'Dragon', age: 12, g: 'f', team: ['Axew', ['Dratini', 'Emolga', 'Gible']] },
  { name: 'Cheren', cls: 'Unova Leader', spec: 'Normal', age: 17, g: 'm', team: ['Lillipup', ['Snivy', 'Purrloin', 'Patrat']] },
  { name: 'Roxie', cls: 'Unova Leader', spec: 'Poison', age: 16, g: 'f', team: ['Koffing', ['Venipede', 'Trubbish', 'Grimer']] },
  { name: 'Marlon', cls: 'Unova Leader', spec: 'Water', age: 24, g: 'm', team: ['Frillish', ['Tirtouga', 'Wailmer', 'Carvanha']] },
  { name: 'Shauntal', cls: 'Elite Four', spec: 'Ghost', age: 24, g: 'f', team: ['Litwick', ['Yamask', 'Golett', 'Frillish']] },
  { name: 'Grimsley', cls: 'Elite Four', spec: 'Dark', age: 30, g: 'm', team: ['Pawniard', ['Sandile', 'Scraggy', 'Purrloin']] },
  { name: 'Caitlin', cls: 'Elite Four', spec: 'Psychic', age: 22, g: 'f', team: ['Gothita', ['Munna', 'Elgyem', 'Sigilyph']] },
  { name: 'Marshal', cls: 'Elite Four', spec: 'Fighting', age: 32, g: 'm', team: ['Timburr', ['Throh', 'Sawk', 'Mienfoo']] },
  { name: 'Alder', cls: 'Champion', spec: 'Bug', age: 58, g: 'm', team: ['Larvesta', ['Bouffalant', 'Druddigon', 'Escavalier']] },
  { name: 'N', cls: 'Pokémon Trainer', spec: null, age: 19, g: 'm', team: ['Purrloin', ['Zorua', 'Tympole', 'Timburr', 'Pidove']] },
  { name: 'Bianca', cls: 'Rival', spec: null, age: 15, g: 'f', team: ['Tepig', ['Munna', 'Pansage', 'Lillipup']] },
  // Kalos
  { name: 'Viola', cls: 'Kalos Leader', spec: 'Bug', age: 20, g: 'f', team: ['Surskit', ['Scatterbug', 'Venonat']] },
  { name: 'Grant', cls: 'Kalos Leader', spec: 'Rock', age: 25, g: 'm', team: ['Tyrunt', ['Amaura', 'Onix']] },
  { name: 'Korrina', cls: 'Kalos Leader', spec: 'Fighting', age: 16, g: 'f', team: ['Riolu', ['Mienfoo', 'Machop', 'Hawlucha']] },
  { name: 'Ramos', cls: 'Kalos Leader', spec: 'Grass', age: 65, g: 'm', team: ['Skiddo', ['Jumpluff', 'Weepinbell']] },
  { name: 'Clemont', cls: 'Kalos Leader', spec: 'Electric', age: 14, g: 'm', team: ['Helioptile', ['Bunnelby', 'Magnemite', 'Dedenne']] },
  { name: 'Valerie', cls: 'Kalos Leader', spec: 'Fairy', age: 22, g: 'f', team: ['Spritzee', ['Mawile', 'Ralts']] },
  { name: 'Olympia', cls: 'Kalos Leader', spec: 'Psychic', age: 40, g: 'f', team: ['Espurr', ['Sigilyph', 'Slowpoke']] },
  { name: 'Wulfric', cls: 'Kalos Leader', spec: 'Ice', age: 48, g: 'm', team: ['Bergmite', ['Snover', 'Cryogonal']] },
  { name: 'Malva', cls: 'Elite Four', spec: 'Fire', age: 30, g: 'f', team: ['Litleo', ['Houndour', 'Torkoal', 'Fletchinder']] },
  { name: 'Siebold', cls: 'Elite Four', spec: 'Water', age: 30, g: 'm', team: ['Clauncher', ['Staryu', 'Binacle', 'Gyarados']] },
  { name: 'Wikstrom', cls: 'Elite Four', spec: 'Steel', age: 35, g: 'm', team: ['Honedge', ['Klefki', 'Probopass', 'Scizor']] },
  { name: 'Drasna', cls: 'Elite Four', spec: 'Dragon', age: 55, g: 'f', team: ['Noibat', ['Druddigon', 'Altaria', 'Dragalge']] },
  { name: 'Diantha', cls: 'Champion', spec: null, age: 27, g: 'f', team: ['Ralts', ['Hawlucha', 'Tyrunt', 'Amaura', 'Goomy']] },
  { name: 'Serena', cls: 'Performer', spec: null, age: 10, g: 'f', team: ['Fennekin', ['Eevee', 'Pancham', 'Flabébé']] },
  { name: 'Calem', cls: 'Rival', spec: null, age: 11, g: 'm', team: ['Froakie', ['Chespin', 'Fletchling', 'Honedge']] },
  // Alola
  { name: 'Hala', cls: 'Island Kahuna', spec: 'Fighting', age: 62, g: 'm', team: ['Makuhita', ['Crabrawler', 'Mankey']] },
  { name: 'Olivia', cls: 'Island Kahuna', spec: 'Rock', age: 28, g: 'f', team: ['Rockruff', ['Nosepass', 'Geodude']] },
  { name: 'Nanu', cls: 'Island Kahuna', spec: 'Dark', age: 47, g: 'm', team: ['Meowth', ['Sableye', 'Sandile', 'Murkrow']] },
  { name: 'Hapu', cls: 'Island Kahuna', spec: 'Ground', age: 15, g: 'f', team: ['Mudbray', ['Shellos', 'Trapinch', 'Golett']] },
  { name: 'Ilima', cls: 'Trial Captain', spec: 'Normal', age: 18, g: 'm', team: ['Yungoos', ['Smeargle', 'Komala']] },
  { name: 'Lana', cls: 'Trial Captain', spec: 'Water', age: 11, g: 'f', team: ['Popplio', ['Wishiwashi', 'Dewpider']] },
  { name: 'Kiawe', cls: 'Trial Captain', spec: 'Fire', age: 15, g: 'm', team: ['Turtonator', ['Salandit', 'Growlithe']] },
  { name: 'Mallow', cls: 'Trial Captain', spec: 'Grass', age: 11, g: 'f', team: ['Bounsweet', ['Fomantis', 'Morelull']] },
  { name: 'Sophocles', cls: 'Trial Captain', spec: 'Electric', age: 12, g: 'm', team: ['Togedemaru', ['Grubbin', 'Pikachu']] },
  { name: 'Acerola', cls: 'Trial Captain', spec: 'Ghost', age: 13, g: 'f', team: ['Sandygast', ['Drifloon', 'Snorunt', 'Misdreavus']] },
  { name: 'Mina', cls: 'Trial Captain', spec: 'Fairy', age: 20, g: 'f', team: ['Cutiefly', ['Snubbull', 'Jigglypuff', 'Klefki']] },
  { name: 'Kahili', cls: 'Elite Four', spec: 'Flying', age: 30, g: 'f', team: ['Pikipek', ['Skarmory', 'Oricorio', 'Zubat']] },
  { name: 'Molayne', cls: 'Elite Four', spec: 'Steel', age: 26, g: 'm', team: ['Klefki', ['Bronzor', 'Magnemite', 'Skarmory']] },
  { name: 'Kukui', cls: 'Champion', spec: null, age: 38, g: 'm', team: ['Rockruff', ['Litten', 'Snorlax', 'Magnemite']] },
  { name: 'Hau', cls: 'Rival', spec: null, age: 11, g: 'm', team: ['Pichu', ['Rowlet', 'Eevee', 'Noibat']] },
  { name: 'Gladion', cls: 'Rival', spec: 'Dark', age: 14, g: 'm', team: ['Riolu', ['Zubat', 'Sneasel', 'Eevee']] },
  { name: 'Lillie', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'f', team: ['Vulpix', ['Clefairy', 'Snorlax']] },
  { name: 'Guzma', cls: 'Team Boss', spec: 'Bug', age: 25, g: 'm', team: ['Wimpod', ['Pinsir', 'Spinarak', 'Surskit']] },
  { name: 'Plumeria', cls: 'Team Admin', spec: 'Poison', age: 24, g: 'f', team: ['Salandit', ['Mareanie', 'Grimer']] },
  { name: 'Lusamine', cls: 'Aether President', spec: null, age: 40, g: 'f', team: ['Feebas', ['Petilil', 'Misdreavus', 'Clefairy']] },
  // Pokémon Professors
  { name: 'Oak', cls: 'Pokémon Professor', spec: null, age: 60, g: 'm', team: ['Tauros', ['Exeggcute', 'Growlithe', 'Magikarp', 'Pidgey']] },
  { name: 'Elm', cls: 'Pokémon Professor', spec: null, age: 31, g: 'm', team: ['Togepi', ['Marill', 'Chikorita', 'Cyndaquil', 'Totodile']] },
  { name: 'Birch', cls: 'Pokémon Professor', spec: null, age: 40, g: 'm', team: ['Zigzagoon', ['Poochyena', 'Treecko', 'Torchic', 'Mudkip']] },
  { name: 'Rowan', cls: 'Pokémon Professor', spec: null, age: 62, g: 'm', team: ['Starly', ['Shinx', 'Bidoof', 'Turtwig', 'Chimchar', 'Piplup']] },
  { name: 'Juniper', cls: 'Pokémon Professor', spec: null, age: 26, g: 'f', team: ['Minccino', ['Snivy', 'Tepig', 'Oshawott']] },
  { name: 'Sycamore', cls: 'Pokémon Professor', spec: null, age: 32, g: 'm', team: ['Gible', ['Chespin', 'Fennekin', 'Froakie']] },
  { name: 'Magnolia', cls: 'Pokémon Professor', spec: null, age: 70, g: 'f', team: ['Duraludon', ['Applin', 'Snorlax']] },
  { name: 'Sada', cls: 'Pokémon Professor', spec: null, age: 38, g: 'f', team: ['Bagon', ['Deino', 'Larvitar', 'Sandile']] },
  { name: 'Turo', cls: 'Pokémon Professor', spec: null, age: 38, g: 'm', team: ['Beldum', ['Magnemite', 'Klink', 'Porygon']] },
  { name: 'Willow', cls: 'Pokémon Professor', spec: null, age: 41, g: 'm', team: ['Pikachu', ['Bulbasaur', 'Charmander', 'Squirtle', 'Eevee']] },
  // Pokémon GO team leaders (their teams' legendary birds are mascots, not partners)
  { name: 'Candela', cls: 'Team Valor Leader', spec: 'Fire', age: 25, g: 'f', team: ['Growlithe', ['Ponyta', 'Magby', 'Charmander', 'Vulpix']] },
  { name: 'Blanche', cls: 'Team Mystic Leader', spec: 'Ice', spec2: 'Water', age: 27, g: 'n', team: ['Lapras', ['Seel', 'Spheal', 'Snorunt', 'Shellder']] },
  { name: 'Spark', cls: 'Team Instinct Leader', spec: 'Electric', age: 23, g: 'm', team: ['Pikachu', ['Elekid', 'Magnemite', 'Voltorb', 'Mareep']] },
  // Galar
  { name: 'Milo', cls: 'Galar Leader', spec: 'Grass', age: 23, g: 'm', team: ['Gossifleur', ['Skiddo', 'Smoliv']] },
  { name: 'Nessa', cls: 'Galar Leader', spec: 'Water', age: 21, g: 'f', team: ['Chewtle', ['Arrokuda', 'Goldeen']] },
  { name: 'Kabu', cls: 'Galar Leader', spec: 'Fire', age: 50, g: 'm', team: ['Sizzlipede', ['Vulpix', 'Growlithe']] },
  { name: 'Bea', cls: 'Galar Leader', spec: 'Fighting', age: 17, g: 'f', team: ['Clobbopus', ['Machop', 'Galarian Farfetch\'d']] },
  { name: 'Allister', cls: 'Galar Leader', spec: 'Ghost', age: 13, g: 'm', team: ['Galarian Yamask', ['Gastly', 'Sinistea']] },
  { name: 'Opal', cls: 'Galar Leader', spec: 'Fairy', age: 88, g: 'f', team: ['Milcery', ['Togepi', 'Mawile', 'Galarian Ponyta']] },
  { name: 'Gordie', cls: 'Galar Leader', spec: 'Rock', age: 21, g: 'm', team: ['Rolycoly', ['Shuckle', 'Stonjourner']] },
  { name: 'Melony', cls: 'Galar Leader', spec: 'Ice', age: 45, g: 'f', team: ['Snom', ['Galarian Darumaka', 'Lapras']] },
  { name: 'Piers', cls: 'Galar Leader', spec: 'Dark', age: 26, g: 'm', team: ['Galarian Zigzagoon', ['Scraggy', 'Stunky']] },
  { name: 'Raihan', cls: 'Galar Leader', spec: 'Dragon', age: 23, g: 'm', team: ['Duraludon', ['Trapinch', 'Goomy']] },
  { name: 'Leon', cls: 'Champion', spec: null, age: 20, g: 'm', team: ['Charmander', ['Dreepy', 'Honedge', 'Axew']] },
  { name: 'Hop', cls: 'Rival', spec: null, age: 12, g: 'm', team: ['Wooloo', ['Rookidee', 'Grookey', 'Sobble']] },
  { name: 'Marnie', cls: 'Rival', spec: 'Dark', age: 14, g: 'f', team: ['Morpeko', ['Impidimp', 'Purrloin', 'Croagunk']] },
  { name: 'Bede', cls: 'Rival', spec: 'Fairy', age: 15, g: 'm', team: ['Hatenna', ['Ralts', 'Gothita']] },
  { name: 'Sonia', cls: 'Pokémon Professor', spec: null, age: 22, g: 'f', team: ['Yamper', ['Eevee', 'Galarian Meowth']] },
  { name: 'Rose', cls: 'Chairman', spec: 'Steel', age: 45, g: 'm', team: ['Cufant', ['Klink', 'Ferroseed', 'Karrablast']] },
  { name: 'Goh', cls: 'Pokémon Trainer', spec: null, age: 10, g: 'm', team: ['Scorbunny', ['Sobble', 'Rookidee', 'Eevee']] },
  { name: 'Chloe', cls: 'Pokémon Trainer', spec: null, age: 10, g: 'f', team: ['Eevee', ['Yamper', 'Milcery']] },
  // Paldea
  { name: 'Katy', cls: 'Paldea Leader', spec: 'Bug', age: 28, g: 'f', team: ['Nymble', ['Tarountula', 'Teddiursa']] },
  { name: 'Brassius', cls: 'Paldea Leader', spec: 'Grass', age: 40, g: 'm', team: ['Smoliv', ['Bonsly', 'Petilil']] },
  { name: 'Iono', cls: 'Paldea Leader', spec: 'Electric', age: 19, g: 'f', team: ['Wattrel', ['Tadbulb', 'Misdreavus', 'Shinx']] },
  { name: 'Kofu', cls: 'Paldea Leader', spec: 'Water', age: 50, g: 'm', team: ['Veluza', ['Wiglett', 'Crabrawler']] },
  { name: 'Larry', cls: 'Paldea Leader', spec: 'Normal', age: 40, g: 'm', team: ['Komala', ['Dunsparce', 'Tandemaus']] },
  { name: 'Ryme', cls: 'Paldea Leader', spec: 'Ghost', age: 26, g: 'f', team: ['Greavard', ['Mimikyu', 'Toxel']] },
  { name: 'Tulip', cls: 'Paldea Leader', spec: 'Psychic', age: 25, g: 'f', team: ['Flittle', ['Girafarig', 'Ralts']] },
  { name: 'Grusha', cls: 'Paldea Leader', spec: 'Ice', age: 20, g: 'm', team: ['Cetoddle', ['Snom', 'Swablu']] },
  { name: 'Rika', cls: 'Elite Four', spec: 'Ground', age: 30, g: 'f', team: ['Barboach', ['Phanpy', 'Diglett', 'Numel']] },
  { name: 'Poppy', cls: 'Elite Four', spec: 'Steel', age: 8, g: 'f', team: ['Tinkatink', ['Cufant', 'Magnemite', 'Bronzor']] },
  { name: 'Hassel', cls: 'Elite Four', spec: 'Dragon', age: 35, g: 'm', team: ['Noibat', ['Skrelp', 'Applin', 'Frigibax']] },
  { name: 'Geeta', cls: 'Champion', spec: null, age: 35, g: 'f', team: ['Glimmet', ['Flittle', 'Skiddo', 'Pawniard', 'Veluza']] },
  { name: 'Nemona', cls: 'Champion', spec: null, age: 16, g: 'f', team: ['Pawmi', ['Rockruff', 'Goomy', 'Sprigatito', 'Orthworm']] },
  { name: 'Arven', cls: 'Rival', spec: null, age: 17, g: 'm', team: ['Maschiff', ['Lechonk', 'Toedscool', 'Tadbulb']] },
  { name: 'Penny', cls: 'Team Star Boss', spec: null, age: 18, g: 'f', team: ['Eevee', ['Pawmi', 'Shroodle']] },
  { name: 'Kieran', cls: 'Rival', spec: null, age: 14, g: 'm', team: ['Applin', ['Horsea', 'Litten', 'Poltchageist']] },
  { name: 'Liko', cls: 'Pokémon Trainer', spec: null, age: 12, g: 'f', team: ['Sprigatito', ['Charcadet', 'Flittle']] },
  { name: 'Roy', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'm', team: ['Fuecoco', ['Wattrel', 'Tarountula']] },
  { name: 'Dot', cls: 'Pokémon Trainer', spec: null, age: 12, g: 'f', team: ['Quaxly', ['Tinkatink', 'Smoliv']] },
  { name: 'Friede', cls: 'Rising Volt Captain', spec: null, age: 30, g: 'm', team: ['Pikachu', ['Charmander', 'Rookidee']] },
  // Battle Frontier Brains
  { name: 'Noland', cls: 'Factory Head', spec: null, age: 42, g: 'm', team: ['Tauros', ['Heracross', 'Starmie']] },
  { name: 'Greta', cls: 'Arena Tycoon', spec: 'Fighting', age: 30, g: 'f', team: ['Heracross', ['Makuhita', 'Meditite']] },
  { name: 'Tucker', cls: 'Dome Ace', spec: 'Dragon', age: 28, g: 'm', team: ['Bagon', ['Beldum', 'Swablu']] },
  { name: 'Lucy', cls: 'Pike Queen', spec: 'Poison', age: 24, g: 'f', team: ['Seviper', ['Feebas', 'Shuckle']] },
  { name: 'Spenser', cls: 'Palace Maven', spec: null, age: 72, g: 'm', team: ['Zubat', ['Slakoth', 'Lapras']] },
  { name: 'Brandon', cls: 'Pyramid King', spec: 'Rock', age: 50, g: 'm', team: ['Larvitar', ['Nosepass', 'Aron']] },
  { name: 'Anabel', cls: 'Salon Maiden', spec: 'Psychic', age: 18, g: 'f', team: ['Abra', ['Snorlax', 'Eevee']] },
  { name: 'Palmer', cls: 'Tower Tycoon', spec: null, age: 45, g: 'm', team: ['Rhyhorn', ['Feebas', 'Dratini']] },
  { name: 'Thorton', cls: 'Factory Head', spec: 'Steel', age: 17, g: 'm', team: ['Bronzor', ['Magnemite', 'Porygon']] },
  { name: 'Dahlia', cls: 'Arcade Star', spec: null, age: 25, g: 'f', team: ['Lotad', ['Togepi', 'Elekid']] },
  { name: 'Darach', cls: 'Castle Valet', spec: null, age: 20, g: 'm', team: ['Starly', ['Piplup', 'Houndour']] },
  { name: 'Argenta', cls: 'Hall Matron', spec: null, age: 50, g: 'f', team: ['Skarmory', ['Squirtle', 'Heracross']] },
  { name: 'Ingo', cls: 'Subway Boss', spec: null, age: 30, g: 'm', team: ['Drilbur', ['Litwick', 'Archen']] },
  { name: 'Emmet', cls: 'Subway Boss', spec: 'Electric', age: 30, g: 'm', team: ['Joltik', ['Tynamo', 'Archen']] },
  // Villain team bosses and admins
  { name: 'Maxie', cls: 'Magma Leader', spec: 'Ground', age: 40, g: 'm', team: ['Numel', ['Poochyena', 'Zubat']] },
  { name: 'Archie', cls: 'Aqua Leader', spec: 'Water', age: 40, g: 'm', team: ['Carvanha', ['Poochyena', 'Zubat']] },
  { name: 'Cyrus', cls: 'Galactic Boss', spec: 'Dark', age: 27, g: 'm', team: ['Sneasel', ['Murkrow', 'Zubat', 'Magikarp']] },
  { name: 'Ghetsis', cls: 'Plasma Sage', spec: 'Dark', age: 50, g: 'm', team: ['Deino', ['Croagunk', 'Tympole']] },
  { name: 'Lysandre', cls: 'Flare Boss', spec: 'Fire', age: 40, g: 'm', team: ['Litleo', ['Murkrow', 'Magikarp']] },
  { name: 'Volo', cls: 'Merchant', spec: null, age: 25, g: 'm', team: ['Spiritomb', ['Gible', 'Riolu', 'Togepi']] },
  { name: 'Archer', cls: 'Rocket Executive', spec: 'Dark', age: 32, g: 'm', team: ['Houndour', ['Koffing', 'Zubat']] },
  { name: 'Ariana', cls: 'Rocket Executive', spec: 'Poison', age: 28, g: 'f', team: ['Ekans', ['Oddish', 'Murkrow']] },
  { name: 'Courtney', cls: 'Magma Admin', spec: 'Fire', age: 22, g: 'f', team: ['Numel', ['Poochyena', 'Swablu']] },
  { name: 'Matt', cls: 'Aqua Admin', spec: 'Water', age: 25, g: 'm', team: ['Carvanha', ['Poochyena', 'Lotad']] },
  { name: 'Shelly', cls: 'Aqua Admin', spec: 'Water', age: 28, g: 'f', team: ['Carvanha', ['Poochyena', 'Zubat']] },
  { name: 'Mars', cls: 'Galactic Commander', spec: null, age: 20, g: 'f', team: ['Glameow', ['Bronzor', 'Zubat']] },
  { name: 'Jupiter', cls: 'Galactic Commander', spec: 'Poison', age: 24, g: 'f', team: ['Stunky', ['Bronzor', 'Zubat']] },
  { name: 'Saturn', cls: 'Galactic Commander', spec: 'Poison', age: 24, g: 'm', team: ['Croagunk', ['Abra', 'Bronzor']] },
  { name: 'Colress', cls: 'Plasma Scientist', spec: 'Steel', age: 30, g: 'm', team: ['Klink', ['Magnemite', 'Elgyem']] },
  // Ash's rivals from the anime
  { name: 'Paul', cls: 'Rival', spec: null, age: 12, g: 'm', team: ['Turtwig', ['Elekid', 'Teddiursa', 'Sneasel']] },
  { name: 'Trip', cls: 'Rival', spec: null, age: 11, g: 'm', team: ['Snivy', ['Pidove', 'Vanillite', 'Frillish']] },
  { name: 'Alain', cls: 'Rival', spec: null, age: 18, g: 'm', team: ['Charmander', ['Beldum', 'Larvitar', 'Pawniard']] },
  { name: 'Tobias', cls: 'Rival', spec: null, age: 25, g: 'm', team: ['Larvitar', ['Bagon', 'Absol']] },
  { name: 'Sawyer', cls: 'Rival', spec: null, age: 12, g: 'm', team: ['Treecko', ['Bagon', 'Clauncher', 'Honedge']] },
  { name: 'Ritchie', cls: 'Rival', spec: null, age: 10, g: 'm', team: ['Pikachu', ['Charmander', 'Caterpie']] },
  { name: 'Harrison', cls: 'Rival', spec: null, age: 12, g: 'm', team: ['Torchic', ['Chikorita', 'Houndour']] },
  { name: 'Morrison', cls: 'Rival', spec: null, age: 11, g: 'm', team: ['Growlithe', ['Beldum', 'Gligar']] },
  { name: 'Cameron', cls: 'Rival', spec: null, age: 12, g: 'm', team: ['Riolu', ['Ferroseed', 'Oshawott']] },
  // Ash's companions
  { name: 'Tracey', cls: 'Pokémon Watcher', spec: null, age: 13, g: 'm', team: ['Scyther', ['Venonat', 'Marill']] },
  { name: 'Max', cls: 'Pokémon Trainer', spec: 'Psychic', age: 8, g: 'm', team: ['Ralts', ['Treecko', 'Torchic']] },
  // player characters
  { name: 'Leaf', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'f', team: [['Bulbasaur', 'Charmander', 'Squirtle'], ['Pidgey', 'Clefairy', 'Eevee']] },
  { name: 'Ethan', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'm', team: [['Chikorita', 'Cyndaquil', 'Totodile'], ['Togepi', 'Marill', 'Sentret']] },
  { name: 'Lyra', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'f', team: [['Chikorita', 'Cyndaquil', 'Totodile'], ['Marill', 'Togepi', 'Hoothoot']] },
  { name: 'Kris', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'f', team: [['Chikorita', 'Cyndaquil', 'Totodile'], ['Mareep', 'Togepi', 'Hoothoot']] },
  { name: 'Lucas', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'm', team: [['Turtwig', 'Chimchar', 'Piplup'], ['Starly', 'Bidoof', 'Shinx']] },
  { name: 'Hilbert', cls: 'Pokémon Trainer', spec: null, age: 14, g: 'm', team: [['Snivy', 'Tepig', 'Oshawott'], ['Lillipup', 'Pidove', 'Purrloin']] },
  { name: 'Hilda', cls: 'Pokémon Trainer', spec: null, age: 14, g: 'f', team: [['Snivy', 'Tepig', 'Oshawott'], ['Munna', 'Pidove', 'Lillipup']] },
  { name: 'Nate', cls: 'Pokémon Trainer', spec: null, age: 13, g: 'm', team: [['Snivy', 'Tepig', 'Oshawott'], ['Riolu', 'Patrat', 'Azurill']] },
  { name: 'Rosa', cls: 'Pokémon Trainer', spec: null, age: 13, g: 'f', team: [['Snivy', 'Tepig', 'Oshawott'], ['Purrloin', 'Azurill', 'Riolu']] },
  { name: 'Elio', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'm', team: [['Rowlet', 'Litten', 'Popplio'], ['Pikipek', 'Rockruff', 'Yungoos']] },
  { name: 'Selene', cls: 'Pokémon Trainer', spec: null, age: 11, g: 'f', team: [['Rowlet', 'Litten', 'Popplio'], ['Rockruff', 'Grubbin', 'Cutiefly']] },
  { name: 'Victor', cls: 'Pokémon Trainer', spec: null, age: 12, g: 'm', team: [['Grookey', 'Scorbunny', 'Sobble'], ['Wooloo', 'Rookidee', 'Skwovet']] },
  { name: 'Gloria', cls: 'Pokémon Trainer', spec: null, age: 12, g: 'f', team: [['Grookey', 'Scorbunny', 'Sobble'], ['Wooloo', 'Yamper', 'Nickit']] },
  { name: 'Florian', cls: 'Pokémon Trainer', spec: null, age: 14, g: 'm', team: [['Sprigatito', 'Fuecoco', 'Quaxly'], ['Lechonk', 'Pawmi', 'Tarountula']] },
  { name: 'Juliana', cls: 'Pokémon Trainer', spec: null, age: 14, g: 'f', team: [['Sprigatito', 'Fuecoco', 'Quaxly'], ['Fidough', 'Pawmi', 'Smoliv']] },
  { name: 'Rei', cls: 'Survey Corps Member', spec: null, age: 15, g: 'm', team: [['Rowlet', 'Cyndaquil', 'Oshawott'], ['Starly', 'Bidoof', 'Shinx']] },
  { name: 'Akari', cls: 'Survey Corps Member', spec: null, age: 15, g: 'f', team: [['Rowlet', 'Cyndaquil', 'Oshawott'], ['Pichu', 'Buneary', 'Ponyta']] },
  // rivals and friends
  { name: 'Hugh', cls: 'Rival', spec: null, age: 14, g: 'm', team: ['Tepig', ['Pidove', 'Purrloin', 'Throh']] },
  { name: 'Shauna', cls: 'Rival', spec: null, age: 12, g: 'f', team: [['Chespin', 'Fennekin', 'Froakie'], ['Flabébé', 'Bunnelby', 'Fletchling']] },
  { name: 'Tierno', cls: 'Rival', spec: null, age: 12, g: 'm', team: ['Corphish', ['Squirtle', 'Budew', 'Fletchling']] },
  { name: 'Trevor', cls: 'Rival', spec: null, age: 12, g: 'm', team: ['Charmander', ['Flabébé', 'Fletchling', 'Pikachu']] },
  { name: 'Drew', cls: 'Coordinator', spec: null, age: 11, g: 'm', team: ['Budew', ['Surskit', 'Trapinch', 'Absol']] },
  { name: 'Zoey', cls: 'Coordinator', spec: null, age: 13, g: 'f', team: ['Glameow', ['Shellos', 'Misdreavus', 'Ralts']] },
  { name: 'Ursula', cls: 'Coordinator', spec: null, age: 11, g: 'f', team: ['Gible', ['Plusle', 'Minun', 'Eevee']] },
  { name: 'Kenny', cls: 'Coordinator', spec: null, age: 10, g: 'm', team: ['Piplup', ['Machop', 'Shroomish', 'Abra']] },
  // DLC: Galar (Isle of Armor, Crown Tundra)
  { name: 'Mustard', cls: 'Dojo Master', spec: null, age: 60, g: 'm', team: ['Mienfoo', ['Shinx', 'Rookidee', 'Jangmo-o']] },
  { name: 'Klara', cls: 'Dojo Student', spec: 'Poison', age: 16, g: 'f', team: ['Galarian Slowpoke', ['Skrelp', 'Koffing', 'Venipede']] },
  { name: 'Avery', cls: 'Dojo Student', spec: 'Psychic', age: 16, g: 'm', team: ['Abra', ['Galarian Slowpoke', 'Woobat', 'Galarian Ponyta']] },
  { name: 'Peony', cls: 'Former Gym Leader', spec: 'Steel', age: 45, g: 'm', team: ['Cufant', ['Galarian Meowth', 'Aron']] },
  // DLC: Paldea (Teal Mask, Indigo Disk)
  { name: 'Carmine', cls: 'Rival', spec: null, age: 15, g: 'f', team: ['Poltchageist', ['Lotad', 'Vulpix']] },
  { name: 'Briar', cls: 'Blueberry Academy Teacher', spec: 'Dragon', age: 25, g: 'f', team: ['Duraludon', ['Gible', 'Dreepy']] },
  { name: 'Lacey', cls: 'Blueberry Elite Four', spec: 'Fairy', age: 17, g: 'f', team: ['Snubbull', ['Cottonee', 'Popplio', 'Impidimp']] },
  { name: 'Drayton', cls: 'Blueberry Elite Four', spec: 'Dragon', age: 18, g: 'm', team: ['Dratini', ['Applin', 'Axew', 'Treecko']] },
  { name: 'Crispin', cls: 'Blueberry Elite Four', spec: 'Fire', age: 17, g: 'm', team: ['Torkoal', ['Fletchling', 'Torchic']] },
  { name: 'Amarys', cls: 'Blueberry Elite Four', spec: 'Steel', age: 19, g: 'f', team: ['Skarmory', ['Piplup', 'Rookidee', 'Shieldon']] },
  // DLC-era: Team Star squad bosses (Scarlet/Violet)
  { name: 'Mela', cls: 'Team Star Boss', spec: 'Fire', age: 17, g: 'f', team: ['Varoom', ['Houndour', 'Torkoal', 'Salandit']] },
  { name: 'Atticus', cls: 'Team Star Boss', spec: 'Poison', age: 18, g: 'm', team: ['Shroodle', ['Skrelp', 'Venipede', 'Grimer']] },
  { name: 'Ortega', cls: 'Team Star Boss', spec: 'Fairy', age: 16, g: 'm', team: ['Fidough', ['Azurill', 'Swirlix', 'Flabébé']] },
  { name: 'Eri', cls: 'Team Star Boss', spec: 'Fighting', age: 18, g: 'f', team: ['Mankey', ['Toxel', 'Riolu', 'Crabrawler']] },
  { name: 'Giacomo', cls: 'Team Star Boss', spec: 'Dark', age: 17, g: 'm', team: ['Pawniard', ['Murkrow', 'Impidimp', 'Nickit']] },
  // Orre: Pokémon XD: Gale of Darkness
  { name: 'Michael', cls: 'Snag Machine Tester', spec: null, age: 15, g: 'm', team: ['Eevee', ['Teddiursa', 'Togepi', 'Makuhita']] },
  { name: 'Jovi', cls: 'Pokémon Trainer', spec: 'Electric', age: 9, g: 'f', team: ['Plusle', ['Minun']] },
  { name: 'Krane', cls: 'Professor', spec: null, age: 45, g: 'm', team: ['Porygon', ['Magnemite', 'Natu']] },
  { name: 'Duking', cls: 'Pyrite Town Strongman', spec: null, age: 40, g: 'm', team: ['Meditite', ['Larvitar', 'Shuckle', 'Plusle']] },
  { name: 'Gonzap', cls: 'Team Snagem Boss', spec: null, age: 45, g: 'm', team: ['Skarmory', ['Seedot', 'Voltorb', 'Oddish', 'Barboach']] },
  { name: 'Miror B.', cls: 'Team Miror Boss', spec: 'Water', age: 35, g: 'm', team: ['Lotad', ['Voltorb', 'Nosepass']] },
  { name: 'Lovrina', cls: 'Cipher Admin', spec: null, age: 25, g: 'f', team: ['Luvdisc', ['Wurmple', 'Budew', 'Skitty']] },
  { name: 'Snattle', cls: 'Cipher Admin', spec: null, age: 50, g: 'm', team: ['Chinchou', ['Wooper', 'Lunatone', 'Castform', 'Beldum']] },
  { name: 'Gorigan', cls: 'Cipher Admin', spec: null, age: 40, g: 'm', team: ['Aron', ['Spheal', 'Slowpoke', 'Teddiursa', 'Mankey']] },
  { name: 'Ardos', cls: 'Cipher Admin', spec: null, age: 30, g: 'm', team: ['Abra', ['Taillow', 'Horsea', 'Heracross', 'Elekid']] },
  { name: 'Eldes', cls: 'Cipher Admin', spec: null, age: 30, g: 'm', team: ['Bagon', ['Nincada', 'Electrike', 'Trapinch', 'Cubone']] },
  { name: 'Greevil', cls: 'Cipher Grand Master', spec: null, age: 60, g: 'm', team: ['Rhyhorn', ['Exeggcute', 'Tauros']] },
  { name: 'Exol', cls: 'Cipher Cmdr', spec: null, age: 30, g: 'm', team: ['Whismur', ['Girafarig', 'Mawile', 'Pikachu']] },
  { name: 'Zook', cls: 'Street Thug', spec: 'Normal', age: 22, g: 'm', team: ['Zangoose'] },
];
// What each famous trainer is known as in the games and anime. A trainer can hold several.
const FAMOUS_TAG_LABELS = { hero: 'Player Character', orre: 'Orre', brain: 'Frontier Brain', leader: 'Gym Leader', kahuna: 'Island Kahuna', captain: 'Trial Captain', e4: 'Elite Four', champ: 'Champion', anime: 'Anime', rival: 'Rival', boss: 'Villain', prof: 'Professor', go: 'Pokémon GO' };
const FAMOUS_TAG_PLURAL = { hero: 'Player characters', orre: 'Orre (XD)', brain: 'Frontier Brains', leader: 'Gym Leaders', kahuna: 'Island Kahunas', captain: 'Trial Captains', e4: 'Elite Four', champ: 'Champions', anime: 'Anime characters', rival: 'Rivals', boss: 'Villains', prof: 'Professors', go: 'Pokémon GO' };
const FAMOUS_TAG_LIST = {
  leader: ['Brock', 'Misty', 'Lt. Surge', 'Erika', 'Koga', 'Sabrina', 'Blaine', 'Giovanni', 'Blue', 'Falkner', 'Bugsy', 'Whitney', 'Morty', 'Chuck', 'Jasmine', 'Pryce', 'Clair', 'Janine', 'Roxanne', 'Brawly', 'Wattson', 'Flannery', 'Norman', 'Winona', 'Tate & Liza', 'Wallace', 'Juan', 'Roark', 'Gardenia', 'Maylene', 'Crasher Wake', 'Fantina', 'Byron', 'Candice', 'Volkner', 'Cilan', 'Chili', 'Cress', 'Lenora', 'Burgh', 'Elesa', 'Clay', 'Skyla', 'Brycen', 'Drayden', 'Iris', 'Cheren', 'Roxie', 'Marlon', 'Viola', 'Grant', 'Korrina', 'Ramos', 'Clemont', 'Valerie', 'Olympia', 'Wulfric', 'Milo', 'Nessa', 'Kabu', 'Bea', 'Allister', 'Opal', 'Gordie', 'Melony', 'Piers', 'Raihan', 'Bede', 'Marnie', 'Katy', 'Brassius', 'Iono', 'Kofu', 'Larry', 'Ryme', 'Tulip', 'Grusha'],
  brain: ['Noland', 'Greta', 'Tucker', 'Lucy', 'Spenser', 'Brandon', 'Anabel', 'Palmer', 'Thorton', 'Dahlia', 'Darach', 'Argenta', 'Ingo', 'Emmet'],
  kahuna: ['Hala', 'Olivia', 'Nanu', 'Hapu'],
  captain: ['Ilima', 'Lana', 'Kiawe', 'Mallow', 'Sophocles', 'Acerola', 'Mina'],
  prof: ['Oak', 'Elm', 'Birch', 'Rowan', 'Juniper', 'Sycamore', 'Kukui', 'Magnolia', 'Sonia', 'Sada', 'Turo', 'Krane', 'Willow'],
  go: ['Candela', 'Blanche', 'Spark', 'Willow'],
  hero: ['Red', 'Leaf', 'Ethan', 'Lyra', 'Kris', 'Brendan', 'May', 'Lucas', 'Dawn', 'Hilbert', 'Hilda', 'Nate', 'Rosa', 'Calem', 'Serena', 'Elio', 'Selene', 'Victor', 'Gloria', 'Florian', 'Juliana', 'Rei', 'Akari', 'Michael'],
  orre: ['Michael', 'Jovi', 'Krane', 'Duking', 'Gonzap', 'Miror B.', 'Lovrina', 'Snattle', 'Gorigan', 'Ardos', 'Eldes', 'Greevil', 'Exol', 'Zook'],
  boss: ['Mela', 'Atticus', 'Ortega', 'Eri', 'Giacomo', 'Greevil', 'Ardos', 'Eldes', 'Lovrina', 'Snattle', 'Gorigan', 'Exol', 'Gonzap', 'Miror B.', 'Giovanni', 'Guzma', 'Plumeria', 'Lusamine', 'Rose', 'Penny', 'Maxie', 'Archie', 'Cyrus', 'Ghetsis', 'Lysandre', 'Volo', 'Archer', 'Ariana', 'Courtney', 'Matt', 'Shelly', 'Mars', 'Jupiter', 'Saturn', 'Colress'],
  e4: ['Lacey', 'Drayton', 'Crispin', 'Amarys', 'Rika', 'Poppy', 'Larry', 'Hassel', 'Hala', 'Olivia', 'Acerola', 'Kahili', 'Molayne', 'Lorelei', 'Bruno', 'Agatha', 'Lance', 'Koga', 'Will', 'Karen', 'Sidney', 'Phoebe', 'Glacia', 'Drake', 'Aaron', 'Bertha', 'Flint', 'Lucian', 'Shauntal', 'Grimsley', 'Caitlin', 'Marshal', 'Malva', 'Siebold', 'Wikstrom', 'Drasna'],
  champ: ['Blue', 'Red', 'Lance', 'Steven', 'Wallace', 'Cynthia', 'Alder', 'Iris', 'Diantha', 'Kukui', 'Leon', 'Geeta', 'Nemona', 'Kieran'],
  anime: ['Drew', 'Zoey', 'Ursula', 'Kenny', 'Ash', 'Misty', 'Brock', 'Gary', 'Tracey', 'May', 'Max', 'Dawn', 'Iris', 'Cilan', 'Clemont', 'Serena', 'Lana', 'Kiawe', 'Mallow', 'Sophocles', 'Lillie', 'Kukui', 'Gladion', 'Hau', 'Oak', 'Juniper', 'Leon', 'Goh', 'Chloe', 'Raihan', 'Liko', 'Roy', 'Dot', 'Friede', 'Paul', 'Trip', 'Alain', 'Tobias', 'Sawyer', 'Ritchie', 'Harrison', 'Morrison', 'Cameron'],
  rival: ['Hugh', 'Shauna', 'Tierno', 'Trevor', 'Carmine', 'Klara', 'Avery', 'Drew', 'Zoey', 'Ursula', 'Kenny', 'Blue', 'Gary', 'Silver', 'Brendan', 'Wally', 'Barry', 'Cheren', 'Bianca', 'N', 'Calem', 'Hau', 'Gladion', 'Hop', 'Marnie', 'Bede', 'Nemona', 'Arven', 'Kieran', 'Paul', 'Trip', 'Alain', 'Tobias', 'Sawyer', 'Ritchie', 'Harrison', 'Morrison', 'Cameron'],
};
for (const f of FAMOUS) f.tags = Object.keys(FAMOUS_TAG_LIST).filter(k => FAMOUS_TAG_LIST[k].includes(f.name));
// Optional packs of famous trainers from outside Pokémon, switched on in Advanced options when a league is created.
// Pack trainers can have a second signature type (spec2, optional); they turn up exactly as often as any other famous trainer.
const FAMOUS_PACKS = {
  mk: { name: 'Mortal Kombat Characters', tag: 'Mortal Kombat', desc: 'Fighters from across the Mortal Kombat series and its guest characters, each with two signature types.', trainers: [
    { name: 'Scorpion', cls: 'Netherrealm Specter', spec: 'Ghost', spec2: 'Fire', age: 34, g: 'm', team: ['Charcadet', ['Litwick', 'Houndour', 'Alolan Marowak', 'Sinistea']] },
    { name: 'Sub-Zero', cls: 'Lin Kuei Grandmaster', spec: 'Ice', spec2: 'Dark', age: 31, g: 'm', team: ['Sneasel', ['Frigibax', 'Snorunt', 'Cryogonal', 'Absol']] },
    { name: 'Raiden', cls: 'God of Thunder', spec: 'Electric', spec2: 'Flying', age: 40, g: 'm', team: ['Elekid', ['Wattrel', 'Mareep', 'Tynamo', 'Joltik']] },
    { name: 'Liu Kang', cls: 'Shaolin Champion', spec: 'Fighting', spec2: 'Fire', age: 25, g: 'm', team: ['Mienfoo', ['Chimchar', 'Tyrogue', 'Dratini']] },
    { name: 'Baraka', cls: 'Tarkatan Warrior', spec: 'Dark', spec2: 'Steel', age: 36, g: 'm', team: ['Pawniard', ['Scyther', 'Sandile', 'Carvanha', 'Honedge']] },
    { name: 'Johnny Cage', cls: 'Movie Star', spec: 'Fighting', spec2: 'Fairy', age: 29, g: 'm', team: ['Hawlucha', ['Meditite', 'Mime Jr.', 'Swirlix', 'Riolu']] },
    { name: 'Sonya Blade', cls: 'Special Forces Lieutenant', spec: 'Fighting', spec2: 'Steel', age: 27, g: 'f', team: ['Riolu', ['Timburr', 'Rookidee', 'Rufflet', 'Magnemite']] },
    { name: 'Kano', cls: 'Black Dragon Mercenary', spec: 'Dark', spec2: 'Fighting', age: 38, g: 'm', team: ['Scraggy', ['Pancham', 'Poochyena', 'Impidimp', 'Magnemite']] },
    { name: 'Reptile', cls: 'Zaterran Assassin', spec: 'Poison', spec2: 'Dragon', age: 30, g: 'm', team: ['Skrelp', ['Kecleon', 'Salandit', 'Croagunk', 'Ekans']] },
    { name: 'Goro', cls: 'Shokan Prince', spec: 'Fighting', spec2: 'Ground', age: 34, g: 'm', team: ['Machop', ['Makuhita', 'Rhyhorn', 'Larvitar', 'Mudbray']] },
    // Mortal Kombat II
    { name: 'Kung Lao', cls: 'Shaolin Monk', spec: 'Steel', spec2: 'Fighting', age: 26, g: 'm', team: ['Honedge', ['Klink', 'Riolu', 'Sawk', 'Bronzor']] },
    { name: 'Kitana', cls: 'Edenian Princess', spec: 'Fairy', spec2: 'Flying', age: 28, g: 'f', team: ['Togepi', ['Swablu', 'Ralts', 'Hoppip', 'Cutiefly']] },
    { name: 'Mileena', cls: 'Tarkatan Clone', spec: 'Dark', spec2: 'Fairy', age: 26, g: 'f', team: ['Mawile', ['Impidimp', 'Sableye', 'Carvanha', 'Nickit']] },
    { name: 'Jax', cls: 'Special Forces Major', spec: 'Steel', spec2: 'Ground', age: 37, g: 'm', team: ['Drilbur', ['Aron', 'Beldum', 'Crabrawler', 'Tinkatink']] },
    { name: 'Shao Kahn', cls: 'Emperor of Outworld', spec: 'Dark', spec2: 'Dragon', age: 40, g: 'm', team: ['Deino', ['Druddigon', 'Larvitar', 'Gible', 'Murkrow']] },
    { name: 'Kintaro', cls: 'Shokan General', spec: 'Fire', spec2: 'Fighting', age: 33, g: 'm', team: ['Litten', ['Tepig', 'Stufful', 'Throh', 'Growlithe']] },
    { name: 'Jade', cls: 'Edenian Bodyguard', spec: 'Grass', spec2: 'Fighting', age: 27, g: 'f', team: ['Shroomish', ['Chespin', 'Sprigatito', 'Snivy', 'Pansage']] },
    { name: 'Smoke', cls: 'Lin Kuei Warrior', spec: 'Poison', spec2: 'Steel', age: 30, g: 'm', team: ['Koffing', ['Varoom', 'Stunky', 'Trubbish', 'Grimer']] },
    { name: 'Noob Saibot', cls: 'Brotherhood of Shadow Wraith', spec: 'Ghost', spec2: 'Dark', age: 33, g: 'm', team: ['Duskull', ['Shuppet', 'Phantump', 'Purrloin', 'Greavard']] },
    // Mortal Kombat 3
    { name: 'Cyrax', cls: 'Lin Kuei Cyborg', spec: 'Steel', spec2: 'Electric', age: 32, g: 'm', team: ['Voltorb', ['Magnemite', 'Joltik', 'Spinarak', 'Tadbulb']] },
    { name: 'Sektor', cls: 'Lin Kuei Cyborg', spec: 'Steel', spec2: 'Fire', age: 34, g: 'm', team: ['Beldum', ['Sizzlipede', 'Remoraid', 'Rolycoly', 'Klink']] },
    { name: 'Nightwolf', cls: 'Matoka Shaman', spec: 'Rock', spec2: 'Psychic', age: 36, g: 'm', team: ['Rockruff', ['Natu', 'Growlithe', 'Elgyem', 'Baltoy']] },
    { name: 'Sindel', cls: 'Queen of Edenia', spec: 'Ghost', spec2: 'Flying', age: 40, g: 'f', team: ['Noibat', ['Drifloon', 'Whismur', 'Misdreavus', 'Hoothoot']] },
    { name: 'Stryker', cls: 'Riot Cop', spec: 'Normal', spec2: 'Fire', age: 35, g: 'm', team: ['Growlithe', ['Patrat', 'Lillipup', 'Litleo', 'Electrike']] },
    { name: 'Kabal', cls: 'Hookswords Vigilante', spec: 'Dark', spec2: 'Bug', age: 30, g: 'm', team: ['Nymble', ['Nincada', 'Galarian Zigzagoon', 'Shroodle', 'Sneasel']] },
    { name: 'Sheeva', cls: 'Shokan Queen', spec: 'Ground', spec2: 'Fighting', age: 32, g: 'f', team: ['Phanpy', ['Mankey', 'Hippopotas', 'Nidoran♀', 'Sandshrew']] },
    { name: 'Motaro', cls: 'Centaurian Warlord', spec: 'Fire', spec2: 'Ground', age: 38, g: 'm', team: ['Ponyta', ['Numel', 'Mudbray', 'Tauros', 'Sandile']] },
    // Ultimate Mortal Kombat 3
    { name: 'Rain', cls: 'Edenian Demigod', spec: 'Water', spec2: 'Electric', age: 29, g: 'm', team: ['Chinchou', ['Froakie', 'Wingull', 'Shellos', 'Tympole']] },
    { name: 'Ermac', cls: 'Soul-Fused Revenant', spec: 'Psychic', spec2: 'Dark', age: 33, g: 'm', team: ['Solosis', ['Inkay', 'Golett', 'Gothita', 'Yamask']] },
    // Mortal Kombat Mythologies: Sub-Zero
    { name: 'Quan Chi', cls: 'Netherrealm Sorcerer', spec: 'Ghost', spec2: 'Poison', age: 40, g: 'm', team: ['Galarian Yamask', ['Gastly', 'Litwick', 'Sandygast', 'Mareanie']] },
    { name: 'Shinnok', cls: 'Fallen Elder God', spec: 'Dark', spec2: 'Fire', age: 40, g: 'm', team: ['Houndour', ['Salandit', 'Litleo', 'Murkrow', 'Zorua']] },
    { name: 'Fujin', cls: 'God of Wind', spec: 'Flying', spec2: 'Dragon', age: 40, g: 'm', team: ['Bagon', ['Starly', 'Pidgey', 'Taillow', 'Swablu']] },
    { name: 'Sareena', cls: 'Netherrealm Demon', spec: 'Dark', spec2: 'Flying', age: 26, g: 'f', team: ['Vullaby', ['Murkrow', 'Purrloin', 'Inkay', 'Spritzee']] },
    { name: 'Kia', cls: 'Brotherhood of Shadow Assassin', spec: 'Poison', spec2: 'Dark', age: 25, g: 'f', team: ['Skorupi', ['Croagunk', 'Zubat', 'Shroodle', 'Venipede']] },
    { name: 'Jataaka', cls: 'Brotherhood of Shadow Assassin', spec: 'Ghost', spec2: 'Fighting', age: 28, g: 'f', team: ['Mankey', ['Frillish', 'Pumpkaboo', 'Timburr', 'Gastly']] },
    // Mortal Kombat 4
    { name: 'Reiko', cls: 'Outworld General', spec: 'Fighting', spec2: 'Psychic', age: 34, g: 'm', team: ['Ralts', ['Meditite', 'Tyrogue', "Galarian Farfetch'd", 'Croagunk']] },
    { name: 'Tanya', cls: 'Edenian Ambassador', spec: 'Fire', spec2: 'Psychic', age: 28, g: 'f', team: ['Fennekin', ['Fletchling', 'Darumaka', 'Galarian Ponyta', 'Slugma']] },
    { name: 'Jarek', cls: 'Black Dragon Enforcer', spec: 'Dark', spec2: 'Ground', age: 33, g: 'm', team: ['Sandile', ['Trapinch', 'Gligar', 'Poochyena', 'Nickit']] },
    { name: 'Kai', cls: 'White Lotus Monk', spec: 'Fighting', spec2: 'Water', age: 27, g: 'm', team: ['Poliwag', ['Lotad', 'Clobbopus', 'Makuhita', 'Mankey']] },
    { name: 'Meat', cls: 'Flesh Pit Experiment', spec: 'Ghost', spec2: 'Ground', age: 20, g: 'm', team: ['Cubone', ['Sandygast', 'Grimer', 'Ditto', 'Gulpin']] },
    // Mortal Kombat: Special Forces
    { name: 'Tremor', cls: 'Black Dragon Earthshaker', spec: 'Rock', spec2: 'Ground', age: 32, g: 'm', team: ['Roggenrola', ['Geodude', 'Diglett', 'Nacli', 'Onix']] },
    // Mortal Kombat: Deadly Alliance
    { name: "Bo' Rai Cho", cls: 'Drunken Master', spec: 'Fighting', spec2: 'Poison', age: 40, g: 'm', team: ['Croagunk', ['Gulpin', 'Spinda', 'Munchlax', 'Slakoth']] },
    { name: 'Drahmin', cls: 'Oni of the Netherrealm', spec: 'Ghost', spec2: 'Steel', age: 38, g: 'm', team: ['Honedge', ['Bronzor', 'Combee', 'Golett', 'Sinistea']] },
    { name: 'Frost', cls: 'Lin Kuei Prodigy', spec: 'Ice', spec2: 'Steel', age: 22, g: 'f', team: ['Alolan Sandshrew', ['Snorunt', 'Snom', 'Cubchoo', 'Bergmite']] },
    { name: 'Hsu Hao', cls: 'Red Dragon Strongman', spec: 'Fire', spec2: 'Electric', age: 37, g: 'm', team: ['Magby', ['Electrike', 'Rolycoly', 'Makuhita', 'Charcadet']] },
    { name: 'Kenshi', cls: 'Blind Swordsman', spec: 'Psychic', spec2: 'Steel', age: 32, g: 'm', team: ['Bronzor', ['Honedge', 'Abra', 'Hatenna', 'Elgyem']] },
    { name: 'Li Mei', cls: 'Outworld Champion', spec: 'Fighting', spec2: 'Bug', age: 21, g: 'f', team: ['Heracross', ['Combee', 'Kricketot', 'Riolu', 'Pawmi']] },
    { name: 'Mavado', cls: 'Red Dragon Leader', spec: 'Steel', spec2: 'Flying', age: 34, g: 'm', team: ['Rookidee', ['Skarmory', 'Klink', 'Spinarak', 'Pidove']] },
    { name: 'Nitara', cls: 'Vaeternian Vampire', spec: 'Flying', spec2: 'Poison', age: 30, g: 'f', team: ['Zubat', ['Woobat', 'Gligar', 'Noibat', 'Vullaby']] },
    { name: 'Blaze', cls: 'Fire Elemental', spec: 'Fire', spec2: 'Rock', age: 40, g: 'm', team: ['Slugma', ['Rolycoly', 'Numel', 'Charmander', 'Litwick']] },
    { name: 'Mokap', cls: 'Motion Capture Actor', spec: 'Normal', spec2: 'Electric', age: 29, g: 'm', team: ['Porygon', ['Helioptile', 'Smeargle', 'Pawmi', 'Ditto']] },
    { name: 'Moloch', cls: 'Oni Warlord', spec: 'Rock', spec2: 'Fighting', age: 40, g: 'm', team: ['Timburr', ['Rhyhorn', 'Binacle', 'Cranidos', 'Onix']] },
    // Mortal Kombat: Deception
    { name: 'Ashrah', cls: 'Redeemed Demon', spec: 'Fairy', spec2: 'Steel', age: 27, g: 'f', team: ['Tinkatink', ['Honedge', 'Flabébé', 'Snubbull', 'Klefki']] },
    { name: 'Darrius', cls: 'Seidan Resistance Leader', spec: 'Electric', spec2: 'Fighting', age: 35, g: 'm', team: ['Pawmi', ['Toxel', 'Blitzle', 'Crabrawler', 'Shinx']] },
    { name: 'Hotaru', cls: 'Seidan General', spec: 'Fire', spec2: 'Bug', age: 33, g: 'm', team: ['Larvesta', ['Sizzlipede', 'Volbeat', 'Illumise', 'Surskit']] },
    { name: 'Dairou', cls: 'Mercenary Assassin', spec: 'Dark', spec2: 'Rock', age: 35, g: 'm', team: ['Larvitar', ['Nickit', 'Rolycoly', 'Nacli', 'Pawniard']] },
    { name: 'Havik', cls: 'Cleric of Chaos', spec: 'Poison', spec2: 'Psychic', age: 31, g: 'm', team: ['Galarian Slowpoke', ['Spinda', 'Glimmet', 'Mime Jr.', 'Croagunk']] },
    { name: 'Kira', cls: 'Black Dragon Recruit', spec: 'Fire', spec2: 'Poison', age: 25, g: 'f', team: ['Salandit', ['Charmander', 'Torchic', 'Vulpix', 'Koffing']] },
    { name: 'Kobra', cls: 'Black Dragon Brawler', spec: 'Poison', spec2: 'Fighting', age: 26, g: 'm', team: ['Ekans', ['Croagunk', 'Seviper', 'Mankey', 'Shroodle']] },
    { name: 'Onaga', cls: 'Dragon King', spec: 'Dragon', spec2: 'Ground', age: 40, g: 'm', team: ['Gible', ['Axew', 'Jangmo-o', 'Trapinch', 'Dratini']] },
    { name: 'Shujinko', cls: 'Earthrealm Wanderer', spec: 'Normal', spec2: 'Fighting', age: 30, g: 'm', team: ['Eevee', ['Smeargle', 'Meditite', 'Tyrogue', 'Stufful']] },
    // Mortal Kombat: Armageddon
    { name: 'Daegon', cls: 'Red Dragon Founder', spec: 'Dragon', spec2: 'Fire', age: 30, g: 'm', team: ['Axew', ['Turtonator', 'Dreepy', 'Houndour', 'Salandit']] },
    { name: 'Taven', cls: 'Edenian Demigod', spec: 'Fire', spec2: 'Dragon', age: 28, g: 'm', team: ['Charmander', ['Fuecoco', 'Growlithe', 'Jangmo-o', 'Litleo']] },
    // Mortal Kombat (2011)
    { name: 'Skarlet', cls: 'Blood Mage', spec: 'Water', spec2: 'Dark', age: 26, g: 'f', team: ['Corphish', ['Carvanha', 'Basculin', 'Frillish', 'Spritzee']] },
    // Mortal Kombat X
    { name: 'Cassie Cage', cls: 'Special Forces Sergeant', spec: 'Fairy', spec2: 'Fighting', age: 22, g: 'f', team: ['Snubbull', ['Riolu', 'Hawlucha', 'Swirlix', 'Fidough']] },
    { name: "D'Vorah", cls: 'Kytinn Hive Mother', spec: 'Bug', spec2: 'Poison', age: 30, g: 'f', team: ['Weedle', ['Combee', 'Venonat', 'Skorupi', 'Joltik']] },
    { name: 'Erron Black', cls: 'Outworld Gunslinger', spec: 'Ground', spec2: 'Steel', age: 38, g: 'm', team: ['Silicobra', ['Cufant', 'Clauncher', 'Mudbray', 'Rufflet']] },
    { name: 'Ferra/Torr', cls: 'Outworld Brute Pair', spec: 'Normal', spec2: 'Dark', age: 25, g: 'f', team: ['Teddiursa', ['Stufful', 'Zangoose', 'Purrloin', 'Pancham']] },
    { name: 'Jacqui Briggs', cls: 'Special Forces Specialist', spec: 'Steel', spec2: 'Fighting', age: 21, g: 'f', team: ['Crabrawler', ['Aron', 'Tinkatink', 'Makuhita', 'Riolu']] },
    { name: 'Kotal Kahn', cls: 'Osh-Tekk Emperor', spec: 'Fire', spec2: 'Grass', age: 38, g: 'm', team: ['Litleo', ['Capsakid', 'Sunkern', 'Chespin', 'Larvesta']] },
    { name: 'Kung Jin', cls: 'Shaolin Archer', spec: 'Fighting', spec2: 'Grass', age: 24, g: 'm', team: ['Rowlet', ['Pikipek', 'Mienfoo', 'Fletchling', 'Pansage']] },
    { name: 'Takeda', cls: 'Shirai Ryu Ninja', spec: 'Psychic', spec2: 'Fighting', age: 22, g: 'm', team: ['Meditite', ['Hatenna', 'Litwick', 'Tangela', 'Mienfoo']] },
    // Guest fighters (Mortal Kombat vs. DC Universe characters left out)
    // Mortal Kombat (2011)
    { name: 'Freddy Krueger', cls: 'Dream Demon', spec: 'Ghost', spec2: 'Psychic', age: 40, g: 'm', team: ['Drowzee', ['Munna', 'Gastly', 'Misdreavus', 'Sneasel']] },
    { name: 'Kratos', cls: 'Ghost of Sparta', spec: 'Fighting', spec2: 'Ice', age: 40, g: 'm', team: ['Machop', ['Cubchoo', 'Snover', 'Crabrawler', 'Spheal']] },
    // Mortal Kombat X
    { name: 'Jason Voorhees', cls: 'Crystal Lake Slasher', spec: 'Ghost', spec2: 'Water', age: 40, g: 'm', team: ['Frillish', ['Honedge', 'Phantump', 'Wooper', 'Shellos']] },
    { name: 'Predator', cls: 'Yautja Hunter', spec: 'Dark', spec2: 'Electric', age: 38, g: 'm', team: ['Shinx', ['Kecleon', 'Nickit', 'Sneasel', 'Pawniard']] },
    { name: 'Alien', cls: 'Xenomorph', spec: 'Poison', spec2: 'Bug', age: 25, g: 'f', team: ['Venipede', ['Skrelp', 'Mareanie', 'Nincada', 'Wimpod']] },
    { name: 'Leatherface', cls: 'Chainsaw Butcher', spec: 'Steel', spec2: 'Normal', age: 35, g: 'm', team: ['Varoom', ['Lechonk', 'Klink', 'Pawniard', 'Zigzagoon']] },
    // Mortal Kombat 11
    { name: 'T-800', cls: 'Cyberdyne Infiltrator', spec: 'Steel', spec2: 'Psychic', age: 35, g: 'm', team: ['Beldum', ['Magnemite', 'Bronzor', 'Klink', 'Porygon']] },
    { name: 'Spawn', cls: 'Hellspawn', spec: 'Dark', spec2: 'Ghost', age: 35, g: 'm', team: ['Murkrow', ['Sableye', 'Shuppet', 'Pawniard', 'Spinarak']] },
    { name: 'RoboCop', cls: 'Detroit Police Cyborg', spec: 'Steel', spec2: 'Electric', age: 38, g: 'm', team: ['Magnemite', ['Patrat', 'Klink', 'Aron', 'Electrike']] },
    { name: 'Rambo', cls: 'Green Beret', spec: 'Grass', spec2: 'Dark', age: 40, g: 'm', team: ['Seedot', ['Sprigatito', 'Rowlet', 'Pikipek', 'Poochyena']] },
    // Mortal Kombat 1 (2023)
    { name: 'Omni-Man', cls: 'Viltrumite Conqueror', spec: 'Flying', spec2: 'Fighting', age: 40, g: 'm', team: ['Flamigo', ['Hawlucha', 'Machop', 'Starly', 'Taillow']] },
    { name: 'Homelander', cls: 'Vought Supe', spec: 'Flying', spec2: 'Fire', age: 40, g: 'm', team: ['Fletchling', ['Miltank', 'Starly', 'Hoothoot', 'Torchic']] },
    { name: 'Peacemaker', cls: 'Vigilante for Peace', spec: 'Normal', spec2: 'Flying', age: 36, g: 'm', team: ['Rufflet', ['Skarmory', 'Clauncher', 'Bronzor', 'Tandemaus']] },
    { name: 'Ghostface', cls: 'Woodsboro Killer', spec: 'Normal', spec2: 'Ghost', age: 30, g: 'm', team: ['Hisuian Zorua', ['Rotom', 'Phantump', 'Honedge', 'Zubat']] },
    { name: 'T-1000', cls: 'Liquid Metal Infiltrator', spec: 'Steel', spec2: 'Water', age: 30, g: 'm', team: ['Piplup', ['Ditto', 'Klink', 'Goomy', 'Tinkatink']] },
    { name: 'Conan', cls: 'Cimmerian Barbarian', spec: 'Fighting', spec2: 'Steel', age: 35, g: 'm', team: ['Sawk', ['Honedge', 'Pawniard', 'Tauros', 'Throh']] },
    { name: 'Shang Tsung', cls: 'Soul-Stealing Sorcerer', spec: 'Psychic', spec2: 'Ghost', age: 40, g: 'm', team: ['Abra', ['Spiritomb', 'Ditto', 'Zorua', 'Gastly']] },
  ] },
  wwe: { name: 'WWE Superstars', tag: 'WWE', desc: 'WWE Superstars from Raw, SmackDown and NXT, and every world champion of the last five years.', trainers: [
    { name: 'Roman Reigns', cls: 'Tribal Chief', spec: 'Dark', age: 41, g: 'm', team: ['Pawniard', ['Carvanha', 'Tyrunt', 'Wailmer', 'Poochyena']] },
    { name: 'Cody Rhodes', cls: 'American Nightmare', spec: 'Fighting', age: 41, g: 'm', team: ['Tyrogue', ['Rufflet', 'Growlithe', 'Litleo', 'Makuhita']] },
    { name: 'CM Punk', cls: 'Best in the World', spec: 'Electric', spec2: 'Poison', age: 47, g: 'm', team: ['Toxel', ['Scraggy', 'Croagunk', 'Murkrow', 'Grimer']] },
    { name: 'Gunther', cls: 'Ring General', spec: 'Fighting', age: 39, g: 'm', team: ['Makuhita', ['Throh', 'Cufant', 'Bergmite', 'Rhyhorn']] },
    { name: 'Sami Zayn', cls: 'Underdog from the Underground', spec: 'Normal', spec2: 'Fighting', age: 42, g: 'm', team: ['Stufful', ['Bidoof', 'Lillipup', 'Mankey', 'Rockruff']] },
    { name: 'Bron Breakker', cls: 'Steiner Powerhouse', spec: 'Electric', spec2: 'Fighting', age: 28, g: 'm', team: ['Yamper', ['Electrike', 'Pawmi', 'Tauros', 'Makuhita']] },
    { name: 'Penta', cls: 'Cero Miedo Luchador', spec: 'Fighting', spec2: 'Ghost', age: 41, g: 'm', team: ['Mankey', ['Hawlucha', 'Golett', 'Cubone', 'Sandygast']] },
    { name: 'Liv Morgan', cls: 'La Güerita', spec: 'Dark', spec2: 'Fairy', age: 32, g: 'f', team: ['Impidimp', ['Swirlix', 'Spritzee', 'Purrloin', 'Sneasel']] },
    { name: 'Iyo Sky', cls: 'Genius of the Sky', spec: 'Flying', age: 36, g: 'f', team: ['Swablu', ['Hoothoot', 'Pikipek', 'Natu', 'Wingull']] },
    { name: 'Tiffany Stratton', cls: 'Center of the Universe', spec: 'Fairy', age: 27, g: 'f', team: ['Ralts', ['Meowth', 'Swirlix', 'Flabébé', 'Snubbull']] },
    { name: 'Otis', cls: 'Human Caterpillar', spec: 'Normal', spec2: 'Bug', age: 34, g: 'm', team: ['Munchlax', ['Makuhita', 'Lechonk', 'Teddiursa', 'Wooper']] },
    { name: "Je'Von Evans", cls: 'Young OG', spec: 'Flying', spec2: 'Electric', age: 22, g: 'm', team: ['Wattrel', ['Taillow', 'Emolga', 'Pichu', 'Hawlucha']] },
    { name: 'Jey Uso', cls: 'Main Event', spec: 'Water', spec2: 'Fighting', age: 41, g: 'm', team: ['Wailmer', ['Buizel', 'Wingull', 'Clobbopus', 'Chewtle']] },
    { name: 'Trick Williams', cls: 'Whoop That', spec: 'Dark', age: 32, g: 'm', team: ['Zorua', ['Nickit', 'Poochyena', 'Scraggy', 'Mankey']] },
    { name: 'Oba Femi', cls: 'The Ruler', spec: 'Rock', age: 28, g: 'm', team: ['Nacli', ['Roggenrola', 'Rhyhorn', 'Tyrunt', 'Makuhita']] },
    { name: 'Jade Cargill', cls: 'Storm', spec: 'Electric', age: 34, g: 'f', team: ['Shinx', ['Wattrel', 'Blitzle', 'Tadbulb', 'Grubbin']] },
    { name: 'Rey Mysterio', cls: 'Master of the 619', spec: 'Fighting', spec2: 'Flying', age: 51, g: 'm', team: ['Hawlucha', ['Riolu', 'Pikipek', 'Taillow', 'Mime Jr.']] },
    { name: 'Sol Ruca', cls: 'Sol Snatcher', spec: 'Water', age: 27, g: 'f', team: ['Finizen', ['Wingull', 'Buizel', 'Corsola', 'Chewtle']] },
    { name: 'Brock Lesnar', cls: 'Beast Incarnate', spec: 'Fighting', spec2: 'Ground', age: 49, g: 'm', team: ['Mudbray', ['Machop', 'Tauros', 'Rhyhorn', 'Teddiursa']] },
    { name: 'Bobby Lashley', cls: 'The All Mighty', spec: 'Fighting', spec2: 'Steel', age: 50, g: 'm', team: ['Aron', ['Timburr', 'Cufant', 'Pancham', 'Makuhita']] },
    { name: 'John Cena', cls: 'Cenation Leader', spec: 'Fighting', spec2: 'Ghost', age: 49, g: 'm', team: ['Golett', ['Kecleon', 'Greavard', 'Tyrogue', 'Crabrawler']] },
    { name: 'Seth Rollins', cls: 'The Visionary', spec: 'Dark', spec2: 'Psychic', age: 40, g: 'm', team: ['Inkay', ['Zorua', 'Espurr', 'Abra', 'Sneasel']] },
    { name: 'Drew McIntyre', cls: 'Scottish Warrior', spec: 'Fighting', spec2: 'Dragon', age: 41, g: 'm', team: ['Jangmo-o', ['Honedge', 'Lapras', 'Druddigon', 'Sawk']] },
    { name: 'Damian Priest', cls: 'Archer of Infamy', spec: 'Ghost', spec2: 'Dark', age: 44, g: 'm', team: ['Rowlet', ['Sableye', 'Absol', 'Duskull', 'Poochyena']] },
    { name: 'Becky Lynch', cls: 'The Man', spec: 'Fire', spec2: 'Fighting', age: 39, g: 'f', team: ['Torchic', ['Vulpix', 'Darumaka', 'Riolu', 'Fletchling']] },
    { name: 'Charlotte Flair', cls: 'The Queen', spec: 'Fairy', spec2: 'Flying', age: 40, g: 'f', team: ['Hatenna', ['Spritzee', 'Rufflet', 'Cutiefly', 'Clefairy']] },
    { name: 'Ronda Rousey', cls: 'Rowdy', spec: 'Fighting', age: 39, g: 'f', team: ['Throh', ['Clobbopus', 'Mienfoo', 'Meditite', 'Tyrogue']] },
    { name: 'Bianca Belair', cls: 'The EST', spec: 'Fighting', spec2: 'Electric', age: 37, g: 'f', team: ['Pawmi', ['Blitzle', 'Riolu', 'Electrike', 'Tangela']] },
    { name: 'Asuka', cls: 'Empress of Tomorrow', spec: 'Poison', spec2: 'Fighting', age: 45, g: 'f', team: ['Koffing', ['Croagunk', 'Shroodle', 'Mankey', 'Venipede']] },
    { name: 'Bayley', cls: 'Role Model', spec: 'Normal', spec2: 'Fairy', age: 37, g: 'f', team: ['Stufful', ['Igglybuff', 'Fidough', 'Swirlix', 'Drifloon']] },
    { name: 'Nia Jax', cls: 'Irresistible Force', spec: 'Ground', spec2: 'Water', age: 42, g: 'f', team: ['Hippopotas', ['Wooper', 'Mudkip', 'Barboach', 'Wailmer']] },
    { name: 'Rhea Ripley', cls: 'The Eradicator', spec: 'Dark', spec2: 'Fighting', age: 30, g: 'f', team: ['Scraggy', ['Sneasel', 'Pancham', 'Murkrow', 'Kangaskhan']] },
    { name: 'Naomi', cls: 'The Glow', spec: 'Electric', spec2: 'Fairy', age: 38, g: 'f', team: ['Mareep', ['Chinchou', 'Morelull', 'Dedenne', 'Pichu']] },
    { name: 'Stephanie Vaquer', cls: 'La Primera', spec: 'Dark', spec2: 'Flying', age: 33, g: 'f', team: ['Vullaby', ['Murkrow', 'Impidimp', 'Hoothoot', 'Purrloin']] },
    { name: 'Chelsea Green', cls: 'Hot Mess', spec: 'Grass', spec2: 'Fairy', age: 35, g: 'f', team: ['Bounsweet', ['Cottonee', 'Fomantis', 'Hoppip', 'Smoliv']] },
    // v175: today's top names and all-time legends (the pack reaches 50)
    { name: 'Randy Orton', cls: 'The Viper', spec: 'Poison', spec2: 'Dark', age: 46, g: 'm', team: ['Seviper', ['Ekans', 'Sneasel', 'Purrloin', 'Skorupi']] },
    { name: 'AJ Styles', cls: 'Phenomenal', spec: 'Fighting', spec2: 'Flying', age: 49, g: 'm', team: ['Hawlucha', ['Tyrogue', 'Mienfoo', 'Pikipek', 'Riolu']] },
    { name: 'LA Knight', cls: 'The Megastar', spec: 'Normal', spec2: 'Electric', age: 43, g: 'm', team: ['Whismur', ['Electrike', 'Pichu', 'Bidoof', 'Shinx']] },
    { name: 'Logan Paul', cls: 'The Maverick', spec: 'Electric', spec2: 'Flying', age: 31, g: 'm', team: ['Rotom', ['Wattrel', 'Emolga', 'Smeargle', 'Hoothoot']] },
    { name: 'Kevin Owens', cls: 'The Prizefighter', spec: 'Fighting', spec2: 'Dark', age: 42, g: 'm', team: ['Pancham', ['Scraggy', 'Makuhita', 'Teddiursa', 'Croagunk']] },
    { name: 'Dominik Mysterio', cls: 'WWE Superstar', spec: 'Dark', spec2: 'Fighting', age: 29, g: 'm', team: ['Hawlucha', ['Zorua', 'Sneasel', 'Poochyena', 'Riolu']] },
    { name: 'Bronson Reed', cls: 'Auszilla', spec: 'Rock', spec2: 'Ground', age: 37, g: 'm', team: ['Larvitar', ['Wailmer', 'Rhyhorn', 'Phanpy', 'Roggenrola']] },
    { name: 'Chad Gable', cls: 'WWE Superstar', spec: 'Fighting', spec2: 'Normal', age: 40, g: 'm', team: ['Throh', ['Hawlucha', 'Clobbopus', 'Machop', 'Mankey']] },
    { name: 'Alexa Bliss', cls: 'The Goddess', spec: 'Fairy', spec2: 'Ghost', age: 35, g: 'f', team: ['Mimikyu', ['Shuppet', 'Sinistea', 'Togepi', 'Flabébé']] },
    { name: 'Raquel Rodriguez', cls: 'Big Mami Cool', spec: 'Ground', spec2: 'Dark', age: 35, g: 'f', team: ['Sandile', ['Trapinch', 'Mudbray', 'Nickit', 'Gligar']] },
    { name: 'The Undertaker', cls: 'Deadman', spec: 'Ghost', spec2: 'Dark', age: 61, g: 'm', team: ['Yamask', ['Litwick', 'Duskull', 'Murkrow', 'Gastly']] },
    { name: 'Steve Austin', cls: 'Stone Cold', spec: 'Rock', spec2: 'Normal', age: 61, g: 'm', team: ['Silicobra', ['Tauros', 'Geodude', 'Mankey', 'Sandshrew']] },
    { name: 'The Rock', cls: "People's Champion", spec: 'Rock', spec2: 'Normal', age: 54, g: 'm', team: ['Tauros', ['Rockruff', 'Bonsly', 'Rolycoly', 'Nosepass']] },
    { name: 'Triple H', cls: 'The Game', spec: 'Steel', spec2: 'Dark', age: 57, g: 'm', team: ['Tinkatink', ['Pawniard', 'Inkay', 'Bronzor', 'Houndour']] },
    { name: 'Shawn Michaels', cls: 'Heartbreak Kid', spec: 'Fighting', spec2: 'Fairy', age: 61, g: 'm', team: ['Tyrogue', ['Buneary', 'Luvdisc', 'Snubbull', 'Mienfoo']] },
  ] },
  nba: { name: 'NBA Superstars', tag: 'NBA', desc: "NBA stars past and present: recent MVPs and Finals MVPs, today's stars and all-time greats.", trainers: [
    { name: 'Shai Gilgeous-Alexander', cls: 'NBA Champion', spec: 'Electric', spec2: 'Dark', age: 28, g: 'm', team: ['Shinx', ['Zorua', 'Pawniard', 'Joltik', 'Elekid']] },
    { name: 'Nikola Jokić', cls: 'The Joker', spec: 'Psychic', spec2: 'Normal', age: 31, g: 'm', team: ['Galarian Ponyta', ['Munchlax', 'Abra', 'Slowpoke', 'Tauros']] },
    { name: 'Joel Embiid', cls: 'The Process', spec: 'Fighting', spec2: 'Ground', age: 32, g: 'm', team: ['Rhyhorn', ['Makuhita', 'Hippopotas', 'Timburr', 'Cubone']] },
    { name: 'Giannis Antetokounmpo', cls: 'Greek Freak', spec: 'Grass', spec2: 'Fighting', age: 31, g: 'm', team: ['Deerling', ['Skiddo', 'Chespin', 'Riolu', 'Tauros']] },
    { name: 'James Harden', cls: 'The Beard', spec: 'Dark', spec2: 'Fire', age: 37, g: 'm', team: ['Litleo', ['Houndour', 'Zorua', 'Purrloin', 'Sneasel']] },
    { name: 'Jalen Brunson', cls: 'Captain Clutch', spec: 'Fighting', spec2: 'Steel', age: 29, g: 'm', team: ['Riolu', ['Mankey', 'Meditite', 'Klink', 'Bronzor']] },
    { name: 'LeBron James', cls: 'King James', spec: 'Steel', spec2: 'Fighting', age: 41, g: 'm', team: ['Pawniard', ['Riolu', 'Tyrogue', 'Cufant', 'Litleo']] },
    { name: 'Kobe Bryant', cls: 'Black Mamba', spec: 'Poison', spec2: 'Dark', age: 41, g: 'm', team: ['Seviper', ['Ekans', 'Croagunk', 'Sneasel', 'Zubat']] },
    { name: "Shaquille O'Neal", cls: 'Big Diesel', spec: 'Steel', spec2: 'Normal', age: 54, g: 'm', team: ['Aron', ['Munchlax', 'Cufant', 'Wailmer', 'Rhyhorn']] },
    { name: 'Michael Jordan', cls: 'His Airness', spec: 'Flying', spec2: 'Fighting', age: 63, g: 'm', team: ['Hawlucha', ['Rufflet', 'Tauros', 'Riolu', 'Tyrogue']] },
    { name: 'Stephen Curry', cls: 'The Chef', spec: 'Water', spec2: 'Fairy', age: 38, g: 'm', team: ['Remoraid', ['Horsea', 'Popplio', 'Marill', 'Psyduck']] },
    { name: 'Magic Johnson', cls: 'Showtime', spec: 'Psychic', spec2: 'Fairy', age: 66, g: 'm', team: ['Ralts', ['Mime Jr.', 'Hatenna', 'Clefairy', 'Natu']] },
    { name: 'Jaylen Brown', cls: 'NBA Champion', spec: 'Psychic', spec2: 'Fighting', age: 29, g: 'm', team: ['Meditite', ['Ralts', 'Elgyem', 'Riolu', 'Natu']] },
    { name: 'Kawhi Leonard', cls: 'The Klaw', spec: 'Dark', spec2: 'Steel', age: 34, g: 'm', team: ['Sneasel', ['Scyther', 'Krabby', 'Purrloin', 'Skarmory']] },
    { name: 'Kevin Durant', cls: 'Slim Reaper', spec: 'Ghost', spec2: 'Dragon', age: 37, g: 'm', team: ['Dreepy', ['Duskull', 'Honedge', 'Phantump', 'Noibat']] },
    { name: 'Luka Dončić', cls: 'The Don', spec: 'Dragon', spec2: 'Psychic', age: 27, g: 'm', team: ['Dratini', ['Goomy', 'Swablu', 'Spoink', 'Sigilyph']] },
    { name: 'Victor Wembanyama', cls: 'The Alien', spec: 'Psychic', spec2: 'Steel', age: 22, g: 'm', team: ['Elgyem', ['Beldum', 'Staryu', 'Bronzor', 'Girafarig']] },
    { name: 'Anthony Edwards', cls: 'Ant-Man', spec: 'Bug', spec2: 'Fighting', age: 24, g: 'm', team: ['Durant', ['Heracross', 'Wimpod', 'Rockruff', 'Nincada']] },
    { name: 'Jayson Tatum', cls: 'NBA Champion', spec: 'Grass', spec2: 'Fighting', age: 28, g: 'm', team: ['Chespin', ['Grookey', 'Seedot', 'Mienfoo', 'Snivy']] },
    { name: 'Tim Duncan', cls: 'The Big Fundamental', spec: 'Water', spec2: 'Steel', age: 50, g: 'm', team: ['Piplup', ['Shellder', 'Bronzor', 'Squirtle', 'Nosepass']] },
    { name: 'Larry Bird', cls: 'Hick from French Lick', spec: 'Normal', spec2: 'Flying', age: 69, g: 'm', team: ['Starly', ['Pidgey', 'Doduo', 'Chatot', 'Pikipek']] },
    { name: 'Kareem Abdul-Jabbar', cls: 'Captain Hook', spec: 'Fighting', spec2: 'Rock', age: 79, g: 'm', team: ['Mienfoo', ['Kabuto', 'Onix', 'Tyrogue', 'Roggenrola']] },
    { name: 'Hakeem Olajuwon', cls: 'The Dream', spec: 'Psychic', spec2: 'Ground', age: 63, g: 'm', team: ['Munna', ['Baltoy', 'Spinda', 'Phanpy', 'Drilbur']] },
    { name: 'Dirk Nowitzki', cls: 'German Wunderkind', spec: 'Steel', spec2: 'Flying', age: 47, g: 'm', team: ['Flamigo', ['Rookidee', 'Skarmory', 'Ponyta', 'Magnemite']] },
    // v175: more of today's stars and all-time legends (the pack reaches 50)
    { name: 'Cade Cunningham', cls: 'All-NBA', spec: 'Steel', spec2: 'Fighting', age: 24, g: 'm', team: ['Varoom', ['Klink', 'Machop', 'Magnemite', 'Riolu']] },
    { name: 'Donovan Mitchell', cls: 'Spida', spec: 'Bug', spec2: 'Electric', age: 29, g: 'm', team: ['Joltik', ['Spinarak', 'Tarountula', 'Grubbin', 'Shinx']] },
    { name: 'Tyrese Maxey', cls: 'All-Star', spec: 'Electric', spec2: 'Normal', age: 25, g: 'm', team: ['Helioptile', ['Pachirisu', 'Emolga', 'Tynamo', 'Zigzagoon']] },
    { name: 'Karl-Anthony Towns', cls: 'NBA Champion', spec: 'Rock', spec2: 'Water', age: 30, g: 'm', team: ['Tirtouga', ['Binacle', 'Corsola', 'Omanyte', 'Relicanth']] },
    { name: 'Ja Morant', cls: 'All-Star', spec: 'Flying', spec2: 'Electric', age: 26, g: 'm', team: ['Wattrel', ['Hawlucha', 'Teddiursa', 'Rufflet', 'Taillow']] },
    { name: 'Devin Booker', cls: 'All-Star', spec: 'Fire', spec2: 'Ground', age: 29, g: 'm', team: ['Fletchling', ['Larvesta', 'Numel', 'Sandile', 'Trapinch']] },
    { name: 'Kyrie Irving', cls: 'Uncle Drew', spec: 'Fairy', spec2: 'Psychic', age: 34, g: 'm', team: ['Mime Jr.', ['Slowpoke', 'Snubbull', 'Hatenna', 'Wynaut']] },
    { name: 'Damian Lillard', cls: 'All-Star', spec: 'Dark', spec2: 'Flying', age: 35, g: 'm', team: ['Hoothoot', ['Noibat', 'Murkrow', 'Purrloin', 'Poochyena']] },
    { name: 'Anthony Davis', cls: 'The Brow', spec: 'Steel', spec2: 'Ground', age: 33, g: 'm', team: ['Drilbur', ['Onix', 'Shieldon', 'Mawile', 'Diglett']] },
    { name: 'Tyrese Haliburton', cls: 'All-Star', spec: 'Normal', spec2: 'Psychic', age: 26, g: 'm', team: ['Cyclizar', ['Drowzee', 'Lillipup', 'Indeedee', 'Chingling']] },
    { name: 'Chet Holmgren', cls: 'NBA Champion', spec: 'Electric', spec2: 'Ghost', age: 24, g: 'm', team: ['Rotom', ['Sinistea', 'Elekid', 'Litwick', 'Voltorb']] },
    { name: 'Cooper Flagg', cls: 'Rookie of the Year', spec: 'Ice', spec2: 'Normal', age: 19, g: 'm', team: ['Snorunt', ['Corphish', 'Cubchoo', 'Deerling', 'Skwovet']] },
    { name: 'Bill Russell', cls: 'Lord of the Rings', spec: 'Grass', spec2: 'Steel', age: 88, g: 'm', team: ['Ferroseed', ['Bulbasaur', 'Exeggcute', 'Klefki', 'Tropius']] },
    { name: 'Wilt Chamberlain', cls: 'The Big Dipper', spec: 'Normal', spec2: 'Fighting', age: 63, g: 'm', team: ['Munchlax', ['Tyrogue', 'Clefairy', 'Bouffalant', 'Komala']] },
    { name: 'Kevin Garnett', cls: 'The Big Ticket', spec: 'Dark', spec2: 'Grass', age: 50, g: 'm', team: ['Poochyena', ['Seedot', 'Sprigatito', 'Mankey', 'Pawniard']] },
    { name: 'Allen Iverson', cls: 'The Answer', spec: 'Dark', spec2: 'Electric', age: 50, g: 'm', team: ['Morpeko', ['Zorua', 'Electrike', 'Stunky', 'Pichu']] },
    { name: 'Dwyane Wade', cls: 'Flash', spec: 'Electric', spec2: 'Fire', age: 44, g: 'm', team: ['Charmander', ['Magby', 'Elekid', 'Eevee', 'Litleo']] },
    { name: 'Dennis Rodman', cls: 'The Worm', spec: 'Bug', spec2: 'Poison', age: 65, g: 'm', team: ['Wurmple', ['Scatterbug', 'Skorupi', 'Venonat', 'Ekans']] },
    { name: 'Scottie Pippen', cls: 'NBA Champion', spec: 'Normal', spec2: 'Steel', age: 60, g: 'm', team: ['Tauros', ['Lillipup', 'Magnemite', 'Galarian Meowth', 'Tinkatink']] },
    { name: 'Charles Barkley', cls: 'Round Mound of Rebound', spec: 'Ground', spec2: 'Normal', age: 63, g: 'm', team: ['Bunnelby', ['Swinub', 'Whismur', 'Sandshrew', 'Gligar']] },
    { name: 'Karl Malone', cls: 'The Mailman', spec: 'Ice', spec2: 'Flying', age: 62, g: 'm', team: ['Delibird', ['Pidove', 'Wingull', 'Snover', 'Spheal']] },
    { name: 'Chris Paul', cls: 'Point God', spec: 'Psychic', spec2: 'Normal', age: 41, g: 'm', team: ['Abra', ['Porygon', 'Smoochum', "Farfetch'd", 'Stantler']] },
    { name: 'Russell Westbrook', cls: 'Mr. Triple-Double', spec: 'Fighting', spec2: 'Electric', age: 37, g: 'm', team: ['Mankey', ['Shinx', 'Toxel', 'Croagunk', 'Electrike']] },
    { name: 'Steve Nash', cls: 'Captain Canada', spec: 'Water', spec2: 'Psychic', age: 52, g: 'm', team: ['Psyduck', ['Natu', 'Scorbunny', 'Seel', 'Chingling']] },
    { name: 'Julius Erving', cls: 'The Doctor', spec: 'Normal', spec2: 'Flying', age: 76, g: 'm', team: ['Audino', ['Happiny', 'Swablu', 'Hawlucha', 'Rufflet']] },
    { name: 'Isiah Thomas', cls: 'Bad Boy', spec: 'Dark', spec2: 'Fighting', age: 65, g: 'm', team: ['Pancham', ['Pawniard', 'Galarian Zigzagoon', 'Houndour', 'Croagunk']] },
  ] },
};
for (const [k, p] of Object.entries(FAMOUS_PACKS)) { FAMOUS_TAG_LABELS[k] = FAMOUS_TAG_PLURAL[k] = p.tag; for (const f of p.trainers) { f.pack = k; f.tags = [k]; FAMOUS.push(f); } }
Object.assign(FAMOUS_TRAITS, { 'Shai Gilgeous-Alexander': 'clutch', 'Nikola Jokić': 'steady', 'Joel Embiid': 'streaky', 'Giannis Antetokounmpo': 'grinder', 'James Harden': 'streaky', 'Jalen Brunson': 'clutch', 'LeBron James': 'lateBloomer', 'Kobe Bryant': 'clutch', "Shaquille O'Neal": 'hothead', 'Michael Jordan': 'competitor', 'Stephen Curry': 'streaky', 'Magic Johnson': 'mentor', Scorpion: 'hothead', 'Sub-Zero': 'steady', Raiden: 'mentor', 'Liu Kang': 'clutch', Baraka: 'competitor', 'Johnny Cage': 'streaky', 'Sonya Blade': 'competitor', Kano: 'hothead', Reptile: 'lateBloomer', Goro: 'grinder', 'Shang Tsung': 'collector', 'Kung Lao': 'steady', Kitana: 'clutch', Mileena: 'hothead', Jax: 'grinder', 'Shao Kahn': 'competitor', Kintaro: 'hothead', Jade: 'steady', Smoke: 'lateBloomer', 'Noob Saibot': 'streaky', Cyrax: 'steady', Sektor: 'competitor', Nightwolf: 'mentor', Sindel: 'clutch', Stryker: 'grinder', Kabal: 'streaky', Sheeva: 'grinder', Motaro: 'hothead', Rain: 'competitor', Ermac: 'steady', 'Quan Chi': 'clutch', Shinnok: 'competitor', Fujin: 'steady', Sareena: 'clutch', Kia: 'hothead', Jataaka: 'grinder', Reiko: 'hothead', Tanya: 'streaky', Jarek: 'grinder', Kai: 'steady', Meat: 'lateBloomer', Tremor: 'grinder', Ashrah: 'lateBloomer', Darrius: 'competitor', Hotaru: 'steady', Dairou: 'hothead', Havik: 'streaky', Kira: 'competitor', Kobra: 'hothead', Onaga: 'clutch', Shujinko: 'mentor', "Bo' Rai Cho": 'mentor', Drahmin: 'hothead', Frost: 'hothead', 'Hsu Hao': 'grinder', Kenshi: 'clutch', 'Li Mei': 'lateBloomer', Mavado: 'competitor', Nitara: 'streaky', Blaze: 'steady', Mokap: 'streaky', Moloch: 'grinder', Daegon: 'hothead', Taven: 'clutch', Skarlet: 'streaky', 'Cassie Cage': 'competitor', "D'Vorah": 'streaky', 'Erron Black': 'steady', 'Ferra/Torr': 'hothead', 'Jacqui Briggs': 'grinder', 'Kotal Kahn': 'clutch', 'Kung Jin': 'lateBloomer', Takeda: 'competitor', Leaf: 'collector', Ethan: 'competitor', Lyra: 'mentor', Kris: 'steady', Lucas: 'steady', Hilbert: 'clutch', Hilda: 'competitor', Nate: 'lateBloomer', Rosa: 'clutch', Elio: 'steady', Selene: 'collector', Victor: 'clutch', Gloria: 'competitor', Florian: 'lateBloomer', Juliana: 'streaky', Rei: 'collector', Akari: 'collector', Hugh: 'hothead', Shauna: 'streaky', Tierno: 'steady', Trevor: 'collector', Drew: 'competitor', Zoey: 'clutch', Ursula: 'hothead', Kenny: 'competitor', Mustard: 'mentor', Klara: 'hothead', Avery: 'hothead', Peony: 'grinder', Carmine: 'hothead', Briar: 'mentor', Lacey: 'streaky', Drayton: 'steady', Crispin: 'hothead', Amarys: 'clutch', Mela: 'hothead', Atticus: 'steady', Ortega: 'competitor', Eri: 'grinder', Giacomo: 'streaky', Michael: 'competitor', Jovi: 'lateBloomer', Krane: 'mentor', Duking: 'grinder', Gonzap: 'hothead', 'Miror B.': 'streaky', Lovrina: 'collector', Snattle: 'steady', Gorigan: 'grinder', Ardos: 'hothead', Eldes: 'steady', Greevil: 'clutch', Exol: 'competitor', Zook: 'hothead', 'Roman Reigns': 'clutch', 'Cody Rhodes': 'competitor', 'CM Punk': 'hothead', Gunther: 'steady', 'Sami Zayn': 'lateBloomer', 'Bron Breakker': 'hothead', Penta: 'streaky', 'Liv Morgan': 'streaky', 'Iyo Sky': 'clutch', 'Tiffany Stratton': 'competitor', Otis: 'streaky', "Je'Von Evans": 'lateBloomer', 'Jey Uso': 'competitor', 'Trick Williams': 'competitor', 'Oba Femi': 'steady', 'Jade Cargill': 'hothead', 'Rey Mysterio': 'mentor', 'Sol Ruca': 'clutch',
  'Jaylen Brown': 'competitor', 'Kawhi Leonard': 'clutch', 'Kevin Durant': 'steady', 'Luka Dončić': 'hothead', 'Victor Wembanyama': 'lateBloomer', 'Anthony Edwards': 'competitor', 'Jayson Tatum': 'steady',
  'Tim Duncan': 'steady', 'Larry Bird': 'clutch', 'Kareem Abdul-Jabbar': 'steady', 'Hakeem Olajuwon': 'clutch', 'Dirk Nowitzki': 'grinder',
  'Brock Lesnar': 'hothead', 'Bobby Lashley': 'competitor', 'John Cena': 'mentor', 'Seth Rollins': 'clutch', 'Drew McIntyre': 'hothead', 'Damian Priest': 'streaky',
  'Becky Lynch': 'competitor', 'Charlotte Flair': 'competitor', 'Ronda Rousey': 'hothead', 'Bianca Belair': 'competitor', Asuka: 'hothead', Bayley: 'mentor', 'Nia Jax': 'hothead',
  'Rhea Ripley': 'competitor', Naomi: 'streaky', 'Stephanie Vaquer': 'clutch', 'Chelsea Green': 'streaky',
  'Randy Orton': 'clutch', 'AJ Styles': 'lateBloomer', 'LA Knight': 'streaky', 'Logan Paul': 'streaky', 'Kevin Owens': 'hothead', 'Dominik Mysterio': 'streaky', 'Bronson Reed': 'hothead', 'Chad Gable': 'grinder', 'Alexa Bliss': 'streaky', 'Raquel Rodriguez': 'hothead', 'The Undertaker': 'steady', 'Steve Austin': 'hothead', 'The Rock': 'competitor', 'Triple H': 'mentor', 'Shawn Michaels': 'clutch', 'Cade Cunningham': 'competitor', 'Donovan Mitchell': 'streaky', 'Tyrese Maxey': 'steady', 'Karl-Anthony Towns': 'streaky', 'Ja Morant': 'hothead', 'Devin Booker': 'steady', 'Kyrie Irving': 'streaky', 'Damian Lillard': 'clutch', 'Anthony Davis': 'streaky', 'Tyrese Haliburton': 'clutch', 'Chet Holmgren': 'lateBloomer', 'Cooper Flagg': 'lateBloomer', 'Bill Russell': 'mentor', 'Wilt Chamberlain': 'competitor', 'Kevin Garnett': 'hothead', 'Allen Iverson': 'streaky', 'Dwyane Wade': 'clutch', 'Dennis Rodman': 'hothead', 'Scottie Pippen': 'steady', 'Charles Barkley': 'hothead', 'Karl Malone': 'steady', 'Chris Paul': 'mentor', 'Russell Westbrook': 'hothead', 'Steve Nash': 'mentor', 'Julius Erving': 'steady', 'Isiah Thomas': 'competitor',
  'Freddy Krueger': 'streaky', 'Kratos': 'hothead', 'Jason Voorhees': 'steady', 'Predator': 'competitor', 'Alien': 'hothead', 'Leatherface': 'streaky', 'T-800': 'steady', 'Spawn': 'clutch', 'RoboCop': 'grinder', 'Rambo': 'grinder', 'Omni-Man': 'competitor', 'Homelander': 'hothead', 'Peacemaker': 'streaky', 'Ghostface': 'streaky', 'T-1000': 'steady', 'Conan': 'grinder' });
const BASE_FAMOUS = FAMOUS.filter(f => !f.pack).length;
const packOn = k => !!(S && S.cfg && (S.cfg.packs || []).includes(k));
// v176: the game's own famous trainers can be switched off too (S.cfg.baseOff); older leagues keep them on
const famousOn = f => f.pack ? packOn(f.pack) : !(S && S.cfg && S.cfg.baseOff);
const FAMOUS_BY_NAME = Object.fromEntries(FAMOUS.map(f => [f.name, f]));
// v176: My trainer packs — famous trainers the player makes, grouped into packs they name. The library lives in this browser;
// a new league keeps its own copy of the packs switched on (S.customPacks), so later edits don't change it and it moves with the save.
const CUSTOM_KEY = 'pokemon-league-gm-custom-v2', CUSTOM_KEY_V1 = 'pokemon-league-gm-custom-v1', CUSTOM_MAX = 200, CUSTOM_PACKS_MAX = 40;
const cleanPack = p => p && p.key && Array.isArray(p.trainers) ? { key: String(p.key), name: String(p.name || 'My pack').slice(0, 40), trainers: p.trainers.filter(f => f && f.name && Array.isArray(f.team)) } : null;
function loadCustomLib() {
  try {
    const v = JSON.parse(localStorage.getItem(CUSTOM_KEY) || 'null');
    if (v && Array.isArray(v.packs)) return v.packs.map(cleanPack).filter(Boolean);
    // the first version kept a single list of trainers: it becomes a pack called My Trainers
    const old = JSON.parse(localStorage.getItem(CUSTOM_KEY_V1) || '[]');
    if (Array.isArray(old) && old.length) return [cleanPack({ key: 'c-my', name: 'My Trainers', trainers: old })];
  } catch (e) {}
  return [];
}
let customLib = typeof localStorage !== 'undefined' ? loadCustomLib() : [];
function saveCustomLib() { try { localStorage.setItem(CUSTOM_KEY, JSON.stringify({ packs: customLib })); return true; } catch (e) { return false; } }
let customFor; // the world whose packs FAMOUS holds right now (null = the library, on the setup screens)
function worldCustomPacks() {
  if (!S) return customLib;
  // a league started with the single-list version keeps its trainers as one pack
  if (!S.customPacks) { S.customPacks = S.customPack && S.customPack.length ? [{ key: 'custom', name: 'My Trainers', trainers: S.customPack }] : []; delete S.customPack; }
  return S.customPacks;
}
function useCustom(packs) {
  for (let i = FAMOUS.length - 1; i >= 0; i--) if (FAMOUS[i].custom) { if (FAMOUS_BY_NAME[FAMOUS[i].name] === FAMOUS[i]) delete FAMOUS_BY_NAME[FAMOUS[i].name]; FAMOUS.splice(i, 1); }
  for (const k of Object.keys(FAMOUS_PACKS)) if (FAMOUS_PACKS[k].custom) { delete FAMOUS_PACKS[k]; delete FAMOUS_TAG_LABELS[k]; delete FAMOUS_TAG_PLURAL[k]; }
  for (const p of packs || []) {
    if (!p || !p.key || FAMOUS_PACKS[p.key]) continue;
    const P = FAMOUS_PACKS[p.key] = { name: p.name, tag: p.name, desc: 'A pack you made.', trainers: [], custom: true };
    FAMOUS_TAG_LABELS[p.key] = FAMOUS_TAG_PLURAL[p.key] = p.name;
    for (const src of p.trainers || []) {
      // a custom trainer can share a built-in famous trainer's name (pulled from a built-in pack); if both are on, only one appears in a league
      if (!src || !src.name || FAMOUS.some(x => x.custom && x.name === src.name)) continue;
      const f = { ...src, team: src.team.map(x => Array.isArray(x) ? x.slice() : x), pack: p.key, tags: [p.key], custom: true };
      FAMOUS.push(f); P.trainers.push(f); if (!FAMOUS_BY_NAME[f.name]) FAMOUS_BY_NAME[f.name] = f;
    }
  }
}
function ensureCustom() { if (customFor !== undefined && customFor === S) return; customFor = S; useCustom(worldCustomPacks()); }
function setCustomLib(packs) { customLib = packs; const ok = saveCustomLib(); if (!S) { customFor = undefined; ensureCustom(); } return ok; }
const customPack = key => customLib.find(p => p.key === key) || null;
function newCustomKey() { let k; do k = 'c-' + Math.random().toString(36).slice(2, 8); while (customPack(k) || FAMOUS_PACKS[k]); return k; }
function checkPackName(raw, key = null) {
  const name = String(raw == null ? '' : raw).trim().replace(/\s+/g, ' ');
  if (!name) return { err: 'Give the pack a name.' };
  if (name.length > 40) return { err: 'Pack names can be up to 40 characters.' };
  const taken = Object.entries(FAMOUS_PACKS).some(([k, p]) => !p.custom && p.name.toLowerCase() === name.toLowerCase()) || customLib.some(p => p.key !== key && p.name.toLowerCase() === name.toLowerCase());
  if (taken) return { err: `There's already a pack called ${name}.` };
  if (!key && customLib.length >= CUSTOM_PACKS_MAX) return { err: `You can keep up to ${CUSTOM_PACKS_MAX} packs.` };
  return { name };
}
// Pokémon a custom trainer can carry: anything but legendaries, mythicals, Paradox Pokémon and Ultra Beasts
const customSpOk = sp => !!SP[sp] && !SP[sp].legend && !SP[sp].paradox && !SP[sp].ub && !isLegendLine(sp);
let CUSTOM_SPECIES = null, SP_LOWER = null;
function customSpecies() { if (!CUSTOM_SPECIES) { CUSTOM_SPECIES = Object.keys(SP).filter(customSpOk).sort(); SP_LOWER = Object.fromEntries(Object.keys(SP).map(n => [n.toLowerCase(), n])); } return CUSTOM_SPECIES; }
// ================= v185: MY POKÉDEX =================
// The player's own changes to the Pokédex: new types, base stats and abilities for any Pokémon, and new Pokémon of
// their own. Kept in this browser; a new league takes a copy when it's created (S.cfg.dex) and keeps it for good,
// so the save carries its Pokédex and nothing changes mid-league. The species tables are put back to the game's own
// and the league's changes laid over them whenever a league is created or loaded.
const DEX_KEY = 'pokemon-league-gm-dex-v1', DEX_MAX_NEW = 200, DEX_NAME_MAX = 24;
const DEX_STAT_LABEL = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'], DEX_STAT_SHORT = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
let dexLib = (() => {
  try { const v = JSON.parse(localStorage.getItem(DEX_KEY) || 'null'); if (v && typeof v === 'object') return { on: !!v.on, edits: v.edits && typeof v.edits === 'object' ? v.edits : {}, added: Array.isArray(v.added) ? v.added : [] }; } catch (e) {}
  return { on: false, edits: {}, added: [] };
})();
function saveDexLib() { try { localStorage.setItem(DEX_KEY, JSON.stringify(dexLib)); return true; } catch (e) { return false; } }
const dexCount = d => d ? Object.keys(d.edits || {}).length + (d.added || []).length : 0;
const dexHas = d => dexCount(d) > 0;
const dexCopy = d => dexHas(d) ? JSON.parse(JSON.stringify({ edits: d.edits || {}, added: d.added || [] })) : null;
// the game's own Pokédex, taken the first time it's needed (every species table is built by then)
let DEX_BASE = null, DEX_ADDED = [], DEX_LEGENDS = [], dexApplied = 'null';
// v185: your own legendary encounters need a total over this, and an unmarked Pokémon over it gets a warning
const DEX_LEGEND_BST = 650, DEX_LEGEND_CHANCE = 0.001; // per week, per custom legendary, in weeks 5–16
function dexSnapshot() {
  if (DEX_BASE) return;
  DEX_BASE = {};
  for (const [n, s] of Object.entries(SP)) DEX_BASE[n] = { types: s.types.slice(), bst: s.bst, evos: s.evos ? s.evos.map(e => ({ to: e.to, lvl: e.lvl })) : null, rare: s.rare, starter: s.starter,
    stats: BASE_STATS[n] ? BASE_STATS[n].slice() : null, ab: SPECIES_AB[n] ? Object.assign({}, SPECIES_AB[n]) : null };
}
// a species' six stats as the game uses them: its real spread scaled to the game's BST, rounded
function dexBaseStats(n) {
  dexSnapshot(); const b = DEX_BASE[n]; if (!b) return null;
  if (!b.stats) return Array(6).fill(Math.round(b.bst / 6));
  const sum = b.stats.reduce((a, x) => a + x, 0) || 1;
  return b.stats.map(x => Math.max(1, Math.round(x * b.bst / sum)));
}
// an evolution can only branch from an ordinary Pokémon (not a legendary, mythical, Paradox, Ultra Beast or baby legendary)
const dexParentOk = n => { const b = DEX_BASE && DEX_BASE[n], s = SP[n]; return !!s && !s.legend && !s.paradox && !s.baby && !s.ub && !s.glitch && !(b && BABY_LEGENDS.includes(LINE[n])); };
const dexEditable = n => { dexSnapshot(); return !!DEX_BASE[n] && n !== 'Missingno'; };
const dexInt = (x, a, b) => Number.isInteger(x) && x >= a && x <= b;
// the shape every saved entry must have before it's used
function dexEntryOk(e) {
  if (!e || !Array.isArray(e.types) || !e.types.length || e.types.length > 2 || !e.types.every(t => TYPES.includes(t)) || (e.types[1] && e.types[1] === e.types[0])) return false;
  if (!Array.isArray(e.stats) || e.stats.length !== 6 || !e.stats.every(x => dexInt(x, 1, 255))) return false;
  if (!Array.isArray(e.ab) || e.ab.length !== 3 || !e.ab.every(a => a === '' || a == null || typeof a === 'string')) return false;
  if (e.from != null && e.from !== '' && !dexInt(e.lvl, 2, 100)) return false;
  return true;
}
function applyDex(d) {
  dexSnapshot();
  const key = JSON.stringify(dexHas(d) ? { edits: d.edits || {}, added: d.added || [] } : null);
  if (key === dexApplied) return;
  dexApplied = key;
  // back to the game's own Pokédex
  for (const n of DEX_ADDED) { delete SP[n]; delete BASE_STATS[n]; delete SPECIES_AB[n]; }
  DEX_ADDED = []; DEX_LEGENDS = [];
  for (const [n, b] of Object.entries(DEX_BASE)) {
    const s = SP[n]; s.types = b.types.slice(); s.bst = b.bst; s.rare = b.rare; s.starter = b.starter; delete s.bs; delete s.dexMod;
    if (b.evos) { s.evos = b.evos.map(e => ({ to: e.to, lvl: e.lvl })); s.evo = s.evos[0]; } else { delete s.evos; delete s.evo; }
    if (b.stats) BASE_STATS[n] = b.stats.slice(); else delete BASE_STATS[n];
    if (b.ab) SPECIES_AB[n] = Object.assign({}, b.ab); else delete SPECIES_AB[n];
  }
  const abOf = e => ({ 0: e.ab[0] || null, 1: e.ab[1] || null, H: e.ab[2] || null });
  if (dexHas(d)) {
    for (const [n, e] of Object.entries(d.edits || {})) {
      if (!dexEditable(n) || !dexEntryOk(e)) continue;
      const s = SP[n]; s.types = e.types.slice(); BASE_STATS[n] = e.stats.slice(); s.bst = e.stats.reduce((a, x) => a + x, 0); SPECIES_AB[n] = abOf(e); s.dexMod = 'edited';
    }
    // new Pokémon, each added once whatever it evolves from is in
    const left = (d.added || []).filter(e => dexEntryOk(e) && typeof e.name === 'string' && e.name && !SP[e.name]);
    for (let moved = true; left.length && moved;) {
      moved = false;
      for (let i = 0; i < left.length; i++) {
        const e = left[i];
        if (e.from && !SP[e.from]) continue;
        if (e.from && !dexParentOk(e.from)) { left.splice(i--, 1); continue; }
        const bst = e.stats.reduce((a, x) => a + x, 0), legend = !!e.legend && !e.from && bst > DEX_LEGEND_BST;
        SP[e.name] = { name: e.name, types: e.types.slice(), bst, rare: !legend && !e.from && !!e.rare, starter: !legend && !e.from && !!e.starter, dexMod: 'new' };
        // a legendary of your own: like Missingno, a legendary in every rule but outside the game's own pools; it only comes as a rare encounter
        if (legend) { SP[e.name].legend = true; SP[e.name].dexLegend = true; DEX_LEGENDS.push(e.name); }
        BASE_STATS[e.name] = e.stats.slice(); SPECIES_AB[e.name] = abOf(e); DEX_ADDED.push(e.name);
        if (e.from) { const p = SP[e.from]; p.evos = (p.evos || []).concat({ to: e.name, lvl: e.lvl }); p.evo = p.evos[0]; }
        left.splice(i--, 1); moved = true;
      }
    }
  }
  // rebuild the tables made from the species list
  EVOLVED.clear(); for (const s of Object.values(SP)) for (const e of s.evos || []) EVOLVED.add(e.to);
  BASES.length = 0; BASES.push(...Object.keys(SP).filter(n => !EVOLVED.has(n) && !SP[n].legend && !SP[n].paradox && !SP[n].baby));
  STARTERS.length = 0; STARTERS.push(...BASES.filter(n => SP[n].starter));
  for (const k of Object.keys(LINE)) delete LINE[k];
  for (const b of BASES) markLine(b, b);
  for (const n of LEGENDS.concat(PARADOX, ['Missingno'], DEX_LEGENDS)) LINE[n] = n;
  for (const b of BABY_LEGENDS) markLine(b, b);
  GREAT_LEGENDS.length = 0; GREAT_LEGENDS.push(...LEGENDS.filter(n => SP[n].bst >= 660));
  REWARD_LEGENDS.length = 0; REWARD_LEGENDS.push(...LEGENDS.filter(n => SP[n].bst < 660));
  CUSTOM_SPECIES = null; TOURNEY_SPECIES = null;
}
// the Pokédex the screen in front of the player should be using
const dexWanted = () => S ? (S.cfg && S.cfg.dex) || null : (dexLib.on ? dexLib : null);
// abilities that work in battle (Missingno's Glitch is its own)
let DEX_ABILITIES = null;
const dexAbilities = () => DEX_ABILITIES || (DEX_ABILITIES = Object.keys(ABILITIES).filter(a => a !== 'Glitch').sort());
// check one entry from the editor: an edit of a game species (name = that species) or a new Pokémon.
// `was` is the name of the new Pokémon being changed, if any. Returns a list of problems.
function checkDexEntry(e, isNew, was, lib = dexLib) {
  dexSnapshot();
  const errs = [];
  if (isNew) {
    const n = String(e.name || '').trim();
    if (!n) errs.push('Give the new Pokémon a name.');
    else if (n.length > DEX_NAME_MAX) errs.push(`Names can be up to ${DEX_NAME_MAX} characters.`);
    else if (/[|/@<>"`\\]/.test(n)) errs.push('Names can\'t contain | / @ < > " ` or \\.');
    else if (/^mega /i.test(n)) errs.push('Names can\'t start with "Mega".');
    else {
      const low = n.toLowerCase();
      if (Object.keys(DEX_BASE).some(x => x.toLowerCase() === low) || Object.values(MEGA).flat().some(f => f.name.toLowerCase() === low)) errs.push(`${n} is already a Pokémon in the game.`);
      else if (lib.added.some(x => x.name.toLowerCase() === low && x.name !== was)) errs.push(`You already have a Pokémon called ${n}.`);
    }
  } else if (!dexEditable(e.name)) errs.push(`${e.name || 'That'} isn't a Pokémon you can change.`);
  if (!TYPES.includes(e.types[0])) errs.push('Choose its main type.');
  if (e.types[1] && e.types[1] === e.types[0]) errs.push("Its second type can't be the same as its main type.");
  e.stats.forEach((x, i) => { if (!dexInt(x, 1, 255)) errs.push(`${DEX_STAT_LABEL[i]} must be a whole number from 1 to 255.`); });
  if (!e.ab[0]) errs.push('Choose its first ability.');
  if (e.ab[1] && e.ab[1] === e.ab[0]) errs.push('Its second ability is the same as its first. Leave the second empty instead.');
  if (isNew && e.legend) {
    const bst = e.stats.reduce((a, x) => a + (Number.isFinite(x) ? x : 0), 0);
    if (e.from) errs.push("A legendary encounter can't evolve from another Pokémon. Clear \"Evolves from\" or untick Legendary encounter.");
    if (bst <= DEX_LEGEND_BST) errs.push(`Only Pokémon with a base stat total over ${DEX_LEGEND_BST} can be legendary encounters. This one's total is ${bst}.`);
    const kids = lib.added.filter(x => x.from && x.from === (was || String(e.name || '').trim())).map(x => x.name);
    if (kids.length) errs.push(`${kids.join(' and ')} ${kids.length === 1 ? 'evolves' : 'evolve'} from it, and nothing can evolve from a legendary. Change ${kids.length === 1 ? 'that' : 'those'} first.`);
  }
  if (isNew && e.from) {
    const name = String(e.name || '').trim(), own = lib.added.find(x => x.name === e.from && x.name !== was);
    if (e.from === name || e.from === was) errs.push("A Pokémon can't evolve from itself.");
    else if (own && own.legend) errs.push(`${e.from} is a legendary encounter, so nothing can evolve from it.`);
    else if (own) {
      // follow the chain back: it mustn't lead round to this Pokémon
      const seen = new Set(); let cur = own;
      while (cur && cur.from && !seen.has(cur.name)) { seen.add(cur.name); if (cur.from === name || cur.from === was) { errs.push(`${e.from} already evolves from ${name}, so ${name} can't evolve from it.`); break; } cur = lib.added.find(x => x.name === cur.from); }
    } else if (!DEX_BASE[e.from]) errs.push(`There's no Pokémon called ${e.from}. Pick one from the list.`);
    else { const s = SP[e.from]; if (s.legend || s.paradox || s.baby || s.ub || s.glitch || BABY_LEGENDS.includes(LINE[e.from])) errs.push(`${e.from} is a legendary, mythical, Paradox Pokémon or Ultra Beast, so nothing can evolve from it.`); }
    if (!dexInt(e.lvl, 2, 100)) errs.push('The evolution level must be a whole number from 2 to 100.');
  }
  if (isNew && !was && lib.added.length >= DEX_MAX_NEW) errs.push(`You can add up to ${DEX_MAX_NEW} new Pokémon.`);
  return errs;
}
// export and import as plain text
const dexExportText = () => JSON.stringify({ pokedex: 'pokemon-league-gm', v: 1, edits: dexLib.edits, added: dexLib.added });
function dexImport(txt) {
  let v; try { v = JSON.parse(String(txt || '').trim()); } catch (e) { return { err: "That isn't a Pokédex export. Paste the whole text from Export my Pokédex." }; }
  if (!v || typeof v !== 'object' || (!v.edits && !v.added)) return { err: "That isn't a Pokédex export. Paste the whole text from Export my Pokédex." };
  const lib = { on: dexLib.on, edits: Object.assign({}, dexLib.edits), added: dexLib.added.slice() };
  let ok = 0, bad = 0;
  for (const [n, e] of Object.entries(v.edits || {})) { const x = dexNorm(Object.assign({}, e, { name: n })); if (dexEntryOk(x) && !checkDexEntry(x, false, null, lib).length) { lib.edits[n] = dexStrip(x); ok++; } else bad++; }
  const mine = new Set();
  for (const e of Array.isArray(v.added) ? v.added : []) {
    const x = dexNorm(e);
    if (!dexEntryOk(x) || !x.name) { bad++; continue; }
    // an imported Pokémon replaces your own of the same name
    const at = lib.added.findIndex(a => a.name === x.name);
    if (at >= 0) lib.added[at] = x; else lib.added.push(x);
    mine.add(x.name);
  }
  // check them with every import in place (one can evolve from another); drop any that fail, until none do
  for (let changed = true; changed;) {
    changed = false;
    for (const x of lib.added.slice()) if (mine.has(x.name) && checkDexEntry(x, true, x.name, lib).length) { lib.added.splice(lib.added.indexOf(x), 1); mine.delete(x.name); bad++; changed = true; }
  }
  while (lib.added.length > DEX_MAX_NEW) { const x = lib.added.pop(); if (mine.has(x.name)) { mine.delete(x.name); bad++; } }
  ok += mine.size;
  return { lib, ok, bad };
}
// tidy an entry from the form or an import into its saved shape
function dexNorm(e) {
  e = e || {};
  const types = [e.types && e.types[0], e.types && e.types[1]].filter(Boolean).map(String);
  const stats = Array.isArray(e.stats) ? e.stats.map(x => Number(x)) : [];
  const ab = [0, 1, 2].map(i => (Array.isArray(e.ab) && e.ab[i] ? String(e.ab[i]) : ''));
  const out = { name: String(e.name || '').trim(), types, stats, ab };
  if (e.from) { out.from = String(e.from).trim(); out.lvl = Number(e.lvl); }
  if (e.legend) out.legend = true; else { if (e.rare) out.rare = true; if (e.starter) out.starter = true; }
  return out;
}
const dexStrip = e => ({ types: e.types, stats: e.stats, ab: e.ab });
// check a trainer from the editor; returns { errs, entry }. target = the pack it goes in; editing = { key, i } of the trainer it replaces
function checkCustom(d, target, editing = null) {
  customSpecies();
  const errs = [], s = v => String(v == null ? '' : v).trim().replace(/\s+/g, ' ');
  const name = s(d.name), cls = s(d.cls), age = Math.round(+d.age);
  const dupe = customLib.flatMap(p => p.trainers.map((f, i) => ({ p, f, i }))).find(x => !(editing && x.p.key === editing.key && x.i === editing.i) && x.f.name.toLowerCase() === name.toLowerCase());
  if (!name) errs.push('Give them a name.'); else if (name.length > 30) errs.push('Names can be up to 30 characters.');
  else if (dupe) errs.push(`You already have a trainer called ${dupe.f.name}${dupe.p.key !== target ? ` in ${dupe.p.name}` : ''}.`);
  else if (/ V\d+$/.test(name)) errs.push('Names can\'t end in V2, V3 and so on: those mark repeat rounds in all-famous leagues.');
  if (!cls) errs.push('Give them a title, like Gym Leader or Movie Star.'); else if (cls.length > 30) errs.push('Titles can be up to 30 characters.');
  if (!(age >= 8 && age <= 90)) errs.push('Age must be between 8 and 90.');
  const g = ['m', 'f', 'n'].includes(d.g) ? d.g : 'm';
  const spec = TYPES.includes(d.spec) ? d.spec : null, spec2 = spec && TYPES.includes(d.spec2) && d.spec2 !== spec ? d.spec2 : null;
  if (d.spec2 && !spec) errs.push('Pick a main type before a second type.');
  const trait = TRAITS[d.trait] ? d.trait : null;
  const lines = new Map();
  const parse = raw => {
    const out = [];
    for (const r of [].concat(raw || []).map(s).filter(Boolean)) {
      const sp = SP_LOWER[r.toLowerCase()];
      if (!sp) { errs.push(`${r} isn't a Pokémon in the game. Check the spelling, including regional forms like Alolan Vulpix.`); continue; }
      if (!customSpOk(sp)) { errs.push(`${sp} can't be on a starting team: legendaries, mythicals, Paradox Pokémon and Ultra Beasts only come through the game's own events.`); continue; }
      const ln = LINE[sp] || sp;
      if (lines.has(ln)) { errs.push(`${sp} is in the same evolution line as ${lines.get(ln)}. Each Pokémon must come from a different line.`); continue; }
      lines.set(ln, sp); out.push(sp);
    }
    return out;
  };
  const opts = raw => Array.isArray(raw) ? raw : String(raw == null ? '' : raw).split(/[\/,]/);
  const lead = parse(opts(d.lead)), second = parse(opts(d.second));
  if (!opts(d.lead).map(s).filter(Boolean).length) errs.push('Pick a lead Pokémon.');
  const tp = target == null ? null : customPack(target);
  if (target != null && !tp) errs.push('Pick a pack for this trainer.');
  else if (tp && !(editing && editing.key === target) && tp.trainers.length >= CUSTOM_MAX) errs.push(`A pack can hold up to ${CUSTOM_MAX} trainers.`);
  if (errs.length) return { errs, entry: null };
  return { errs, entry: { name, cls, spec, spec2, age, g, trait, team: [lead.length === 1 ? lead[0] : lead, ...(second.length ? [second.length === 1 ? second[0] : second] : [])] } };
}
// ---- pack export / import (v176) ----
// one trainer as it goes in a pack file; built-in trainers carry the trait the game gives them
const packEntry = f => ({ name: f.name, cls: f.cls, spec: f.spec || null, spec2: f.spec2 || null, age: f.age, g: f.g, trait: (f.custom ? f.trait : FAMOUS_TRAITS[f.name]) || null, team: f.team.map(x => Array.isArray(x) ? x.slice() : x) });
const BUILTIN_SOURCES = () => [['base', 'Pokémon famous trainers'], ...Object.entries(FAMOUS_PACKS).filter(([, p]) => !p.custom).map(([k, p]) => [k, p.name])];
function builtinSource(key) {
  const trainers = key === 'base' ? FAMOUS.filter(f => !f.pack) : FAMOUS_PACKS[key] && !FAMOUS_PACKS[key].custom ? FAMOUS_PACKS[key].trainers : null;
  return trainers ? { name: (BUILTIN_SOURCES().find(([k]) => k === key) || [, 'Pack'])[1], trainers: trainers.map(packEntry) } : null;
}
function packExportText(packs) { return JSON.stringify({ game: 'Pokémon League GM', kind: 'trainer-pack', v: 1, packs: packs.map(p => ({ name: p.name, trainers: p.trainers.map(packEntry) })) }, null, 1); }
const PACK_TEXT_ERR = "That isn't a trainer pack. Use the whole text from an export, or a file made with Export.";
// text copied through phones or chat apps often arrives with curly quotes and markdown escapes (\[ \]); those are tidied up
function tidyPackText(t) { return String(t || '').trim().replace(/^```[a-z]*\s*|```$/gi, '').replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"').replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'").replace(/\\([\[\]_*#])/g, '$1').replace(/\u00A0/g, ' ').trim(); }
function parsePackText(txt) {
  let v; try { v = JSON.parse(String(txt || '').trim()); } catch (e) { try { v = JSON.parse(tidyPackText(txt)); } catch (e2) { return { err: PACK_TEXT_ERR }; } }
  let packs = v && Array.isArray(v.packs) ? v.packs : v && Array.isArray(v.trainers) ? [v] : Array.isArray(v) ? [{ name: 'Imported trainers', trainers: v }] : null;
  if (!packs) return { err: PACK_TEXT_ERR };
  packs = packs.filter(p => p && Array.isArray(p.trainers)).map(p => ({ name: String(p.name || 'Imported trainers').trim().slice(0, 40) || 'Imported trainers', trainers: p.trainers.filter(f => f && typeof f === 'object').slice(0, 1000) }));
  if (!packs.some(p => p.trainers.length)) return { err: 'There are no trainers in that pack.' };
  return { packs };
}
// imported teams are tidied first: an option from the same evolution line as an earlier one is dropped (Hitmonlee or Hitmonchan)
function normImport(raw) {
  customSpecies();
  const s = v => String(v == null ? '' : v).trim(), lineOf = x => { const sp = SP_LOWER[x.toLowerCase()]; return sp ? LINE[sp] || sp : x.toLowerCase(); };
  const team = Array.isArray(raw.team) ? raw.team : [];
  const lead = [].concat(team[0] || []).map(s).filter(Boolean), seen = new Set(lead.map(lineOf)), second = [];
  for (const x of [].concat(team[1] || []).map(s).filter(Boolean)) { const ln = lineOf(x); if (seen.has(ln)) continue; seen.add(ln); second.push(x); }
  return { name: raw.name, cls: raw.cls, g: raw.g, age: raw.age, spec: raw.spec || '', spec2: raw.spec2 || '', trait: raw.trait || '', lead, second };
}
// check every trainer in an import; rows that can't come in say why
function prepImport(raws) {
  const seen = new Set();
  return raws.map(raw => {
    const r = checkCustom(normImport(raw || {}), null), errs = r.errs.slice(), nm = String((raw && raw.name) || '').trim().toLowerCase();
    if (!errs.length && seen.has(nm)) errs.push('Listed twice: only the first one is imported.');
    if (nm) seen.add(nm);
    return { raw, entry: errs.length ? null : r.entry, errs };
  });
}
// a pack name that's free, adding (2), (3)... when needed; list = the packs it must not clash with
function uniquePackName(name, list = customLib) {
  const base = String(name || 'Imported trainers').trim().replace(/\s+/g, ' ').slice(0, 34) || 'Imported trainers';
  const free = n => !list.some(p => p.name.toLowerCase() === n.toLowerCase()) && !Object.values(FAMOUS_PACKS).some(p => !p.custom && p.name.toLowerCase() === n.toLowerCase());
  if (free(base)) return base;
  for (let i = 2; i < 100; i++) if (free(`${base} (${i})`)) return `${base} (${i})`;
  return base + ' ' + Date.now().toString(36);
}
function famousTags(t) { return t && t.famous ? (t.famTags || (FAMOUS_BY_NAME[famBase(t)] || {}).tags || []) : []; }
const FAMOUS_DRAFT_CHANCE = 0.06; // per draft prospect
const FAMOUS_E4_CHANCE = 0.15;    // per founding Elite Four seat
const FAMOUS_POST_CHANCE = 0.2;   // per outsider appointed to a gym or an Elite Four seat later on
function famousAvailable(filter) { ensureCustom(); S.famousUsed = S.famousUsed || []; return FAMOUS.filter(f => famousOn(f) && !S.famousUsed.includes(f.name) && famousNameFree(f) && filter(f)); }
function makeFamous(f, role, quality, lvl) {
  const t = newTrainer({ age: f.age, quality, role, specialty: f.spec });
  t.name = f.name; t.cls = f.cls; t.gender = f.g; t.famous = true; t.famTags = f.tags.slice(); t.spec2 = f.spec2 || null; t.trait = (f.custom ? TRAITS[f.trait] && f.trait : FAMOUS_TRAITS[f.name]) || t.trait;
  t.pot = clamp(Math.max(t.pot, ovr(t) + (f.age <= 18 ? ri(14, 24) : ri(2, 8))), ovr(t), 99);
  t.team = signaturePicks(f.team).map((sp, i) => stamp(makeMon(sp, lvl - i * 2, f.spec), 'starter'));
  S.famousUsed.push(f.name);
  return t;
}

function makeDraftClass(n) {
  const cls = [];
  // legacy prospects whose time has come take the first places in the class (at most two a year)
  const due = (S.legacyQueue || []).filter(q => q.at <= S.season).slice(0, 2);
  for (const q of due) { S.legacyQueue = S.legacyQueue.filter(x => x !== q); const t = makeLegacy(q); if (t) { cls.push(t.id); n--; } }
  for (let i = 0; i < n; i++) {
    const r = rand();
    const age = r < 0.6 ? ri(10, 17) : r < 0.85 ? ri(18, 27) : ri(28, 40);
    // older prospects arrive more developed; a few late bloomers are genuinely good
    const q = ri(28, 52) + Math.min(14, Math.max(0, age - 14)) * 0.8 + (rand() < 0.15 ? ri(6, 14) : 0);
    const ctrs = metaCounters();
    const spec = featOn('meta') && ctrs.length && rand() < 0.3 ? pick(ctrs) : null;
    const fam = !(S.cfg && S.cfg.allFamous) && rand() < FAMOUS_DRAFT_CHANCE ? famousAvailable(f => f.age <= 40 || f.tags.includes('prof')) : [];
    if (fam.length) {
      const f = pick(fam);
      const t = makeFamous(f, 'prospect', ri(50, 60) + Math.min(14, Math.max(0, f.age - 14)) * 0.8, 9);
      news(`Scouts are buzzing: ${dn(t)} has entered the draft.`, 'draft', t.id);
      cls.push(t.id);
      continue;
    }
    const t = newTrainer({ age, quality: q, role: 'prospect', specialty: spec || undefined });
    starterTeam(t, 9);
    cls.push(t.id);
  }
  return cls;
}
function scoutEst(t) { if (t.potEst == null) t.potEst = clamp(t.pot + ri(-8, 8), ovr(t), 99); return t.potEst; }
// what an AI team thinks a trainer is worth: current skill, upside for the young, a discount for age
function tradeValue(t, k) {
  const young = t.age <= 22 ? scoutEst(t) * 0.35 : ovr(t) * 0.35;
  let v = ovr(t) * 0.65 + young - Math.max(0, t.age - 35) * 0.8;
  if (k && specTypes(t).some(ty => ORGS[k].likes.includes(ty))) v += 4;
  // family ties: a team values its former star's child a little more
  if (k && t.legacy && t.legacy.org === k) v += 5;
  return v;
}
function autoResolveGifts() {
  let guard = 0;
  while ((S.pendingGifts || []).length && guard++ < 50) autoGift();
}
function setupDraft(snakeRounds) {
  // v168: farewell gifts wait until after the draft (beginGifts), so nothing is resolved here
  S.phase = 'draft';
  const pool = makeDraftClass(snakeRounds ? 6 : draftClassSize()).concat(snakeRounds ? S.freeAgents : eachLeague(() => independents().map(t => t.id)).flat().concat(S.freeAgents.filter(id => T(id) && T(id).role === 'free')));
  pool.forEach(id => scoutEst(T(id)));
  // worst team picks first; the founding draft uses a random order
  let order;
  const h = S.history[S.history.length - 1];
  if (!h || snakeRounds) order = shuffle(ORG_KEYS);
  else order = h.standings.map(r => r.key).reverse();
  const queue = [];
  if (snakeRounds) for (let r = 0; r < snakeRounds; r++) (r % 2 ? order.slice().reverse() : order).forEach(k => queue.push({ org: k, round: r + 1, must: true }));
  else {
    // compensation picks come first, in draft order, so a team that lost a trainer to promotion gets an early shot at the best prospect
    for (const k of order) for (const c of (S.compPicks || []).filter(c => c.org === k)) queue.push({ org: k, round: 'Comp', must: false, from: c.from });
    order.forEach(k => queue.push({ org: k, round: 1, must: false }));
  }
  S.compPicks = [];
  S.draft = { pool, order, queue, picks: [], i: 0, done: false, founding: !!snakeRounds };
  runDraft();
}
function draftAvail() { const d = S.draft; return d.pool.filter(id => { const t = T(id); return t && !t.org && ['prospect', 'free', 'challenger'].includes(t.role); }); }
function draftSign(t, k) {
  // an independent already on a circuit stays there if the team has room in that League
  if (t.role === 'challenger') t.lg = homeLeague(t);
  const here = t.role === 'challenger' && lgRoster(k, lgOf(t)).length < ROSTER;
  const lg = here ? lgOf(t) : draftLeague(t, k);
  if (t.role === 'challenger' && !here) inLeague(homeLeague(t), () => { S.challengers = S.challengers.filter(x => x !== t.id); });
  if (t.role !== 'challenger' || !here) { t.role = 'challenger'; t.lg = lg; inLeague(lg, () => { if (!S.challengers.includes(t.id)) S.challengers.push(t.id); }); }
  S.freeAgents = S.freeAgents.filter(x => x !== t.id);
  joinOrg(t, k);
  if (nLeagues() > 1) settleLegendClash(t);
}
const teamFull = k => openLeague(k) == null;
// where a new signing goes: a League with room, avoiding one where their legendary is already held
function draftLeague(t, k) {
  const open = []; for (let i = 0; i < nLeagues(); i++) if (lgRoster(k, i).length < ROSTER) open.push(i);
  if (!open.length) return 0;
  const legs = t.team.filter(m => SP[m.sp].legend).map(m => m.sp);
  const clash = i => legs.length ? inLeague(i, () => { const h = ownedLegends(); return legs.filter(sp => h.has(sp)).length; }) : 0;
  return open.map(i => ({ i, c: clash(i), n: lgRoster(k, i).length })).sort((a, b) => a.c - b.c || a.n - b.n)[0].i;
}
// a legendary is one per League: if a newcomer brings one that's already held there, it returns to the wild
function settleLegendClash(t) {
  const legs = t.team.filter(m => SP[m.sp].legend); if (!legs.length) return;
  inLeague(lgOf(t), () => {
    const others = new Set(); for (const x of leagueTrainers()) if (x !== t && !['retired', 'prospect', 'free'].includes(x.role)) for (const m of x.team) if (SP[m.sp].legend) others.add(m.sp);
    for (const m of legs) if (others.has(m.sp) && t.team.length > 1) { farewell(t, m, `could not follow them into the ${S.lgName}`); t.team = t.team.filter(x => x !== m); news(`${dn(t)}'s ${m.sp} could not follow them into the ${S.lgName}, where one is already held. It returned to the wild.`, t.user ? 'you' : 'move', t.id); }
  });
}
function draftCurrent() {
  const d = S.draft;
  while (true) {
    if (d.i < d.queue.length) {
      const q = d.queue[d.i];
      // a mandatory fill pick is skipped if the team already filled up
      if (q.must && teamFull(q.org)) { d.i++; continue; }
      return q;
    }
    // fill rounds: any team below three trainers keeps picking
    const short = d.order.filter(k => !teamFull(k));
    if (!short.length || !draftAvail().length) return null;
    short.forEach(k => d.queue.push({ org: k, round: 'Fill', must: true }));
  }
}
// how much better a prospect must look before a full team releases its weakest trainer to draft them
const DRAFT_SWAP_EDGE = 0;
function runDraft() {
  const d = S.draft;
  while (true) {
    const q = draftCurrent();
    if (!q) return finishDraft();
    if (q.org === S.userOrg) return; // wait for the player
    const avail = draftAvail().sort((a, b) => tradeValue(T(b), q.org) - tradeValue(T(a), q.org));
    const best = avail[0] ? T(avail[0]) : null;
    const roster = org(q.org).roster.map(T);
    if (!best) { d.picks.push({ n: d.picks.length + 1, org: q.org, round: q.round, id: null }); d.i++; continue; }
    if (teamFull(q.org)) {
      const worst = roster.filter(t => t.role === 'challenger').sort((a, b) => tradeValue(a, q.org) - tradeValue(b, q.org))[0];
      if (!worst || tradeValue(best, q.org) < tradeValue(worst, q.org) + DRAFT_SWAP_EDGE) { d.picks.push({ n: d.picks.length + 1, org: q.org, round: q.round, id: null }); d.i++; continue; }
      release(worst, 'to make room on the roster');
    }
    d.picks.push({ n: d.picks.length + 1, org: q.org, round: q.round, id: best.id });
    draftSign(best, q.org);
    news(`${orgName(q.org)} drafted ${dn(best)} (age ${best.age}).`, 'draft', best.id);
    d.i++;
  }
}
// the player's pick: prospectId null = pass (only allowed on optional picks); releaseId frees a roster spot first
function userDraft(prospectId, releaseId) {
  const d = S.draft; const q = draftCurrent();
  if (!q || q.org !== S.userOrg) return;
  if (prospectId == null) {
    if (q.must) return;
    d.picks.push({ n: d.picks.length + 1, org: q.org, round: q.round, id: null });
  } else {
    if (teamFull(S.userOrg)) {
      const r = T(releaseId); if (!r || r.org !== S.userOrg || r.role !== 'challenger') return;
      release(r, 'to make room on the roster');
    }
    const t = T(prospectId);
    d.picks.push({ n: d.picks.length + 1, org: q.org, round: q.round, id: t.id });
    draftSign(t, S.userOrg);
    news(`You drafted ${dn(t)} (age ${t.age}, ${t.specialty ? specTypes(t).join(' / ') + ' specialist' : 'mixed team'}) with pick #${d.picks.length}.`, 'you', t.id);
  }
  d.i++;
  runDraft();
}
// ---------- simming several seasons: the player's decisions made the way an AI GM would ----------
function autoUserDraft() {
  let guard = 0;
  while (S.phase === 'draft' && guard++ < 200) {
    const q = draftCurrent();
    if (!q || q.org !== S.userOrg) break;
    const best = draftAvail().map(T).sort((a, b) => tradeValue(b, S.userOrg) - tradeValue(a, S.userOrg))[0];
    const roster = org(S.userOrg).roster.map(T);
    if (!best) { if (q.must) { S.draft.i++; runDraft(); continue; } userDraft(null); continue; }
    if (teamFull(S.userOrg)) {
      const worst = roster.filter(t => t.role === 'challenger').sort((a, b) => tradeValue(a, S.userOrg) - tradeValue(b, S.userOrg))[0];
      if (worst && tradeValue(best, S.userOrg) >= tradeValue(worst, S.userOrg) + DRAFT_SWAP_EDGE) userDraft(best.id, worst.id);
      else if (!q.must) userDraft(null);
      else if (worst) userDraft(best.id, worst.id);
      else { S.draft.i++; runDraft(); }
    } else userDraft(best.id);
  }
}
// a team's own farewell-gift choice: the Pokémon it values most goes to the ranch
function autoGift() {
  const g = S.pendingGifts[0];
  const m = (g.mons || []).filter(x => ranchable(x.sp)).sort((a, b) => ranchValue(b) - ranchValue(a))[0];
  return confirmGift(m ? m.uid : null);
}
// one step through whatever the current phase needs. acceptInvites: answer League invitations yes or no
function autoStep(acceptInvites) {
  if (S.phase === 'season') { while (S.phase === 'season') simWeek({}, {}); return; }
  if (S.phase === 'league') { runLeague(); return; }
  if (S.phase === 'offseason') {
    let g = 0;
    while (S.offers.length && g++ < 20) {
      const o = S.offers[0];
      if (o.kind === 'rejoin') { const c = T(o.id) ? rejoinChoice(T(o.id), o.org) : { ok: false }; acceptOffer(c.ok, c.release); }
      else acceptOffer(!!acceptInvites);
    }
    S.lastSeatBattle = null;
    setupDraft(); return;
  }
  if (S.phase === 'draft') { autoUserDraft(); if (S.phase === 'draft') runDraft(); return; }
  if (S.phase === 'ranch') { let g = 0; while ((S.ranchPicks || []).length && g++ < 40) autoRanchPick(0); if (S.userOrg) { aiRest(S.userOrg); aiStock(S.userOrg); ranchAuto(S.userOrg); } confirmRanch(); return; }
  if (S.phase === 'reward') { const tg = T(S.reward.target); confirmReward(S.reward.pool.slice().sort((a, b) => SP[b].bst + (onSpec(tg, b) ? 60 : 0) - SP[a].bst - (onSpec(tg, a) ? 60 : 0))[0]); return; }
  if (S.phase === 'register') { confirmRegistration(); return; }
  if (S.phase === 'gifts') { let g = 0; while ((S.pendingGifts || []).length && g++ < 40) autoGift(); confirmGifts(); return; }
  if (S.phase === 'reassign') { confirmReassign(); return; }
  if (S.phase === 'banvote') { autoBanVote(); confirmBanVote(); return; }
}
// play through to the end of the next season's League, then on to the start of the season after it
function simOneSeason(acceptInvites) {
  const target = S.history.length + 1; let guard = 0;
  while ((S.history.length < target || S.phase !== 'season') && guard++ < 60) autoStep(acceptInvites);
  return S.history[S.history.length - 1];
}
function finishDraft() {
  const d = S.draft;
  // undrafted trainers try their luck as independents while there is room on the circuit
  const left = d.pool.map(T).filter(t => t && !t.org && ['prospect', 'free'].includes(t.role)).sort((a, b) => tradeValue(b) - tradeValue(a));
  for (const t of left) {
    const room = eachLeague(() => independents().length).map((n, i) => ({ n, i })).filter(x => x.n < indieCap()).sort((a, b) => a.n - b.n)[0];
    if (room) { t.role = 'challenger'; t.lg = room.i; inLeague(room.i, () => S.challengers.push(t.id)); if (nLeagues() > 1) settleLegendClash(t); if (t.seasons === 0 && t.potEst != null) news(`${dn(t)} went undrafted and will compete as an independent.`, 'draft', t.id); }
    else if (t.role === 'prospect') { if (t.famous) S.famousUsed = (S.famousUsed || []).filter(n => n !== t.name); delete S.trainers[t.id]; }
    else if (t.role === 'free' && !S.freeAgents.includes(t.id)) { S.freeAgents.push(t.id); t.freeSince = t.freeSince ?? S.season; }
  }
  S.freeAgents = S.freeAgents.filter(id => T(id) && T(id).role === 'free');
  d.done = true;
  beginGifts();
}
// after the draft: AI teams hand over their farewell gifts; the player chooses theirs on the Farewell gifts screen,
// which also lists every team's gifts (always shown with several Leagues; with one, only when there are gifts)
function beginGifts() {
  const all = S.pendingGifts || [];
  const mine = all.filter(g => g.org === S.userOrg);
  S.pendingGifts = all.filter(g => g.org !== S.userOrg);
  let guard = 0; while (S.pendingGifts.length && guard++ < 50) autoGift();
  S.pendingGifts = mine;
  const founding = S.draft && S.draft.founding;
  if (mine.length || (!founding && (nLeagues() > 1 || (S.giftLog || []).length))) { S.phase = 'gifts'; return; }
  beginReassign();
}
function confirmGifts() {
  if (S.phase !== 'gifts' || (S.pendingGifts || []).length) return;
  beginReassign();
}
// The team that holds the championship gives its weakest trainer a Paradox Pokémon, chosen from three (v182; it was a
// legendary before, and those now come through their own events). Paradox Pokémon aren't one of a kind: two trainers
// can have the same one. One choice fits the trainer's type when any does, and there's always an Ancient and a Future one.
const isAncient = sp => !/^Iron /.test(sp);
function paradoxRewardPool(t) {
  const pool = [], fit = shuffle(PARADOX.filter(n => specFit(t, n) === 2)).concat(shuffle(PARADOX.filter(n => specFit(t, n) === 1)));
  if (fit.length) pool.push(fit[0]);
  const rest = shuffle(PARADOX.filter(n => !pool.includes(n)));
  for (const a of [true, false]) if (!pool.some(n => isAncient(n) === a)) { const n = rest.find(x => isAncient(x) === a && !pool.includes(x)); if (n) pool.push(n); }
  for (const n of rest) if (pool.length < 3 && !pool.includes(n)) pool.push(n);
  return pool.slice(0, 3);
}
// legendaries held in this League. A baby legendary (Cosmog, Type: Null, Kubfu…) counts as every legendary it can grow into,
// so nobody is handed a Solgaleo while a Cosmog that could become one is out there
function ownedLegends() {
  const set = new Set();
  for (const t of leagueTrainers()) if (!['retired', 'prospect'].includes(t.role)) for (const m of t.team) {
    if (SP[m.sp].legend) set.add(m.sp);
    if (SP[m.sp].baby) { const q = [m.sp]; while (q.length) { const n = q.shift(); for (const e of SP[n].evos || []) { if (SP[e.to].legend) set.add(e.to); q.push(e.to); } } }
  }
  return set;
}
// with several Leagues each League's Champion team gives one, League by League
function beginReward(from = 0) {
  for (let i = from; i < nLeagues(); i++) {
    useLeague(i);
    const k = champOrg();
    // v189: the reward goes to the team's ranch, so it's chosen with the team's weakest trainer in any League in mind
    const target = k ? org(k).roster.map(T).filter(t => t && t.role === 'challenger').sort((a, b) => ovr(a) - ovr(b))[0] : null;
    if (!target) continue;
    const pool = paradoxRewardPool(target);
    S.reward = { org: k, target: target.id, pool, lg: i };
    if (k === S.userOrg) { S.phase = 'reward'; return; }
    const likes = ORGS[k].likes;
    const score = n => SP[n].bst + (onSpec(target, n) ? 60 : 0) + (SP[n].types.some(ty => likes.includes(ty)) ? 25 : 0);
    giveReward(pool.slice().sort((a, b) => score(b) - score(a))[0]);
  }
  useLeague(0);
  S.reward = null;
  beginRanch();
}
// v189: the reward goes into the team's active ranch; the team hands it to any of its trainers, in any League
function giveReward(name) {
  const r = S.reward;
  const m = makeMon(name, 10); m.fr = 90; m.metFr = 1;
  addToRanch(r.org, m, { how: 'reward', season: S.season + 1, fromName: `${S.lgName} title`, lg: S.lg || 0 });
  news(`As the Champion's team${nLeagues() > 1 ? ' in the ' + S.lgName : ''}, ${orgName(r.org)} added ${name}${SP[name].paradox ? ', a Paradox Pokémon,' : ''} to its ranch.`, r.org === S.userOrg ? 'you' : 'title');
}
function confirmReward(name) {
  const r = S.reward; if (!r || !r.pool.includes(name)) return;
  useLeague(r.lg || 0);
  giveReward(name);
  S.reward = null;
  beginReward((r.lg || 0) + 1);
}
// ================= TEAM RANCH (v189) =================
// Every team keeps a ranch. The active ranch holds Pokémon the team can hand to its own trainers, in any League: the
// Champion's reward and farewell gifts land here, and when one of the team's trainers retires, the GM keeps one of their Pokémon here.
// The rest of a retiring trainer's team goes to the historical ranch, which is for display only, along with every title roster. Each offseason, after the
// Champion's reward, a team can hand each of its challengers one Pokémon from the active ranch; it joins at no higher than
// the trainer's own strongest level and is registered on top of the usual three in its first season. Pokémon never age
// out of a ranch. Legendaries and other one-of-a-kind Pokémon never go to the active ranch.
// v189: the active ranch has no limit; one handoff per trainer each offseason keeps it in check
const REST_IV = [4, 8]; // v192: neither part of a ranch has a size limit
function ranchOf(k) { const o = k && S.orgs && S.orgs[k]; if (!o) return null; if (!o.ranch) o.ranch = { active: [], retired: [] }; if (!o.ranch.champs) o.ranch.champs = []; if (!o.ranch.resting) o.ranch.resting = []; return o.ranch; }
// the historical ranch also keeps every title-winning roster: each season one of the team's trainers wins the title and
// ends the League as Champion (defenses aren't recorded)
const RANCH_CHAMPS_MAX = 60;
function ranchChampionRoster(k, c, won) {
  const R = ranchOf(k); if (!won || !R || !c || !c.team || !c.team.length) return;
  if (R.champs.some(x => x.season === S.season && x.id === c.id)) return;
  R.champs.unshift({ season: S.season, lg: S.lg || 0, lgName: S.lgName, id: c.id, name: `${c.cls} ${c.name}`, won: !!won,
    mons: c.team.map(m => ({ sp: m.sp, lvl: Math.floor(m.lvl), ko: m.ss && m.ss.season === S.season ? m.ss.ko : 0, shiny: m.shiny || undefined, alpha: m.alpha || undefined, delta: m.delta || undefined })) });
  if (R.champs.length > RANCH_CHAMPS_MAX) R.champs.length = RANCH_CHAMPS_MAX;
}
const ranchable = sp => !!SP[sp] && !isLegendLine(sp) && !SP[sp].legend && !SP[sp].baby && !babyLine(sp) && !SP[sp].ub && !SP[sp].glitch;
// how much a team values a ranch Pokémon (for AI choices and for which one makes room when the ranch is full)
const ranchValue = (m, t) => SP[m.sp].bst * (t && onSpec(t, m.sp) ? 1.15 : 1) + (m.shiny ? 60 : 0) + (m.alpha ? 40 : 0) + (m.delta ? 40 : 0) + (SP[m.sp].paradox ? 40 : 0) + ivTotal(m) / 4;
function ranchRecord(m, info) {
  const st = m.st || {};
  return { uid: m.uid, sp: m.sp, lvl: Math.floor(m.lvl || 1), season: info.season, from: info.from ?? null, fromName: info.fromName || '', why: info.why || '', nat: m.nat,
    st: { b: st.b || 0, w: st.w || 0, l: st.l || 0, ko: st.ko || 0 }, shiny: m.shiny || undefined, alpha: m.alpha || undefined, delta: m.delta || undefined, paradox: SP[m.sp] && SP[m.sp].paradox ? true : undefined };
}
function toRetiredRanch(k, rec) {
  const R = ranchOf(k); if (!R) return;
  R.retired.unshift(rec);
}
// a Pokémon joins the active ranch
function addToRanch(k, m, info) {
  const R = ranchOf(k); if (!R || !m || !ranchable(m.sp)) return false;
  ensureMon(m);
  m.item = null; delete m.bond; m.gift = null; m.cap = null; m.ss = null; m.form = 0;
  // v192: steps counts the offseason ranch steps it has been available for; one added during a step counts that one
  m.ranch = Object.assign({ season: curSeason(), steps: S.ranchStepOn ? 1 : 0 }, info);
  R.active.push(m);
  return true;
}
// the team a retiring trainer's Pokémon go to: their own, or the team they left for a post
function ranchTeamOf(t) {
  const post = ['leader', 'e4', 'champion', 'exchamp'].includes(t.role);
  for (const k of post ? [t.org, t.elevatedFrom, t.champOrg, t.homeOrg] : [t.org]) if (k && S.orgs && S.orgs[k]) return k;
  return null;
}
// a trainer retires: the GM keeps one Pokémon in the active ranch, the rest go to the historical ranch for display.
// AI teams choose at once; the player chooses on the Ranch screen after the Champion's reward.
function ranchRetire(t, k) {
  if (!k || !ranchOf(k) || !t.team || !t.team.length) return;
  const keep = t.team.filter(m => ranchable(m.sp));
  const info = { season: S.season || 1, from: t.id, fromName: dn(t) };
  if (k === S.userOrg && keep.length) {
    (S.ranchPicks = S.ranchPicks || []).push({ org: k, from: t.id, fromName: info.fromName, season: info.season, uids: keep.map(m => m.uid) });
    news(`${info.fromName} retired. Choose one of their Pokémon to keep in your ranch.`, 'you', t.id);
    return;
  }
  const best = keep.slice().sort((a, b) => ranchValue(b) - ranchValue(a))[0] || null;
  settleRanchPick(t, k, best ? best.uid : null, info);
}
// the chosen Pokémon (uid, or null for none) moves from the retired trainer to the active ranch; the rest are put on display
function settleRanchPick(t, k, uidPick, info) {
  info = info || { season: S.season || 1, from: t.id, fromName: dn(t) };
  const m = uidPick != null ? t.team.find(x => x.uid === uidPick && ranchable(x.sp)) : null;
  for (const x of t.team) if (x !== m) toRetiredRanch(k, ranchRecord(x, Object.assign({ why: `retired with ${info.fromName}` }, info)));
  if (!m) return null;
  farewell(t, m, `kept in ${orgName(k)}'s ranch`);
  t.team = t.team.filter(x => x !== m);
  addToRanch(k, m, Object.assign({ how: 'retired' }, info));
  news(`${orgName(k)} kept ${info.fromName}'s ${m.sp} in its ranch.`, k === S.userOrg ? 'you' : 'move', t.id);
  return m;
}
// the player's choice for a pending retirement (index into S.ranchPicks; uid null keeps none in the active ranch)
function answerRanchPick(i, uidPick) {
  const p = (S.ranchPicks || [])[i]; if (!p) return null;
  S.ranchPicks.splice(i, 1);
  const t = T(p.from); if (!t) return null;
  return settleRanchPick(t, p.org, uidPick, { season: p.season, from: p.from, fromName: p.fromName });
}
function autoRanchPick(i) {
  const p = (S.ranchPicks || [])[i]; if (!p) return null;
  const t = T(p.from);
  const best = t ? t.team.filter(m => p.uids.includes(m.uid) && ranchable(m.sp)).sort((a, b) => ranchValue(b) - ranchValue(a))[0] : null;
  return answerRanchPick(i, best ? best.uid : null);
}
// who can be handed a ranch Pokémon this offseason: the team's challengers, in any League, one each
// (registration comes after, so a full team is fine: the handoff is registered on top of the usual three)
function ranchTakers(k) { return org(k).roster.map(T).filter(t => t && t.role === 'challenger' && !(S.ranchGiven || {})[t.id]); }
function ranchHand(k, ranchUid, toId) {
  const R = ranchOf(k), to = T(toId); if (!R || !to) return null;
  const m = R.active.find(x => x.uid === ranchUid); if (!m) return null;
  const info = m.ranch || {};
  // v192: a rested Pokémon going back to its own trainer doesn't use their handoff, and it registers like any of theirs
  // v194: so does a banned one going back to its trainer; a banned legendary (or other one-of-a-kind) registers in the usual three
  const home = (info.how === 'rest' || info.how === 'banned') && info.from === to.id;
  if (to.org !== k || to.role !== 'challenger' || (!home && (S.ranchGiven || {})[to.id]) || !ranchCanTake(to, m)) return null;
  const uniq = banUnique(m.sp);
  R.active = R.active.filter(x => x !== m);
  const top = to.team.length ? Math.floor(Math.max(...to.team.map(x => x.lvl))) : 10;
  m.lvl = Math.max(5, Math.min(Math.floor(m.lvl), top));
  if (!uniq && (info.how === 'retired' || info.how === 'farewell' || info.how === 'surplus' || ((info.how === 'rest' || info.how === 'banned') && !home))) { m.prior = { name: info.fromName, st: m.st || blankStat() }; m.st = blankStat(); }
  m.ss = null; m.form = 0; m.gift = home || uniq ? null : S.season + 1; m.metFr = 1;
  // a legendary changing partners keeps the clock it already had
  if (uniq && !home && m.partners && isLegendLine(m.sp)) {
    const p = m.partners.find(x => x.id === info.from && x.to == null);
    if (p) { p.to = S.season || 1; const now = statSnap(m); p.st = { b: now.b - p.at.b, w: now.w - p.at.w, l: now.l - p.at.l, ko: now.ko - p.at.ko }; p.why = `banned in the ${info.lgName || 'League'}`; }
    m.partners.push({ id: to.id, name: dn(to), from: curSeason(), to: null, at: statSnap(m) });
  }
  if (!home) m.met = { how: info.how === 'reward' ? 'gift' : info.how === 'farewell' ? 'farewell' : 'ranch', season: S.season + 1, week: 1, from: info.fromName || orgName(k) };
  m.ranchFrom = { org: k, how: info.how || 'ranch', fromName: info.fromName || '', season: S.season + 1 };
  delete m.ranch;
  ensureMon(m); refreshMoves(m);
  if (!home) (S.ranchGiven = S.ranchGiven || {})[to.id] = true;
  to.team.push(m);
  (S.ranchLog = S.ranchLog || []).push({ season: S.season + 1, org: k, to: to.id, toName: dn(to), sp: m.sp, how: info.how || 'ranch', fromName: info.fromName || '', lg: lgOf(to) });
  if (S.ranchLog.length > 200) S.ranchLog.splice(0, S.ranchLog.length - 200);
  if (SP[m.sp].legend) noteLegends(to);
  inLeague(lgOf(to), () => news(home && info.how === 'banned' ? `${dn(to)}'s ${m.sp} is back from the ${orgName(k)} ranch and can battle again.` : home ? `${dn(to)}'s ${m.sp} is back from a season of rest at the ${orgName(k)} ranch.` : `${orgName(k)} sent ${m.sp} from its ranch to ${dn(to)}${info.how === 'farewell' && info.fromName ? `, a farewell gift from ${info.fromName}` : (info.how === 'retired' || info.how === 'surplus') && info.fromName ? `. It last battled for ${info.fromName}` : ''}.`, k === S.userOrg ? 'you' : 'move', to.id));
  return m;
}
// a team's own choices: the trainers who need it most (lowest OVR) get first pick of what suits them best.
// v192: a Pokémon in its last offseason in the ranch counts for more, so a good one is used before it goes on display.
const RANCH_LAST_BONUS = 120;
const ranchGreat = m => isSpecial(m) || !!SP[m.sp].paradox || (m.ranch && m.ranch.how === 'reward') || linePeak(m.sp) >= 500 || ivTotal(m) >= 150;
const ranchPickValue = (m, t) => ranchValue(m, t) + (ranchLastChance(m) ? RANCH_LAST_BONUS : 0);
function ranchAuto(k) {
  const R = ranchOf(k); if (!R || !R.active.length) return;
  for (const m of R.active.filter(x => x.ranch && x.ranch.how === 'rest')) { const t = T(m.ranch.from); if (t && t.org === k && t.role === 'challenger') ranchHand(k, m.uid, t.id); }
  returnBannedHome(k);
  // v194: a banned legendary (or other one-of-a-kind) goes first, to the weakest teammate who can take it
  for (const m of R.active.filter(x => x.ranch && x.ranch.how === 'banned' && banUnique(x.sp)).sort((a, b) => ranchValue(b) - ranchValue(a))) {
    const t = ranchTakers(k).filter(x => ranchCanTake(x, m)).sort((a, b) => ovr(a) - ovr(b))[0];
    if (t) ranchHand(k, m.uid, t.id);
  }
  // great Pokémon about to leave the ranch go first, each to the weakest trainer who can use it
  for (const m of R.active.filter(x => ranchLastChance(x) && ranchGreat(x)).sort((a, b) => (isSpecial(b) ? 1000 : 0) + ranchValue(b) - (isSpecial(a) ? 1000 : 0) - ranchValue(a))) {
    const t = ranchTakers(k).filter(x => ranchCanTake(x, m) && !x.team.some(y => LINE[y.sp] === LINE[m.sp]) && !(m.ranch.how === 'surplus' && m.ranch.from === x.id)).sort((a, b) => ovr(a) - ovr(b))[0];
    if (t) ranchHand(k, m.uid, t.id);
  }
  for (const t of ranchTakers(k).sort((a, b) => ovr(a) - ovr(b))) {
    if (!R.active.length) break;
    const lines = new Set(t.team.map(m => LINE[m.sp]));
    const m = R.active.filter(x => ranchCanTake(t, x) && !lines.has(LINE[x.sp]) && !(x.ranch && x.ranch.how === 'surplus' && x.ranch.from === t.id)).sort((a, b) => ranchPickValue(b, t) - ranchPickValue(a, t))[0];
    if (m) ranchHand(k, m.uid, t.id);
  }
}
// ---------- rest (v189) ----------
// After a season, each of a team's challengers can send one Pokémon to rest at the ranch instead of registering or
// releasing it. It sits out the whole next season, then comes back in the following offseason's ranch step with better
// IVs, ready to go back to its trainer (or to anyone on the team). Legendaries and this season's handoffs can't rest.
const canRest = (t, m) => !!(t && m && t.team.includes(m) && ranchable(m.sp) && !isGift(m) && t.team.length > 1);
function restMon(t, uidPick) {
  const k = t && t.org, R = ranchOf(k); if (!R || t.role !== 'challenger' || (S.ranchRested || {})[t.id]) return null;
  const m = t.team.find(x => x.uid === uidPick); if (!canRest(t, m)) return null;
  if (m.item) { bagAdd(t, m.item); m.item = null; }
  if (t.mega && t.mega.uid === m.uid) t.mega.uid = null;
  t.team = t.team.filter(x => x !== m);
  m.rest = { from: t.id, fromName: dn(t), season: S.season, back: S.season + 1, org: k };
  R.resting.push(m);
  (S.ranchRested = S.ranchRested || {})[t.id] = m.uid;
  news(`${dn(t)} sent ${m.sp} to rest at the ${orgName(k)} ranch. It sits out Season ${S.season + 1} and comes back stronger.`, k === S.userOrg ? 'you' : 'move', t.id);
  return m;
}
// changed their mind during the same ranch step
function unrestMon(t) {
  const u = (S.ranchRested || {})[t.id], R = ranchOf(t.org); if (u == null || !R) return null;
  const m = R.resting.find(x => x.uid === u && x.rest && x.rest.season === S.season); if (!m) return null;
  R.resting = R.resting.filter(x => x !== m); delete m.rest; t.team.push(m); delete S.ranchRested[t.id];
  return m;
}
// a season of rest is over: better IVs, and into the active ranch
function returnRested(k) {
  const R = ranchOf(k); if (!R || !R.resting.length) return;
  for (const m of R.resting.filter(x => x.rest && x.rest.back <= S.season)) {
    R.resting = R.resting.filter(x => x !== m);
    const r = m.rest; delete m.rest;
    ensureMon(m);
    let up = 0; for (const key of STAT_KEYS) { const was = m.iv[key]; m.iv[key] = Math.min(31, was + ri(REST_IV[0], REST_IV[1])); up += m.iv[key] - was; }
    m.fr = Math.min(255, (m.fr ?? 70) + 20);
    addToRanch(k, m, { how: 'rest', season: curSeason(), from: r.from, fromName: r.fromName });
    m.ranch.ivUp = up;
    news(`${r.fromName}'s ${m.sp} is rested and back at the ${orgName(k)} ranch${up ? `, stronger for it (IVs +${up})` : ''}.`, k === S.userOrg ? 'you' : 'move', r.from);
  }
}
// v192: AI trainers almost always rest the best Pokémon they'd otherwise have to release at registration
function aiRest(k) {
  for (const t of org(k).roster.map(T).filter(x => x && x.role === 'challenger')) {
    if (regular(t).length <= START_TEAM || rand() >= 0.95) continue;
    const keep = new Set(bestThree(t));
    const m = regular(t).filter(x => !keep.has(x.uid) && canRest(t, x)).sort((a, b) => ranchValue(b, t) - ranchValue(a, t))[0];
    if (m) restMon(t, m.uid);
  }
}
// v192: whatever else an AI trainer would release at registration goes into the team's active ranch for a teammate,
// so the ranch rarely runs dry. Simming runs this for the player's team too.
function aiStock(k) {
  const R = ranchOf(k); if (!R) return;
  for (const t of org(k).roster.map(T).filter(x => x && x.role === 'challenger')) {
    if (regular(t).length <= START_TEAM) continue;
    const keep = new Set(bestThree(t));
    for (const m of regular(t).filter(x => !keep.has(x.uid) && canRest(t, x))) {
      if (regular(t).length <= START_TEAM) break;
      if (m.item) { bagAdd(t, m.item); m.item = null; }
      if (t.mega && t.mega.uid === m.uid) t.mega.uid = null;
      farewell(t, m, `passed on to ${orgName(k)}'s ranch`);
      t.team = t.team.filter(x => x !== m);
      addToRanch(k, m, { how: 'surplus', season: curSeason(), from: t.id, fromName: dn(t) });
    }
  }
}
// v192: a Pokémon nobody takes in RANCH_STEPS offseason ranch steps goes on display in the historical ranch.
// A season spent resting doesn't count: a rested Pokémon only starts counting once it's back in the active ranch.
// Paradox Pokémon are rare, so they get twice as long.
const RANCH_STEPS = 3, RANCH_STEPS_PARADOX = 6;
const ranchSteps = m => SP[m.sp] && isLegendLine(m.sp) && m.partners ? Infinity : SP[m.sp] && SP[m.sp].paradox ? RANCH_STEPS_PARADOX : RANCH_STEPS;
const ranchLastChance = m => !!(m && m.ranch && (m.ranch.steps || 0) >= ranchSteps(m));
function ageRanch(k) {
  const R = ranchOf(k); if (!R || !R.active.length) return;
  const gone = [];
  for (const m of R.active.slice()) {
    // v194: a banned Pokémon nobody on the team can take this offseason doesn't age, and a legendary's clock waits too
    // (up to BAN_HOLD offseasons; after that it moves on, or goes on display)
    if (m.ranch.how === 'banned' && !org(k).roster.some(id => ranchCanTake(T(id), m))) {
      m.ranch.held = (m.ranch.held || 0) + 1;
      if (m.ranch.held <= BAN_HOLD) { if (m.leg) m.leg.until++; continue; }
      if (isLegendLine(m.sp) && m.partners) { ranchLegendLeaves(k, m, 'moved on after waiting out a ban'); continue; }
      gone.push(m); continue;
    }
    // a legendary leaves by its own clock, never for the historical ranch
    if (isLegendLine(m.sp) && m.partners) { if (m.leg && m.leg.until <= S.season) ranchLegendLeaves(k, m, 'moved on while waiting in the ranch'); continue; }
    m.ranch.steps = (m.ranch.steps || 0) + 1;
    if (m.ranch.steps > ranchSteps(m)) gone.push(m);
  }
  if (!gone.length) return;
  R.active = R.active.filter(m => !gone.includes(m));
  for (const m of gone) toRetiredRanch(k, ranchRecord(m, { season: S.season, from: m.ranch.from ?? null, fromName: m.ranch.fromName || '', why: `unused in the ranch for ${ranchSteps(m)} offseasons` }));
  if (k === S.userOrg) news(`${gone.length === 1 ? gone[0].sp + ' was' : gone.length + ' Pokémon were'} unused in your ranch for ${ranchSteps(gone[0])}${gone.some(m => ranchSteps(m) !== ranchSteps(gone[0])) ? ' or more' : ''} offseasons and went on display in the retired ranch${gone.length > 1 ? ': ' + gone.map(m => m.sp).join(', ') : ''}.`, 'you');
}
// offseason step after the Champion's reward: rested Pokémon come back, AI teams rest and hand out; the player gets the
// Ranch screen whenever they have a challenger on the roster
function beginRanch() {
  S.ranchGiven = {}; S.ranchRested = {};
  S.ranchStepOn = false; for (const k of ORG_KEYS) ageRanch(k);
  S.ranchStepOn = true;
  for (const k of ORG_KEYS) returnRested(k);
  for (const k of ORG_KEYS) returnBannedHome(k);
  for (const k of ORG_KEYS) if (k !== S.userOrg) { aiRest(k); aiStock(k); ranchAuto(k); }
  const mine = (S.ranchPicks || []).filter(p => p.org === S.userOrg).length;
  if (S.userOrg && (mine || ranchTakers(S.userOrg).length)) { S.phase = 'ranch'; return; }
  beginRegistration();
}
function confirmRanch() {
  if (S.phase !== 'ranch') return;
  let g = 0; while ((S.ranchPicks || []).length && g++ < 40) autoRanchPick(0);
  beginRegistration();
}
// ================= LEAGUE BANLIST (v194) =================
// Each offseason, after League moves and before the Champion's reward, the teams with challengers in a League vote on
// banning its top performers of the season just played. The ballot is the League's five best by knockouts and wins per
// battle (Gym Leaders', the Elite Four's and the Champion's Pokémon count too; at most two legendaries). A ban needs a
// majority of the voting teams; at most two new bans a season and three at a time per League. Every ban comes back to
// the vote each offseason (keep or lift) and lifts on its own after three seasons. A ban covers the species, what it
// evolves from and what it evolves into, so banning Sylveon bans Eevee too, but not Vaporeon.
// Banned Pokémon leave everyone in that League: a team's challengers send theirs to the team ranch, where a teammate in
// another League can take it (or it waits for the ban to lift and goes back to its trainer). Gym Leaders, the Elite Four
// and the Champion get a replacement that fits their type and the season's meta. Independents let theirs go.
// Legendaries are the one exception to the ranch rule: a banned legendary can wait in the team ranch, keeping its old
// partner clock. A season it can't be used anywhere on the team doesn't count toward that clock. It registers in the
// usual three rather than on top of them, and if its time runs out in the ranch it moves on as usual. A banned Pokémon
// can wait out at most BAN_HOLD offseasons with nobody able to take it; then a legendary moves on, and anything else goes on display.
const BAN_BALLOT = 5, BAN_MAX_NEW = 2, BAN_CAP = 3, BAN_MAX_SEASONS = 3, BAN_MIN_B = 8, BAN_BALLOT_LEGENDS = 2, BAN_HOLD = 4;
let PREV_EVO = null, PREV_N = 0;
function prevEvo(sp) {
  const n = Object.keys(SP).length;
  if (!PREV_EVO || PREV_N !== n) { PREV_EVO = {}; PREV_N = n; for (const k of Object.keys(SP)) for (const e of SP[k].evos || []) if (!PREV_EVO[e.to]) PREV_EVO[e.to] = k; }
  return PREV_EVO[sp] || null;
}
function banMembers(sp) {
  const out = new Set([sp]);
  for (let p = prevEvo(sp), g = 0; p && g < 6; p = prevEvo(p), g++) out.add(p);
  const q = [sp]; while (q.length) { const n = q.shift(); for (const e of (SP[n] && SP[n].evos) || []) if (!out.has(e.to)) { out.add(e.to); q.push(e.to); } }
  return [...out];
}
function lgState(i) { return i == null || i === (S.lg || 0) ? S : (S.leagues && S.leagues[i]) || null; }
function bansIn(i) { const L = lgState(i); return (L && L.bans) || []; }
function banOf(sp, i) { return bansIn(i).find(b => b.members.includes(sp)) || null; }
function bannedIn(sp, i) { return !!(S && featOn('banlist') && sp && banOf(sp, i)); }
const banUnique = sp => !ranchable(sp);
// the season's best performers in the bound League (built in the offseason before anyone moves or retires)
function buildBanBallot() {
  S.banBallot = null;
  if (!featOn('banlist')) return;
  const agg = {};
  for (const t of leagueTrainers()) {
    if (['retired', 'prospect', 'free'].includes(t.role)) continue;
    for (const m of t.team) {
      const ss = m.ss; if (!ss || ss.season !== S.season || !SP[m.sp]) continue;
      const a = agg[m.sp] = agg[m.sp] || { sp: m.sp, b: 0, ko: 0, w: 0, users: new Set() };
      a.b += ss.b || 0; a.ko += ss.ko || 0; a.w += ss.w || 0; a.users.add(t.id);
    }
  }
  const score = a => a.ko / a.b + 0.5 * a.w / a.b + Math.log2(1 + a.users.size) * 0.15;
  const list = Object.values(agg).filter(a => a.b >= BAN_MIN_B && !banOf(a.sp, S.lg || 0)).sort((x, y) => score(y) - score(x));
  const cands = [], used = new Set(); let legs = 0;
  for (const a of list) {
    if (cands.length >= BAN_BALLOT) break;
    const mem = banMembers(a.sp); if (mem.some(x => used.has(x))) continue;
    const leg = isLegendLine(a.sp) || !!SP[a.sp].legend;
    if (leg && legs >= BAN_BALLOT_LEGENDS) continue;
    if (leg) legs++;
    mem.forEach(x => used.add(x));
    cands.push({ sp: a.sp, members: mem, b: a.b, ko: a.ko, w: a.w, users: a.users.size, score: Math.round(score(a) * 100) / 100, leg });
  }
  S.banBallot = { season: S.season, cands };
}
// the teams that vote in League i: those with a challenger there
function banVoters(i) { return ORG_KEYS.filter(k => org(k).roster.some(id => { const t = T(id); return t && t.role === 'challenger' && lgOf(t) === i; })); }
const teamIn = (k, i) => org(k).roster.map(T).filter(t => t && t.role === 'challenger' && lgOf(t) === i);
const teamUses = (k, i, mem) => teamIn(k, i).some(t => t.team.some(m => mem.includes(m.sp)));
// a team with a stake in a ban: it holds one of the banned Pokémon in its ranch, or has a trainer of its type there
const teamStake = (k, i, b) => (ranchOf(k) ? ranchOf(k).active : []).some(m => m.ranch && m.ranch.how === 'banned' && m.ranch.lg === i && b.members.includes(m.sp)) || teamIn(k, i).some(t => onSpec(t, b.sp));
// AI teams never vote to ban what their own trainers use there, and go easier on their sponsor's favourite types
function aiBanVote(k, i, c, rank) {
  if (teamUses(k, i, c.members)) return false;
  let p = 0.35 + 0.1 * (BAN_BALLOT - 1 - rank);
  if (SP[c.sp].types.some(ty => ORGS[k].likes.includes(ty))) p -= 0.25;
  if (c.leg) p += 0.1;
  return rand() < p;
}
function aiKeepVote(k, i, b) {
  if (teamStake(k, i, b)) return false;
  return rand() < 0.8 - 0.2 * Math.max(0, S.season - b.season - 1);
}
const banKey = (i, sp) => `${i}|${sp}`;
// offseason step after League moves: the AI teams' votes are cast when the step resolves; the player votes on the Banlist screen
function beginBanVote() {
  S.banVote = null;
  if (!featOn('banlist')) return beginReward();
  const lgs = [];
  for (let i = 0; i < nLeagues(); i++) {
    const L = lgState(i); if (!L) continue;
    const ballot = L.banBallot && L.banBallot.season === S.season ? L.banBallot.cands : [];
    const reviews = (L.bans || []).filter(b => b.season < S.season).map(b => b.sp);
    const voters = banVoters(i);
    if (voters.length < 2 || (!ballot.length && !reviews.length)) continue;
    lgs.push({ lg: i, voters, cands: ballot.map(c => Object.assign({}, c)), reviews });
  }
  if (!lgs.length) return beginReward();
  S.banVote = { season: S.season, lgs, ban: {}, lift: {} };
  if (S.userOrg && lgs.some(x => x.voters.includes(S.userOrg))) { S.phase = 'banvote'; return; }
  confirmBanVote();
}
// simming: the player's team votes the way an AI team would
function autoBanVote() {
  const V = S.banVote, k = S.userOrg; if (!V || !k) return;
  for (const x of V.lgs) if (x.voters.includes(k)) {
    x.cands.forEach((c, r) => { V.ban[banKey(x.lg, c.sp)] = aiBanVote(k, x.lg, c, r); });
    for (const sp of x.reviews) { const b = bansIn(x.lg).find(z => z.sp === sp); if (b) V.lift[banKey(x.lg, sp)] = !aiKeepVote(k, x.lg, b); }
  }
}
function setBanVote(i, sp, kind, v) { const V = S.banVote; if (!V || S.phase !== 'banvote') return; (kind === 'lift' ? V.lift : V.ban)[banKey(i, sp)] = !!v; }
function confirmBanVote() {
  const V = S.banVote; if (!V) return beginReward();
  const changes = S.changes = S.changes || [];
  const out = [];
  for (const x of V.lgs) out.push(inLeague(x.lg, () => resolveBanVote(x, V, changes)));
  S.banResults = { season: S.season, lgs: out };
  S.banVote = null;
  beginReward();
}
function resolveBanVote(x, V, changes) {
  const i = x.lg, n = x.voters.length, user = S.userOrg, pre = nLeagues() > 1 ? `${lgShort(i)}: ` : '';
  const res = { lg: i, n, rows: [], reviews: [] };
  S.bans = S.bans || []; S.banLog = S.banLog || [];
  for (const sp of x.reviews) {
    const b = S.bans.find(z => z.sp === sp); if (!b) continue;
    const age = S.season - b.season, how = {}; let keep = 0;
    for (const k of x.voters) { const v = k === user ? !V.lift[banKey(i, sp)] : aiKeepVote(k, i, b); how[k] = v; if (v) keep++; }
    const kept = age < BAN_MAX_SEASONS && keep * 2 > n;
    res.reviews.push({ sp, keep, n, kept, how, age, limit: age >= BAN_MAX_SEASONS });
    S.banLog.unshift({ season: S.season, sp, act: kept ? 'keep' : 'lift', keep, n, limit: age >= BAN_MAX_SEASONS });
    if (kept) { b.kept = (b.kept || 0) + 1; changes.push(`${pre}${sp} stays banned for Season ${S.season + 1} (${keep} of ${n} teams voted to keep it).`); }
    else {
      S.bans = S.bans.filter(z => z !== b);
      changes.push(`${pre}The ban on ${sp} is lifted${age >= BAN_MAX_SEASONS ? ` after ${age} seasons` : ` (${keep} of ${n} teams voted to keep it)`}.`);
      news(`The ${S.lgName} lifted its ban on ${sp}. It can battle there again in Season ${S.season + 1}.`, 'league');
    }
  }
  const passed = [];
  x.cands.forEach((c, rank) => {
    const how = {}; let yes = 0;
    for (const k of x.voters) { const v = k === user ? !!V.ban[banKey(i, c.sp)] : aiBanVote(k, i, c, rank); how[k] = v; if (v) yes++; }
    const row = { sp: c.sp, yes, n, how, passed: false, leg: c.leg };
    res.rows.push(row);
    if (yes * 2 > n) passed.push({ row, c });
  });
  passed.sort((a, b) => b.row.yes - a.row.yes || b.c.score - a.c.score);
  let room = Math.min(BAN_MAX_NEW, BAN_CAP - S.bans.length);
  for (const { row, c } of passed) {
    if (room <= 0) { row.capped = true; continue; }
    room--; row.passed = true;
    S.bans.push({ sp: c.sp, members: c.members, season: S.season, yes: row.yes, n });
    S.banLog.unshift({ season: S.season, sp: c.sp, act: 'ban', yes: row.yes, n });
    changes.push(`${pre}${c.sp} is banned for Season ${S.season + 1} (${row.yes} of ${n} teams voted for it).`);
    news(`The ${S.lgName} banned ${c.sp}${c.members.length > 1 ? ` (and ${c.members.filter(s => s !== c.sp).join(', ')})` : ''} for Season ${S.season + 1}, ${row.yes} of ${n} teams voting for it.`, 'league');
  }
  if (S.banLog.length > 60) S.banLog.length = 60;
  enforceBans();
  return res;
}
// clear every banned Pokémon out of the bound League (after the vote, and again as each season starts)
function enforceBans() {
  if (!featOn('banlist') || !(S.bans || []).length) return;
  const i = S.lg || 0;
  for (const t of leagueTrainers()) {
    if (['retired', 'prospect', 'free'].includes(t.role)) continue;
    const bench = (t.bench || []).filter(m => banOf(m.sp, i));
    if (bench.length) { t.bench = t.bench.filter(m => !bench.includes(m)); for (const m of bench) farewell(t, m, `banned in the ${S.lgName}`); }
    const out = t.team.filter(m => banOf(m.sp, i));
    if (!out.length) continue;
    const top = Math.max(...t.team.map(m => m.lvl));
    for (const m of out) pullBanned(t, m, i);
    if (['leader', 'e4', 'champion'].includes(t.role)) banReplace(t, out);
    else if (!t.team.length) {
      const o = wildOffers(t)[0];
      if (o) { const nm = stamp(makeMon(o.sp, Math.max(5, Math.floor(top) - 2)), 'caught'); t.team.push(nm); news(`With all of their Pokémon banned in the ${S.lgName}, ${dn(t)} caught ${nm.sp} to keep going.`, t.user ? 'you' : 'move', t.id); }
    }
  }
}
function pullBanned(t, m, i) {
  if (m.item) { bagAdd(t, m.item); m.item = null; }
  if (t.mega && t.mega.uid === m.uid) t.mega.uid = null;
  const k = t.role === 'challenger' ? t.org : null;
  if (k && ranchOf(k)) {
    t.team = t.team.filter(x => x !== m);
    banToRanch(k, m, t, i);
    news(`${m.sp} is banned in the ${S.lgName}, so ${dn(t)} sent it to the ${orgName(k)} ranch.`, k === S.userOrg ? 'you' : 'move', t.id);
    return;
  }
  farewell(t, m, `banned in the ${S.lgName}`);
  t.team = t.team.filter(x => x !== m);
  if (t.role === 'challenger') news(`${m.sp} is banned in the ${S.lgName}, so ${dn(t)} let it go.`, t.user ? 'you' : 'move', t.id);
}
// a banned Pokémon joins its team's active ranch (legendaries too, in this case only); it keeps its partner clock
function banToRanch(k, m, t, i) {
  ensureMon(m);
  m.item = null; delete m.bond; m.gift = null; m.cap = null; m.ss = null; m.form = 0;
  m.ranch = { season: curSeason(), steps: S.ranchStepOn ? 1 : 0, how: 'banned', from: t.id, fromName: dn(t), lg: i, lgName: S.lgName };
  ranchOf(k).active.push(m);
}
// a Gym Leader, Elite Four member or Champion who lost Pokémon to a ban gets a replacement of their type (any type for a
// Champion with no specialty), close in strength to the one it replaces, favouring types that hit the season's meta
function banReplace(t, outs) {
  const slot = eliteSlot(t); if (!slot) return;
  const i = S.lg || 0, counters = metaCounters(), ins = [];
  for (const gone of outs) {
    if (t.team.length >= slot.size) break;
    const lines = new Set(t.team.map(m => LINE[m.sp]));
    const pool = buildEliteTeam(t.specialty, slot.lvl, 10, t.role === 'champion' || !t.specialty).filter(m => !lines.has(LINE[m.sp]) && !banOf(m.sp, i));
    const target = SP[gone.sp].bst;
    const sc = m => (onSpec(t, m.sp) ? 300 : 0) - Math.abs(SP[m.sp].bst - target) / 2 + (SP[m.sp].types.some(ty => counters.includes(ty)) ? 60 : 0) + rand() * 20;
    const best = pool.sort((a, b) => sc(b) - sc(a))[0];
    if (!best) continue;
    stamp(best, 'assigned'); t.team.push(best); ins.push(`${best.sp} for ${gone.sp}`);
  }
  relevelElite(t);
  if (ins.length) news(`With ${outs.map(m => m.sp).join(' and ')} banned in the ${S.lgName}, the League gave ${dn(t)} ${ins.join(', ')}.`, t.user ? 'you' : 'move', t.id);
}
// can this challenger take this ranch Pokémon now? Not into a League where it's banned; a legendary (or other
// one-of-a-kind) only to a trainer without one, never to a past partner, and not into a League that already has it
function ranchCanTake(t, m) {
  if (!t || !m || t.role !== 'challenger' || !SP[m.sp]) return false;
  if (bannedIn(m.sp, lgOf(t))) return false;
  if (!banUnique(m.sp)) return true;
  const home = m.ranch && m.ranch.from === t.id;
  if (!home && wasPartner(t, m)) return false;
  return !inLeague(lgOf(t), () => ownedLegends().has(m.sp) || (isLegendLine(m.sp) && (legendFull(t) || !!pooledLegend(m.sp))));
}
// a banned Pokémon goes back to its own trainer as soon as it can (it doesn't use their handoff)
function returnBannedHome(k) {
  const R = ranchOf(k); if (!R) return;
  for (const m of R.active.filter(x => x.ranch && x.ranch.how === 'banned')) { const t = T(m.ranch.from); if (t && t.org === k && ranchCanTake(t, m)) ranchHand(k, m.uid, t.id); }
}
// a legendary whose time is up while it waits in a ranch moves on, as it would from a team
function ranchLegendLeaves(k, m, why) {
  const R = ranchOf(k); if (!R) return;
  R.active = R.active.filter(x => x !== m);
  const from = m.ranch || {};
  delete m.ranch;
  releaseLegend({ id: from.from, lg: from.lg }, m, why);
  news(`${m.sp} moved on from the ${orgName(k)} ranch. It will wait in the ${leagueName(m.lgHome ?? 0)} for a new partner.`, k === S.userOrg ? 'you' : 'title');
}
// the player moves a ranch Pokémon out of the active ranch: on display, or (a legendary) on its way
function ranchShelf(k, uidPick) {
  const R = ranchOf(k), m = R && R.active.find(x => x.uid === uidPick); if (!m) return null;
  if (isLegendLine(m.sp) && m.partners) { ranchLegendLeaves(k, m, 'let go from the ranch'); return m; }
  R.active = R.active.filter(x => x !== m);
  toRetiredRanch(k, ranchRecord(m, { season: curSeason(), from: m.ranch ? m.ranch.from : null, fromName: m.ranch ? m.ranch.fromName : '', why: 'moved to the retired ranch' }));
  return m;
}

// Before each season every challenger registers at most three Pokémon.
// AI trainers keep their strongest; the player decides for their own trainers.
const isGift = m => m.gift === S.season + 1 || m.gift === S.season && S.phase === 'season';
function regular(t) { return t.team.filter(m => !isGift(m)); }
function bestThree(t) { const v = m => (isSpecial(m) ? 10000 : 0) + SP[m.sp].bst * (1 + (onSpec(t, m.sp) ? 0.1 : 0)); return regular(t).slice().sort((a, b) => v(b) - v(a)).slice(0, START_TEAM).map(m => m.uid); }
function beginRegistration() {
  S.ranchStepOn = false;
  const mine = userTrainers().filter(t => t.role === 'challenger' && regular(t).length > START_TEAM);
  if (!mine.length) return startSeason();
  S.phase = 'register';
  S.registration = {};
  for (const t of mine) S.registration[t.id] = bestThree(t);
}
function applyRegistration(t, uids) {
  const keep = regular(t).filter(m => uids.includes(m.uid)).slice(0, START_TEAM).concat(t.team.filter(isGift));
  if (!keep.length) return;
  const gone = t.team.filter(m => !keep.includes(m));
  for (const m of gone) farewell(t, m, 'not registered for the new season');
  // v192: a team's trainer's unregistered Pokémon go on display in the team's historical ranch
  if (t.org && ranchOf(t.org)) for (const m of gone) toRetiredRanch(t.org, ranchRecord(m, { season: S.season, from: t.id, fromName: dn(t), why: `not registered by ${dn(t)} for Season ${S.season + 1}` }));
  t.team = keep;
  if (gone.length && t.user) news(`${dn(t)} registered ${keep.map(m => m.sp).join(', ')} for Season ${S.season + 1} and released ${gone.map(m => m.sp).join(', ')}.`, 'you', t.id);
}
function confirmRegistration() {
  for (const [id, uids] of Object.entries(S.registration || {})) { const t = T(+id); if (t && regular(t).length > START_TEAM) applyRegistration(t, uids); }
  S.registration = null;
  startSeason();
}
// v174: offers that take a trainer off your team (a gym invitation, an Elite Four seat challenge) are settled before
// offers that bring one back (a former trainer who lost their post). So you know whether a promotion opens a roster
// spot before deciding whether to release someone to make room, and nobody is invited to a gym after being released.
const OFFER_ORDER = { leader: 0, e4: 0, rejoin: 1 };
function orderOffers() {
  if (!S || !S.offers || S.offers.length < 2) return;
  S.offers = S.offers.map((o, i) => ({ o, i })).sort((a, b) => (OFFER_ORDER[a.o.kind] ?? 0) - (OFFER_ORDER[b.o.kind] ?? 0) || a.i - b.i).map(x => x.o);
}
// an offer that no longer fits (the invited trainer left your team, or the former trainer has already found a team)
function offerStale(o) {
  const u = T(o.id); if (!u) return true;
  if (o.kind === 'rejoin') return u.role !== 'challenger' || !!u.org;
  return u.org !== S.userOrg || u.role !== 'challenger';
}
function acceptOffer(accept, releaseId) {
  orderOffers();
  const o = S.offers[0]; if (!o) return;
  useLeague(o.lg || 0);
  const u = T(o.id);
  if (offerStale(o)) {
    // a vacant gym whose invitation can't go ahead still needs a leader
    if (o.kind === 'leader' && !S.gyms[o.slot].leader) {
      const nl = bestCandidate([]) || newTrainer({ age: ri(26, 44), quality: 56, role: 'leader' });
      if (nl.org) promote(nl, 'leader', o.slot); else { S.challengers = S.challengers.filter(x => x !== nl.id); installElite(nl, 'leader', o.slot); }
      news(`${dn(nl)} took over ${TOWNS[o.slot]} Gym.`, 'move', nl.id);
    }
    S.offers.shift(); return;
  }
  S.lastSeatBattle = null;
  if (o.kind === 'rejoin') {
    if (accept && u && u.role === 'challenger' && !u.org) rejoin(u, o.org, releaseId);
    else if (u) news(`You passed on bringing back ${dn(u)}. They go on as an independent.`, 'you', u.id);
    S.offers.shift(); return;
  }
  if (accept && o.kind === 'e4') {
    const n = (S.seatBattles || []).length;
    const extra = [];
    const won = seatChallenge(u, o.slot, extra, '');
    S.lastSeatBattle = S.seatBattles[n];
    (S.changes = S.changes || []).push(...extra);
    if (won) news(`Your roster has an open spot for the draft.`, 'you', u.id);
  } else if (accept) {
    const from = orgName(u.org);
    promote(u, 'leader', o.slot); news(`${u.name} left ${from} to become ${TOWNS[o.slot]} Gym Leader. Your roster has an open spot.`, 'you', u.id);
  } else if (o.kind === 'leader') {
    const nl = bestCandidate([]) || newTrainer({ age: ri(26, 44), quality: 56, role: 'leader' });
    if (nl.org) promote(nl, 'leader', o.slot); else { S.challengers = S.challengers.filter(x => x !== nl.id); installElite(nl, 'leader', o.slot); }
    news(`${dn(u)} declined ${TOWNS[o.slot]} Gym. ${dn(nl)} took the job.`, 'move', nl.id);
  }
  S.offers.shift();
}
function userRelease(id) { const t = T(id); if (t && t.user && t.role === 'challenger') release(t); }

function startSeason() {
  S.tourneyPause = false;
  S.season++; S.week = 0; S.phase = 'season'; S.dexSeason = {}; S.weekOffers = {}; S.changes = null; S.progress = null; S.plans = {}; S.worlds = null;
  eachLeague(() => {
    S.league = null; S.lastBattles = [];
    if (S.season > 1 && featOn('rotation')) rotateGyms();
    enforceBans();
    S.gyms.forEach(g => { g.w = 0; g.l = 0; g.streak = 0; g.foes = []; g.lastSwap = null; });
    for (const t of challengers()) {
      settleItemOffers(t);
      if (!t.user || !t.itemsManual) autoEquip(t);
      t.badges = []; t.badgeWeek = null; t.weekLog = [];
      for (const m of t.team) m.form = (m.form || 0) * 0.3;
      const base = 10 + Math.min(8, t.seasons * 2);
      if (regular(t).length > START_TEAM) applyRegistration(t, bestThree(t));
      t.team.forEach((m, i) => { m.lvl = base - (i === 0 ? 0 : 1); refreshMoves(m); });
      t.seasons++;
    }
    for (const id of [S.champion, ...S.e4, ...S.gyms.map(g => g.leader)]) { const t = T(id); t.weekLog = []; t.badges = []; t.seasons = (t.seasons || 0) + 1; relevelElite(t); }
  });
  for (const id of S.freeAgents) { const t = T(id); if (t && t.role === 'free') t.seasons = (t.seasons || 0) + 1; }
  if (featOn('tourney')) drawTourneyRule();
  const circ = eachLeague(() => S.challengers.length);
  news(`Season ${S.season} begins: ${ORG_KEYS.map(k => `${ORGS[k].short} ${org(k).roster.length}`).join(', ')}. ${nLeagues() > 1 ? circ.map((n, i) => `${n} challengers in the ${leagueName(i)}`).join(', ') : circ[0] + ' challengers on the circuit'}.`, 'league');
}

function newWorld(userOrg, cfg = { teams: 4, roster: 3 }) {
  S = { version: 3, season: 0, week: 0, phase: 'draft', trainers: {}, nextId: 1, nextUid: 1, usedNames: {}, famousUsed: [], dex: {}, dexSeason: {}, userOrg, gyms: [], e4: [], champion: null, challengers: [], freeAgents: [], news: [], history: [], hof: [], stats: { ko: {}, use: {} }, meta: null, offers: [], plans: {}, catchPicks: {}, lastBattles: [], weekOffers: {}, orgs: {} };
  customFor = undefined; useCustom(customLib);
  S.cfg = { teams: cfg.teams, roster: cfg.roster, leagues: [1, 2, 4].includes(cfg.leagues) ? cfg.leagues : 1, allFamous: !!cfg.allFamous, baseOff: !!cfg.baseOff, packs: (cfg.packs || []).filter(k => FAMOUS_PACKS[k]), off: Object.fromEntries((cfg.off || []).filter(k => FEATURES.some(g => g.items.some(i => i[0] === k))).map(k => [k, true])),
    tourneyRule: cfg.tourneyRule === 'none' || TOURNEY_RULES[cfg.tourneyRule] ? cfg.tourneyRule : 'rotate' };
  // v185: the league's Pokédex is fixed now, for good
  S.cfg.dex = cfg.dex !== undefined ? dexCopy(cfg.dex) : (dexLib.on ? dexCopy(dexLib) : null);
  applyDex(S.cfg.dex);
  // the league keeps its own copy of the player's packs that are switched on
  S.customPacks = JSON.parse(JSON.stringify(customLib.filter(p => S.cfg.packs.includes(p.key))));
  customFor = undefined; ensureCustom();
  // your team plus rival teams drawn at random from the rest
  const rivals = shuffle(ALL_ORG_KEYS.filter(k => k !== userOrg)).slice(0, cfg.teams - 1);
  S.orgKeys = ALL_ORG_KEYS.filter(k => k === userOrg || rivals.includes(k));
  applyCfg();
  for (const k of ORG_KEYS) S.orgs[k] = { key: k, roster: [], hist: [], cups: 0 };
  // every League after the first starts empty and is built in turn
  // which regions this world uses, in random order
  const regions = shuffle(LEAGUE_SETS.map((_, i) => i)).slice(0, S.cfg.leagues);
  const blank = i => ({ gyms: [], e4: [], champion: null, challengers: [], history: [], stats: { ko: {}, use: {} }, lastBattles: [], meta: null, towns: LEAGUE_SETS[regions[i]].towns.slice(), lgName: LEAGUE_SETS[regions[i]].name });
  S.leagues = [null]; S.lg = 0;
  S.towns = LEAGUE_SETS[regions[0]].towns.slice(); S.lgName = LEAGUE_SETS[regions[0]].name; TOWNS = S.towns;
  for (let i = 1; i < S.cfg.leagues; i++) S.leagues.push(blank(i));
  for (let li = 0; li < S.cfg.leagues; li++) inLeague(li, () => foundLeague());
  foundingDraft(userOrg);
}
// one League's founding staff: eight Gym Leaders, the Elite Four and a Champion
function foundLeague() {
  const types = shuffle(TYPES);
  for (let i = 0; i < 8; i++) {
    S.gyms.push({ leader: null, w: 0, l: 0, hist: [] });
    const t = newTrainer({ age: ri(22, 50), quality: 50 + i * 2.2, role: 'leader', specialty: types[i] });
    installElite(t, 'leader', i);
  }
  const e4t = types.slice(8, 12);
  for (let i = 0; i < 4; i++) {
    S.e4.push(null);
    const taken = S.e4.filter(Boolean).map(id => T(id).specialty);
    const fam = !(S.cfg && S.cfg.allFamous) && rand() < FAMOUS_E4_CHANCE ? famousAvailable(f => f.age >= 18 && f.spec && !taken.includes(f.spec)) : [];
    const t = fam.length ? makeFamous(pick(fam), 'e4', 66 + i, E4_LV[i]) : newTrainer({ age: ri(26, 50), quality: 64 + i, role: 'e4', specialty: taken.includes(e4t[i]) ? TYPES.find(ty => !taken.includes(ty) && !types.slice(0, 8).includes(ty)) : e4t[i] });
    installElite(t, 'e4', i);
    if (t.famous) news(`${t.name} has joined the ${S.lgName} as a member of the Elite Four.`, 'move', t.id);
  }
  const c = newTrainer({ age: ri(24, 40), quality: 72, role: 'champion', specialty: types[12] });
  c.foundingChamp = true;
  installElite(c, 'champion');
}
// ---------- moving trainers between Leagues ----------
// A team may move its circuit trainers between Leagues in the offseason, to dodge a bad matchup against a League's
// Champion and Elite Four or its meta. Rosters stay at ROSTER per League, so a full League means a swap.
// How well a trainer's types line up against League i: +1 for each foe Pokémon they hit super-effectively, −1 for
// each that hits all of their Pokémon super-effectively, with the Champion counting double and the meta half.
function leagueFit(t, i) {
  return inLeague(i, () => {
    const mine = t.team; if (!mine.length) return 0;
    const hits = (atkTypes, sp) => atkTypes.some(ty => effVs(ty, sp) >= 2);
    const score = (sp, w) => (mine.some(m => hits(monTypes(m), sp)) ? w : 0) - (mine.every(m => SP[sp].types.some(ty => effVs(ty, m.sp) >= 2)) ? w : 0);
    let v = 0, n = 0;
    const champ = T(S.champion);
    if (champ) for (const m of champ.team) { v += score(m.sp, 2); n += 2; }
    for (const id of S.e4) { const e = T(id); if (e) for (const m of e.team) { v += score(m.sp, 1); n += 1; } }
    for (const sp of S.metaMons || []) if (SP[sp]) { v += score(sp, 0.5); n += 0.5; }
    return n ? Math.round(v / n * 100) / 100 : 0;
  });
}
// v164: League moves have their own offseason step, after the draft and before the Champion's reward and registration
const canMoveNow = () => nLeagues() > 1 && S.phase === 'reassign';
function beginReassign() {
  if (nLeagues() < 2) return beginBanVote();
  S.phase = 'reassign';
  S.reassign = { moves: [], start: {} };
  for (const id of S.userOrg ? org(S.userOrg).roster : []) S.reassign.start[id] = lgOf(T(id));
  aiLeagueMoves();
}
function confirmReassign() {
  if (S.phase !== 'reassign') return;
  S.reassign = null;
  beginBanVote();
}
// a legendary is one per League, so a trainer can't carry one into a League where someone already has it
function moveBlock(t, to) {
  if (t.role !== 'challenger' || !t.org) return 'Only team trainers on the circuit can change Leagues.';
  const legs = t.team.filter(m => SP[m.sp].legend).map(m => m.sp);
  const clash = legs.length ? inLeague(to, () => { const held = ownedLegends(); return legs.find(sp => held.has(sp)); }) : null;
  return clash ? `Someone in the ${leagueName(to)} already has ${clash}.` : null;
}
function shiftLeague(t, to) {
  const from = homeLeague(t); if (from === to) return;
  inLeague(from, () => { S.challengers = S.challengers.filter(x => x !== t.id); });
  t.lg = to;
  inLeague(to, () => { if (!S.challengers.includes(t.id)) S.challengers.push(t.id); });
  (t.lgMoves = t.lgMoves || []).push({ season: S.season + 1, from, to });
}
// move a trainer to League `to`; swapId names a teammate there to trade places with when that League is full
function moveTrainer(id, to, swapId) {
  const t = T(id); if (!t || !canMoveNow() || to === lgOf(t) || to < 0 || to >= nLeagues()) return 'No move possible.';
  const k = t.org;
  const why = moveBlock(t, to); if (why) return why;
  const room = lgRoster(k, to).length < ROSTER;
  let o = null;
  if (!room) {
    o = T(swapId);
    if (!o || o.org !== k || lgOf(o) !== to) return `The ${leagueName(to)} is full for ${orgName(k)}; pick a teammate there to swap with.`;
    const w2 = moveBlock(o, lgOf(t)); if (w2) return w2;
  }
  const from = lgOf(t);
  shiftLeague(t, to); if (o) shiftLeague(o, from);
  if (S.reassign) S.reassign.moves.push({ org: k, id: t.id, from, to, swap: o ? o.id : null });
  inLeague(to, () => news(`${orgName(k)} moved ${dn(t)} from the ${leagueName(from)} to the ${leagueName(to)}${o ? `, swapping with ${dn(o)}` : ''}.`, k === S.userOrg ? 'you' : 'move', t.id));
  return null;
}
// ---------- Grand Slam: Champion (at a season's end) of every League in the world ----------
let champLgCache = { key: null, map: null };
function champLeagueMap() {
  const lens = eachLeague(() => S.history.length).join(',');
  const key = `${S.season}|${S.phase}|${lens}`;
  if (champLgCache.key === key && champLgCache.map) return champLgCache.map;
  const map = new Map();
  eachLeague(i => { for (const h of S.history) { if (!map.has(h.champ)) map.set(h.champ, new Set()); map.get(h.champ).add(i); } });
  champLgCache = { key, map };
  return map;
}
function champLeaguesOf(t) { return nLeagues() > 1 && t ? champLeagueMap().get(t.id) || new Set() : new Set(); }
const isGrandSlam = t => nLeagues() > 1 && champLeaguesOf(t).size === nLeagues();
// ---------- v175: chasing the Grand Slam ----------
// A Slam chaser has won at least one League but not all of them. The AI pulls chasers toward Leagues they haven't
// won, a dethroned chaser goes back to the circuit in an unwon League, and a contender (titles in 2+ Leagues) gets
// SLAM_EXTRA more seasons before age can retire them.
const SLAM_PULL = 0.5, SLAM_EXTRA = 3;
const slamChaser = t => nLeagues() > 1 && !!t && ((t.titleSeasons || []).length || (t.career && t.career.titles)) && !isGrandSlam(t) && champLeaguesOf(t).size >= 1;
const slamContender = t => slamChaser(t) && champLeaguesOf(t).size >= 2;
// cheap checks first: this runs for every trainer in the retirement passes
const slamProtected = t => nLeagues() > 1 && !!t && ((t.titleSeasons || []).length >= 2 || (t.career && t.career.titles >= 2)) && (t.seasons || 0) < careerSpan(t) + SLAM_EXTRA && slamContender(t);
const unwonLeagues = t => Array.from({ length: nLeagues() }, (_, i) => i).filter(i => !champLeaguesOf(t).has(i));
// a League's matchup, plus a pull toward the Leagues a Slam chaser still needs
const slamFit = (t, i) => leagueFit(t, i) + (slamChaser(t) && !champLeaguesOf(t).has(i) ? SLAM_PULL : 0);
// can t (any circuit trainer, team or independent) go to League i: room there and no legendary clash
function slamRoom(t, i) {
  if (i === lgOf(t)) return false;
  const legs = t.team.filter(m => SP[m.sp].legend).map(m => m.sp);
  if (legs.length && inLeague(i, () => { const held = ownedLegends(); return legs.some(sp => held.has(sp)); })) return false;
  return t.org ? lgRoster(t.org, i).length < ROSTER : inLeague(i, () => independents().length) < indieCap();
}
// after the League offseasons: a dethroned Slam chaser looks for a new challenge in a League they haven't won
// (your own trainers stay put; the reassignment step marks their unwon Leagues for you)
function slamReturns(changes) {
  const ids = S.slamReturn || []; S.slamReturn = [];
  if (nLeagues() < 2) return;
  for (const id of ids) {
    const t = T(id);
    if (!t || t.role !== 'challenger' || t.user || !slamChaser(t) || S.offers.some(o => o.id === t.id)) continue;
    const from = homeLeague(t); if (from == null) continue;
    const opts = unwonLeagues(t).filter(i => slamRoom(t, i));
    if (!opts.length) continue;
    const to = opts.sort((a, b) => leagueFit(t, b) - leagueFit(t, a))[0];
    shiftLeague(t, to);
    const msg = `Former Champion ${t.name} wants a new challenge and moves from the ${leagueName(from)} to the ${leagueName(to)}, a League they haven't won yet (Grand Slam: ${champLeaguesOf(t).size} of ${nLeagues()}).`;
    inLeague(to, () => news(msg, 'move', t.id));
    changes.push(msg);
  }
}
function checkGrandSlams() {
  if (nLeagues() < 2) return;
  for (const id of eachLeague(() => S.champion)) {
    const t = T(id); if (!t) continue;
    // one League short of the Slam (4-League worlds): the chase makes the news, once per count
    const n = champLeaguesOf(t).size;
    if (nLeagues() > 2 && !t.grandSlam && n === nLeagues() - 1 && t.slamNews !== n) {
      t.slamNews = n;
      news(`${dn(t)} has now been Champion of ${n} of ${nLeagues()} Leagues and is chasing the Grand Slam. Still to win: ${unwonLeagues(t).map(leagueName).join(', ')}.`, t.user || t.formerUser ? 'you' : 'title', t.id);
    }
    if (t.grandSlam || !isGrandSlam(t)) continue;
    t.grandSlam = S.season;
    news(`GRAND SLAM! ${dn(t)} has now been Champion of ${nLeagues() === 2 ? 'both' : 'all ' + nLeagues()} Leagues: ${eachLeague(() => S.lgName).join(', ')}.`, t.user || t.formerUser ? 'you' : 'title', t.id);
  }
}
// AI teams make at most one swap each offseason, when it clearly improves both trainers' matchups
const MOVE_EDGE = 0.35;
function aiLeagueMoves() {
  if (nLeagues() < 2) return;
  for (const k of ORG_KEYS) {
    if (k === S.userOrg) continue;
    // v175: a team always looks when one of its trainers is chasing the Grand Slam; other swaps keep the 60% look
    const look = rand() <= 0.6;
    const ts = org(k).roster.map(T).filter(t => t.role === 'challenger');
    let best = null;
    for (const a of ts) for (const b of ts) {
      if (lgOf(a) >= lgOf(b) || !(look || slamChaser(a) || slamChaser(b))) continue;
      const gain = slamFit(a, lgOf(b)) + slamFit(b, lgOf(a)) - slamFit(a, lgOf(a)) - slamFit(b, lgOf(b));
      if (gain > MOVE_EDGE && (!best || gain > best.gain) && !moveBlock(a, lgOf(b)) && !moveBlock(b, lgOf(a))) best = { a, b, gain };
    }
    // a Slam chaser can also take an open spot in a League they haven't won, without a swap
    for (const a of ts) {
      if (!slamChaser(a)) continue;
      for (let i = 0; i < nLeagues(); i++) {
        if (i === lgOf(a) || lgRoster(k, i).length >= ROSTER || moveBlock(a, i)) continue;
        const gain = slamFit(a, i) - slamFit(a, lgOf(a));
        if (gain > MOVE_EDGE && (!best || gain > best.gain)) best = { a, to: i, gain };
      }
    }
    if (best) best.b ? moveTrainer(best.a.id, lgOf(best.b), best.b.id) : moveTrainer(best.a.id, best.to);
  }
}
function foundingDraft(userOrg) {
  // veterans available in the founding draft
  const experienced = Math.max(8, ORG_KEYS.length * ROSTER + indieCap() - 6) * nLeagues();
  for (let i = 0; i < experienced; i++) {
    // experienced but with no recorded League history: older, better rated, more evolved Pokémon
    const exp = ri(1, 5);
    const t = newTrainer({ age: ri(12, 16) + exp, quality: ri(36, 56) + exp * 2, role: 'free' });
    starterTeam(t, 9);
    { const o = wildOffers(t)[0]; if (o) t.team.push(stamp(makeMon(o.sp, 35), 'caught')); }
    t.team.forEach(m => { m.lvl = Math.max(m.lvl, 16 + exp * 6); evolveMon(m, t.specialty); });
    S.freeAgents.push(t.id);
  }
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
  const per = nLeagues() > 1 ? ` for each of ${nLeagues()} Leagues (${eachLeague(() => S.lgName).join(', ')})` : '';
  news(`The ${nLeagues() > 1 ? 'World Circuit' : S.lgName} has been founded. ${words[ORG_KEYS.length][0].toUpperCase() + words[ORG_KEYS.length].slice(1)} teams will draft ${words[ROSTER]} trainer${ROSTER > 1 ? 's' : ''} each${per}. You run ${orgName(userOrg)}.`, 'league');
  setupDraft(ROSTER * nLeagues());
}

if (typeof module !== 'undefined') module.exports = { BAN_BALLOT, BAN_CAP, BAN_MAX_NEW, BAN_MAX_SEASONS, banMembers, bansIn, banOf, bannedIn, buildBanBallot, beginBanVote, autoBanVote, setBanVote, confirmBanVote, enforceBans, ranchCanTake, returnBannedHome, ranchShelf, ageRanch, TOURNEY_RULES, tourneyRule, tourneyRuleKnown, drawTourneyRule, bringThree, startSeason, ranchLastChance, RANCH_STEPS, RANCH_STEPS_PARADOX, restMon, unrestMon, returnRested, aiRest, canRest, ranchChampionRoster, ranchOf, ranchHand, ranchAuto, beginRanch, confirmRanch, answerRanchPick, autoRanchPick, ranchTakers, addToRanch, settleRanchPick, ranchable, runTourney, tourneyPick, aiTourneyChoice, tourneySpecies, tourneySpOk, settleTourneyOffer, seedOrder, TOURNEY_WEEK, applyDex, dexImport, checkDexEntry, dexNorm, dexBaseStats, get dexLib() { return dexLib; }, set dexLib(v) { dexLib = v; }, BASE_STATS, SPECIES_AB, STARTERS, LINE, EVOLVED, GREAT_LEGENDS, makeMon, ROAMERS, STORMS, paradoxRewardPool, settleStorm, stormRank, ABILITIES, SPECIES_AB, abilityOf, rollAbSlot, ITEMS, TYPE_ITEMS, itemScore, autoEquip, eliteItems, gymItemOffer, takeItemOffer, setItem, bagAdd, heldItem, crossroads, reinvent, dryStreak, isGrandSlam, champLeaguesOf, checkGrandSlams, useLeague, inLeague, eachLeague, nLeagues, lgOf, lgRoster, openLeague, moveTrainer, leagueFit, aiLeagueMoves, worldChampionship, cupStandings, leagueName, startLegend, legendBattle, legendWeek, villainLegend, legendOffseason, joinLegend, answerLegend, weald, wantsLegend, recordGreat, GREAT_LEGENDS, REWARD_LEGENDS, FEATURES, featOn, legacyChance, scheduleLegacy, makeLegacy, legacyLine, metaMons, counterTypesFor, metaCounters, AWARDS, seasonAwards, seasonScore, VILLAIN_TEAMS, startVillainEvent, villainWeek, endVillainEvent, eventActive, eventFoe, eventTeam, gymClosed, raidBattle, answerSnag, offerSnag, snag, purify, purifyWeek, makeShadow, openHeart, wantsRaid, circuitLevel, bondBlocked, BOND_ROLES, checkBonds, bondMon, bondName, BOND_ATK, pokerusWeek, pkrsContact, infectPkrs, monGrowth, LUCKY_CHANCE, PKRS_WEEKS, titleOf, titleNameTaken, famName, famBase, chooseFamous, checkCustom, checkPackName, setCustomLib, parsePackText, prepImport, builtinSource, packExportText, uniquePackName, BUILTIN_SOURCES, ensureCustom, useCustom, customSpecies, newCustomKey, get customLib() { return customLib; }, MALE, FEMALE, FAMOUS_PACKS, BASE_FAMOUS, packOn, famousAvailable, TRADE_EVOS, findTrade, doTrade, roadTrades, answerTrade, MEGA, megaFor, hasMega, megaHolder, assignMegaStone, earnMega, rotateGyms, fitGymTeam, isSpecial, monTypes, makeDelta, DELTA_CHANCE, gymLost, adaptGym, activeOutbreak, maybeOutbreak, offerRejoin, rejoinChoice, simOneSeason, autoStep, fixHallOfFame, repairLevels, repairLeagues, homeLeague, backfillLeagueTags, isLegendLine, legendBlocked, pooledLegend, claimLegend, legendDepartures, adoptLegends, curSeason,  eliteSlot, TRAITS, traitOf, h2hOf, isRival, roadBattles, FAMOUS_TAG_LIST, FAMOUS_BY_NAME, ULTRA_BEASTS, BABY_LEGENDS, ownedLegends, freeBabies, PARADOX, DUAL_CLASSES, specTypes, specFit, applyCfg, ALL_ORG_KEYS, get ORG_KEYS() { return ORG_KEYS; }, get ROSTER() { return ROSTER; }, careerSpan, ageRetireChance, leadStyle, LEAD_STYLES, confirmGift, legacyOf, legacyPoints, coverOptions, MOVES, idealMoves, refreshMoves, estimate, battler, natureFx, NATURES, ensureMon, learnedCov, frTier, formTier, retireChance, trainerRec, blankStat, FAMOUS, confirmReward, confirmReassign, beginReassign, beginGifts, confirmGifts, giftTeammates, confirmGift, autoGift, canMoveNow, LEGENDS, champOrg, confirmRegistration, independents, ORGS, orgStandings, userTrainers, userRelease, draftCurrent, draftAvail, PACE, dn, CLASSES, setupDraft, get S() { return S; }, set S(v) { S = v; }, newWorld, simWeek, runLeague, userDraft, acceptOffer, aiAction, aiCatch, wildOffers, ovr, T, challengers, SP, BASES, battle };
