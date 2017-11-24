angular.module('Ctrl', [])

	// inject the Sin service factory into our controller
	.controller('appController', function($scope,$http, User, Data) {

        User.get()
            .then(function(data) {
                $scope.user = data.data;
                $scope.loading = false;
            });

        $scope.dataGet = function(){

        }

        $scope.compare = function(){
			$scope.loading = true;
			$scope.done = false;
			Data.getFb().then(function(data){
				Data.getTt().then (function(data){
		            Data.compare().then(function(data) {
						$scope.done = true;
						$scope.loading = false;
		                $scope.output = data.data;
		            });
		            $scope.loading = false;
				});
			});
        }

        $scope.setSocial = function (social) {
			$scope.social = social;
            console.log(social);
		};





});
