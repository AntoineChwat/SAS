angular.module('dataService', [])

    .service('Data', ['$http',function($http) {
        return {
            getFb : function() {
                return $http.get('/data/facebook');
            },

            getTt : function() {
                return $http.get('/data/twitter');
            },

            compare : function() {
                return $http.get('/compare');
            }
        }
    }]);
