'use strict';

var app = angular.module('maApp');

app.controller('DeveloperCtrl', ['$scope',
  function ($scope) {
    const ct = this;
  }
]);

app.controller('DevDashboardCtrl', ['$scope', '$http',
    function ($scope, $http) {
        const ct = this;

        $http.get('/containers/preconfList')
            .success(function(data){

                ct.images = data;

            })
            .error(function(data){
                
                ct.images = [ {repo: 'error', tag:'error'}];
            
            });
        
        ct.info = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
        
        ct.one = function(){
            
            return 'ttt';   
        }
        
        /*
        ct.containers = [
            
            {name: 'cont1', value: '10'},
            {name: 'cont2', value: '20'}
            
        ]*/
        
  }
]);
