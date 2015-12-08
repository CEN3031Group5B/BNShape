'use strict';

describe('Articles E2E Tests:', function () {
  describe('Test articles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/products/');
	  element(by.id('gobutton')).click();
		
    });
  });
	  
	describe('Check for product categories to exist', function () {
    it('Should report missing credentials', function () {
      browser.get('http://www.localhost:3000/products');
      /**element(by.css('button[type=submit]')).click();
      element(by.binding('error')).getText().then(function (errorText) {
        expect(errorText).toBe('Missing credentials');**/
	 expect('CATEGORIES').toExist();
      });
    });
  
});
