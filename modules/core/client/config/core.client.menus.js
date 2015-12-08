'use strict';

angular.module('core').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Team',
      state: 'team',
      type: '',
      roles: ['*']
    });

	Menus.addMenuItem('topbar', {
      title: 'About Us',
      state: 'about',
      type: '',
      roles: ['*']
    });

  }
]);
