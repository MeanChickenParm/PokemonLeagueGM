const UPDATES = [
  { id: 203, date: 'November 8, 2026', time: '11:28 AM ET', title: 'Trainers vote on bans', items: [
    "Banlist votes are now weighted: half from the teams (GMs) and half from the League's trainers (challengers, Gym Leaders, the Elite Four and the Champion). A Pokémon is banned when over 50% of the weighted vote backs a ban, for the longest length that still has over 50%.",
    "Trainers vote with their grudges. They push to ban Pokémon that beat them this season (more for each knockout and each loss it was part of), that hit their type or half their team super effectively, or that their rival uses. They never vote to ban a Pokémon on their own team and go easy on ones of their own type. Angrier trainers vote for longer bans.",
    "Trainers vote when the vote opens, so the ballot shows how they lean before you vote: their share for a ban and their main reasons (lost to it, weak to it, rival uses it).",
    "Expect more bans: about three new ones a season instead of about two, and longer ones, so more are in force at once. Teams also vote for longer bans than before.",
    "Ban news names the trainer with the biggest grudge who led the push, and Season history shows each ban's share of the vote (hover for the team and trainer counts).",
    "Each trainer now keeps track, for the season, of which Pokémon knocked theirs out and in how many of their losses.",
  ] },
  { id: 202, date: 'November 5, 2026', time: '6:31 PM ET', title: 'Battle speed', items: [
    "Battle replays have a speed setting: Slow, Normal, Fast or Very fast. Change it any time during a battle and the replay speeds up or slows down on the spot.",
    "New Pause button to stop a replay mid-battle and read the log, then Play to carry on. Skip to the result still jumps straight to the end.",
    "Your speed is remembered for every battle after. Replays now start at Normal, a little over twice as slow as before; Fast is the old speed.",
  ] },
  { id: 201, date: 'November 3, 2026', time: '11:19 PM ET', title: 'Banlist lengths', items: [
    "Banlist votes now set a ban's length up front. Each team votes Allow, 1 season, 2 seasons or 3 seasons for each Pokémon on the ballot. A majority of teams voting for any ban bans it, for the longest length a majority backed (a vote for 3 seasons also counts toward 2 and 1).",
    "Bans are no longer voted on again each offseason. Each one runs its full length, then lifts on its own.",
    "A League can now hold up to 15 bans at a time (up to five new ones a season, for up to three seasons each), up from five.",
    "The Banlist vote screen shows what's still banned and for how long, the office Banlist card shows the last season of each ban, and Season history shows each ban's length.",
    "Bans already in place in existing leagues run to the three-season limit.",
  ] },
  { id: 200, date: 'November 3, 2026', time: '10:01 PM ET', title: 'Radiant Pokémon', items: [
    "New: Radiant Pokémon (✧). Rarer than shinies (about 0.3% of wild Pokémon, eight times that in a mass outbreak, double for Collectors). A Radiant wears its species' shiny image.",
    "Every Radiant has at least Good IVs: no stat below 16.",
    "Every Radiant has an ability its evolution line never has, and stronger in battle than any ability the line does have (a line that already has a top ability, like Dragonite's Multiscale, gets a different top one). Abilities that suit its type and attacking style come up more often. It replaces its own ability and stays through evolution. Signature abilities can turn up; only ones tied to a Pokémon's own forms (Zero to Hero, Schooling, Disguise, Stance Change and the like) can't.",
    "Radiants get a ✧ Radiant tag everywhere shinies get theirs, a glowing explore card, a ✧ ability chip, a Radiant filter in My Pokédex, a glossary entry and catch news. Trainers value them above shinies when choosing what to catch and keep.",
    "New option in Advanced options (Wild Pokémon): Radiant Pokémon. On by default, including in existing leagues.",
    "Delta Pokémon no longer roll an unusual ability (they had a 15% chance). Radiants are now the Pokémon with abilities their species never gets. Deltas keep their unusual type and outstanding IVs.",
  ] },
  { id: 199, date: 'November 3, 2026', time: '9:08 PM ET', title: 'New trainer traits', items: [
    "Seven new trainer traits. Underdog: +5% against a stronger team. Front-runner: +4% against a weaker team, −3% against a stronger one. Comeback Kid: +4% in the battle after a loss. Home Turf: +4% when defending a Gym, Elite Four or Champion seat. Purist: +3% when every Pokémon on the team fits their specialty.",
    "Hero: +6% against villain teams, and their Shadow Pokémon's hearts open 50% faster. Globetrotter: +5% in the World Championship; their team looks for a League move for them every offseason, takes smaller matchup gains to make one, and a Globetrotter chasing the Grand Slam feels twice the pull toward Leagues they haven't won.",
    "A team counts as stronger or weaker when its power is more than 5% above or below the other's.",
    "Trainers still have a 75% chance of a trait, now drawn from 16. Trainers who already have a trait keep it. Famous trainers who had no set trait now get a fitting one, including Home Turf for Lt. Surge, Sabrina and Clair, Purist for Karen, Erika and Morty, Hero for Michael, Hilbert and Elio, and Globetrotter for Peony and Kahili.",
  ] },
  { id: 198, date: 'November 3, 2026', time: '8:59 PM ET', title: 'More trainer classes', items: [
    "New dual-type trainer classes covering type pairs no class had. From the games: Tuber (Water/Normal), Cameraman (Normal/Electric), Rancher (Normal/Ground), Picnicker (Grass/Normal), Pokémon Breeder (Normal/Fairy), Pilot (Flying/Steel) and Poké Maniac (Ground/Poison).",
    "New extended classes: Courier, Locksmith, Samurai, Knight, Fencer, Mercenary, Antique Dealer, Junk Dealer, Jeweler, Fossil Diver, Paleontologist, Stoker, Rock Climber, Lamplighter, Phantom Thief, Occultist, Paranormal Investigator, Doll Collector, Farmer, Lumberjack, Landscaper, Florist, Bandit, Orchardist, Lighthouse Keeper, Lifeguard, Harbor Master, Clam Digger, Falconer, Kickboxer, Fortune Teller, Desert Nomad, Street Fighter, Con Artist, Trickster, Lepidopterist and Figure Skater.",
    "Every type now has at least three dual classes, and Steel, Ghost, Rock and Grass have many more. Dual specialists are no more common than before (about 1 in 6 typed challengers); there's just more variety in which pair they get.",
    "New option in Advanced options (World): Extended trainer classes. On by default. Turn it off and only classes from the Pokémon games are handed out, which also retires the made-up ones from earlier versions (Storm Chaser, Volcanologist, Blacksmith, Mechanic, Herbalist, Shrine Maiden, Gravekeeper, Spelunker, Polar Explorer, Glacier Diver, Night Watchman, Monk, Astronomer, Apothecary, Dragon Rider and Wrestler).",
  ] },
  { id: 197, date: 'November 3, 2026', time: '8:39 PM ET', title: 'Temperaments', items: [
    "New: temperaments. Every nature still raises one stat and lowers another in battle, and now also gives a small effect off the field. A Pokémon's profile shows its temperament under its nature.",
    "Attack natures are fiery. Lonely bonds faster but sulks for 4 weeks after a trade. Brave hits 5% harder against a stronger team. Adamant levels 8% faster but gains less from resting. Naughty slacks off against the first three gyms but rises to face villain teams.",
    "Defense natures are steady. Bold never loses form from a loss. Relaxed gets more from resting but levels slower. Impish hits 5% harder against its trainer's rival. Lax plays down to much weaker teams.",
    "Speed natures are restless. Timid gets nervous in its first Elite Four or Championship battle each season. Hasty levels fast early in the season and fades late. Jolly lifts the whole team 3% during a win streak. Naive levels 25% faster in its first season with a new trainer.",
    "Sp. Atk natures are thinkers. Modest learns moves 5 levels early. Mild shrugs off cold streaks. Quiet comes back from a season of rest 5 levels higher. Rash swings from −8% to +8% each battle.",
    "Sp. Def natures are composed. Calm steadies Timid teammates. Gentle helps teammates 10+ levels below it level 15% faster. Sassy hits 5% harder after a loss. Careful loses half as much form from fainting.",
    "Neutral natures are wildcards. Hardy never runs hot or cold. Docile keeps its friendship when traded. Serious hits 4% harder in Elite Four and Championship battles. Bashful starts each season shy and grows with every win. Quirky takes on a different temperament each season.",
    "The glossary has a Temperaments section, ranch lists show each Pokémon's temperament next to its nature, and temperaments can be switched off in Advanced options (Events).",
  ] },
  { id: 196, date: 'November 3, 2026', time: '8:05 PM ET', title: 'Class pictures', items: [
    "New: class pictures. One image can cover a whole trainer class, so every Hiker (or Lass, Swimmer, Ace Trainer and so on) shows it. A trainer's own portrait still comes first, so you can give one Hiker a unique look and let the rest share the class picture.",
    "Trainers keep their class picture after becoming a Gym Leader, Elite Four member or Champion, unless they have a portrait of their own.",
    "Images (in the league menu, and in Advanced options) has a new Classes tab listing every trainer class, with how many trainers hold each one in your league. Tap a class to add or change its picture.",
    "A trainer's portrait window has a button to add or change the picture for their whole class, and shows the class picture when they have none of their own.",
    "Image packs: files in a classes folder (like classes/Hiker.png) import as class pictures, and Export pack saves class pictures there too.",
  ] },
  { id: 195, date: 'November 3, 2026', time: '7:15 PM ET', title: 'Historical and retired ranches, ban records', items: [
    "The team ranch's display shelf is now two panels. The historical ranch holds the title-winning rosters; retired Pokémon (retired with a trainer, not registered, or unused in the active ranch) have their own retired ranch below it.",
    "Each title roster in the historical ranch is collapsible: tap a season to open or close its roster. They're listed newest first and start closed.",
    "Ranch text, the Glossary and the Retired Pokémon screen now say retired ranch where they mean retired Pokémon.",
    "New Records board under Pokémon: Most times banned. It counts each time a League vote bans a species (a ban kept in later votes counts once), shows the seasons it was banned for and flags what's banned now. Legendaries are included.",
    "History has a new Banlists section: every vote in the League, newest first, with what was banned, kept and lifted (and by how many teams), and the banlist in force for each season.",
    "The ban log now keeps up to 600 entries instead of 60, so the history doesn't lose old votes.",
    "The page menu now fits phone screens: on narrow screens Glossary and Updates move into a More menu (with the new-updates dot), so the page no longer scrolls sideways a little on every screen.",
    "Fixed text changing size in the Banlists history on phones. It's now one block per vote (banned, kept, lifted and the banlist in force) instead of a wide table, and the page no longer lets the browser enlarge text on its own.",
    "The Banlist ballot now varies: instead of the season's exact top five, it's five drawn at random from the top 20 performers (still at most two legendaries, and one per evolutionary family). The vote screen shows each one's place in the top 20, and AI teams still lean toward banning the higher-ranked ones.",
    "Banlist limits loosened: there's no longer a limit of two new bans a season, so every Pokémon on the ballot that gets a majority is banned, and a League can hold up to five bans at a time instead of three. When there isn't room for them all, the most votes go first.",
  ] },
  { id: 194, date: 'November 3, 2026', time: '4:40 PM ET', title: 'League banlists', items: [
    "New offseason step, the Banlist vote, after the draft and League moves and before the Champion's reward and the ranch. In each League, the teams with challengers there vote on banning the season's five top performers (by knockouts and wins per battle, across challengers, Gym Leaders, the Elite Four and the Champion; at most two legendaries on the ballot).",
    "A ban needs a majority of the voting teams. Up to two new bans pass a season, the most votes first, and a League holds at most three. A ban covers the Pokémon, what it evolves from and what it evolves into: banning Sylveon bans Eevee too, but not Vaporeon.",
    "Every ban comes back to the vote each offseason, keep or lift, and lifts on its own after three seasons. AI teams never vote to ban what their own trainers use there, go easier on their sponsor's favourite types, and vote to lift a ban when they have a banned Pokémon waiting or a trainer of its type there.",
    "Bans apply to everyone in that League. Gym Leaders, Elite Four members and the Champion lose their banned Pokémon and get a replacement of their type, close in strength and favouring types that hit the season's meta. Independents let theirs go.",
    "A team challenger's banned Pokémon goes to the team ranch. A teammate in another League can take it in the ranch step, and it goes back to its own trainer, without using a handoff, as soon as it's allowed there again (the ban lifts, or the trainer moves League).",
    "Legendaries are the exception to the ranch rule: a banned legendary can wait in the ranch too. It keeps the clock it had with its trainer, and an offseason when nobody on the team can take it doesn't count toward that clock. If a teammate takes it, it registers in the usual three, not on top of them. If its time runs out while it waits, it moves on as usual.",
    "A banned Pokémon nobody on the team can take doesn't age in the ranch. After four such offseasons a legendary moves on and anything else goes on display in the historical ranch.",
    "Nothing banned in a League turns up there while it's banned: wild catches, legendary events, roamers, storms, Shadow snags, gym swaps, Elite Four and Champion teams and the Midseason Tournament prize all skip it.",
    "The office has a Banlist card while anything is banned, the League reassignment screen lists each League's bans, and the ranch says where a banned Pokémon can go. New Glossary entry: Banlist.",
    "League banlists can be turned off in Advanced options → World when creating a league. They're on in existing leagues, starting this offseason.",
  ] },
  { id: 193, date: 'November 3, 2026', time: '3:54 PM ET', title: 'Midseason Tournament rules', items: [
    "Each season's Midseason Tournament is now played under one special rule, drawn at random when the season starts (never the same as the season before) and announced in the news after week 8. Until then the office card and the tournament page say a rule is coming.",
    "Inverse Battle: the type chart is flipped. Super-effective hits are not very effective, and resisted hits and immunities become super effective. Abilities like Levitate and Flash Fire still work as usual.",
    "Legendaries banned: legendaries, mythicals, Ultra Beasts, Paradox Pokémon and baby legendaries sit out, and trainers fight with the rest of their team.",
    "Flat levels: every Pokémon fights at Lv 50, so species, moves, abilities and the trainer decide it rather than training.",
    "Trick Room: slower Pokémon move first all tournament. Priority moves still go first, and a Quick Claw can still jump the queue.",
    "Items off: no held items in the tournament. Only drawn when held items are on in the league.",
    "Bring 3: before each battle, both trainers see the other's team and bring the three Pokémon that match up best, by power and type matchups both ways. Sharper trainers choose better. Your trainers choose for themselves.",
    "Scalemons: every Pokémon's stats are scaled so its base stats add up to 600, with HP left as it is. Weak species hit like strong ones, so typing and moves decide it.",
    "Flipped: every Pokémon's base stats are reversed. HP swaps with Speed, Attack with Sp. Def, and Defense with Sp. Atk, so a Shuckle becomes a speed demon.",
    "1v1: each trainer sees the other's team and sends out the one Pokémon that matches up best. Ace against ace.",
    "Underdog Cup: only each trainer's three lowest-level Pokémon battle, so the bench decides it.",
    "Rules only change the tournament's own battles. Teams, levels and items are exactly as they were afterwards. Each tournament replay opens with the rule, the bracket page shows it, and Past winners has a new Rule column.",
    "Advanced options → Rules has a new Midseason Tournament rule setting for new leagues: Rotating (the default), any one rule every season, or Standard for plain battles. Existing leagues rotate, starting with the next tournament that hasn't reached week 8 yet.",
    "Sim to League and Sim multiple seasons have a new Stop before the Midseason Tournament option. Sim to League stops at the start of week 12; Sim multiple seasons plays on into the next season and stops there. You set the plans and play the week that ends with the tournament yourself.",
    "Sim to League is now also there on the pause after the Midseason Tournament, so it's available every week of the season.",
    "In week 12 the play button says Play Midseason Tournament: it plays the week with your plans, then the tournament.",
    "To-do list: a doubles format for the tournament is tabled for later.",
  ] },
  { id: 192, date: 'November 3, 2026', time: '12:40 PM ET', title: 'Teams use their ranches', items: [
    "AI teams now use the Team ranch every offseason. A trainer with more Pokémon than they can register almost always sends the best one they'd otherwise release to rest, so it comes back next offseason with better IVs.",
    "Whatever else an AI trainer would release at registration is passed on to the team's active ranch instead, so a teammate can use it. In the ranch these show as Passed on by, and their record with the old trainer stays on their stat card.",
    "With the ranch stocked, AI challengers now usually get a Pokémon from it each offseason, weakest trainers first. A trainer is never handed back a Pokémon they just passed on.",
    "Simming through the ranch step now runs your team the same way: each of your challengers rests their best extra, passes the others on to your ranch, and takes one Pokémon from it.",
    "Ranches have no size limit. The historical ranch used to keep only the latest 80 Pokémon; now it keeps them all.",
    "A Pokémon nobody takes from the active ranch in three offseasons goes on display in the historical ranch, which keeps saves from growing without end. A season spent resting doesn't count: a rested Pokémon's three offseasons start once it's back. Paradox Pokémon are rare, so they get six offseasons. Ranch Pokémon in their last offseason are marked Last offseason here.",
    "AI teams, and your team when simming, hand out ranch Pokémon in their last offseason first, and a great one (special, Paradox, a Champion's reward, a strong line or high IVs) goes to the weakest trainer who can use it before anything else is handed out.",
    "A rested Pokémon going back to its own trainer no longer uses that trainer's one handoff for the offseason, so they can still take another Pokémon from the ranch. The rested one registers like any of their Pokémon rather than on top of the usual three. Before, rest returns were using up nearly every handoff, so passed-on and Paradox Pokémon sat unused.",
    "In the ranch, Paradox Pokémon are now valued the same as alphas and Delta Pokémon when teams decide who gets what.",
    "The ranch screen's Retired Pokémon list now shows your top 10 by knockouts, then wins. See all opens a new Retired Pokémon screen with the whole historical ranch: sort by any column, see why each one is there, and show 100 more at a time.",
    "Every Pokémon on the Retired Pokémon lists opens its page. Where its last trainer still keeps its full stat card, you see that card; otherwise you see what the ranch kept: level, nature, record and why it's there.",
    "Sim multiple seasons lists how the ranch step is handled for your team, and when you sim 10 or more seasons or your league is already large, it reminds you that browsers only keep a few megabytes per site and to download your save file now and then.",
    "When you register your trainers yourself, the Pokémon you don't register go on display in your historical ranch instead of just being released. The same goes for every team.",
  ] },
  { id: 191, date: 'November 3, 2026', time: '10:40 AM ET', title: 'Special tags on resting Pokémon', items: [
    "Resting Pokémon now show their special conditions, so you can see at a glance when you're resting a shiny, alpha, Delta, Shadow, Paradox, legendary or other rare Pokémon. The tags appear in the Resting list, on the line saying what each trainer is resting, and on the buttons for choosing what to rest.",
    "The Resting list also shows each Pokémon's picture, nature and IVs.",
  ] },
  { id: 190, date: 'November 3, 2026', time: '9:05 AM ET', title: 'Your own images', items: [
    "Add your own pictures. The game still ships with no Pokémon artwork: you upload an image for any Pokémon (plus an optional shiny one) and a portrait for any trainer, and anything without one keeps its colored dot or initials.",
    "Three ways in, all opening the same upload window: the camera badge on a trainer's portrait square, the Add image and Add shiny image buttons on a Pokémon's page, and Images (in the league menu, and in Advanced options before a league starts), which shows what you have, the space it takes, and a grid to browse, add or replace pictures.",
    "The upload window shows the picture on a checkered background, the file's name and size, and how it looks at list, team and battle size. Pixel art (on by default) keeps sprites sharp; Flip to face right mirrors it. Empty margins are trimmed and every image is saved as a 128 × 128 square.",
    "A Pokémon's image is for the whole species, on every team. Shinies use the shiny image when there is one; Delta, alpha, Shadow and Mega Pokémon use the normal image.",
    "Pictures show in team lists, on a Pokémon's page, on catch offers, registration, the ranch and the Champion's reward, beside names in the Pokédex, records, standings and the draft, and in battle: the trainers' portraits, and each side's Pokémon, with the opponent's mirrored to face yours.",
    "Images are kept in this browser on this device and are never part of the save file, so saves stay small. Export pack saves them all as one zip; Import pack takes a zip or image files and matches them by name (Sprout.png, Sprout-shiny.png, trainers by title and name, like Hiker Ben.png).",
  ] },
  { id: 189, date: 'November 2, 2026', time: '11:47 PM ET', title: 'Team ranches and resting', items: [
    "Every team now has a ranch, with two parts. The active ranch holds Pokémon the team can hand to its own trainers, with no limit: one handoff per trainer each offseason keeps it in check. The historical ranch is on display for good. Find yours under Office → Team ranch.",
    "The Champion's reward now goes to the team's ranch instead of straight to its weakest trainer. You still choose one of three Paradox Pokémon, and from the ranch you can hand it to any of your trainers, in any League.",
    "When one of your trainers retires, you choose one of their Pokémon to keep in the active ranch. The rest go to the historical ranch, with their level, record and who they last battled for. It also applies to a trainer who left your team for a gym, an Elite Four seat or the title and retires from that post.",
    "Each time one of a team's trainers wins the title, their title-winning roster goes into the team's historical ranch, with each Pokémon's level and knockouts that season. Title defenses aren't added.",
    "Farewell gifts now go through the ranch too. A trainer leaving your team for a gym or an Elite Four seat leaves one Pokémon in the ranch (you still choose which), and you hand it to any of your trainers, in any League.",
    "Each offseason, after the Champion's reward, there's a new Team ranch step. Each of your challengers can receive one Pokémon from the active ranch. Like a farewell gift, it's registered on top of the usual three in its first season, and its past record stays on its stat card.",
    "Pokémon never age out of a ranch. Legendaries and other one-of-a-kind Pokémon never go to the active ranch. You can move a Pokémon from the active ranch to the historical ranch yourself.",
    "AI teams run their ranches too. They keep the best Pokémon from each retiring trainer and hand ranch Pokémon to their weakest trainers first.",
    "Glossary: new Team ranch entry, and the Paradox entry is updated.",
    "Rest: in the Team ranch step, each of your challengers can send one Pokémon to rest at the ranch instead of registering or releasing it. It sits out the whole next season, then comes back to the active ranch in the following offseason with better IVs (up to 31) and a little more friendship, ready to go back to its trainer, keeping its record. Legendaries and Pokémon handed out this offseason can't rest. AI trainers rest a Pokémon they'd otherwise have to release about half the time.",
  ] },
  { id: 188, date: 'November 2, 2026', time: '11:20 PM ET', title: 'The Midseason Tournament', items: [
    "The season stops for it. Playing week 12 takes you straight to the finished tournament instead of on to week 13, the way the League results follow the Elite Four. It shows the winner and the prize, how each of your trainers did, and the whole bracket with the semifinal and final replays. Continue to week 13 when you're ready; the office waits on the tournament until you do.",
    "New: the Midseason Tournament. After week 12, every challenger in every League meets in one single-elimination bracket: team trainers and independents alike. Gym Leaders, the Elite Four and Champions sit it out.",
    "The field is seeded by strength, so the strongest trainers get any byes. One loss ends a run. With several Leagues it's a single bracket for the whole world, about 100 challengers.",
    "The winner chooses an alpha of any Pokémon they like, evolved forms included, at the level of their strongest Pokémon, with outstanding IVs and already on a hot streak. Legendaries, mythicals, baby legendaries, Ultra Beasts, Paradox Pokémon and other one-of-a-kind finds can't be chosen.",
    "If one of your trainers wins, you pick the Pokémon (type to search the whole list, or take their own suggestion). If their team is full, you choose who makes room. If you don't choose, they take their own pick when the League starts.",
    "Tournament battles count toward records like any other battle, but not as League battles: there's no Mega Evolution or Battle Bond. Replays are kept for the semifinals and the final.",
    "The tournament has its own screen under League → Midseason Tournament: every round of the bracket, the semifinal and final replays, the prize, and every past winner. The office shows a card for it during the season.",
    "Winning it is a new honor (\"Midseason Cup\") on a trainer's profile, and reaching the final is listed too. Records has two new boards: Most Midseason Tournament wins and Most Midseason Tournament finals.",
    "It can be switched off for a new league in Advanced options → Game features → Events. The Glossary explains it.",
  ] },
  { id: 187, date: 'November 2, 2026', time: '10:50 PM ET', title: 'Housekeeping: the Pokémon data has its own file', items: [
    "Behind the scenes, all the Pokémon data now lives in its own file: species, legendaries, base stats, Paradox Pokémon, baby legendaries, Mega forms, moves, signature moves and abilities. That's about 3,900 lines moved out of the game's code.",
    "Nothing changes in play, and saves from earlier versions load as before. Every Pokémon, move and ability is the same.",
    "The itch.io download now has two files side by side: index.html and pokemon-data.js. The one-file version of the game still works on its own.",
  ] },
  { id: 186, date: 'November 2, 2026', time: '10:30 PM ET', title: 'One offseason offer per team', items: [
    'Each team (yours and every AI team) now gets at most one offseason offer per season, across all Leagues: a gym invitation or an Elite Four seat challenge.',
    'Once a team has had its offer, the League stops pulling from it. Other vacant gyms go to independents who performed well, or to newly appointed trainers.',
    'If the trainer who earned an Elite Four seat challenge belongs to a team that already had its offer, the challenge goes to the strongest independent who reached the League instead. If none qualifies, there\'s no seat challenge that year.',
    'Former trainers coming home are not part of this limit: a team can still be offered any former trainer who loses a post, on top of its one invitation.',
    'The game\'s version number now shows in the header, so you can always tell which build is open.',
  ] },
  { id: 185, date: 'November 2, 2026', time: '8:45 PM ET', title: 'My Pokédex: change any Pokémon, or add your own', items: [
    "New in Advanced options: My Pokédex. Change any Pokémon's types, base stats and abilities, legendaries included. Missingno is the one exception, since its stats are scrambled every battle.",
    "Add Pokémon of your own. Give each a name, one or two types, six base stats and up to three abilities. A first-stage Pokémon is caught in the wild like any other, and can be marked as rare or as a starter. An evolution can come from one of your own Pokémon or branch from an ordinary game Pokémon at a level you choose. A new Eevee evolution, for example, is picked like Eevee's other branches.",
    "A new first-stage Pokémon with a base stat total over 650 can be made a Legendary encounter. It's never found in the wild. Instead it appears, very rarely, as a legendary encounter that challengers battle for, like Regigigas or Darkrai. In tests, a new one usually took 60 or more seasons to first appear in a League, and often didn't appear at all in 100 seasons. Once caught, it changes partners like other legendaries. It follows the legendary rules: one trainer holds it at a time as a partner, nothing can evolve from it, and a trainer who already has a legendary can't win it.",
    "The editor warns you when a Pokémon that isn't a legendary has a total over 650, both while you type the stats and when you save. That covers new Pokémon left unmarked and changes to existing ones. It's only a warning; you can still save it.",
    "Only abilities that already work in battles can be chosen. Moves come from a Pokémon's types as usual, so a new or retyped Pokémon gets a fitting moveset by itself. Nothing can evolve from a legendary, mythical, Paradox Pokémon, Ultra Beast or baby legendary.",
    "The Pokédex is locked when a league is created. A new league takes a copy of your Pokédex if \"Use my Pokédex in the new league\" is on, and keeps it for good. The save carries it, so the league plays the same on another device, and later edits never touch a league that's already running.",
    "Your changes are saved in this browser. Export my Pokédex gives a text code to keep or share, and Import reads one back.",
    "In a league with its own Pokédex, the Pokédex page says what was changed, and tags those Pokémon New or Changed.",
    "A trainer from one of your packs whose Pokémon isn't in a league's Pokédex (one of your own, in a league that doesn't use them) starts with a common Pokémon instead.",
  ] },
  { id: 184, date: 'November 2, 2026', time: '7:35 PM ET', title: 'Missingno; every legendary can now be found; one legendary per trainer', items: [
    "Missingno has arrived, very rarely. Instead of an encounter, it glitches onto a random challenger's team mid-season. Anyone can get it, but trainers having a poor season are up to four times as likely. It's rarer than any other legendary event: in a single League, expect it about once in every 100 seasons.",
    "Its stats are scrambled. Every battle deals out the same six values (160, 136, 110, 84, 70, 40, a 600 total) to its six stats at random, so one battle it's a glass cannon and the next it's a wall. Its new ability, Glitch, does this, and also counts every move it uses as its own type.",
    "It's the glitch Bird type, which is neutral against everything and takes neutral damage from everything. No gym, trainer specialty or Delta Pokémon will ever be Bird type.",
    'It always knows Sky Attack, Water Gun (twice), and ??????, a glitched slot that turns into a random attack from the whole move list every time it\'s used. Its level shows as "Lv ??" and its base stats as "??".',
    "It's about as strong as Mew or Latios in one-on-one tests, but far less predictable.",
    "It's a legendary partner like the others, staying 6–10 seasons instead of 3–5. Now and then (about a 2% chance each season) it glitches away mid-season, though never during the League and never as a trainer's last Pokémon.",
    "It can't be traded, given as a farewell gift, Mega Evolved or used for Battle Bond. It's never a Champion's reward, a wild find or a starting Pokémon. It's part of the Legendary encounters option, so switching that off turns it off too.",

    "One legendary per trainer. Any legendary that chooses a trainer (gifts, wings, Mewtwo's cave, heroes, character picks) now passes over anyone who already has a legendary, or one on its way to them, and goes to the next in line, or waits for another year. They can still take part in encounters and storms, but can't be the one to win. They also won't find legendaries or roamers while exploring.",
    "Arceus now appears, now and then, to the trainer with the best career who has never had a legendary partner at all (3+ seasons). It no longer goes to whoever has collected the most legendaries.",
    "Every legendary and mythical Pokémon can now be obtained. New ways, none of them tied to a trainer's type or to holding another legendary:",
    'Found while exploring (very rare, about one in every 7–8 seasons for each League): Regirock, Regice, Registeel, Regieleki, Regidrago, Mew, Manaphy, Zarude, Ogerpon, Hoopa, and Shaymin in the first six weeks of a season.',
    'New rare encounters, battled for like the others: Regigigas, Darkrai (sleep lasts longer while it is loose), Cresselia, Deoxys and Heatran (a volcanic eruption). Terapagos can now be found on an Area Zero expedition.',
    'New storms, each lasting four weeks and choosing the challenger who wins the most battles in it: Enamorus (Bloom: Fairy moves hit harder), the island guardians (Electric, Psychic, Grassy and Misty Terrain), and the Treasures of Ruin, whose curses make physical or special attacks hit harder or softer for everyone. A bird storm is now and then its Galarian form\'s instead (a Psychic haze, a Fighting stampede or a Dark blaze).',
    'The Loyal Three (Okidogi, Munkidori, Fezandipiti) now roam the region like Raikou and the others. Necrozma can come through an Ultra Wormhole.',
    "Chosen for character or for their season, in the offseason (each one only looks some years): Uxie (best Strategy), Mesprit (best Bond), Azelf (best Nerve), Glastrier (best Training), Spectrier (best Scouting), Pecharunt (weakest Bond), Volcanion (most knockouts), Victini (most wins), Marshadow (most road battle wins), Zeraora (fastest through the badge circuit), Magearna (best-rated challenger), Meloetta (best season), Jirachi (any challenger, at random: its wish), Celebi (most improved: the biggest jump in badges from the season before) and Diancie (a trainer who looks after a Carbink). They join the following season.",
    'The Rainbow Wing (Ho-Oh) is now given in about half of offseasons instead of every one, so Ho-Oh turns up about as often as Lugia.',
    'Heroes: stopping Team Plasma frees Genesect, and stopping any other villain team can draw a Sword of Justice (Cobalion, Terrakion or Virizion, matched to the hero) or Keldeo for a hero under 20.',
  ] },
  { id: 183, date: 'November 2, 2026', time: '7:10 PM ET', title: 'Wild Shadow Pokémon; purification without Purify weeks', items: [
    'Wild Shadow Pokémon: any wild Pokémon can now be a Shadow Pokémon, about as rarely as a shiny (the Collector trait doubles the odds, as it does for shinies). The explore screen flags them. Cipher getting away still makes them far more common for the rest of that season. They can be switched off in the game options.',
    "No more Purify weeks. A Shadow Pokémon's heart now opens during the trainer's normal weeks: most when training, a bit less when exploring or challenging a gym, plus a little from every battle. A higher Bond rating still speeds it up.",
    'A Shadow Pokémon whose heart is fully open is purified at the end of that week, whatever the trainer did, and gets all its held-back levels at once. It takes about 6 to 8 weeks with an average Bond rating. The weekly planner shows each Shadow Pokémon\'s progress.',
  ] },
  { id: 182, date: 'November 2, 2026', time: '6:58 PM ET', title: "Paradox Champion's reward; roaming legendaries and legendary storms; explore highlights", items: [
    "The Champion's reward is now a Paradox Pokémon instead of a legendary. The Champion's team still gives it to its weakest trainer after each draft, chosen from three: one fits the trainer's type when any does, and there's always at least one Ancient and one Future option.",
    "Paradox Pokémon aren't one of a kind: two trainers can have the same one. They're kept for good, with no partner seasons.",
    'Roaming legendaries: Raikou, Entei, Suicune, Latias and Latios can roam the region for 7–9 weeks, about three seasons in five. A roamer stays near one town at a time and moves on most weeks.',
    "Challengers exploring on the way to the roamer's town may find it among their wild Pokémon, about one week in four, and catch it like any other find, with no battle. Challengers heading for the next town over have half the chance, and challengers with all eight badges a third. If two find it in the same week, the first to catch it gets it.",
    'Legendary storms: about three seasons in four, a legendary brings four weeks of weather to the whole region, at its own time of year:',
    'Zapdos brings an electric storm in spring (Electric moves +20%). Moltres brings a summer heat wave (harsh sunlight). Tornadus brings a gale (Flying moves +20%). Thundurus brings a thunderstorm (rain, Electric moves +10%). Articuno brings a winter blizzard (snow, Ice moves +15%).',
    'After Tornadus or Thundurus storms, Landorus may come down to calm the skies (Ground moves +15%).',
    "When the storm passes, its legendary chooses the challenger who won the most battles while it lasted (at least 3, with knockouts settling a tie), whatever their type. Every battle counts: gyms, road battles, villains and legendaries.",
    "The office and the weekly planner show the roamer (where it was last seen, and each trainer's chance of finding it) and the storm (its effect and the standings). A new Legendary sightings panel on the office page lists recent roamers and storms.",
    "Explore highlight: when a trainer's wild Pokémon this week include anything special (a shiny, alpha, Delta or Shadow Pokémon, a rare find, an Ultra Beast or the roaming legendary), their Explore button glows gold with a ✦. A \"Spotted\" note names what's out there, and the trainer's tab in the menu gets a ✦.",
    "The week's wild Pokémon are now rolled when the planner first shows the trainer, so the highlight is accurate. If you choose Explore, you see the same Pokémon, and a trainer left to decide picks from them too.",
    'Special finds other than shinies and alphas now get a highlighted card on the explore screen.',
    'Both events can be switched off in the game options: Roaming legendaries and Legendary storms.',
    "Legendaries now come through their own events rather than as the Champion's reward. Those without an event yet (Mew, Celebi, the Regis, the Lake trio, the Swords of Justice and others) don't appear for now, apart from ones already on teams. They'll get events of their own.",
    "Fix: a trainer's last week no longer shows \"Trained\" after a gym battle or an exploring week. The item found while exploring now shows alongside it.",
    'Glossary: new Roaming legendary and Legendary storm entries; Paradox and Legendary / Mythical are updated.',
    'The legendary storms no longer favor any type in who they choose, so type specialists are never shut out of (or handed) these legendaries.',
  ] },
  { id: 181, date: 'November 2, 2026', time: '6:08 PM ET', title: 'Best item picks are highlighted', items: [
    'Gym rewards now mark the best choice with a gold "★ Best pick" border, worked out from everything your team already holds and carries.',
    'Each reward option says what it would do for you: which Pokémon it suits best ("Best on Gengar"), or why it\'s not worth taking ("You already have one", "No one on the team can use it"). Options with no use are dimmed.',
    'When changing a Pokémon\'s item by hand, the best item in the bag for that Pokémon is starred and listed first, items it can\'t use are dimmed, and it tells you when it\'s already holding its best item.',
    'If you\'ve set items by hand and Auto-equip would give a better set from what you own, the Items panel says so and the Auto-equip button is highlighted.',
  ] },
  { id: 180, date: 'November 2, 2026', time: '5:36 PM ET', title: '196 new moves: signature moves, stat-raising attacks and multi-hit moves', items: [
    '84 new moves join the shared move pools, covering every type: Slash, Lava Plume, Heat Wave, Superpower, Hammer Arm, Drill Run, High Horsepower, Leaf Storm, Power Whip, Lunge, Iron Tail, Dragon Rush, Darkest Lariat and more.',
    'Signature moves: 74 moves that belong to specific Pokémon. Only those Pokémon can learn them, and each one takes the slot its type would otherwise use. Examples: Pyro Ball (Cinderace), Bitter Blade (Ceruledge), Armor Cannon (Armarouge), Crabhammer (Kingler, Crawdaunt), Jet Punch (Palafin), Flower Trick (Meowscarada), Kowtow Cleave (Kingambit), Make It Rain (Gholdengo), Shadow Bone (Alolan Marowak) and Extreme Speed (Arcanine, Dragonite).',
    'Legendary and mythical Pokémon now use their own moves: Aeroblast, Sacred Fire, Origin Pulse, Precipice Blades, Dragon Ascent, Roar of Time, Spacial Rend, Shadow Force, Blue Flare, Bolt Strike and others.',
    'Signature healing and setup moves (Soft-Boiled, Milk Drink, Slack Off, Heal Order, Shift Gear, Obstruct) always take the Pokémon\'s utility slot.',
    'Signature moves unlock by tier like every other move (Lv 22 for tier 2, Lv 40 for tier 3), so many arrive on evolution or late in a Pokémon\'s growth.',
    'Moves show "signature move" in their description, and the Glossary lists which Pokémon own each signature move.',
    'Some moves are simplified to fit how battles work here: Gigaton Hammer and Doom Desire have no turn restrictions.',
    'Because the move pools grew, many Pokémon will update their movesets the next time they load. Check "learned" notes on your team.',
    'Attacks can now raise the user\'s own stats when they land. 16 more moves use this: Flame Charge, Rapid Spin, Trailblaze, Power-Up Punch, Charge Beam, Steel Wing, and Ancient Power, Silver Wind and Ominous Wind (a small chance to raise every stat).',
    'New signature moves with a stat raise: Torch Song (Skeledirge), Fiery Dance (Volcarona), Aqua Step (Quaquaval), Aura Wheel (Morpeko), Esper Wing (Hisuian Braviary), Psyshield Bash (Wyrdeer) and Diamond Storm (Diancie).',
    'Meteor Mash and Metal Claw now have their chance to raise Attack.',
    'Sheer Force treats these raises as added effects: it gives up the raise for extra power. Serene Grace doubles the chance. Shield Dust doesn\'t stop them, since they affect the attacker.',
    'Multi-hit moves: an attack can now hit several times in one turn. Each hit does the same damage, and together they get past a Focus Sash or Sturdy. A Disguise only soaks the first hit.',
    '19 new multi-hit moves: Bullet Seed, Icicle Spear, Rock Blast, Pin Missile, Bone Rush, Tail Slap, Scale Shot, Arm Thrust, Fury Swipes, Spike Cannon (2–5 hits); Double Kick, Twineedle, Double Hit, Dual Chop, Dual Wingbeat, Twin Beam, Bonemerang (2 hits); Triple Dive and Triple Axel (3 hits). Scale Shot also raises Speed.',
    'New multi-hit signature moves: Population Bomb (Maushold), Gear Grind (Klinklang) and Double Iron Bash (Melmetal).',
    'Dragon Darts (two hits), Water Shuriken (2–5 hits, moves first) and Surging Strikes (three hits) now work like their real versions instead of single hits.',
    'New ability: Skill Link. Its multi-hit moves always hit five times. Cinccino, Cloyster, Ambipom, Toucannon and others can now have it. Technician powers up each hit of a weak multi-hit move.',
    'The game now has 346 moves.',
  ] },
  { id: 179, date: 'November 2, 2026', time: '5:02 PM ET', title: 'Updates gets its own page; copyright and AI disclosure', items: [
    'Updates is now its own page instead of a pop-up. Open it from the Updates tab beside Glossary, from the ⋯ menu, or from the setup screen.',
    'Each update now shows its version number. From this version on, every update is dated and timestamped, and the rule is written at the top of the Updates page.',
    'The Updates page now ends with a copyright disclaimer and a disclosure of how AI was used to make the game.',
    'Every version in the changelog now folds down to its title: tap a version\'s title to collapse or expand it. What you fold is remembered in this browser.',
    'The copyright disclaimer now notes that Pokémon League GM is open source, with a link to the Discord where you can ask for access.',
  ] },
  { id: 178, date: 'November 2, 2026', title: 'Every Pokémon has an ability: 49 new abilities', items: [
    "49 new abilities, so the 71 Pokémon that showed \"No ability yet\" (Zorua, Mimikyu, Aegislash, Arceus, Darkrai and others) now all have one. Abilities marked \"adapted\" in their description work a little differently from the main games to fit how battles work here.",
    'Shared abilities: Run Away, Gluttony, Harvest, Infiltrator, Illusion, Flower Veil, Aroma Veil, Cute Charm, Mummy, Wandering Spirit, Mycelium Might, Toxic Chain, Corrosion, Protean, Heavy Metal, Berserk, Download, Magician and Magnet Pull. Many other species also have these, so they now use them too.',
    'Signature abilities: Forecast, Flower Gift, Stance Change, Battery, Power Spot, Dancer, Schooling, Wimp Out, Emergency Exit, Shields Down, Comatose, Disguise, Gulp Missile, Ice Face, Hunger Switch, Zero to Hero, Surge Surfer, Mimicry, Bad Dreams, Victory Star, Multitype, RKS System, Shadow Shield, Prism Armor, Soul-Heart, Chilling Neigh, Grim Neigh, Tera Shell, Poison Puppeteer and Mind\'s Eye.',
    'Form changes happen mid-battle: Aegislash switches to Blade Forme to attack, Minior\'s core breaks out below half HP, Eiscue\'s ice face shatters, and Mimikyu\'s disguise gets busted.',
    'Two Pokémon now fight in their weaker form some of the time, as in the games. Wishiwashi\'s school breaks up at a quarter HP. Palafin leading off starts in Zero Form until its first knockout; sent in later, it arrives as the Hero.',
    'Arceus and Silvally take the type of their held type-boosting item (Charcoal makes them Fire).',
    'Wimpod and Golisopod retreat once per battle when a hit drops them to half HP, and can come back in later.',
    'Run Away also helps a trainer find items while exploring (a smaller boost than Pickup).',
  ] },
  { id: 177, date: 'November 2, 2026', title: 'Legendary encounters: most damage wins, bigger swings, experience in defeat; smarter auto-equip', items: [
    'A legendary encounter now stays near its town for five weeks instead of three (Groudon and Kyogre still stay for the season).',
    'Legendaries are tougher when encountered: four levels higher than before, and every attempt now faces it at full strength rather than whatever earlier attempts left.',
    'Each trainer\'s damage adds up to their own total across their attempts. The legendary goes to the trainer who did the most damage, not whoever lands the last hit. That happens once the combined damage wears it down (four full defeats\' worth), or when its five weeks run out. It no longer escapes.',
    'If two or more trainers are tied for the most damage, they battle it out, winner stays on, and the last trainer standing gets it.',
    'Luck matters much more against a legendary: each attempt rolls the challenger\'s form on the day, from half damage up to double, usually somewhere in between. A bad day also means the legendary hits a little harder. The same team can do more than ever one week and struggle badly the next. The battle log shows the day\'s form.',
    'A failed attempt now earns real experience: a typical attempt is worth about a third of the way from a lost gym battle to a training week, and a big one is worth most of a training week.',
    'Trainers know when not to bother: no one seeks a legendary that has already been with them (it never goes back to a former partner), and AI trainers give up once they are too far behind the leader to catch up. AI trainers also no longer hold back to snipe a weakened legendary.',
    'The legendary banner shows how worn down it is and the top three damage totals; the Seek plan shows your total against the leader. Seek is hidden for a trainer the legendary won\'t go to.',
    'If your trainer wins it with a full team, you choose who makes room (unless the season has just ended, when the weakest ordinary Pokémon goes). A trainer who retires right after getting one sends it back to the pool as before.',
    'An encounter already running in an older save starts its damage tally afresh under the new rules.',
    'Auto-equip now shares items out across the whole team instead of handing out the single best match first. If Gengar is your only Poison type and holds a Focus Sash, a new Poison Barb goes to Gengar and the Focus Sash moves to whichever teammate gets the most from it.',
    'Choosing a gym reward on Auto, and deciding what to leave behind when the bag is full, now count how much an item adds to the team as a whole, so an item only one Pokémon can use is valued properly.',
  ] },
  { id: 176, date: 'November 2, 2026', title: 'Make, import and export trainer packs; names clash only within a title', items: [
    'New: My trainer packs, a section of its own in Advanced options. Create as many packs as you like, name them, and fill them with your own famous trainers. Each pack has its own on/off switch, like the built-in packs.',
    'For each trainer, set a name, title, gender, age, one or two types, a trait, a lead Pokémon and up to six options for their second Pokémon. Trainers in a pack that is switched on turn up like any other famous trainer, including in all-famous leagues.',
    'Packs can be renamed or deleted, and a trainer can be moved to another pack from its edit form.',
    'Your packs are saved in this browser. Each new league keeps its own copy of the packs that are switched on, so later edits don\'t change a league already started, and the copy goes with the save if you move it to another device.',
    'The editor checks each trainer: the name can\'t match one in any of your packs, every Pokémon must be in the game, each must come from a different evolution line, and legendaries, mythicals, Paradox Pokémon and Ultra Beasts aren\'t allowed. A lead can have a few options (Pikachu / Pichu), and the second Pokémon is optional.',
    'The game\'s own 261 famous trainers are now a pack you can switch off, under Advanced options → Famous trainer packs. With it off, only the packs you switch on supply famous trainers, so an all-famous league can be all WWE, or all your own trainers. It\'s on by default, and leagues already running keep it on.',
    'Export any pack as text to copy or a file to download: one of your packs, all of them at once as a backup, or a built-in pack (the game\'s own famous trainers, Mortal Kombat, WWE or NBA).',
    'Import trainers from a file or pasted text, or straight from a built-in pack. Search the list, tick the trainers you want, and put them in a new pack or one you already have. Trainers that can\'t come in (a name you already use, a legendary on the team) say why.',
    'Import also reads text that picked up curly quotes or markdown escapes on the way (common when copying from a phone or a chat app).',
    'Trainers copied from a built-in pack keep their title, types, trait and team, and you can change any of them. A copy can share a name with the built-in trainer; if both packs are on, only one of them appears in a league.',
    'A name now only clashes when the title matches too. There can be one Hiker Ben at a time, but a Swimmer Ben can exist beside him, and a generated trainer can share a first name with a famous one (Ace Trainer Cody and Cody Rhodes).',
    'A title and name is never reused. Once someone has been Hiker Ben, no later trainer gets that exact title and name, even after Hiker Ben retires, so the records stay clear.',
    'Famous trainers now wait only if that exact title and name is taken. Villain bosses and admins follow the same rule.',
    'A trainer who changes class keeps their name, and picks a new class where no one else already holds that title and name.',
    'All-famous leagues: retired famous trainers no longer debut again under the same name. Once every famous trainer has debuted, the whole roster comes round again as V2 (Kanto Leader Misty V2), then V3, and so on, instead of switching to generated trainers.',
    'A V2 waits for the earlier version to retire where possible, so two of the same famous trainer are rarely on the circuit at once. Each version keeps its own record, and the News says when a new round starts.',
    'Fixed: a famous prospect who goes undrafted in an all-famous league can come back under their original name, even after V2 rounds have started.',
  ] },
  { id: 175, date: 'November 2, 2026', title: 'Chasing the Grand Slam; WWE and NBA packs grow to 50', items: [
    'Multi-League worlds: Grand Slams (Champion of every League over a career) should now happen more often.',
    'Other teams pull their former Champions toward Leagues they haven\'t won yet when they plan League moves. A team always considers it when it has a Slam chaser, and a chaser can take an open spot in an unwon League without needing a teammate to swap with.',
    'A dethroned Champion who goes back to the circuit now moves to a League they haven\'t won, if there\'s room and no legendary clash. Your own trainers stay where they are, so the choice is yours.',
    'Trainers who have won 2 or more Leagues, but not all of them, get 3 extra seasons before age can retire them, including when they lose a post.',
    'Slam progress is easier to follow: trainers show a "Slam 2/4" tag with the Leagues still to win, the League reassignment cards tag each League your trainers haven\'t won as Unwon, and the News reports when a Champion is one League away from the Grand Slam.',
    'WWE and NBA packs now at 50 trainers each.',
  ] },
  { id: 174, date: 'November 2, 2026', title: 'League offers in a sensible order', items: [
    'On the League offers screen, offers that would take a trainer off your team (gym invitations, Elite Four seat challenges) now always come before offers that would bring a former trainer back.',
    'So you know whether a promotion opens a roster spot before deciding whether to release someone to make room for a returning trainer.',
    'Fix: a trainer you released to bring a former trainer back could then be offered the gym that former trainer had just left. An invitation for a trainer who is no longer on your team is now withdrawn, and the League fills the gym as usual.',
  ] },
  { id: 173, date: 'November 2, 2026', title: 'Elite teams bring back old partners', items: [
    'When a legendary moves on from a Gym Leader, an Elite Four member or the Champion, its spot now goes to one of that trainer\'s own former Pokémon instead of a new League-assigned one.',
    'A Pokémon they set aside comes back first; otherwise one from their former Pokémon list (left behind on promotion, swapped out, released) returns with its record, nature and IVs. Pokémon of their type and ones with more battles come first, and never one now on another trainer\'s team or from the same evolution line as a teammate.',
    'The League only assigns a new Pokémon when the trainer has never had another one. The News says who came back, and the Pokémon\'s card notes the season it returned.',
  ] },
  { id: 172, date: 'November 1, 2026', title: 'Cleaner multi-season sim results', items: [
    'The multi-season sim results no longer list each season\'s farewell gifts. Gifts still show on the Farewell gifts screen in manual play and in the News.',
  ] },
  { id: 171, date: 'November 1, 2026', title: 'Collapsible boxes', items: [
    'Every box with a title can be folded down to its title: tap the title (or the ▾ arrow beside it) to collapse or expand it. This works on every page, in pop-ups like trainer and Pokémon profiles, on each Records board and on Glossary sections.',
    'Folded boxes stay folded when you come back, and a box folded on one trainer\'s page is folded on every trainer\'s page. This is saved in your browser only.',
  ] },
  { id: 170, date: 'November 1, 2026', title: 'Gym Leaders name their League too', items: [
    'Sitting Gym Leaders are now shown as "Sinnoh Gym Leader Wally", like the Champion and Elite Four, so they\'re easy to tell apart from famous trainers\' titles and from other Leagues\' Gym Leaders.',
  ] },
  { id: 169, date: 'November 1, 2026', title: 'Clearer Champion and Elite Four titles', items: [
    'The sitting Champion is now shown as "Defending Sinnoh Champion Wally", and Elite Four members as "Sinnoh Elite Four Bruno", naming the League they serve.',
    'This keeps them apart from famous trainers whose class is a title (like Kalos Champion Diantha), and from another League\'s Champion or Elite Four in multi-League saves. Single-League saves use their League\'s name too.',
    'Older news and records keep the names as they were written at the time.',
  ] },
  { id: 168, date: 'November 1, 2026', title: 'Offseason screens: League offers and farewell gifts', items: [
    'The offseason now runs: Season recap → League offers → Draft → Farewell gifts → League reassignment (several Leagues) → Champion\'s reward → Registration.',
    'League offers (gym and Elite Four invitations, former trainers asking to come back) have their own screen instead of panels on the recap.',
    'Farewell gifts are now handed over after the draft, on their own screen. You choose the Pokémon and the teammate in that League for your own promoted trainers, and a new draftee can receive it. The screen lists every team\'s gifts this offseason.',
    'With several Leagues the Farewell gifts screen always appears. With one League it appears when there are gifts.',
    'Multi-season sims still decide everything on their own. Each simulated season now shows its farewell gifts in the results.',
    'Fix: with several Leagues, your gift could be offered to a teammate in a different League. It now stays in the promoted trainer\'s League.',
  ] },
  { id: 167, date: 'November 1, 2026', title: 'Legendary leaderboards', items: [
    'Legendary and mythical Pokémon now have their own section on the Records page: most knockouts, HP damage, wins, best win %, longest win streak, 6-0 sweeps, Mega Evolutions, most partners and most-used legendary species.',
    'Each legendary is counted once, with its lifetime record across every partner. A legendary waiting for a new partner is shown as "waiting · last with" its last trainer.',
    'The regular Pokémon boards and the Hall of Shame Pokémon boards no longer include legendaries, so the stat outliers don\'t crowd everyone else out. Ultra Beasts and Paradox Pokémon stay on the regular boards.',
  ] },
  { id: 166, date: 'November 1, 2026', title: 'Legendaries are partners, not possessions', items: [
    'A legendary or mythical Pokémon now stays with a trainer for 3–5 seasons (rolled when it joins), then moves on in the offseason. Baby legendaries count from their catch.',
    'Once it moves on, it waits in the League where it was first found, keeping its lifetime record, awards and IVs. The next trainer to find it, catch it or receive it as the Champion\'s reward gets that same Pokémon, at their own level.',
    'A legendary never goes back to a trainer it has already been with, whatever the route.',
    'A legendary also moves on when its trainer retires or releases it, and it is never handed over as a farewell gift.',
    'Its page shows every partner with the seasons and record they had together, and when it will move on. Records count each legendary once. Your team list shows the last season it will stay ("until S12").',
    'Ultra Beasts and Paradox Pokémon work as before. In existing saves, legendaries already on teams stay for 1–3 more seasons.',
    'Champions start a level higher (Lv 91, or 92 with several Leagues). Without their legendaries for the whole reign, title changes had climbed to about 54%; this brings them back to about 50%.',
  ] },
  { id: 165, date: 'November 1, 2026', title: 'Accomplishments show their League', items: [
    'With several Leagues, a trainer\'s honors now say which League each one came from: titles, interim titles, season awards, legendary encounters, villain wins, Gym Leader comebacks, badge circuits and best League finish.',
    'Positions held list the League for every post, and the season-by-season Career table has a League column.',
    'Records boards (Most titles, Youngest and Oldest Champion, Trainer of the Year, Interim titles and more), Hall of Fame cards and Pokémon awards name the League too.',
    'Older saves are filled in from each League\'s own records where they can be: titles, awards, posts, comebacks, interim titles and your own trainers\' seasons. Anything the records can\'t place shows no League.',
  ] },
  { id: 164, date: 'November 1, 2026', title: 'League reassignment is its own offseason step', items: [
    'With several Leagues, moving trainers between Leagues now happens on its own page right after the draft, before the Champion\'s reward and registration.',
    'The page shows each of your trainers\' matchup in every League, with Move and Swap buttons, plus every move the other teams made. Other teams now make their moves here instead of quietly at the start of the season.',
    'Moves are made only during this step. Confirm to carry on to the Champion\'s reward and registration.',
  ] },
  { id: 163, date: 'November 1, 2026', title: 'Fix: trainers in two Leagues at once, and double Hall of Fame entries', items: [
    'With several Leagues, a trainer could hold a gym or Elite Four seat in one League while still challenging in another. This happened most often with your own trainers being offered a post in the other League.',
    'The same mix-up could retire a trainer in the wrong League. They kept their real post, were retired again later, and got a second (or third) Hall of Fame entry.',
    'Fixed. Existing saves are repaired when loaded: each trainer is listed in one place only, posts kept by mistakenly retired trainers go to new leaders, and every Hall of Fame member appears once.',
  ] },
  { id: 162, date: 'October 31, 2026', title: 'Keeping your saves on itch.io and other sites', items: [
    'When the game is played inside another site\'s page (like itch.io), a notice explains that some browsers (every iPhone and iPad browser, Safari, Brave) wipe saves there when the browser closes.',
    'Its "Open in its own tab" button opens the game directly, where saving works normally, and brings your current league along.',
  ] },
  { id: 161, date: 'October 30, 2026', title: 'Fix: long sims with several Leagues', items: [
    'Fixed a bug in worlds with several Leagues where a Gym Leader or Elite Four member could end up with a team that couldn\'t battle, which froze Sim seasons partway through. Leagues already affected are repaired when they load.',
    'If a sim ever does hit a problem, it now stops with a message (your progress is saved) instead of hanging.',
  ] },
  { id: 160, date: 'October 30, 2026', title: 'A draft board you can see all of', items: [
    'On PC the draft\'s Available table now spans the full page width, below the clock, your roster and the picks, so every column and the Draft button are on screen (it used to be squeezed into the left column with the Draft button out of sight).',
    'The Draft button column stays pinned to the right edge, so it\'s always visible, even on phones where the table scrolls sideways.',
  ] },
  { id: 159, date: 'October 30, 2026', title: 'A tidier page menu, bigger NBA and WWE packs, and long names that fit', items: [
    'The page menu is now four dropdowns: Office (Office, the current offseason step, News), Trainers (each of your trainers, plus All trainers), League (Standings, Gyms & Elite, History) and Stats (Records, Pokémon, Hall of Fame), with the Glossary beside them.',
    'NBA Superstars pack: 12 more players — recent Finals MVPs, today\'s stars and all-time legends (24 in all).',
    'WWE Superstars pack: 17 more Superstars — everyone who has won a WWE world championship in the last five years (35 in all).',
    'Famous trainers known by one name (like Brock or Larry) and pack trainers who share it (Brock Lesnar, Larry Bird) are never active at the same time.',
    'Trainer pages and profiles put the class or title on its own line above the name, size very long names down, and keep the OVR on the card.',
    'Records boards keep each rank and value beside the first line of a long name.',
    'Long names in the trainer tabs and the previous / next buttons are shortened with "…", and tags no longer break across lines.',
  ] },
  { id: 158, date: 'October 30, 2026', title: 'A fairer road to the title', items: [
    'Every qualifier now finishes their Elite Four run before anyone challenges the Champion.',
    'Trainers who get through the Elite Four then challenge the Champion in order of their season\'s gym record, worst first and best last. The season recap shows the order.',
  ] },
  { id: 157, date: 'October 29, 2026', title: 'Glossary and more Gym Leader comebacks', items: [
    'A Gym Leader\'s season now counts toward a comeback when their gym is one of the three hardest to beat (was two), so comebacks happen about three times as often.',
    'New Glossary (⋯ menu, or the setup screen): every ability, move, held item, trainer trait and rating, plus battle, Pokémon and League terms. Searchable, with a section for each.',
  ] },
  { id: 156, date: 'October 29, 2026', title: 'Gym Leader comebacks', items: [
    'A Gym Leader whose gym is one of the two hardest to beat for 6 to 8 seasons in a row may step down to chase the title: a one-in-three chance after 6 such seasons, one in two after 7, and always after 8.',
    'They return to the badge circuit sharper (every rating improves), the team they left for the gym (if any) gets the first chance to sign them back, and they won\'t retire for at least five seasons, whatever their age.',
    'The comeback shows in news and in the trainer\'s Honors.',
  ] },
  { id: 155, date: 'October 29, 2026', title: 'Gym Leader reigns and this Updates page', items: [
    'Gym Leaders move to a new town every season, so a trainer\'s Positions held now shows each run as Gym Leader as one reign ("Gym Leader · Seasons 3–9") instead of listing every town.',
    'New Updates page (here), listing changes to the game as they arrive. Open it from the ⋯ menu or the setup screen.',
  ] },
];
const UPDATES_SEEN_KEY = 'plgm-updates-seen';
const updatesSeen = () => { try { return +(localStorage.getItem(UPDATES_SEEN_KEY) || 0); } catch (e) { return 0; } };
const updatesNew = () => UPDATES.length && UPDATES[0].id > updatesSeen();
function markUpdatesSeen() { try { localStorage.setItem(UPDATES_SEEN_KEY, String(UPDATES[0].id)); } catch (e) {} }
const UPDATES_RULE = 'Every version is numbered, and from v179 on each one is dated and timestamped (Eastern Time). All the changes made in one round of work are listed together under that one version.';
function updStamp(u) { return `v${u.id} · ${u.date}${u.time ? ` · ${u.time}` : ''}`; }
function viewUpdates() {
  const back = S ? '' : '<button class="btn small" data-act="nav" data-v="office">← Back to setup</button>';
  return `<section class="panel callout"><div class="ph"><h1>Updates</h1>${back}</div>
    <p class="muted">What's changed in Pokémon League GM, newest first. Current version: <span class="num">${updStamp(UPDATES[0])}</span></p>
    <p class="fine"><strong>Versioning rule:</strong> ${UPDATES_RULE}</p></section>
  <section class="panel"><div class="ph"><h2>Changelog</h2><span class="muted">${UPDATES.length} updates</span></div>
    ${UPDATES.map(u => `<section class="upd"><div class="upd-h"><h3>${u.title}</h3><span class="muted small num">${updStamp(u)}</span></div><ul class="changes">${u.items.map(x => `<li>${x}</li>`).join('')}</ul></section>`).join('')}</section>
  <section class="panel"><div class="ph"><h2>Copyright disclaimer</h2></div>
    <p>Pokémon League GM is an unofficial, fan-made game. It is not affiliated with, endorsed, sponsored or approved by Nintendo, Creatures Inc., GAME FREAK inc. or The Pokémon Company.</p>
    <p>Pokémon, Pokémon names, moves, abilities, items and all related names and trademarks are © and ™ Nintendo, Creatures Inc. and GAME FREAK inc. They are used here for non-commercial fan purposes only, and no infringement is intended.</p>
    <p>Any other names, including real people, teams and brands in optional trainer packs, are trademarks of their respective owners and are used only for fun. Those owners have no connection to this game.</p>
    <p>Pokémon League GM is open source. To get access to the project, ask in the Discord: <a href="https://discord.gg/2mbaC7gUMk" target="_blank" rel="noopener noreferrer">discord.gg/2mbaC7gUMk</a>.</p></section>
  <section class="panel"><div class="ph"><h2>AI use disclosure</h2></div>
    <p>This game was made with generative AI. Its code, in-game text and game data were written with Claude, an AI model made by Anthropic, following the creator's design, direction and testing.</p>
    <p>The game uses no AI-generated images, music or voices. Pokémon data is adapted from the main series games, and AI-written content may contain mistakes.</p></section>`;
}
function updatesBody() {
  return `<div class="mh"><h2>Updates</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>
  <p class="muted small">What's changed in Pokémon League GM, newest first.</p>
  ${UPDATES.map(u => `<section class="upd"><div class="upd-h"><h3>${u.title}</h3><span class="muted small">${u.date}</span></div><ul class="changes">${u.items.map(x => `<li>${x}</li>`).join('')}</ul></section>`).join('')}`;
}
function menuBody() {
  const m = modal;
  return `<div class="mh"><h2>League file</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>
  <div class="confirm-row"><button class="btn" data-act="simmany">Sim multiple seasons…</button><button class="btn" data-act="glossary">Glossary</button><button class="btn" data-act="images">Images</button><button class="btn" data-act="updates">Updates${updatesNew() ? ' <span class="newdot" aria-label="new"></span>' : ''}</button></div>
  <p class="muted">Progress saves automatically in this browser after every week. Copy the save to back it up or move it to another device.</p>
  <div class="confirm-row"><button class="btn" data-act="export">Copy save to clipboard</button>${canSaveFile() ? '<button class="btn" data-act="savefile">Download save file</button>' : ''}<button class="btn" data-act="importshow">Load a save</button></div>
  ${m.copying ? '<p class="fine">Preparing the save…</p>' : m.copied ? '<p class="fine">Save copied to the clipboard. Paste it into Load a save to bring this league back.</p>' : ''}
  ${m.exportText ? `<textarea id="exportbox" class="box" readonly rows="4">${m.exportText}</textarea><p class="fine">The clipboard isn't available here. Select the text above and copy it.</p>` : ''}
  ${m.importing ? `<label class="fine" for="importbox">Paste a save:</label><textarea id="importbox" class="box" rows="4"></textarea><div class="confirm-row"><button class="btn primary" data-act="importgo">Load this save</button></div>${m.err ? `<p class="warn">${m.err}</p>` : ''}` : ''}
  <hr><div class="confirm-row">${m.confirmNew ? `<span>This erases the current league.</span><button class="btn danger" data-act="newgo">Erase and start over</button><button class="btn" data-act="newcancel">Cancel</button>` : `<button class="btn danger" data-act="newask">Start a new league</button>`}</div>`;
}

// ---------- battle viewer ----------
function battleShell() {
  const r = modal.r;
  const side = (s, si) => `<div class="bside s${si}"><div class="bname">${trMini(T(s.id), 32)}<span>${s.name}</span></div><div class="pips">${s.team.map((m, i) => `<span class="pip" id="pip-${si}-${i}" title="${m.sp}"></span>`).join('')}</div>
    <div class="active" id="act-${si}"><span class="a-pic" id="apic-${si}"></span><span class="a-name">—</span><span class="a-lv"></span><div class="hp"><i id="hp-${si}"></i></div></div></div>`;
  return `<div class="mh"><h2>${r.title}</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>
  <div class="arena">${side(r.sides[0], 0)}<div class="vs">VS</div>${side(r.sides[1], 1)}</div>
  <ol class="blog" id="blog"></ol>
  <div class="bspeed" id="bspeed"><span class="bspeed-l">Speed</span><span class="segs bspeed-segs" role="group" aria-label="Battle speed">${BSPEEDS.map(([k, , label]) => `<button class="seg${bSpeed === k ? ' on' : ''}" data-act="bspeed" data-v="${k}" aria-pressed="${bSpeed === k}">${label}</button>`).join('')}</span><button class="btn small" data-act="bpause" id="bpause">Pause</button></div>
  <div class="confirm-row"><button class="btn" data-act="bskip" id="bskip">Skip to the result</button><span class="bresult" id="bres"></span></div>`;
}
// Battle speed (v202): milliseconds per line of the battle log; the choice is remembered in this browser.
const BSPEEDS = [['slow', 1100, 'Slow'], ['normal', 600, 'Normal'], ['fast', 260, 'Fast'], ['vfast', 80, 'Very fast']];
const BSPEED_KEY = 'plgm-battle-speed';
let bSpeed = (() => { try { const v = localStorage.getItem(BSPEED_KEY); return BSPEEDS.some(b => b[0] === v) ? v : 'normal'; } catch (e) { return 'normal'; } })();
const bSpeedMs = () => (BSPEEDS.find(b => b[0] === bSpeed) || BSPEEDS[1])[1];
function setBattleSpeed(v) {
  if (!BSPEEDS.some(b => b[0] === v)) return; bSpeed = v; try { localStorage.setItem(BSPEED_KEY, v); } catch (e) {}
  document.querySelectorAll('[data-act="bspeed"]').forEach(b => { const on = b.dataset.v === v; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  if (modal && modal.kind === 'battle' && modal.resume && !modal.paused && !modal.done) modal.resume();
}
function toggleBattlePause() {
  if (!modal || modal.kind !== 'battle' || modal.done) return;
  modal.paused = !modal.paused; const b = $('#bpause'); if (b) b.textContent = modal.paused ? 'Play' : 'Pause';
  if (modal.paused) clearInterval(player); else modal.resume && modal.resume();
}
function startPlayback() {
  clearInterval(player);
  const r = modal.r; let k = 0;
  const hp = [[], []]; r.sides.forEach((s, si) => s.team.forEach((m, i) => hp[si][i] = m.max));
  const act = [-1, -1];
  const logEl = $('#blog');
  const megaName = [{}, {}];
  const nm = (si, i) => megaName[si][i] || r.sides[si].team[i].sp;
  const mine = id => { const t = T(id); return t && t.org === S.userOrg; };
  function line(text, cls = '') { const li = document.createElement('li'); li.className = cls; li.innerHTML = text; logEl.appendChild(li); logEl.scrollTop = logEl.scrollHeight; }
  function updActive(si) { const i = act[si]; if (i < 0) return; const m = r.sides[si].team[i]; const box = $('#act-' + si);
    { const pic = $('#apic-' + si), key = m.sp + (m.shiny ? '*' : ''); if (pic && pic.dataset.k !== key) { pic.dataset.k = key; const u = monImg(m.sp, m.shiny || m.radiant); pic.innerHTML = u ? `<img class="pic${si ? ' flip' : ''}" src="${u}" alt="" width="76" height="76">` : ''; } } box.querySelector('.a-name').textContent = m.sp; box.querySelector('.a-lv').textContent = 'Lv ' + (SP[m.sp] && SP[m.sp].glitch ? '??' : m.L); const pct = Math.max(0, hp[si][i] / m.max * 100); const bar = $('#hp-' + si); bar.style.width = pct + '%'; bar.className = pct < 25 ? 'red' : pct < 50 ? 'amb' : ''; }
  function step() {
    const e = r.ev[k++]; if (!e) { clearInterval(player); return false; }
    if (e.k === 'send') { act[e.s] = e.i; $(`#pip-${e.s}-${e.i}`)?.classList.add('out'); line(`<b>${r.sides[e.s].name}</b> sends out <b>${nm(e.s, e.i)}</b> (Lv ${SP[r.sides[e.s].team[e.i].sp] && SP[r.sides[e.s].team[e.i].sp].glitch ? '??' : r.sides[e.s].team[e.i].L}).`, 'send'); updActive(e.s); }
    if (e.k === 'hit') { const ts = 1 - e.s; const prev = hp[ts][e.ti]; hp[ts][e.ti] = e.hp; const pct = Math.round((prev - e.hp) / r.sides[ts].team[e.ti].max * 100);
      const tags = (e.mult >= 2 ? ' <em class="se">super effective</em>' : e.mult < 1 ? ' <em class="nve">not very effective</em>' : '') + (e.crit ? ' <em class="crit">critical hit</em>' : '') + (e.feel === 'solid' ? ' <em class="solid">solid hit</em>' : e.feel === 'glance' ? ' <em class="glance">glancing blow</em>' : '') + (e.mo ? ' <em class="mo">on a roll</em>' : '');
      line(e.mn ? `${nm(e.s, e.i)} used <b>${e.mn}</b>! ${nm(ts, e.ti)} loses ${pct}%.${tags}` : `${nm(e.s, e.i)} hits ${nm(ts, e.ti)}${e.mt ? ` with a ${e.mt} move` : ''} for ${pct}%.${tags}`, 'hit s' + e.s); updActive(ts); }
    if (e.k === 'miss') line(`${nm(e.s, e.i)} used <b>${e.mn}</b>, but it missed${e.guard ? ` — ${nm(1 - e.s, e.ti)} was ready for it` : ''}!`, 'miss');
    if (e.k === 'dodge') line(`${nm(e.s, e.i)} used <b>${e.mn}</b>, but ${nm(1 - e.s, e.ti)} dodged it!`, 'miss');
    if (e.k === 'use') line(`${nm(e.s, e.i)} used <b>${e.mn}</b>!`, 'hit s' + e.s);
    if (e.k === 'mega') { line(`<b>${r.sides[e.s].name}</b>'s Key Stone reacts! ${nm(e.s, e.i)} Mega Evolved into <b>${e.to}</b>!`, 'mega'); megaName[e.s][e.i] = e.to; updActive(e.s); }
    if (e.k === 'bond') { line(`${nm(e.s, e.i)} and <b>${r.sides[e.s].name}</b> are in perfect sync! It became <b>${e.to}</b>!`, 'bond'); megaName[e.s][e.i] = e.to; updActive(e.s); }
    if (e.k === 'pain') line(`<b>${r.sides[e.s].name}</b> feels ${nm(e.s, e.i)}'s pain, and the rest of the team falters.`, 'pain');
    if (e.k === 'hyper') line(`${nm(e.s, e.i)} is in Hyper Mode and won't listen!`, 'hyper');
    if (e.k === 'endure') line(`${nm(e.s, e.i)} hung on at 1 HP!`, 'endure');
    if (e.k === 'note') { if (e.hp != null && e.s >= 0) { hp[e.s][e.i] = e.hp; updActive(e.s); }
      line(e.txt.replace('{0}', e.s >= 0 ? `<b>${nm(e.s, e.i)}</b>` : '').replace('{1}', e.os != null ? `<b>${nm(e.os, e.oi)}</b>` : ''), 'note ' + (e.cls || '')); }
    if (e.k === 'item') { const it = ITEMS[e.it] ? ITEMS[e.it].name : e.it; if (e.hp != null) { hp[e.s][e.i] = e.hp; updActive(e.s); }
      line(e.it === 'focussash' ? `${nm(e.s, e.i)} hung on with its <b>${it}</b>!` : e.it === 'sitrus' ? `${nm(e.s, e.i)} ate its <b>${it}</b> and restored some HP.` : e.it === 'leftovers' ? `${nm(e.s, e.i)} restored a little HP with its <b>${it}</b>.` : e.it === 'lifeorb' ? `${nm(e.s, e.i)} lost some HP to its <b>${it}</b>.` : `${nm(e.s, e.i)}'s ${it}.`, 'item'); }
    if (e.k === 'faint') { $(`#pip-${e.s}-${e.i}`)?.classList.add('down'); line(`${nm(e.s, e.i)} fainted.`, 'faint'); }
    if (e.k === 'end') { const w = r.sides[e.w], l = r.sides[1 - e.w]; line(`<b>${w.name}</b> wins with ${w.left} Pokémon left.`, 'end'); $('#bres').textContent = mine(w.id) ? 'Victory' : mine(l.id) ? 'Defeat' : w.name + ' wins'; $('#bskip').hidden = true; modal.done = true; const sp = $('#bspeed'); if (sp) sp.hidden = true; }
    return true;
  }
  modal.skip = () => { while (step()) {} };
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  modal.paused = false; modal.done = false;
  modal.resume = () => { clearInterval(player); player = setInterval(step, bSpeedMs()); };
  if (reduce) modal.skip(); else modal.resume();
}

