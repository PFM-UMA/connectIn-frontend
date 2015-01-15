'use strict';

// Declare app level module which depends on views, and components
angular.module('connectIn', [
    'ngRoute',
    'connectIn.version',
    'connectIn.home',
    'connectIn.login'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/login'});
    }])

    .controller('ConnectInController', function ($scope,
                                                   USER_ROLES,
                                                   AuthService) {
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };
    })
