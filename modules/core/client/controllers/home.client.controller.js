'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

angular.module('core').controller('CarouselCtrl', function ($scope) {
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  var slides = $scope.slides = [
    {
      image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR002e7oOC-HCyjkqUN-PHIWK8sK95Lvg-0JV3Arnn1hXHL8zp9VQ'
    },
    {
      image: 'https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s320x320/e15/11236283_1601588623452939_22635068_n.jpg'
    },
    {
      image: 'http://bnshapeclothing.com/image/cache/data/website_DSC_0024-800x1021.jpg'
    },
    {
      image: 'http://bnshapeclothing.com/image/cache/data/website_DSC_0895-800x1021.jpg'
    }];

  // $scope.addSlide = function() {
  //   var newWidth = 1000 + slides.length + 1;
  //   slides.push({
  //     image: '//placekitten.com/' + newWidth + '/500'
  //   });
  // };

  // for (var i=0; i<4; i++) {
  //   $scope.addSlide();
  // }
});
