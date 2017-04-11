"use strict";
(function() {
   
   var width = 135, height = 152;
   var canvas, ctx, bgimage, fgimage, ofsx;   
   var running = null;
   var progress = 0;

   function degToRad(angle) {
      return angle/57.2958;
   }
   
   window.startChrono = function(duration, oncomplete) {
      if (canvas == undefined) {
         return initCanvas(function() {
            document.body.appendChild(canvas);
            startChrono(duration, oncomplete);
         });
      }
      
      if (running)
         cancelAnimationFrame(running);

      canvas.classList.remove("hidden");
      
      var w = progress = 0;
      var lastick;
      
      (function tick(ts){
         if (!lastick) lastick = ts;
         progress+= ts - lastick;
         lastick = ts;

         if (progress < duration) {
            ctx.save();
            ctx.translate(Math.sin(w), 0);
            if (progress/duration > .6)
               w+= progress/duration;
            draw(Math.min(progress / duration, 1));
            ctx.restore();
            return running = requestAnimationFrame(tick);
         }

         draw(1);
         running = null;
         if (oncomplete) oncomplete();
         
      })(0);
   }
   
   window.stopChrono = function() {
      if (running)
         cancelAnimationFrame(running);
      running = null;
      ctx.clearRect(0,0, width,height);
      canvas.classList.add("hidden");
      return progress;
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
   
   function draw(time) { 
      ctx.clearRect(0,0, width,height); 
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
      ctx.fillStyle = "rgb(" + Math.ceil((187*time)) + ",27,25)";
      ctx.fill();
      ctx.restore();
      ctx.drawImage(fgimage, 0,0);
   }
   
})();