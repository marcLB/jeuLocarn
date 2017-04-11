var niveauEncours = 0;
var x = 0;
var y = 0;
var bRep = 0;
var mRep = 0;
var image = new Image();
var imgZone2 = new Array;
var imgDep = new Array;
var score = 0;
var tempsEcoule = false;
var imgZone1 = new Array;
var scoreTotal=0;
//var imageEncoursDepl=evt.target;
var zone2X=620;
var zone2Y=126;

function startGame() {

    startLevel(niveauEncours);

    function startLevel(niveauEncours) {

        startChrono(30000, FinDuTemps);

        x = 0;
        y = 0;

        var dataNiveau = config.niveaux[niveauEncours];

        for (var i = 0; i < dataNiveau.images.length; i++) {

            var dataImage = dataNiveau.images[i];

            if (x == 2) {

                x = 0;
                y += 1;

            }

            buildImage(dataImage, x, y);

            x++;

        }

        console.log(dataImage);

        function buildImage(dataImage, x, y) {

            image = new Image();
            image.config = dataImage.right;
            image.classList.add('image');
            image.src = dataImage.url;
            image.addEventListener('mousedown', listen);

            document.body.appendChild(image);


            var posX = (image.width + 40) * x + 100;
            var posY = (image.height + 40) * y + 140;
            image.positionX=posX;
            image.positionY=posY;

            
            
            image.style.left = image.positionX + 'px';
            image.style.top = image.positionY + 'px';
        }



        var btnValidate = document.getElementById("button");
        btnValidate.addEventListener('mousedown', pressButton);

    }

    function pressButton() {

        var imgTab = document.getElementsByClassName('image')

        for (var i = 0; i < 6; i++) {


            document.body.removeChild(imgTab[5 - i]);

        }


        changementNiveau();

    }




    function comptageScore() {

        for (var i = 0; i < imgZone2.length; i++) {

            imgDep = imgZone2[i];

            if (imgDep.config) {

                
                bRep++;
                
            } else {
                
                mRep++;
               
            }

            score = Math.ceil((bRep - mRep)) * 5 / 14;          
            scoreTotal=Math.ceil(score);

        }

        if (scoreTotal < 0) {

            scoreTotal = 0;

        }

    }

    function changementNiveau() {

        stopChrono();

        comptageScore();
        imgZone2 = [];
        imgDep = [];

        if (niveauEncours < 2) {

            niveauEncours++;
            startLevel(niveauEncours);

        } else {

            endGame();

        }




    }

    function transition(image) {
            
            
            var posX=image.positionX;
            var posY=image.positionY;
      
            console.log(posX,posY);
            
            image.classList.add('imageMove');
            image.style.left = posX + "px";
            image.style.top = posY + "px";
            
        


    }

    function endGame() {

//        document.write(scoreTotal);

        stopChrono();
        gameComplete(scoreTotal);


    }

    function FinDuTemps() {

        tempsEcoule = true;
        
        pressButton();


    }

    function dragObject(target, startx, starty) {
        target.classList.remove('imageMove');
        target.classList.add('image');
       target.style.zIndex = null;
       target.classList.add('draged');
        document.addEventListener("mousemove", deplaceObjet);
        
        document.addEventListener("mouseup", stopDeplacer);

        var bounds = target.getBoundingClientRect();

        
        var offset = {
            x: startx - bounds.left,
            y: starty - bounds.top
        };

        var visibleArea = {
            width: document.body.clientWidth,
            height: document.body.clientHeight

        };


        function deplaceObjet(evt) {

            
            
            var bounds = target.getBoundingClientRect();
      
            

            var posX = evt.pageX - offset.x;

            posX = Math.min(Math.max(posX, 0), visibleArea.width - target.clientWidth);
            target.style.left = posX + 'px';


            var posY = evt.pageY - offset.y;

            posY = Math.min(Math.max(posY, 0), visibleArea.height - target.clientHeight);
            target.style.top = posY + 'px';


            //target.style.boxShadow = '10px 10px 5px rgba(0,0,0,0.9)'

        }

        function stopDeplacer(evt)

        {
            document.removeEventListener('mousemove', deplaceObjet);
            document.removeEventListener('mouseup', stopDeplacer);

           // target.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.9)';
           //delete target.style.boxShadow = 'auto';
target.classList.remove('draged');
            var imgX = evt.clientX;
            var imgY = evt.clientY;
            
            x = 0;
            y = 0;
            if (testPosition(imgX, imgY)) {
                console.log(testPosition(imgX,imgY));
                var testZone = evt.target;


                if (imgZone2.indexOf(testZone) < 0) {

                    imgZone2.push(testZone);

                }


                for (var i = 0; i < imgZone2.length; i++) {


                    var imgDep = imgZone2[i];
                    
                    var posX = (imgDep.width + 30) * x + 620;
                    var posY = (imgDep.height/1.2) * y + 180;
//                    console.log(posX,posY);
                    
                    imgDep.style.left = posX + 'px';
                    imgDep.style.top = posY + 'px';

                    imgDep.style.zIndex=i;
                    if (x == 1) {

                        x = 0;
                        y += 1;

                    } else {

                        x++;
                    }



                }

            } else {

             
               transition(target);
               imageEncoursDepl=null;
                
            }
        }




    }


    function listen(evt) {

        evt.preventDefault();
        dragObject(evt.target, evt.pageX, evt.pageY);
    }


    function testPosition(imgX, imgY) {
       
        test = false;

        if (imgX > 600 && imgY > 126 && imgX <1000 && imgY < 800) {


            test = true;

        }

        return test;

    }
}