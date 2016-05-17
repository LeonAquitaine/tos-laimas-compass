app.service('dataService', function ($rootScope) {
    
    var serv = this;

    serv.mapNames = {
        "1001": "Klaipeda",
        "1006": "Orsha",
        "1007": "Saalus Convent",
        "1021": "West Siauliai Woods",
        "1032": "East Siauliai Woods",
        "1041": "Miners' Village",
        "1051": "Crystal Mine 1F",
        "1081": "Entrance of Kateen Forest",
        "1082": "Owl Burial Ground",
        "1111": "Karolis Springs",
        "1122": "Paupys Crossing",
        "1131": "Letas Stream",
        "1141": "Poslinkis Forest",
        "1151": "Saknis Plains",
        "1162": "Woods of the Linked Bridges",
        "1171": "Lemprasa Pond",
        "1172": "Spring Light Woods",
        "1173": "Uskis Arable Land",
        "1174": "Vilna Forest",
        "1175": "Dina Bee Farm",
        "1176": "Baron Allerno",
        "1180": "Gytis Settlement Area",
        "1191": "Kule Peak",
        "1201": "Gate Route",
        "1211": "Sirdgela Forest",
        "1221": "Kvailas Forest",
        "1231": "Dvasia Peak",
        "1241": "Sunset Flag Forest",
        "1251": "Gateway of the Great King",
        "1261": "Ramstis Ridge",
        "1271": "Overlong Bridge Valley",
        "1281": "Akmens Ridge",
        "1291": "Tiltas Valley",
        "1301": "Rukas Plateau",
        "1311": "King's Plateau",
        "1321": "Zachariel Crossroads",
        "1331": "Royal Mausoleum 1F",
        "1381": "Guards Graveyard",
        "1391": "Valius' Eternal Resting Place",
        "1411": "Underground Grave of Ritinis",
        "1421": "Stele Road",
        "1431": "Goddess' Ancient Garden",
        "1441": "Escanciu Village",
        "1451": "Fedimian Suburbs",
        "1461": "Mage Tower 1F",
        "1511": "Starving Demon's Way",
        "1521": "Pilgrim Path",
        "1531": "Manahas",
        "1541": "Genar Field",
        "1542": "Feretory Hills",
        "1543": "Sutatis Trade Route",
        "1544": "Mochia Forest",
        "1551": "Altar Way",
        "1561": "Forest of Prayer",
        "1571": "Apsimesti Crossroads",
        "1581": "Main Chamber",
        "1631": "Dingofasil District",
        "1641": "Verkti Square",
        "1651": "Roxona Market",
        "1661": "Ruklys Street",
        "1681": "Downtown",
        "1691": "Inner Enceinte District",
        "1701": "Sentry Bailey",
        "1751": "Ibre Plateau",
        "1761": "Grand Yard Mesa",
        "1771": "Sventimas Exile",
        "1781": "Kadumel Cliff",
        "1791": "Steel Heights",
        "1831": "Kalejimas Visiting Room",
        "1881": "Pelke Shrine Ruins",
        "1891": "Absenta Reservoir",
        "1901": "3Cm lake 85",
        "1911": "3Cm lake 86",
        "1921": "3Cm lake 87",
        "1931": "Astral Tower 88",
        "1981": "Castle 93",
        "1982": "Castle 94",
        "1983": "Castle 95",
        "1984": "Castle 96",
        "1985": "Castle 98",
        "1986": "Castle 97",
        "1987": "Castle 99",
        "1988": "Castle 101",
        "1989": "Castle 100",
        "1990": "Castle 102",
        "1991": "Closed Town 103",
        "1992": "Closed Town 104",
        "1993": "Closed Town 105",
        "1994": "Closed Town 106",
        "1995": "Closed Town 107",
        "2000": "Closed Dungeon 108",
        "2051": "Grynas Trails",
        "2061": "Grynas Training Camp",
        "2071": "Grynas Hills",
        "2081": "Srautas Gorge",
        "2082": "Gele Plateau",
        "2083": "Nefritas Cliff",
        "2084": "Tenet Garden",
        "2085": "Tenet Church B1",
        "2088": "Veja Ravine",
        "2089": "Vieta Gorge",
        "2090": "Cobalt Forest",
        "2091": "Septyni Glen",
        "2101": "White Tree 23_1",
        "2111": "Maple Forest 23_2",
        "2121": "White Tree 23_3",
        "2131": "Mesafasla",
        "2141": "Stogas Plateau",
        "2300": "Greene Manor",
        "2301": "Shaton Farm",
        "2302": "Shaton Reservoir",
        "2401": "Passage of the Recluse",
        "2411": "Mullers Passage",
        "2412": "Underground Passage 4",
        "2421": "Thaumas Trail",
        "2431": "Salvia Forest",
        "2441": "Rasvoy Lake",
        "2451": "Sekta Forest",
        "2461": "Oasseu Memorial",
        "2471": "Maven Abby",
        "2481": "Sienakal Graveyard",
        "2491": "Carlyle's Mausoleum",
        "2501": "Viltis Forest",
        "2511": "Glade Hillroad",
        "2521": "Laukyme Swamp",
        "2531": "Tyla Monastery",
        "2541": "Galeed Plateau",
        "2551": "Fasika Plateau",
        "2561": "Nuoridin Falls",
        "2571": "Namu Temple Ruins",
        "2581": "Istora Ruins",
        "3000": "Closed Town 18_1",
        "3010": "Closed Town 18_2",
        "3020": "Castle Dungeon 19_1",
        "3030": "Castle Dungeon 19_2",
        "3040": "Castle Field 20_1",
        "3050": "Castle Field 20_2",
        "3060": "Castle Field 20_3",
        "3070": "Castle Field 20_4",
        "3080": "Closed Town 20_5",
        "3090": "Closed Town 20_6",
        "3100": "White tree 21_1",
        "3110": "White tree 21_2",
        "3120": "White tree 22_1",
        "3130": "White tree 22_2",
        "3140": "White tree 22_3",
        "3150": "Monastery 22_4",
        "3160": "Monastery 22_5",
        "3170": "Fantasy Library 48_1",
        "3220": "3cm lake 27_1",
        "3221": "3cm lake 27_2",
        "3223": "3cm lake 27_3",
        "3230": "Maple Forest 24_1",
        "3240": "Maple Forest 24_2",
        "3250": "Maple Forest 24_3",
        "3260": "Maple Forest 25_1",
        "3270": "Maple Forest 25_2",
        "3280": "Maple Forest 25_3",
        "3290": "Catacombs 25_4",
        "3300": "White Tree 56_1",
        "3310": "Ruklys Hall of Fame",
        "3320": "Extension",
        "3330": "Evacuation Residential District",
        "3340": "Coastal Fortress",
        "3350": "Cranto Coast",
        "3360": "Igti Coast",
        "3370": "Bellai Rainforest",
        "3380": "Seir Rainforest",
        "3390": "Alemeth Forest",
        "3400": "Zeraha",
        "3410": "Barha Forest",
        "3420": "Nahash Forest",
        "3430": "Vera Coast",
        "3440": "Elgos Monastery Annex",
        "3450": "Elgos Abbey Main Building",
        "3460": "Videntis Shrine",
        "3470": "Mokusul Chamber",
        "3480": "2nd Demon Prison",
        "3530": "Coral Plains 44_1",
        "3540": "Coral Plains 44_2",
        "3550": "Coral Plains 44_3",
        "3560": "Limestone Cave 52_1",
        "3610": "Demon Prison District 1",
        "3660": "Limestone Cave 55-1",
        "3670": "Bracken Forest 42_1",
        "3680": "Bracken Forest 42_2",
        "3690": "Bracken Forest 43_1",
        "3700": "Bracken Forest 43_2",
        "3710": "Bracken Forest 43_3",
        "3720": "Bracken Forest 43_4",
        "3730": "Tenants' Farm",
        "3740": "Aqueduct Bridge Area",
        "3750": "Myrkiti Farm",
        "3760": "Vedas Plateau",
        "3770": "3cm lake 26_1",
        "3780": "3cm lake 26_2",
        "3790": "Closed Town 53_1",
        "3810": "Royal Mausoleum Workers Lodge",
        "3840": "Residence of the Fallen Legwyn Family",
        "3850": "Roxona Reconstruction Agency West Building",
        "3910": "Ashaq Underground Prison 1F",
        "3960": "Koru Jungle",
        "3970": "Knidos Jungle",
        "3980": "Dadan Jungle",
        "3990": "Novaha Assembly Hall",
        "4020": "Delmore Hamlet",
        "4030": "Delmore Manor",
        "4040": "Delmore Outskirts",
        "4050": "Nevellet Quarry 1F",
        "4070": "Topes Fortress 1F",
        "4090": "Sicarius 1F",
        "981": "Fedimian"
    };

    serv.event = null;

    var socket = io();

    socket.on('maps', function (data) {
        console.log('data:maps');

        serv.maps = data;

        serv.mapHash = {};

        serv.mapClassPerName = {};
        serv.mapOrderedHashList = {};

        //First, a hash identifying map ClassIDs per name:

        serv.maps.forEach(function (i) {
            serv.mapClassPerName[i.ClassName] = i.ClassID;
            var v = "00" + i.QuestLevel;
            var u = "0000" + i.ClassID;
            var t = "" + v.substr(v.length - 3) + u.substr(u.length - 5);
            i.mapOrderedHash = Number(t);
        });

        serv.maps = serv.maps.sort(function (a, b) {
            return a.mapOrderedHash - b.mapOrderedHash;
        });

        //Then filter out the useless stuff and hash it:

        var nodes = {};

        serv.maps.forEach(function (i) {

            if (i.UseMapFog == 1)
                if (i.PhysicalLinkZone) {

                    serv.mapOrderedHashList[i.mapOrderedHash] = i;


                    serv.mapHash[i.ClassID] = i;

                    serv.mapHash[i.ClassID].Description = serv.mapNames[i.ClassID] ? serv.mapNames[i.ClassID] : i.EngName;

                    // Translate PhysicalLinkZone names to ClassIDs

                    var ls = [];
                    var ols = {};

                    var links = i.PhysicalLinkZone.split('/');

                    angular.forEach(links, function (ii) {
                        ls.push(serv.mapClassPerName[ii]);
                        ols[serv.mapClassPerName[ii]] = 1;
                    });

                    nodes[serv.mapClassPerName[i.ClassName]] = ols;

                    serv.mapHash[i.ClassID].linkedMaps = ls;
                }
        });

        serv.nodes = nodes;

         $rootScope.$digest();
    });

    socket.on('mobs', function (data) {
        console.log('data:mobs');
        serv.mobs = data;
         $rootScope.$digest();
    });

    socket.on('settings', function (data) {
        console.log('data:settings');
        serv.settings = data;
         $rootScope.$digest();
    });

    socket.on('server', function (data) {
        console.log('data:server');
        console.log(data);
        serv.server = data;
         $rootScope.$digest();
    });

    socket.on('tracker', function (data) {
        console.log('data:tracker');
        serv.tracker = data;

        serv.trackedCharacters = {};

        for (var k in serv.tracker)
            for (var l in serv.tracker[k]) {
                var name = l + ' ' + k;
                serv.trackedCharacters[name] = serv.tracker[k][l];
            }

         $rootScope.$digest();
    });

    socket.on('event', function (data) {
        console.log('data:event');
        serv.event = data;

        serv.selectedCharacter = data.Character;

        if (!serv.trackedCharacters[serv.selectedCharacter].map[data.Map])
            serv.trackedCharacters[serv.selectedCharacter].map[data.Map] = { mobs: [], Exploration: {} };

        if (data.EventSource === 'Exploration') {
            serv.trackedCharacters[serv.selectedCharacter].map[data.Map].Exploration = data.Data.Exploration;
        }
        else {
            if (serv.trackedCharacters[serv.selectedCharacter].map[data.Map].mobs.indexOf(data.EventSource) == -1)
                serv.trackedCharacters[serv.selectedCharacter].map[data.Map].mobs.push(data.EventSource);


            if (!serv.trackedCharacters[serv.selectedCharacter].mob[data.EventSource])
                serv.trackedCharacters[serv.selectedCharacter].mob[data.EventSource] = {};


            serv.trackedCharacters[serv.selectedCharacter].mob[data.EventSource].Total = data.Data[data.EventSource].Total;
            serv.trackedCharacters[serv.selectedCharacter].mob[data.EventSource].Current = data.Data[data.EventSource].Current;
            serv.trackedCharacters[serv.selectedCharacter].mob[data.EventSource].Completed = data.Data[data.EventSource].Completed;
        }

         $rootScope.$digest();
    });


});