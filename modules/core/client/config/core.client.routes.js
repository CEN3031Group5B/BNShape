'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('cart', {
        url: '/cart',
        templateUrl: 'modules/products/client/views/view-cart.client.view.html'
    })
    .state('about', {
        url: '/about',
        templateUrl: 'modules/core/client/views/pages/about.client.view.html'
    })
    .state('privacy-policy', {
        url: '/privacy-policy',
        templateUrl: 'modules/core/client/views/pages/policy.client.view.html'
    })
    .state('terms-conditions', {
        url: '/terms-conditions',
        templateUrl: 'modules/core/client/views/pages/terms.client.view.html'
    })
    .state('contact', {
        url: '/contact',
        templateUrl: 'modules/core/client/views/pages/contact.client.view.html'
    })
    .state('returns', {
        url: '/returns',
        templateUrl: 'modules/core/client/views/pages/returns.client.view.html'
    })
    .state('team', {
        url: '/team',
        templateUrl: 'modules/core/client/views/pages/team.client.view.html'
    })
    .state('voucher', {
        url: '/voucher',
        templateUrl: 'modules/core/client/views/pages/voucher.client.view.html'
    });
  }
]);
