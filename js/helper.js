;(function(){
  
  angular.module('App')
    .service('Helper', ['$http', '$document', '$q', function($http, $document, $q) {
      
      return {
        
        initGL: function(canvasId) {
          var gl,
            canvas = document.querySelector('#' + canvasId);
          
          try {
            gl = canvas.getContext('webgl');
          } catch(e) {}
          
          if (!gl) {
            throw new Error('Cannot obtain WebGL context');
          }
          
          // Set clear color to black, fully opaque
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          // Enable depth testing
          gl.enable(gl.DEPTH_TEST);
          // Near things obscure far things
          gl.depthFunc(gl.LEQUAL);
          // Clear the color as well as the depth buffer.
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
          return gl;
        },
        
        loadShaderCode: function(shaderNames) {
          console.debug('Loading shaders', shaderNames);
      
          var shadersCount = shaderNames.length,
              deferred = $q.defer(),
              shadersCode = {};
          
          function loadCallback(shaderName, response) {
            console.debug('Shader loaded', shaderName);
            shadersCode[shaderName] = response.data;
            if (--shadersCount === 0) {
              deferred.resolve(shadersCode);
            }
          }
          
          function errorHandler(shaderName, reason) {
            console.error('Error while loading a shader', shaderName, ', ', reason);
            deferred.reject(reason);
          }
          
          for (var i = 0; i < shaderNames.length; i++) {
            var shaderName = shaderNames[i];
            $http.get('shaders/' + shaderName + '.txt')
                 .then(
                   loadCallback.bind(null, shaderName),
                   errorHandler.bind(null, shaderName));
          }
          
          return deferred.promise;

        },
        
        glShader: function(gl, source, type) {
          var shader = gl.createShader(type);
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          
          // See if it compiled successfully
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
            gl.deleteShader(shader);
            throw new Error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
          }
          return shader;
        },
        
        getShaderFromDom: function(gl, id) {
          var el = $document.querySelector('#' + id),
            source = '',
            node,
            shader;
            
          if (!el) {
            throw new Error('Shader' + id + 'not found');
          }
          
          node = el.firstChild;
          while (node) {
            if (node.nodeType === node.TEXT_NODE) {
              source += node.textContent;
            }
            node = node.nextSibling;
          }
          
          switch(el.type) {
            case 'x-shader/x-vertex': 
              shader = gl.createShader(gl.VERTEX_SHADER);
              break;
            case 'x-shader/x-fragment':
              shader = gl.createShader(gl.FRAGMENT_SHADER);
              break;
            default:
              throw new Error('Unknown shader type ' + el.type);
          }
          
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          
          // See if it compiled successfully
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
            gl.deleteShader(shader);
            throw new Error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
          }
          return shader;
        },
        
      };
    }]);
  
})();
