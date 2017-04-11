//sons
var engoulevent1 = document.createElement("audio");
engoulevent1.src = "sons/engoulevent1R.mp3";

/*var essaiCam = document.createElement("audio");
essaiCam.src = "sons/essaiCamRR.mp3";*/

var essaiCam = document.createElement("audio");
essaiCam.src = "sons/EssaiCam.mp3";

var moteur = document.createElement("audio");
moteur.src = "sons/moteurR.mp3";

var solex330 = document.createElement("audio");
solex330.src = "sons/solex330R.mp3";

var camera = document.createElement("audio");
camera.src = "sons/camera-shutter-click.mp3";

//papierPhotos
var picturePaper1 = document.getElementById('picturePaper1');
var picturePaper2 = document.getElementById('picturePaper2');
var picturePaper3 = document.getElementById('picturePaper3');
var picturePaper4 = document.getElementById('picturePaper4');

var picturePapers =
    [picturePaper1, picturePaper2, picturePaper3, picturePaper4];

//choix
var choice1 = document.getElementById('choice1');
var choice2 = document.getElementById('choice2');
var choice3 = document.getElementById('choice3');
var choice4 = document.getElementById('choice4');

var choices = [choice1, choice2, choice3, choice4];



 //selection
var isCorrect = false;

    function verif(evt) {
        for(var i in picturePapers) {
            n = picturePapers[i];
            n.classList.add('select0');
        }
        evt.target.parentElement.classList.remove('select0');
        evt.target.parentElement.classList.add('select');
        document.getElementById('btn_validate').classList.add('btn_validate');
        console.log('verif', evt.target.getAttribute('data-verif'));
        if (evt.target.getAttribute('data-verif')== "1" ) {
            isCorrect = true;
            console.log('correct', isCorrect);
        }else{
            isCorrect= false;
        }
//        reponsesLevel1.indexOf(evt.target);
        
        }

function select(){
        for(var i in choices) {
            n = choices[i];
            n.addEventListener('mousedown', verif);
        }
    }

//   validation
    function validaded() {
       
        btn_validate.addEventListener('mousedown', function(evt) {
             console.log('correctVal', isCorrect);
            var time = stopChrono();
           console.log("time", time);
           var score;
            if(isCorrect) {
                if(time <= 5000) {
                    time /=1000;
                    score = 6 - time;
                    console.log('validaded');
                    console.log("score",score);
                }else {
                   score = 0;
                console.log('score',score); 
                }  
            }else {
                score = 0;
                console.log('score',score);
            }
           gameComplete(Math.ceil(score));
        } );  
    }