function startGame() {
    
    console.log('START');
    
    //variables
    var btn_validate = document.getElementById('btn_validate');
    
    //song timeline
    setTimeout(function() { moteur.play(); }, 2000);
    
    moteur.addEventListener("ended", function() {
        camera.play();
        document.getElementById('flash').classList.add('flash');
        document.getElementById('picturePaper1').classList.add('picturePaper');
        document.getElementById("choice1").classList.remove('choice');
        document.getElementById('choice1').classList.add('choiceAppear');
        setTimeout(function() { solex330.play();
                                document.getElementById("flash").classList.remove('flash'); 
                              }, 2000);  
    });
      
    solex330.addEventListener("ended", function() {
        camera.play();
        document.getElementById('flash').classList.add('flash');
        document.getElementById('picturePaper2').classList.add('picturePaper');
        document.getElementById("choice2").classList.remove('choice');
        document.getElementById('choice2').classList.add('choiceAppear');
        setTimeout(function() { engoulevent1.play();
                                document.getElementById("flash").classList.remove('flash');
                              }, 2000);  
    });
    
    engoulevent1.addEventListener("ended", function() {
        camera.play();
        document.getElementById('flash').classList.add('flash');
        document.getElementById('picturePaper3').classList.add('picturePaper');
        document.getElementById("choice3").classList.remove('choice');
        document.getElementById('choice3').classList.add('choiceAppear');
        setTimeout(function() { essaiCam.play();
                                document.getElementById("flash").classList.remove('flash');
                              }, 1000);  
    });
    
    essaiCam.addEventListener("ended", function() {
        camera.play();
        document.getElementById('flash').classList.add('flash');
        document.getElementById('picturePaper4').classList.add('picturePaper');
        document.getElementById("choice4").classList.remove('choice');
        document.getElementById('choice4').classList.add('choiceAppear');
        setTimeout(function() { 
            select();
            validaded();
            startChrono(5000, function(){
                console.log("chrono");    
            });    
        }, 5000);
        setTimeout(function() {
            document.getElementById("flash").classList.remove('flash');
            document.getElementById('flash').classList.add('animEnd'); 
        },3000);
    });
             
}