app.service('dataService', function ($rootScope, $http) {

    var serv = this;

    serv.event = null;

    $http.get('res/data/maps.json').success(function (data) {
        setMaps(data);
    });
    $http.get('res/data/mobs.json').success(function (data) {
        setMobs(data);
    });

    function setMaps(data) {
        console.log('data:maps');
        serv.maps = data;

        var orderedMaps = [];

        for (var m in serv.maps) {
            orderedMaps.push(serv.maps[m]);
        };

        orderedMaps.sort(function (a, b) { return a.Name - b.Name });
        orderedMaps.sort(function (a, b) { return a.QuestLevel - b.QuestLevel });

        serv.orderedMaps = orderedMaps;

        // Prepare node list for route resolution

        var nodes = {};

        for (var m in serv.maps) {
            var mapo = serv.maps[m];

            nodes[m] = {};

            mapo.nodes.forEach(function (e) {
                nodes[m][e] = 1;
            });
        };

        serv.nodes = nodes;
    };

    function setMobs(data) {
        console.log('data:mobs');
        serv.mobs = data;
    };

    if (typeof io !== "undefined") {
        var socket = io();
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

            var defaultChar = -1;

            for (var k in serv.tracker)
                for (var l in serv.tracker[k]) {
                    var name = l + ' ' + k;

                    if (defaultChar == -1) {
                        console.log("Picking " + name);
                        defaultChar = name;
                    }

                    serv.trackedCharacters[name] = serv.tracker[k][l];
                }

            if (!serv.selectedCharacter)
                if (defaultChar != -1)
                    serv.selectedCharacter = defaultChar;

            $rootScope.$digest();
        });

        socket.on('event', function (data) {
            console.log('data:event');
            console.log(data);
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

    }
});