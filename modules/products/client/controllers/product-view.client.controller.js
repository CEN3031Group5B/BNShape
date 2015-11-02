'use strict';

// Product View controller
angular.module('products').controller('ProductViewController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products',
  function ($scope, $stateParams, $location, Authentication, Products) {
    $scope.authentication = Authentication;
    $scope.this_product_id = $stateParams.productId;
    $scope.this_product = Products.get({ productId: $scope.this_product_id }, function() {
            console.log($scope.this_product);
        });
    $scope.admin = false;

    // Get average rating
    $scope.getRating = function() {
    	var sum = 0;
		for( var i = 0; i < $scope.this_product.reviews.length; i++ ){
		    sum += parseInt( $scope.this_product.reviews[i], 10 ); // Decimal base
		}

		return sum/$scope.this_product.reviews.length;
    };

    // Add a blank size choice
    $scope.addSize = function() {
    	$scope.this_product.sizes.push("New Size");
    };

    // Remove an existing size
    $scope.removeSize = function(_index) {
    	$scope.this_product.sizes.splice(_index, 1);//remove(_size);
    };

    Array.prototype.remove = function() {
	    var what, a = arguments, L = a.length, ax;
	    while (L && this.length) {
	        what = a[--L];
	        while ((ax = this.indexOf(what)) !== -1) {
	            this.splice(ax, 1);
	        }
	    }
	    return this;
	};

    // Save changes
    $scope.saveChanges = function() {
      $scope.this_product.$update( function (response) {
        console.log("Saved changes");
        console.log($scope.this_product.name);
        console.log(response);

      }, function (errorResponse) {
        console.log("Error when trying to save changes!");
        console.log($scope.this_product.name);
        console.log(errorResponse);
      });
    };
  }
]);