// ---------- render ----------
// ---------- playing inside another site's page (itch.io and the like) ----------
// There the game is a frame from another site, and many browsers (every iPhone / iPad browser, Safari, Brave) keep its
// storage only until the browser closes. Opening the game in its own tab saves normally; the league is handed over.
const EMBEDDED = (() => { if (window.claude) return false; try { return window.self !== window.top && !window.top.location.href; } catch (e) { return true; } })();
let embedNoteHidden = (() => { try { return sessionStorage.getItem('plgm-embed-note') === '1'; } catch (e) { return false; } })();
function embedNote() {
  if (!EMBEDDED || embedNoteHidden) return '';
  return `<div class="embednote" role="note"><div class="embednote-in"><span><b>Your saves may not last here.</b> Some browsers (every iPhone and iPad browser, Safari, Brave) wipe a game's saves when it's played inside another site's page. Open the game in its own tab to keep your progress${S ? ' (your league comes with it)' : ''}, and copy your save from the ⋯ menu now and then as a backup.</span>
    <span class="embednote-act"><button class="btn small primary" data-act="ownTab">Open in its own tab</button><button class="btn small ghost" data-act="embedhide">Hide</button></span></div></div>`;
}
// the itch page's copy opens a new tab and, when that tab says it's ready, hands it the current league as a save code
function openOwnTab() {
  const url = location.href.split('#')[0] + '#from-embed';
  const w = window.open(url, '_blank');
  if (!w) { toast("The browser blocked the new tab. Allow pop-ups for this page, or copy your save and load it in a new tab."); return; }
  const onMsg = async ev => {
    if (ev.source !== w || ev.origin !== location.origin || !ev.data || ev.data.type !== 'plgm-ready') return;
    window.removeEventListener('message', onMsg);
    w.postMessage({ type: 'plgm-save', code: S ? await saveCode() : null }, location.origin);
  };
  window.addEventListener('message', onMsg);
  setTimeout(() => window.removeEventListener('message', onMsg), 60000);
}
// the new tab: ask the page that opened it for its league, and take it unless this tab already has a later season
function receiveFromEmbed() {
  if (typeof location === 'undefined' || location.hash !== '#from-embed' || !window.opener) return;
  history.replaceState(null, '', location.href.split('#')[0]);
  const onMsg = async ev => {
    if (ev.source !== window.opener || ev.origin !== location.origin || !ev.data || ev.data.type !== 'plgm-save') return;
    window.removeEventListener('message', onMsg);
    if (!ev.data.code) return;
    const v = await parseSave(ev.data.code); if (!v) return;
    if (S && (S.season || 0) > (v.season || 0)) { toast('This tab already has a later season of your league, so it was kept.'); return; }
    adoptSave(v); save(); render(); toast(`Your league came over from the other page: Season ${S.season || 1}. Progress now saves in this tab.`);
  };
  window.addEventListener('message', onMsg);
  try { window.opener.postMessage({ type: 'plgm-ready' }, location.origin); } catch (e) {}
}
function render() {
  applyDex(dexWanted());
  ensureCustom();
  const app = $('#app');
  if (S) fixView();
  if (!S) { app.innerHTML = `<header class="top"><div class="top-in"><div class="mark"><span class="mark-ball" aria-hidden="true"></span><div><div class="mark-name">Pokémon League GM <span class="mark-ver">v${UPDATES[0].id}</span></div><div class="mark-sub">New league</div></div></div><div class="top-act"><button class="btn ghost" data-act="glossary">Glossary</button><button class="btn ghost" data-act="updates">Updates${updatesNew() ? '<span class="newdot"></span>' : ''}</button></div></div></header>` + embedNote() + (view === 'updates' ? `<main class="wrap" id="main">${viewUpdates()}</main>` : viewSetup()); if (view === 'updates') applyFolds(app, 'updates'); return; }
  bindView();
  let v = '';
  if (view === 'office') v = viewOffice();
  if (view === 'roster') v = viewOffice();
  if (view[0] === 't' && /^t\d+$/.test(view)) v = viewTrainerScreen(+view.slice(1));
  if (view === 'circuit') v = viewCircuit();
  if (view === 'gyms') v = viewGyms();
  if (view === 'news') v = viewNews();
  if (view === 'history') v = viewHistory();
  if (view === 'records') v = viewRecords();
  if (view === 'hof') v = viewHof();
  if (view === 'dex') v = viewDex();
  if (view === 'trainers') v = viewTrainers();
  if (view === 'recap') v = viewRecap();
  if (view === 'draft') v = viewDraft();
  if (view === 'register') v = viewRegister();
  if (view === 'reward') v = viewReward();
  if (view === 'ranch') v = viewRanch();
  if (view === 'ranchhist') v = viewRanchHistory();
  if (view === 'reassign') v = viewReassign();
  if (view === 'banvote') v = viewBanVote();
  if (view === 'offers') v = viewOffers();
  if (view === 'gifts') v = viewGifts();
  if (view === 'tourney') v = viewTourney();
  if (view === 'updates') v = viewUpdates();
  app.innerHTML = header() + nav() + embedNote() + `<main class="wrap" id="main">${lgBar()}${v}</main><div id="toast" class="toast" role="status" hidden></div>`;
  applyFolds(app, foldScope());
}
// ---------- collapsible boxes (v171) ----------
// Any panel with a heading, and each Records board, folds down to its header when its title is tapped. What's
// folded is remembered per page (a trainer's page counts as one page for every trainer), in this browser only.
const FOLD_STORE = 'plgm-folds';
let folded = (() => { try { return new Set(JSON.parse(localStorage.getItem(FOLD_STORE) || '[]')); } catch (e) { return new Set(); } })();
const foldScope = () => /^t\d+$/.test(view) ? 'trainer' : view;
function saveFolds() { try { localStorage.setItem(FOLD_STORE, JSON.stringify([...folded].slice(-400))); } catch (e) {} }
function applyFolds(root, scope) {
  if (!root || !root.querySelectorAll) return;
  const mark = (box, head, key) => {
    if (!head || head.dataset.act || head.querySelector('.fchev')) return;
    key = key.replace(/▾/g, '').replace(/\d+/g, '#').replace(/\s+/g, ' ');
    const shut = folded.has(key);
    box.classList.add('can-fold'); box.classList.toggle('folded', shut); head.classList.add('fold-head');
    head.dataset.act = 'fold'; head.dataset.k = key;
    head.setAttribute('role', 'button'); head.setAttribute('tabindex', '0'); head.setAttribute('aria-expanded', String(!shut));
    head.insertAdjacentHTML('afterbegin', '<span class="fchev" aria-hidden="true">▾</span>');
  };
  for (const box of root.querySelectorAll('section.panel')) {
    if (box.classList.contains('fold')) continue; // the Advanced page has its own folding
    const head = box.querySelector(':scope > .ph > h2, :scope > .ph > h3') || box.querySelector(':scope > h2, :scope > h3');
    if (head) mark(box, head, `${scope}|${head.textContent.trim()}`);
  }
  for (const box of root.querySelectorAll('.upd')) { const head = box.querySelector(':scope > .upd-h > h3'); if (head) mark(box, head, `${scope}|upd|${head.textContent.trim()}`); }
  for (const box of root.querySelectorAll('.gl-sec')) { const head = box.querySelector(':scope > .gl-h > h3'); if (head) mark(box, head, `${scope}|gloss|${head.textContent.trim()}`); }
  for (const box of root.querySelectorAll('.recboard:not(.big)')) {
    const head = box.querySelector(':scope > .rec-h');
    const sec = box.closest('section.panel'), secH = sec && sec.querySelector(':scope > .ph > h2');
    if (head) mark(box, head, `${scope}|board|${secH ? secH.textContent.replace('▾', '').trim() : ''}|${head.textContent.trim()}`);
  }
}
function toggleFold(el) {
  const k = el.dataset.k, box = el.closest('.can-fold'); if (!k || !box) return;
  const shut = !folded.has(k);
  if (shut) folded.add(k); else folded.delete(k);
  box.classList.toggle('folded', shut); el.setAttribute('aria-expanded', String(!shut));
  saveFolds();
}
// with several Leagues, the league-wide pages show one League at a time; a trainer's page shows their own League
const LG_VIEWS = ['office', 'circuit', 'gyms', 'news', 'history', 'recap', 'records'];
function bindView() {
  if (!S || nLeagues() < 2) return;
  viewLg = Math.min(viewLg, nLeagues() - 1);
  const tv = /^t\d+$/.test(view) && T(+view.slice(1));
  if (tv) viewLg = lgOf(tv);
  if (view === 'reward' && S.reward) viewLg = S.reward.lg || 0;
  useLeague(viewLg);
}
function lgBar() {
  if (nLeagues() < 2 || !LG_VIEWS.includes(view)) return '';
  const mine = i => userTrainers().filter(t => lgOf(t) === i).length;
  return `<nav class="lgbar segs" aria-label="League">${Array.from({ length: nLeagues() }, (_, i) => `<button class="seg${i === viewLg ? ' on' : ''}" data-act="lgview" data-v="${i}" aria-pressed="${i === viewLg}">${leagueName(i)}${mine(i) ? ` <span class="lg-n">${mine(i)}</span>` : ''}</button>`).join('')}</nav>`;
}
const lgTag = t => nLeagues() > 1 && t ? `<span class="tag lg">${lgShort(lgOf(t))}</span>` : '';
function toast(msg) { const el = $('#toast'); if (!el) return; el.textContent = msg; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 3400); }
function go(v) { view = v; render(); window.scrollTo(0, 0); }
function fixView() { if (/^t\d+$/.test(view)) { const t = T(+view.slice(1)); if (!t || !t.user) view = 'office'; } }

