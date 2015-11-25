;(function() {
  angular.module('App')
    .service('GlApp', ['$http', 'Helper', function($http, Helper){
      
      var shaderSourceCode, me = this;
      
      function initBuffer(gl, bufferData) {
        var  buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
        return buffer;
      }
      
      function initShaderProgram(gl) {
        var vShader = Helper.glShader(gl, shaderSourceCode['shader_1.vert'], gl.VERTEX_SHADER);
        var fShader = Helper.glShader(gl, shaderSourceCode['shader_1.frag'], gl.FRAGMENT_SHADER);
        
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vShader);
        gl.attachShader(shaderProgram, fShader);
        gl.linkProgram(shaderProgram);
        
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          throw new Error("Unable to initialize the shader program.");
        }
        
        gl.useProgram(shaderProgram);
        
        shaderProgram.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        shaderProgram.aVertexColor    = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.aVertexPosition);
        gl.enableVertexAttribArray(shaderProgram.aVertexColor);
    
        return shaderProgram;
      }
      
      //===============
      function draw() {
        var vertices = [
            -0.25, 0.25, 0,
            -0.25, -0.25, 0,
            0.25, 0.25, 0,
            0.25, -0.25, 0,
          ];
        var vertexColor = [
          1.0,  0.0,  0.0,  1.0,  // red
          0.0,  1.0,  0.0,  1.0,  // green
          0.0,  0.0,  1.0,  1.0,  // blue
          1.0,  1.0,  0.0,  1.0   // red
        ];
          
        var gl = Helper.initGL('mainCanvas');
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
    
        var sp = initShaderProgram(gl);
        
        var vBuf = initBuffer(gl, vertices);
        gl.vertexAttribPointer(sp.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(sp.aVertexPosition);
    
        var cBuf = initBuffer(gl, vertexColor);
        gl.vertexAttribPointer(sp.aVertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(sp.aVertexColor);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      
      // GlApp interface
      this.run = function() {
        draw();
      };
        
      this.init = function() {
        Helper.loadShaderCode(['shader_1.vert', 'shader_1.frag']).then(
          function(result) {
            shaderSourceCode = result;
            // FIXME
            me.run();
          }
        );
      };
      
    }]);
})();

