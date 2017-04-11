function startGame(){

    var niveauEncours = 0;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
      
   makeHDPICanvas(canvas);
   
    var canvasWIDTH = 1024;
    var canvasHEIGTH = 768;

    var dataNiveau = config.niveaux[niveauEncours];

    var image = null,
        reponse1 = null,
        reponse2 = null,
        titre = null,
        cadre = null,
        anneauPetit = null,
        anneauGrand = null;

    var start = new Point(100,400);
    var end = null;

    var zoneChoix1 = new Point(480,330);
    var zoneChoix2 = new Point(480,430);
    var zoneAnneauGrand = null;

    var choix1 = null;
    var choix2 = null;

    var rayon = 20;

    var score = 0;
    var scoreTotal = 0;

    var maxlengthLine = 400;

    var midPoint = new Point(start.x,0);

    var force = 0;

    var running = false;

    var rotation = 1000;

    var soundDrop = new Audio('sons/ClickSong.mp3');

    //prechargement des images + reinitialisation des coordonnées

    function loadImage(src, callback)
    {   

        var image = new Image();
        image.addEventListener('load', function(){
            callback(image);
        });
        image.src = src;
        return image;
    }





    var nbreImage = 3;

    function onloadALL(){
        nbreImage--;
        if(nbreImage==0){

            startLevel();
            startChrono(config.niveaux.length*3000,endGame);
        }
    }


    //Préchargement des images

    function preLoadPics(){
        cadre = loadImage('images/cadre.svg',onloadALL);
        anneauPetit = loadImage('images/anneau_petit.svg', onloadALL);
        anneauGrand = loadImage('images/anneau_grand.svg',onloadALL);
    }
   
    preLoadPics();


    function initializeRotate(){
        rotation = 500;
    }

    function initializePointCorde(){
        end = new Point(190,400);
    }

    function redrawSlowCorde(){
        initializePointCorde();
        if(running == true)
        {
            requestAnimationFrame(redrawSlowCorde);
        }
    }


    function redraw(){
        drawLevel();
        if(running == true)
        {
            requestAnimationFrame(redraw);
        }
    }


    //Démarrage interface

    function startLevel()
    {
        if(niveauEncours==config.niveaux.length)
        {
            running = false;
            return endGame();
        }
       
        var dataNiveau = config.niveaux[niveauEncours];
        choix1 = dataNiveau.choixReponse[0];
        choix2 = dataNiveau.choixReponse[1];
         
       document.getElementById("choix1").textContent = choix1.titre;
       document.getElementById("choix2").textContent = choix2.titre;
       
        initializeRotate();
        initializePointCorde();

        image = loadImage(dataNiveau.image,function(){
            drawLevel();
            if(running == false){
                running = true;
                redraw();
            }
        });
    }

    function drawRings(){
        ctx.drawImage(anneauPetit,
                      start.x - anneauPetit.width/2, 
                      start.y - anneauPetit.height/2);
        ctx.drawImage(anneauGrand,
                      end.x - anneauGrand.width/2,
                      end.y - anneauGrand.height/2);
    }


    function drawCorde(){
        var dist = end.distance(start);
        var diff = maxlengthLine - dist;
        var midPointDist = (start.x+dist/2) - midPoint.x +force;

        midPoint.x += midPointDist*0.2;
        force = force*0.5;

        midPoint.y = start.y+diff;

        drawRings();

        ctx.save();
        ctx.lineWidth = 13;
        ctx.lineCap = "round";
        ctx.shadowBlur = 30;
        ctx.shadowColor = "rgba(0,0,0,.5)";

        ctx.beginPath();
        ctx.moveTo(start.x,start.y);
        ctx.quadraticCurveTo(midPoint.x,midPoint.y,end.x,end.y);
        ctx.strokeStyle="#FFF6C0";
        ctx.stroke();
        ctx.restore();
    }


    function buildLevel(){
        drawCorde();
        //drawLevel();
    }


    function insertChoice1(){
        ctx.font = ("32px CooperBlackStd");
        ctx.fillStyle = "#FFF6C0";

        //ctx.beginPath();
        ctx.fillText(choix1.titre,zoneChoix1.x+50,zoneChoix1.y+10);
    }


    function insertChoice2(){
        ctx.font = ("32px CooperBlackStd");
        ctx.fillStyle = "#FFF6C0";

        //ctx.beginPath();
        ctx.fillText(choix2.titre,zoneChoix2.x+50,zoneChoix2.y+10);
    }


    function rotatePics(){

        ctx.translate(135,230);
        ctx.rotate(degToRad(rotation));
        ctx.translate(-135,-230);
        ctx.drawImage(image,55,150,160,160);
        ctx.drawImage(cadre,55,150,170,170);
        rotation*=0.95;
    }


    function degToRad(deg){
        return deg/57.2958;
    }

    function clear(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    function drawLevel(){
        clear();
       
//        insertChoice1();
//        insertChoice2();

        drawCircle(zoneChoix1,rayon);
        drawCircle(zoneChoix2,rayon);
        drawCorde();

        ctx.save();     
        rotatePics();
        ctx.restore();
    }


    function Point(x,y){
        this.x = x;
        this.y = y;
    }


    
   
    
    function mouseMoveListener(e){
        //MAJ coordonnées endPoint suivant coord souris 
        force = (e.layerX - end.x)*10;

        end.x = e.layerX;
        end.y = e.layerY;
        
    }

    canvas.addEventListener('mousedown',function(e){

        canvas.addEventListener('mousemove', mouseMoveListener);
        canvas.addEventListener('mouseup', function mouseUp(e){

            if(dropChoix(zoneChoix1)){

                end.x = zoneChoix1.x;
                end.y = zoneChoix1.y;
                soundDrop.play();
                
                niveauEncours ++;
                
                
                
                if(choix1.bonne === true)
                {
                    score ++;
                }else{
                    console.log("mauvaise réponse");
                }

                console.log("score :",score);
                setTimeout(startLevel,500);


            }else if(dropChoix(zoneChoix2)){
                end.x = zoneChoix2.x;
                end.y = zoneChoix2.y;
                soundDrop.play();
                niveauEncours ++;


                if(choix2.bonne === true)
                {
                    score ++;
                }else{
                    console.log("mauvaise réponse");
                }
                console.log("score :",score);
                setTimeout(startLevel,500);

            }else{
                
                setTimeout(initializePointCorde,100);
                //drawLevel();
            }

            canvas.removeEventListener('mouseup', mouseUp);
            canvas.removeEventListener('mousemove', mouseMoveListener);
        })
    });


    function dropChoix(zonechoix){
        return end.x > zonechoix.x - rayon 
            && end.x < zonechoix.x + rayon 

            && end.y > zonechoix.y - rayon 
            && end.y < zonechoix.y + rayon;
        //console.log(dropChoix);
    }



    function getPixelRatio(canvas)
    {
        var ctx = canvas.getContext("2d");
        var dpr = window.devicePixelRatio || 1
        ,bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
        return dpr/bsr;
    }




    function makeHDPICanvas(canvas)
    {
        var ratio = getPixelRatio(canvas) 
        ,bounds = canvas.getBoundingClientRect();
        canvas.width = bounds.width*ratio;
        canvas.height = bounds.height*ratio;
        canvas.getContext("2d").setTransform(ratio,0,0,ratio,0,0);
    }    



    Point.prototype.distance = function(destPoint)
    {
        var dx = Math.pow(destPoint.x - this.x, 2);
        var dy = Math.pow(destPoint.y - this.y, 2);
        return Math.sqrt(dx + dy);
    }



    function drawCircle(position,rayon)
    {   
        ctx.fillStyle = "#566F00";
        ctx.lineWidth="2";

        ctx.beginPath();

        ctx.arc(position.x,position.y,rayon,0,2*Math.PI);
        ctx.fill();
    }



    function endGame(){

        scoreTotal = Math.ceil(score/4);
       stopChrono();
//        alert("le jeu est fini !!!\n" + "Votre score est de : " + scoreTotal);

        running = false;
        gameComplete(scoreTotal);
        console.log("score total",scoreTotal);
    }

}



