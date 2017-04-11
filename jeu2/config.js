config = {
    img1:{
        source: 'images/01.jpg',
        coord:[{x:278 , y:155},	
               {x:805 , y:704},
               {x:658 , y:613},
               {x:778 , y:334},
              ]	
    },
    img2:{
        source: 'images/02.jpg',
        coord:[{x:298 , y:125},
               {x:338 , y:367},
              ]	
    }
}

var sonClickFalse = document.createElement("audio");
var sonClickTrue = document.createElement("audio");

sonClickFalse.src='sons/clickFalse.mp3';
sonClickTrue.src='sons/clickTrue.mp3';