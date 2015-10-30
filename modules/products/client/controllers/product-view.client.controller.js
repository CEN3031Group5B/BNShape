'use strict';

// Product View controller
angular.module('products').controller('ProductViewController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products',
  function ($scope, $stateParams, $location, Authentication, Products) {
    $scope.authentication = Authentication;
  }
]);
