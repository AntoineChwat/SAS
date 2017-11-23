angular.module('userService', [])

    .factory('User', ['$http',function($http) {
        return {
            get : function() {
                return $http.get('/api/user');
            }
        }
    }]);