// ---------- actions ----------
function afterDraft() { if (S.phase === 'gifts') go('gifts'); else if (S.phase === 'reassign') go('reassign'); else if (S.phase === 'banvote') go('banvote'); else if (S.phase === 'reward') go('reward'); else if (S.phase === 'ranch') go('ranch'); else if (S.phase === 'register') go('register'); else if (S.phase === 'season') { go('office'); toast(`Season ${S.season} is underway.`); } else render(); }
function planFor(t) { let p = S.plans[t.id] || 'auto'; if (p === 'challenge' && (t.role === 'champion' || t.badges.length >= 8 || gymClosed(t.badges.length))) p = 'auto'; if (p === 'raid' && (t.role !== 'challenger' || !eventFoe())) p = 'auto'; if (p === 'purify') p = 'auto'; if (p === 'seek' && (t.role !== 'challenger' || !S.legend || legendBlocked(t, S.legend.sp))) p = 'auto'; return p; }
function playWeek() {
  if (S.phase !== 'season') return;
  const choices = {};
  for (const t of userTrainers()) {
    const pk = S.catchPicks[t.id];
    if (planFor(t) !== 'explore' || !pk) continue;
    // a pick with a full team and no release chosen is skipped
    if (t.team.length >= 6 && pk.release == null) choices[t.id] = null;
    else choices[t.id] = { offer: S.weekOffers[t.id][pk.i], release: pk.release };
  }
  finishWeek(choices);
}
// auto: Sim week. Your trainers decide for themselves (AI plans and catches), ignoring this week's plans and picks
function finishWeek(choices, auto) {
  const plans = {};
  if (!auto) for (const t of userTrainers()) plans[t.id] = planFor(t);
  simWeek(plans, auto ? {} : choices);
  S.catchPicks = {};
  save();
  render();
  const found = userTrainers().map(t => t.weekLog[t.weekLog.length - 1]).filter(e => e && e.found && ITEMS[e.found]).map(e => ITEMS[e.found].name);
  const rewards = userTrainers().reduce((a, t) => a + (t.itemOffers || []).length, 0);
  const caught = userTrainers().map(t => t.weekLog[t.weekLog.length - 1]).filter(e => e && e.caught).map(e => (e.radiant ? 'a Radiant ' + (e.alpha ? 'alpha ' : '') : e.shiny ? 'a shiny ' + (e.alpha ? 'alpha ' : '') : e.alpha ? 'an alpha ' : '') + e.caught);
  // gym battles and road battles are reported separately; in a road battle your trainer may be either side
  const lb = eachLeague(() => S.lastBattles || []).flat();
  const gyms = lb.filter(r => r.stakes === 'gym'), roads = lb.filter(r => r.stakes === 'rival'), raids = lb.filter(r => r.stakes === 'raid' && !r.legend);
  const roadWon = r => { const t = T(r.sides[r.winner].id); return !!(t && t.user); };
  const gymMsg = gyms.length ? `${gyms.filter(r => r.winner === 0).length} of ${gyms.length} gym battle${gyms.length === 1 ? '' : 's'} won.` : '';
  const roadMsg = roads.length ? `${roads.filter(roadWon).length} of ${roads.length} road battle${roads.length === 1 ? '' : 's'} won.` : '';
  const legs = lb.filter(r => r.legend); const legMsg = legs.length ? (legs.some(r => r.legendCaught) ? `Caught ${legs[0].title.split(' · ')[0]}!` : `${legs.length} attempt${legs.length === 1 ? '' : 's'} at ${legs[0].title.split(' · ')[0]}.`) : '';
  const raidMsg = raids.length ? `${raids.filter(r => r.winner === 0).length} of ${raids.length} villain battle${raids.length === 1 ? '' : 's'} won.` : '';
  toast([gymMsg, roadMsg, raidMsg, legMsg, caught.length ? `Caught ${caught.join(', ')}.` : '', found.length ? `Found ${found.join(', ')}.` : '', rewards ? `${rewards} gym reward${rewards > 1 ? 's' : ''} to choose.` : ''].filter(Boolean).join(' ') || `Week ${S.week} complete.`);
  if (tourneyPaused()) { view = 'tourney'; render(); window.scrollTo(0, 0); }
  if (S.week === TOURNEY_WEEK && S.tourney && S.tourney.season === S.season) { const w = T(S.tourney.winner); toast(`Midseason Tournament: ${w ? dn(w) : 'someone'} won it!${S.tourneyOffer ? ' Choose their alpha prize.' : ''}`); }
  if (S.phase === 'league') toast('The regular season is over. Time for the Pokémon League.');
}

