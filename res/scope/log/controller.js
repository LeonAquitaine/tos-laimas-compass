app
    .controller('logController', function ($scope, dataService, $state) {

        $scope.data = dataService;

        $scope.doRoute = function (destinationID) {
            $state.go('route', {from: ($scope.data.event ? $scope.data.event.Map : "1001"), to: destinationID});
        };
        
        $scope.intPerc = function(a,b){
            return parseInt((a / b) * 100);
        }

        $scope.showAll = true;
    });
