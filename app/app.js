'use strict';

// Declare app level module which depends on views, and components
angular.module('connectIn', [
    'ngRoute',
    'connectIn.version',
    'connectIn.home',
    'connectIn.login'
])
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        user: 'user',
        guest: 'guest'
    })

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

    .config(['$routeProvider', 'USER_ROLES', function ($routeProvider, USER_ROLES) {
        $routeProvider
            .when('/login', {
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl',
                access: { authorizedRoles: [USER_ROLES.all] }
            })
            .when('/home',{
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl',
                access: { authorizedRoles: [USER_ROLES.user, USER_ROLES.admin] }
            })
            .otherwise({
                redirectTo: '/login',
                access: { authorizedRoles: [USER_ROLES.all] }
            });
    }])

    .run(function ($rootScope, AUTH_EVENTS, AuthService, $location) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            var authorizedRoles = next.access.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        });

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function(event, data){
            $location.path('/home');
        });
    })

    .service('Session', function () {
        this.create = function (sessionId, userId, userRole) {
            this.id = sessionId;
            this.userId = userId;
            this.userRole = userRole;
        };
        this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.userRole = null;
        };
        return this;
    })

    .factory('AuthService', function ($http, Session) {
        var authService = {};

        authService.login = function (credentials) {
            return $http
                .post('http://localhost:1337/signin', credentials)
                .then(function (res) {
                    Session.create(res.data.id, res.data.email,
                        res.data.rol);
                    return res.data.user;
                }, function(res){
                    console.log("Login error: " + res.data.error);
                });
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        };

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
        };

        return authService;
    })