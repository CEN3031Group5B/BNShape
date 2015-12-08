'use strict';

// Setting up route
angular.module('orders').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('orders', {
        abstract: true,
        url: '/checkout/review',
        template: '<ui-view/>'
      })
      .state('orders.review', {
        url: '',
        templateUrl: 'modules/orders/client/views/review-order.client.view.html'
      });
  }
]);
