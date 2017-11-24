angular.module('Ctrl', [])

	// inject the Sin service factory into our controller
	.controller('appController', function($scope,$http, User, Data) {

        User.get()
            .then(function(data) {
                $scope.user = data.data;
                $scope.loading = false;
            });

        $scope.dataGet = function(){
            $scope.loading = true;
            $scope.done = false;
            Data.getFb().then(function(data){
                Data.getTt();
                $scope.loading = false;
                $scope.done = true;

            })
        }

        $scope.compare = function(){
            $scope.loading = true
            Data.compare().then(function(data) {
                $scope.output = data.data;
            });
            $scope.loading = false
        }

        $scope.setSocial = function (social) {
			$scope.social = social;
            console.log(social);
		};





});
