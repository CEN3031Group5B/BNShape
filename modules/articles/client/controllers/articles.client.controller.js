'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope','$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.cart_items = [];
    $scope.success_add = false;
    $scope.cart_popup = "cart_popup.html";

    $scope.add_cart = function(article_id){
        // var prevCookie = $cookieStore.get('cart');
        // var updatedCookie = article_id;
        // console.log($scope.cart_items.length);
        // if($scope.cart_items.length !== 0){
        //   $cookieStore.remove('cart');
        //   updatedCookie = prevCookie + "&" + article_id;
        // }
        // $cookieStore.put('cart',updatedCookie);
        // $scope.cart_items.push(article_id);
        // $scope.success_add = true;
        // setTimeout(function(){
        //   $scope.success_add = false;
        //   $scope.$apply();
        // },5000);
        // //ToDo: success message
    };

    $scope.quick_delete_cart = function(index_to_delete){
        // $scope.cart_items.splice(index_to_delete,1);
        // $cookieStore.remove('cart');
        // if($scope.cart_items.length!==0){
        //   $cookieStore.put('cart', $scope.cart_items.join("&"));
        // }
    };

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
      // var current_items = $cookieStore.get('cart');
      // if(current_items !== undefined){
      //   $scope.cart_items = current_items.split('&');
      // }
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);
