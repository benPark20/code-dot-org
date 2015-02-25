  'use strict';

  // Declare app level module which depends on filters, and services
  angular.module('projectsApp', [
    'ngRoute',
    'ngResource',
    'projectsApp.controllers',
    'projectsApp.services'
  ]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/',
                        {templateUrl: '/p/projects',
                         controller: 'ProjectsController'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);

  // SERVICES
  var services = angular.module('projectsApp.services', []).
      value('version', '0.1');

  // Section service. see sites.v3/code.org/routes/v2_section_routes.rb
  services.factory('projectsService', ['$resource',
    function($resource) {
      var Project = $resource('/v3/apps/:id', {}, {
        // default methods: see https://code.angularjs.org/1.2.21/docs/api/ngResource/service/$resource
        //  'get':    {method: 'GET'},
        //  'save':   {method: 'POST'},
        //  'query':  {method: 'GET', isArray:true},
        //  'remove': {method: 'DELETE'},
        //  'delete': {method: 'DELETE'} // don't use this because it doesn't work in IE9
      });

      Project.prototype.url = function() {
        if (this.levelUrl && this.levelSourceId && this.id) {
          return this.levelUrl + '?level_source_id=' + this.levelSourceId + '#' + this.id;
        } else {
          return null;
        }
      };

      return Project;
    }]);

  // CONTROLLERS

  var controllers = angular.module('projectsApp.controllers', []).
      value('version', '0.1');

  controllers.controller('ProjectsController', ['$scope', '$route', '$routeParams', '$location', '$window', 'projectsService',
      function($scope, $route, $routeParams, $location, $window, projectsService) {
    $scope.projectsLoaded = false;

    $scope.projects = projectsService.query();

    //default sort order
    $scope.order = 'updatedAt';
    $scope.reverse = true;

    $scope.projects.$promise.then(function(projects) {
      $scope.projectsLoaded = true;
    }).catch($scope.genericError);

    $scope.projectVisible = function(project) {
      return (!project.hidden);
    }

    $scope.genericError = function(result) {
      $window.alert("An unexpected error occurred, please try again. If this keeps happening, try reloading the page.");
    };
  }]);
