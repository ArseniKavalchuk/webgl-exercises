;(function() {
  angular
    .module('App',[])
    .controller('Main', ['$document', '$scope', '$http', 'GlApp', function($document, $scope, $http, GlApp) {
      
      console.debug('Loading application...');
      GlApp.init();
      
    }]);
})();