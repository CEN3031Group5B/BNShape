'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/notifications',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/notifications/client/views/list-articles.client.view.html'
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/notifications/client/views/create-article.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/notifications/client/views/view-article.client.view.html'
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/notifications/client/views/edit-article.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
