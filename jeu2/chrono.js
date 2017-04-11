"use strict";
(function() {
   
   // width 135 height 152
   
   var width = 135
      ,height = 152;
   var canvas, ctx, bgimage, fgimage;   
   var running = null;

   window.startChrono = function(duration, oncomplete) {
      if (canvas == undefined) {
         return initCanvas(function() {
            document.body.appendChild(canvas);
            startChrono(duration, oncomplete);
         });
      }
      
      if (running)
         cancelAnimationFrame(running);

      var lastick, progress = 0;
      
      (function tick(ts){
         if (!lastick) lastick = ts;
         progress+= ts - lastick;
         lastick = ts;

         if (progress < duration) {
            draw(Math.min(progress / duration, 1));
            return running = requestAnimationFrame(tick);
         }

         draw(1);
         running = null;
         if (oncomplete) oncomplete();
         
      })(0);
   }
   
   function initCanvas(onready) {
      canvas = document.createElement('canvas');
      canvas.id = "chrono";
      canvas.width = 135;
      canvas.height = 152;
      ctx = canvas.getContext("2d");
      
      var toload = 2;
      function onload() {
         toload--;
         if (toload == 0 && onready)
            onready();
      }
      
      bgimage = new Image();      
      fgimage = new Image();
      bgimage.onload = onload;
      fgimage.onload = onload;
      bgimage.src = "pixs/chrono-background.svg";
      fgimage.src = "pixs/chrono-foreground.svg";
   }   
   
	function degToRad(deg){
		return deg/57.2958;
   }
   function draw(time) { 
      ctx.clearRect(0,0, 135,152);
      ctx.drawImage(bgimage, 0,0);
      ctx.save();
      ctx.beginPath();
      var cx = 56, cy = 84;
      ctx.translate(cx,cy);
      ctx.rotate(degToRad(-90));
      ctx.translate(-cx,-cy);
      ctx.moveTo(cx,cy);
      ctx.arc(cx,cy, 36, 0,degToRad((time*360)));
      ctx.lineTo(cx,cy);
      ctx.fillStyle = "#C73128";
      ctx.fill();
      ctx.restore();
      ctx.drawImage(fgimage, 0,0);
   }
   
	window.stopChrono=function(){
		if(running)
			cancelAnimationFrame(running);
		running=null;
		ctx.clearRect(0,0,width,height);
	}
	
})();