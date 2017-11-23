angular.module('Ctrl', [])

	// inject the Sin service factory into our controller
	.controller('appController', function($scope,$http, User, Data) {

        User.get()
            .then(function(data) {
                $scope.user = data.data;
                $scope.loading = false;
            });

        $scope.dataGet = function(){
            $scope.done = false;
            Data.getFb().then(function(data){
                Data.getTt();
                $scope.done = true;

            })
        }

        $scope.compare = function(){
            Data.compare().then(function(data) {
                $scope.output = data.data;
            });
        }

        $scope.setSocial = function (social) {
			$scope.social = social;
            console.log(social);
		};





});
