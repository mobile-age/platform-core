'use strict';

var app = angular.module('maApp');

app.controller('DeveloperCtrl', ['$scope',
  function ($scope) {
    const ct = this;
  }
]);

app.controller('DevDashboardCtrl', ['$scope', '$http', 'FileUploader', 'Notification',
    function ($scope, $http, FileUploader, Notification) {
        const ct = this;

        ct.container = false;

        ct.filesUploader = new FileUploader({
          queueLimit: 10,
        });

        $http.get('/containers/preconfList')
            .success(function(data){

                ct.images = data;

            })
            .error(function(data){

                ct.images = [ {repo: 'error', tag:'error'}];

            });
        
        $http.get('/applications/my_apps')
            .success(function(data){

                ct.applications = data;

            })
            .error(function(data){

                ct.applications = [ {name: 'error'} ];

            });
        
        
        ct.addApplication = function () { 
            
            $http.get('/applications/add/' + ct.appName)
                .success(function(data){
                    
                    Notification.success('Application ' + ct.appName + ' created successfully.');
                
                    $http.get('/applications/my_apps')
                        .success(function(data){

                            ct.applications = data;

                        })
                        .error(function(data){

                            ct.applications = [ {name: 'error'} ];

                        });

                })
                .error(function(data){

                    Notification.success('Error in creating ' + ct.appName + ' application.');

                });

        };

        ct.currentAppIdx = -1;
        ct.setCurrentApp = function(idx) {
          ct.currentAppIdx = idx;
        };

        ct.info = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

        ct.deployContainer = function() {

            alert($("#sel1 option:selected").val());
            //ct.container = true;
        };

        ct.one = function() {

            return 'ttt';
        };

        /*
        ct.containers = [

            {name: 'cont1', value: '10'},
            {name: 'cont2', value: '20'}

        ]*/

  }
]);
