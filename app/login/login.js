'use strict';

angular.module('connectIn.login', ['ngRoute'])

    .controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, USER_ROLES, AuthService) {
        $scope.credentials = {
            username: '',
            password: ''
        };

        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        $scope.login = function (credentials) {
            AuthService.login(credentials).then(
               function (user) {
                    // LOGIN SUCCEEDED
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);
            }, function () {
                    // LOGIN FAILED
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        };
    })

    .controller('SignupCtrl', function($scope, $http){
        $scope.credentials = {
            username: '',
            password: ''
        };

        $scope.signup = function(credentials){
            $http.post('http://localhost:1337/signup', credentials)
        }
    })



