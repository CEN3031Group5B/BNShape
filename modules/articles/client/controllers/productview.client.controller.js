'use strict';

// Product View controller
angular.module('articles').controller('ProductViewController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
  }
]);