// open / close the page menu's dropdowns in place (no full re-render)
function syncNav() { document.querySelectorAll('.navgrp').forEach(g => { const b = g.querySelector('.navbtn'), on = !!b && b.dataset.k === navOpen; g.classList.toggle('open', on); if (b) b.setAttribute('aria-expanded', String(on)); }); }
document.addEventListener('click', ev => {
  if (navOpen && !ev.target.closest('.navgrp')) { navOpen = null; syncNav(); }
  const el = ev.target.closest('[data-act]'); if (!el) return;
  if (el.dataset.act === 'fold') { toggleFold(el); return; }
  const a = el.dataset.act;
  if (el.disabled) return;
  if (!S && dexAction(a, el)) { render(); return; }
  // an action on one of your trainers works in that trainer's League
  if (S && nLeagues() > 1 && el.dataset.id && T(+el.dataset.id) && !['draftpick', 'drel'].includes(a)) useLeague(lgOf(T(+el.dataset.id)));
  switch (a) {
    case 'imgup': openImgUp(el.dataset.k, el.dataset.c); break;
    case 'imgopt': if (modal && modal.draft) { modal.draft[el.dataset.k] = !modal.draft[el.dataset.k]; imgRedraft(); } break;
    case 'imgsave': imgSaveDraft(); break;
    case 'imgdel': { const k = modal.key; imgDel(k).then(() => { modal = modal && modal.kind === 'img' ? modal.back || null : modal; renderModal(); render(); toast(`Removed the image for ${imgLabel(k)}.`); }); break; }
    case 'images': imgMsg = ''; imgClearArm = false; modal = { kind: 'images', back: modal }; renderModal(); break;
    case 'imgtab': imgTab = el.dataset.v; imgQ = ''; imgRefresh(); break;
    case 'imgexport': imgExport(); break;
    case 'imgclear': imgClearArm = true; imgRefresh(); break;
    case 'imgclearno': imgClearArm = false; imgRefresh(); break;
    case 'imgclearyes': imgClearAll().then(() => render()); break;
    case 'setteams': setupTeams = +el.dataset.v; render(); break;
    case 'setroster': setupRoster = +el.dataset.v; render(); break;
    case 'setleagues': setupLeagues = +el.dataset.v; render(); break;
    case 'lgview': viewLg = +el.dataset.v; render(); break;
    case 'lgmove': { const why = moveTrainer(+el.dataset.id, +el.dataset.v, el.dataset.w ? +el.dataset.w : null); save(); render(); toast(why || 'Moved.'); break; }
    case 'setuppage': setupPage = el.dataset.v; render(); window.scrollTo(0, 0); break;
    case 'advtoggle': setupAdv[el.dataset.k] = !setupAdv[el.dataset.k]; render(); break;
    case 'packlist': setupPackOpen[el.dataset.k] = !setupPackOpen[el.dataset.k]; render(); break;
    case 'feattoggle': setupOff[el.dataset.k] = !setupOff[el.dataset.k]; render(); break;
    case 'featreset': setupOff = {}; render(); break;
    case 'settourneyrule': setupTourneyRule = el.dataset.v; render(); break;
    case 'cfexport': cfExport = cfExport === el.dataset.k ? null : el.dataset.k; if (setupPage === 'custom') cfRead(); render(); { const b = $('.cf-export'); if (b) b.scrollIntoView({ block: 'nearest' }); } break;
    case 'cfexpclose': cfExport = null; if (setupPage === 'custom') cfRead(); render(); break;
    case 'cfexpcopy': { const ta = $('#cf-exptext'); if (!ta) break; const done = () => toast('Pack copied. Paste it into Import trainers on another device.');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, () => { ta.select(); toast('Select all and copy the text.'); }); else { ta.select(); toast('Select all and copy the text.'); } break; }
    case 'cfexpfile': { const k = el.dataset.k, packs = exportPacksFor(k); if (packs.length) downloadText(packFileName(k), packExportText(packs)); break; }
    case 'cfimport': cfImp = cfImpBlank(el.dataset.k || 'text'); if (cfImp.src !== 'text') cfImpLoad(); setupPage = 'import'; cfExport = null; render(); window.scrollTo(0, 0); break;
    case 'cfimpread': { const ta = $('#cfimptext'); if (ta) cfImp.text = ta.value; cfImpLoad(); render(); break; }
    case 'cfimpall': { const on = el.dataset.v === '1'; cfImp.groups.forEach((g, gi) => g.rows.forEach((r, i) => { if (r.entry && cfImpMatch(r, cfImp.q)) { if (on) cfImp.sel.add(gi + ':' + i); else cfImp.sel.delete(gi + ':' + i); } }));
      const nm = $('#cfimpname'); if (nm) cfImp.newName = nm.value; render(); break; }
    case 'cfimpgo': cfImpCommit(); render(); window.scrollTo(0, 0); break;
    case 'cfopen': cfOpen(el.dataset.k); render(); window.scrollTo(0, 0); break;
    case 'cfnewpack': { const inp = $('#cf-newpack'); cfNewPackName = inp ? inp.value : ''; const r = checkPackName(cfNewPackName); cfNewPackErr = r.err || '';
      if (r.name) { const key = newCustomKey(); const ok = setCustomLib(customLib.concat([{ key, name: r.name, trainers: [] }])); setupPacks[key] = true; cfNewPackName = ''; cfOpen(key);
        cfMsg = `Created ${r.name} and switched it on.${ok ? '' : " This browser couldn't store it, so it will be gone when the page closes."}`; window.scrollTo(0, 0); }
      render(); break; }
    case 'cfrename': { cfRead(); const pk = customPack(cfPack); if (!pk) break; const r = checkPackName(($('#cf-packname') || {}).value, pk.key); cfErrs = []; cfMsg = '';
      if (r.err) cfErrs = [r.err]; else { setCustomLib(customLib.map(p => p.key === pk.key ? { ...p, name: r.name } : p)); cfMsg = `Renamed the pack to ${r.name}.`; }
      render(); break; }
    case 'cfdelpack': cfRead(); cfDelArm = true; render(); break;
    case 'cfdelpackno': cfRead(); cfDelArm = false; render(); break;
    case 'cfdelpackyes': { const pk = customPack(cfPack); cfDelArm = false; if (pk) { setCustomLib(customLib.filter(p => p.key !== pk.key)); delete setupPacks[pk.key]; toast(`Deleted ${pk.name}.`); } cfPack = null; setupPage = 'advanced'; render(); window.scrollTo(0, 0); break; }
    case 'cfsave': { cfRead(); const target = cfDraft.pack || cfPack, ed = cfEdit != null ? { key: cfPack, i: cfEdit } : null;
      const r = checkCustom(cfDraft, target, ed); cfErrs = r.errs; cfMsg = '';
      if (r.entry) {
        const list = customLib.map(p => ({ ...p, trainers: p.trainers.slice() })), from = ed && list.find(p => p.key === ed.key), to = list.find(p => p.key === target);
        if (from && from === to) to.trainers[ed.i] = r.entry; else { if (from) from.trainers.splice(ed.i, 1); to.trainers.push(r.entry); }
        const ok = setCustomLib(list);
        cfMsg = `${ed ? 'Saved' : 'Added'} ${r.entry.cls} ${r.entry.name}${target !== cfPack ? ` to ${to.name}` : ''}.${ok ? '' : " This browser couldn't store it, so it will be gone when the page closes."}`;
        cfDraft = cfBlank(); cfEdit = null;
      }
      render(); if (!r.entry) { const e = $('.cf-errs'); if (e) e.scrollIntoView({ block: 'center' }); } break; }
    case 'cfclear': cfDraft = cfBlank(); cfEdit = null; cfErrs = []; cfMsg = ''; render(); break;
    case 'cfedit': { const pk = customPack(cfPack), i = +el.dataset.v; if (!pk || !pk.trainers[i]) break; cfEdit = i; cfDraft = cfFrom(pk.trainers[i], pk.key); cfErrs = []; cfMsg = ''; render(); const f = $('#cf-form'); if (f) f.scrollIntoView({ block: 'start' }); break; }
    case 'cfdel': { cfRead(); const pk = customPack(cfPack), i = +el.dataset.v, f = pk && pk.trainers[i]; if (!f) break;
      setCustomLib(customLib.map(p => p.key === pk.key ? { ...p, trainers: p.trainers.filter((_, j) => j !== i) } : p));
      if (cfEdit === i) { cfEdit = null; cfDraft = cfBlank(); } else if (cfEdit != null && cfEdit > i) cfEdit--; cfErrs = []; cfMsg = `Deleted ${f.cls} ${f.name}.`; render(); break; }
    case 'packtoggle': if (setupPage === 'custom') cfRead(); setupPacks[el.dataset.k] = !setupPacks[el.dataset.k]; render(); break;
    case 'basetoggle': setupBaseOff = !setupBaseOff; render(); break;
    case 'packall': { const on = el.dataset.v === '1'; setupBaseOff = !on; setupPacks = { ...setupPacks, ...Object.fromEntries(Object.keys(FAMOUS_PACKS).filter(k => !FAMOUS_PACKS[k].custom).map(k => [k, on])) }; render(); break; }
    case 'advfold': setupFold[el.dataset.k] = !setupFold[el.dataset.k]; render(); break;
    case 'advfoldall': { const shut = el.dataset.v === '1'; setupFold = Object.fromEntries(['rules', 'features', 'packs', 'mypacks', 'dex', 'images', 'load', ...FEATURES.map(g => 'feat-' + g.group)].map(k => [k, shut])); render(); break; }
    case 'pickorg': viewLg = 0; newWorld(el.dataset.k, { leagues: setupLeagues, teams: setupTeams, roster: setupRoster, allFamous: setupAdv.allFamous, baseOff: setupBaseOff, packs: Object.keys(setupPacks).filter(k => setupPacks[k]), off: Object.keys(setupOff).filter(k => setupOff[k]), tourneyRule: setupTourneyRule }); S.catchPicks = {}; setupPage = 'main'; save(); go('draft'); break;
    case 'nav': navOpen = null; modal = null; renderModal(); go(el.dataset.v); break;
    case 'navgrp': navOpen = navOpen === el.dataset.k ? null : el.dataset.k; syncNav(); break;
    case 'profile': modal = { kind: 'profile', id: +el.dataset.id, back: recBack() }; renderModal(); break;
    case 'ownTab': openOwnTab(); break;
    case 'embedhide': embedNoteHidden = true; try { sessionStorage.setItem('plgm-embed-note', '1'); } catch (e) {} render(); break;
    case 'glossary': navOpen = null; syncNav(); modal = { kind: 'glossary' }; renderModal(); break;
    case 'glosssec': glossSec = el.dataset.v; if (modal && modal.kind === 'glossary') { renderModal(); const sh = document.querySelector('.sheet'); if (sh) sh.scrollTop = 0; } break;
    case 'updates': navOpen = null; modal = null; renderModal(); markUpdatesSeen(); go('updates'); break;
    case 'close': if (modal && modal.kind === 'simmany' && modal.running) break; clearInterval(player); modal = modal && modal.back ? modal.back : null; renderModal(); break;
    case 'simmany': modal = { kind: 'simmany', n: 5, accept: false }; renderModal(); break;
    case 'legrel': { const id = +el.dataset.id; const m = answerLegend(id, +el.dataset.u); save(); render(); if (m) toast(`${m.sp} joined the team!`); break; }
    case 'legno': { answerLegend(+el.dataset.id, null); save(); render(); break; }
    case 'snagsel': { const id = +el.dataset.id; S.snagPick = S.snagPick || {}; S.snagPick[id] = { i: +el.dataset.i, release: (S.snagPick[id] || {}).release }; render(); break; }
    case 'snagrel': { const id = +el.dataset.id; S.snagPick = S.snagPick || {}; S.snagPick[id] = Object.assign(S.snagPick[id] || {}, { release: +el.dataset.u }); render(); break; }
    case 'snaggo': { const id = +el.dataset.id; const pk = (S.snagPick || {})[id]; if (pk) { const m = answerSnag(id, pk.i, pk.release); delete S.snagPick[id]; save(); render(); if (m) toast(`Snagged a Shadow ${m.sp}.`); } break; }
    case 'snagno': { const id = +el.dataset.id; answerSnag(id, null); if (S.snagPick) delete S.snagPick[id]; save(); render(); break; }
    case 'tradeans': { const id = +el.dataset.id; const r = answerTrade(id, el.dataset.v === '1'); save(); render(); if (r) toast(`Trade done: ${T(id).name} received ${r.a}.`); break; }
    case 'megaset': { const t = T(+el.dataset.id); if (t && t.user) { assignMegaStone(t, +el.dataset.u, el.dataset.v); save(); render(); } break; }
    case 'hoflg': hofLg = el.dataset.v; render(); break;
    case 'hofsort': hofSort = el.dataset.v; render(); break;
    case 'recmore': modal = { kind: 'recmore', key: el.dataset.k }; renderModal(); break;
    case 'simmanyn': modal.n = +el.dataset.v; renderModal(); break;
    case 'simmanyacc': modal.accept = el.dataset.v === '1'; renderModal(); break;
    case 'simstoptourney': simStopTourney = !simStopTourney; renderModal(); break;
    case 'simmanygo': modal.stopTourney = simStopTourney && featOn('tourney'); modal.running = true; modal.log = []; renderModal(); simTimer = setTimeout(simManyTick, 30); break;
    case 'simmanystop': modal.stopRequested = true; renderModal(); break;
    case 'simmanyclose': modal = null; renderModal(); go('office'); break;
    case 'simmanyrecords': modal = null; renderModal(); go('records'); break;
    case 'plan': S.plans[+el.dataset.id] = el.dataset.v; save(); render(); break;
    case 'playweek': playWeek(); break;
    case 'csel': { const id = +el.dataset.id; const prev = S.catchPicks[id]; S.catchPicks[id] = { i: +el.dataset.i, release: prev ? prev.release : null }; save(); render(); break; }
    case 'crel': { const id = +el.dataset.id; if (S.catchPicks[id]) S.catchPicks[id].release = +el.dataset.u; save(); render(); break; }
    case 'cclear': delete S.catchPicks[+el.dataset.id]; save(); render(); break;
    case 'itemtake': { const k = takeItemOffer(+el.dataset.id, +el.dataset.i); save(); render(); if (k) toast(`${ITEMS[k].name} added to the bag.`); break; }
    case 'itemopen': itemOpen = itemOpen === +el.dataset.u ? null : +el.dataset.u; render(); break;
    case 'itemset': setItem(+el.dataset.id, +el.dataset.u, el.dataset.k || null); save(); render(); break;
    case 'itemauto': { const t = T(+el.dataset.id); if (t) { t.itemsManual = false; autoEquip(t); itemOpen = null; save(); render(); toast('Items equipped.'); } break; }
    case 'tourneydone': S.tourneyPause = false; save(); go('office'); toast(`On to week ${S.week + 1}.`); break;
    case 'simweek': if (S.phase !== 'season') break; finishWeek({}, true); break;
    case 'autoseasonask': modal = { kind: 'confirmsim' }; renderModal(); setTimeout(() => { const b = document.querySelector('[data-act="autoseason"]'); if (b && b.focus) b.focus(); }, 0); break;
    case 'autoseason': { const stop = tourneyAhead() && simStopTourney; modal = null; renderModal(); S.tourneyPause = false;
      if (stop) simToTourney(); else while (S.phase === 'season') simWeek({}, {});
      save(); go('office'); toast(stop ? `Simulated to week ${TOURNEY_WEEK}. Your trainers made their own calls. The Midseason Tournament is played after this week.` : 'Simulated to the end of the regular season. Your trainers made their own calls.'); break; }
    case 'runleague': runLeague(); save(); go('recap'); break;
    case 'giftpick': giftPick = +el.dataset.u; render(); break;
    case 'giftgo': if (giftPick == null) break; confirmGift(giftPick); giftPick = null; save(); render(); toast('Farewell gift left in the ranch.'); break;
    case 'giftskip': confirmGift(null); giftPick = null; giftTo = null; save(); render(); break;
    case 'todraft': if (S.offers.length) { go('offers'); break; } setupDraft(); save(); go(S.phase === 'draft' ? 'draft' : 'office'); break;
    case 'drel': draftRelease = +el.dataset.id; render(); break;
    case 'draftpick': userDraft(+el.dataset.id, draftRelease); draftRelease = null; save(); afterDraft(); break;
    case 'draftpass': userDraft(null); save(); afterDraft(); break;
    case 'giftsconfirm': if ((S.pendingGifts || []).length) break; confirmGifts(); save(); afterDraft(); break;
    case 'reassignconfirm': confirmReassign(); save(); afterDraft(); break;
    case 'banset': setBanVote(+el.dataset.l, el.dataset.sp, +el.dataset.v); save(); render(); break;
    case 'banconfirm': if (S.phase !== 'banvote') break; { confirmBanVote(); save(); const r = S.banResults, nb = r ? r.lgs.reduce((a, x) => a + x.rows.filter(y => y.passed).length, 0) : 0; afterDraft(); toast(nb ? `Votes are in: ${nb} new ban${nb === 1 ? '' : 's'}. See the news.` : 'Votes are in: no new bans.'); } break;
    case 'ranchkeep': ranchKeep = +el.dataset.u; render(); break;
    case 'ranchkeepgo': if (ranchKeep == null) break; { const m = answerRanchPick(+el.dataset.i, ranchKeep); ranchKeep = null; save(); render(); if (m) toast(`${m.sp} is in your ranch.`); } break;
    case 'ranchkeepnone': answerRanchPick(+el.dataset.i, null); ranchKeep = null; save(); render(); break;
    case 'ranchsel': ranchSel = ranchSel === +el.dataset.u ? null : +el.dataset.u; render(); break;
    case 'ranchto': ranchTo = +el.dataset.id; render(); break;
    case 'ranchgo': if (ranchSel == null || ranchTo == null || S.phase !== 'ranch') break; { const m = ranchHand(S.userOrg, ranchSel, ranchTo); ranchSel = null; ranchTo = null; save(); render(); if (m) toast(`${m.sp} is on its way.`); } break;
    case 'ranchshelf': { const lg = (() => { const R = ranchOf(S.userOrg), x = R && R.active.find(y => y.uid === ranchSel); return x && isLegendLine(x.sp) && x.partners; })(); const m = ranchShelf(S.userOrg, ranchSel); if (!m) break; ranchSel = null; save(); render(); toast(lg ? `${m.sp} moved on.` : `${m.sp} moved to the historical ranch.`); } break;
    case 'ranchrest': if (S.phase !== 'ranch') break; { const t = T(+el.dataset.id), m = t && t.org === S.userOrg ? restMon(t, +el.dataset.u) : null; save(); render(); if (m) toast(`${m.sp} is resting at the ranch.`); } break;
    case 'ranchunrest': if (S.phase !== 'ranch') break; { const t = T(+el.dataset.id), m = t && t.org === S.userOrg ? unrestMon(t) : null; save(); render(); if (m) toast(`${m.sp} stays on the team.`); } break;
    case 'ranchdone': if ((S.ranchPicks || []).some(p => p.org === S.userOrg)) break; confirmRanch(); save(); afterDraft(); break;
    case 'rewardpick': confirmReward(el.dataset.n); save(); afterDraft(); break;
    case 'regtoggle': { const id = +el.dataset.id, u = +el.dataset.u; const sel = S.registration[id]; const i = sel.indexOf(u); if (i >= 0) sel.splice(i, 1); else if (sel.length < START_TEAM) sel.push(u); else { sel.shift(); sel.push(u); } save(); render(); break; }
    case 'regconfirm': if (!Object.entries(S.registration).every(([id, sel]) => sel.length === Math.min(START_TEAM, regular(T(+id)).length))) break; confirmRegistration(); save(); go('office'); toast(`Season ${S.season} is underway.`); break;
    case 'rejoinrel': rejoinRelease = +el.dataset.id; render(); break;
    case 'offer': { if (el.dataset.v === '1' && S.offers[0] && S.offers[0].kind === 'rejoin' && lgRoster(S.userOrg, S.offers[0].lg || 0).length >= ROSTER && rejoinRelease == null) break; acceptOffer(el.dataset.v === '1', rejoinRelease); rejoinRelease = null; save(); render(); if (S.lastSeatBattle) { modal = { kind: 'battle', r: S.lastSeatBattle }; renderModal(); S.lastSeatBattle = null; } break; }
    case 'releaseask': el.parentElement.innerHTML = `<span>Release ${dn(T(+el.dataset.id))}?</span><button class="btn danger" data-act="releasego" data-id="${el.dataset.id}">Release</button><button class="btn" data-act="nav" data-v="${view}">Keep</button>`; break;
    case 'releasego': userRelease(+el.dataset.id); save(); render(); toast('Released. They stay on the circuit as an independent.'); break;
    case 'watchtourney': { const T0 = S.tourney, r = T0 && T0.rounds[+el.dataset.r], m = r && r.matches[+el.dataset.m]; if (m && m.log) { modal = { kind: 'battle', r: m.log }; renderModal(); } break; }
    case 'tourneyrel': tourneyRel = +el.dataset.u; render(); break;
    case 'tourneypick': { const id = +el.dataset.id, t = T(id), inp = $('#tp-sp'), raw = (inp ? inp.value : '').trim(); tourneyText = raw;
      const sp = el.dataset.sp || tourneySpecies().find(n => n.toLowerCase() === raw.toLowerCase());
      if (!sp) { toast(raw ? `${raw} can't be chosen. Pick a Pokémon from the list.` : 'Type a Pokémon first.'); break; }
      if (t.team.length >= 6 && tourneyRel == null) { toast('The team is full. Choose who makes room first.'); break; }
      const m = tourneyPick(id, sp, tourneyRel); tourneyRel = null; tourneyText = ''; save(); render(); if (m) toast(`An alpha ${m.sp} joined ${t.name}'s team!`); break; }
    case 'watchworld': { const m = S.worlds && S.worlds.matches[+el.dataset.i]; if (m) { modal = { kind: 'battle', r: m.log }; renderModal(); } break; }
    case 'watch': { const r = el.dataset.src === 'week' ? S.lastBattles[+el.dataset.i] : S.league.logs[+el.dataset.i]; modal = { kind: 'battle', r }; renderModal(); break; }
    case 'bskip': clearInterval(player); modal.skip && modal.skip(); break;
    case 'bspeed': setBattleSpeed(el.dataset.v); break;
    case 'bpause': toggleBattlePause(); break;
    case 'nf': newsFilter = el.dataset.v; render(); break;
    case 'mon': modal = { kind: 'mon', t: +el.dataset.t, u: +el.dataset.u, back: recBack() }; renderModal(); break;
    case 'alum': modal = { kind: 'mon', t: +el.dataset.t, alum: +el.dataset.i, back: recBack() }; renderModal(); break;
    case 'ranchrec': modal = { kind: 'mon', rec: { u: +el.dataset.u, s: +el.dataset.s }, back: recBack() }; renderModal(); break;
    case 'dexsort': { const k = el.dataset.k; dexSort = dexSort.k === k ? { k, dir: -dexSort.dir } : { k, dir: k === 'sp' ? 1 : -1 }; render(); break; }
    case 'dexkind': dexKind = el.dataset.v; render(); break;
    case 'dextrait': dexTrait = el.dataset.v; render(); break;
    case 'dexscope': dexScope = el.dataset.v; render(); break;
    case 'rhsort': { const k = el.dataset.k; rhSort = rhSort.k === k ? { k, dir: -rhSort.dir } : { k, dir: ['sp', 'from', 'why'].includes(k) ? 1 : -1 }; render(); break; }
    case 'rhmore': rhShow += 100; render(); break;
    case 'trsort': { const k = el.dataset.k; trSort = trSort.k === k ? { k, dir: -trSort.dir } : { k, dir: ['name', 'org', 'pos'].includes(k) ? 1 : -1 }; render(); break; }
    case 'draftsort': { const k = el.dataset.k; draftSort = draftSort.k === k && k !== 'best' ? { k, dir: -draftSort.dir } : { k, dir: ['name', 'type', 'trait', 'age'].includes(k) ? 1 : -1 }; render(); break; }
    case 'trscope': trScope = el.dataset.v; render(); break;
    case 'trgroup': trGroup = el.dataset.v; trFam = 'all'; render(); break;
    case 'trfam': trFam = el.dataset.v; render(); break;
    case 'dexmin': dexMin = +el.dataset.v; render(); break;
    case 'menu': modal = { kind: 'menu' }; renderModal(); break;
    case 'export': {
      const m0 = modal; m0.exportText = null; m0.copied = false; m0.copying = true; renderModal();
      saveCode().then(txt => {
        const showBox = () => { if (modal !== m0) return; m0.copying = false; m0.exportText = txt.replace(/</g, '\\u003c'); renderModal(); const b = $('#exportbox'); if (b) b.select(); };
        try { navigator.clipboard.writeText(txt).then(() => { if (modal !== m0) return; m0.copying = false; m0.copied = true; renderModal(); }, showBox); } catch (e) { showBox(); }
      });
      break; }
    case 'importshow': modal.importing = true; renderModal(); break;
    case 'importgo': { const m0 = modal; parseSave($('#importbox').value).then(v => { if (modal !== m0) return; if (!v) { m0.err = SAVE_ERR; renderModal(); return; } adoptSave(v); save(); modal = null; renderModal(); go(view); toast('Save loaded.'); }); break; }
    case 'savefile': saveFile(); break;
    case 'setuploadgo': { parseSave(($('#setupload') || {}).value).then(v => { if (!v) { setupLoadErr = SAVE_ERR; render(); return; } setupLoadErr = ''; setupPage = 'main'; adoptSave(v); save(); go(view); toast(`Loaded Season ${S.season || 1} of a ${ORG_KEYS.length}-team league.`); }); break; }
    case 'newask': modal.confirmNew = true; renderModal(); break;
    case 'newcancel': modal.confirmNew = false; renderModal(); break;
    case 'newgo': try { localStorage.removeItem(SAVE_KEY); } catch (e) {} S = null; modal = null; renderModal(); render(); break;
  }
});
document.addEventListener('input', e => {
  const id = e.target && e.target.id;
  if (id === 'trsearch') { trQ = e.target.value; const r = $('#trres'); if (r) r.innerHTML = trainersResults(); }
  if (id === 'glosssearch') { glossQ = e.target.value; const r = $('#glossres'); if (r) { r.innerHTML = glossResults(); applyFolds(r, 'modal-glossary'); } }
  if (id === 'dexsearch') { dexQ = e.target.value; const r = $('#dexres'); if (r) r.innerHTML = dexResults(); }
  if (id === 'setupload') setupLoadText = e.target.value;
  if (id === 'dx-pick') dxPickText = e.target.value;
  if (id === 'dx-imp') dxImpText = e.target.value;
  if (id === 'dx-from' || id === 'dx-legend') dxSyncChecks();
  if (e.target && e.target.classList && e.target.classList.contains('dx-stat')) { const b = $('#dx-bst'); if (b) b.textContent = '· total ' + dxBst([0, 1, 2, 3, 4, 5].map(i => Number((($('#dx-st' + i) || {}).value) || 0))); dxSyncWarn(); }
  if (id === 'cfimpq' && cfImp) { cfImp.q = e.target.value; const r = $('#cfimplist'); if (r) r.innerHTML = cfImpList(); }
  if (id === 'cfimptext' && cfImp) cfImp.text = e.target.value;
  if (id === 'cfimpname' && cfImp) cfImp.newName = e.target.value;
  if (id === 'imgq') { imgQ = e.target.value; const r = $('#imggrid'); if (r) r.innerHTML = imgGrid(); }
  if (id === 'hofsearch') { hofQ = e.target.value; const r = $('#hofres'); if (r) r.innerHTML = hofResults(); }
});
// a chosen save file is read into the paste box, so it can be checked and loaded the same way
document.addEventListener('change', e => {
  if (e.target && e.target.id === 'imgfile' && e.target.files && e.target.files[0]) { imgPickFile(e.target.files[0]); return; }
  if (e.target && e.target.id === 'imgpackfile' && e.target.files && e.target.files.length) { imgImport(e.target.files).then(() => render()); return; }
  if (e.target && e.target.id === 'dx-legend') { dxSyncChecks(); return; }
  if (e.target && e.target.id === 'cf-trait') { cfRead(); render(); return; }
  if (e.target && e.target.classList && e.target.classList.contains('cf-imp-chk') && cfImp) { const k = e.target.dataset.k; if (e.target.checked) cfImp.sel.add(k); else cfImp.sel.delete(k); const b = $('#cfimpgo'); if (b) b.textContent = cfImpGoLabel(); return; }
  if (e.target && e.target.id === 'cfimpsrc' && cfImp) { const src = e.target.value; cfImp = cfImpBlank(src); if (src !== 'text') cfImpLoad(); render(); return; }
  if (e.target && e.target.id === 'cfimpdest' && cfImp) { const nm = $('#cfimpname'); if (nm) cfImp.newName = nm.value; cfImp.dest = e.target.value; render(); return; }
  if (e.target && e.target.id === 'cfimpfile' && e.target.files && e.target.files[0] && cfImp) { const f = e.target.files[0], rd = new FileReader();
    rd.onload = () => { cfImp.text = String(rd.result || ''); cfImp.fileName = f.name; cfImpLoad(); render(); }; rd.onerror = () => { cfImp.err = "Couldn't read that file."; render(); }; rd.readAsText(f); return; }
  if (!e.target || e.target.id !== 'setupfile' || !e.target.files || !e.target.files[0]) return;
  const f = e.target.files[0], rd = new FileReader();
  rd.onload = async () => { setupLoadText = String(rd.result || ''); setupLoadName = f.name; setupLoadErr = (await parseSave(setupLoadText)) ? '' : SAVE_ERR; render(); };
  rd.onerror = () => { setupLoadErr = "Couldn't read that file."; render(); };
  rd.readAsText(f);
});
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.dataset && e.target.dataset.act === 'fold') { e.preventDefault(); toggleFold(e.target); return; } if (e.key === 'Escape' && navOpen) { navOpen = null; syncNav(); return; } if (e.key === 'Escape' && modal && !(modal.kind === 'simmany' && modal.running)) { clearInterval(player); modal = modal.back || null; renderModal(); } });

