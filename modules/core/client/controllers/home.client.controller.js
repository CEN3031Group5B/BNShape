'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

// Controls the images of the carousel displays
angular.module('core').controller('CarouselCtrl', function ($scope) {
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  var slides = $scope.slides = [
    {
      image: 'https://scontent-mia1-1.xx.fbcdn.net/hphotos-xlp1/v/t1.0-9/11220461_973102212753036_5098071536240473268_n.jpg?oh=48f5deb1e654f27fca0d041b739547f2&oe=56F0F6B6'
    },
    {
      image: 'https://scontent-mia1-1.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/12243248_976845205712070_8234193161510904182_n.jpg?oh=308cd8ae189b7f96d483cd4b9ecadea5&oe=56B88437'
    },
    {
      image: 'https://scontent-mia1-1.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/12019985_969015559828368_6298243536650081959_n.jpg?oh=1f6ed7a2396076c58abc664d70e954d0&oe=56AE3BF7'
    },
    {
      image: 'https://scontent-mia1-1.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/12243400_980460845350506_2500918501691579590_n.jpg?oh=bb3dd7101955073a3e58b7a0ba27f2cf&oe=56F04EA7'
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
