'use strict';

// Articles controller
angular.module('articles').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
  }
]);