// take over a save: fill in anything older saves are missing and open the right screen for its phase
function adoptSave(v, keepView) {
  S = v; applyDex(S.cfg && S.cfg.dex); applyCfg(); S.catchPicks = S.catchPicks || {};
  for (const t of Object.values(S.trainers)) {
    if (['leader', 'e4', 'champion'].includes(t.role) && !(t.posts || []).length) t.posts = [{ role: t.role, place: postPlace(t, t.role), from: t.joined || 1, to: null }];
    if (t.org && !(t.teams || []).length) t.teams = [{ org: t.org, from: t.joined || 1, to: null }];
  }
  view = keepView || (S.phase === 'draft' ? 'draft' : S.phase === 'gifts' ? 'gifts' : S.phase === 'reassign' ? 'reassign' : S.phase === 'banvote' ? 'banvote' : S.phase === 'register' ? 'register' : S.phase === 'reward' ? 'reward' : S.phase === 'ranch' ? 'ranch' : 'office');
}
// Download save file: inside claude.ai the viewer's downloads capability offers the file (with a confirmation);
// opened as a plain local file, an ordinary browser download does it
let downloadsNs = null, downloadsChecked = !window.claude;
if (window.claude && window.claude.use) window.claude.use('downloads').then(ns => { downloadsNs = ns; downloadsChecked = true; if (modal && modal.kind === 'menu') renderModal(); }, () => { downloadsChecked = true; });
const canSaveFile = () => !window.claude || !!downloadsNs;
async function saveFile() {
  const data = await saveCode(), filename = `pokemon-league-gm-season-${S.season || 1}.${data.startsWith(CODE_TAG) ? 'txt' : 'json'}`;
  if (downloadsNs) {
    try { await downloadsNs.save({ filename, data }); toast('Save file downloaded.'); }
    catch (e) { const c = e && e.code; if (c === 'declined') return; toast(c === 'rate_limited' ? 'A download is already waiting for your answer.' : "Couldn't download here. Use Copy save to clipboard instead."); }
    return;
  }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: data.startsWith(CODE_TAG) ? 'text/plain' : 'application/json' })); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); toast('Save file downloaded.'); }
  catch (e) { toast("Couldn't download here. Use Copy save to clipboard instead."); }
}
// a save from the menu's export: pasted text or the contents of a downloaded file
async function parseSave(txt) {
  try {
    let t = String(txt || '').replace(/\s+/g, '');
    if (t.startsWith(CODE_TAG)) {
      if (!CAN_DEFLATE) return null;
      const ds = new Blob([b64ToBytes(t.slice(CODE_TAG.length))]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      t = await new Response(ds).text();
    } else t = String(txt || '').trim();
    const v = JSON.parse(t); return v && v.trainers && v.version === 3 ? v : null;
  } catch (e) { return null; }
}
const SAVE_ERR = "That isn't a save from this version of Pokémon League GM. Use the whole save text, or a file from the menu's Download save file.";
function boot(data) {
  imgBootDone = false; imgLoadAll();
  const saved = (data && data.S && data.S.version === 3 && data.S) || load();
  if (saved && saved.packed) {
    $('#app').innerHTML = '<p class="muted" style="padding:24px">Loading your league…</p>';
    if (!CAN_DEFLATE) { S = null; imgBootDone = true; render(); return; }
    inflateText(saved.packed).then(txt => { const v = JSON.parse(txt); if (v && v.version === 3) adoptSave(v, data && data.view); else S = null; imgBootDone = true; render(); receiveFromEmbed(); }, () => { S = null; imgBootDone = true; render(); receiveFromEmbed(); });
    return;
  }
  if (saved) adoptSave(saved, data && data.view);
  else S = null;
  imgBootDone = true;
  render();
  receiveFromEmbed();
}
window.claude?.hot?.snapshot?.(() => ({ S, view }));
window.claude?.hot?.ready ? window.claude.hot.ready(boot) : boot(window.claude?.hot?.data ?? {});
