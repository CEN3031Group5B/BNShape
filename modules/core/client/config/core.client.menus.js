'use strict';

angular.module('core').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Team',
      state: 'products.list',
      type: '',
      roles: ['*']
    });

	Menus.addMenuItem('topbar', {
      title: 'About Us',
      state: 'products.list',
      type: '',
      roles: ['*']
    });

  }
]);
