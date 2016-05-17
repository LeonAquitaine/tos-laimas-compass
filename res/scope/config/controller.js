app
    .controller('configController', function ($scope, dataService) {
        $scope.data = dataService;


        if (typeof window !== 'undefined' && window.process && window.process.type === "renderer") {
            $scope.canShowDialog = true;
        };

        $scope.pickDirectory = function () {

            console.log('here');
            dialog.showOpenDialog({
                title: 'Select the game folder (TreeOfSavior)',
                defaultPath: $scope.data.settings.gameFolder,
                properties: ['openDirectory']
            }, function (folders) {

                if (folders === undefined) return;
                var folder = folders[0];
                appConfig.setGameFolder(folder);
            });
        };

    });
