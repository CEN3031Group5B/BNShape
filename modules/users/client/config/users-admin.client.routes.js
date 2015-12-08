'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
	  
	   .state('admin.notifications', {
        abstract: true,
        url: '/notifications',
		controller: 'ArticlesController',
        template: '<ui-view/>'
      })
      .state('notifications.list', {
        url: '/viewNotifications',
        templateUrl: 'modules/users/client/views/admin/list-notification.client.view.html'
      })
      .state('notifications.create', {
        url: '/create',
        templateUrl: 'modules/users/client/views/admin/create-notification.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('notifications.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/admin/view-notification.client.view.html'
      })
      .state('notifications.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/admin/edit-notification.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
	  
  }
]);
