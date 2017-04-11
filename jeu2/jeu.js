
function startGame(){
console.log('START');
	
var a = 1;
var image = new Image();
var lunette = new Image();
var busardClick = new Array();
var niv=1;
var mRep=0;
var bRep=0;
var nbreBusard = config['img'+niv].coord.length
var tempsEcoule=false;
var score;
var tabCercle = new Array();
lunette.src='images/lunette@2x.png'
image.className='image';
	
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

context.rect(0,0,canvas.width,canvas.height);

makeHDPICanvas(canvas);

afficheImg(niv);

//affichage de l'image fct du niveau
function afficheImg(niv){
	tempsEcoule=false;
	nbreBusard = config['img'+niv].coord.length
	busardClick=[];
	tabCercle=[];
	
	context.clearRect(0,0,canvas.width,canvas.height);
	setTimeout(affichageText,500);
	image.src=config["img"+niv].source;
	setTimeout(function(){
     var txtel = document.getElementById("txthowmany");
     txtel.textContent = "";
     txtel.style.display = "none";
		startChrono(30000,finDuTemps);
		draw(150,150);
		startListener();
		console.log("draw");
	},4000)
}
	
//correspondance click/busard
function clickCanvas(evt){
	var x = evt.layerX;
	var y = evt.layerY;
	var valide=false;

	for(var i=0; i<nbreBusard; i++){//parcourt config/coords
		var coords=config['img'+niv].coord[i];
		if(testPosition(x,y,coords.x,coords.y)){//Click sur 1 busard
			valide=true;
			if(busardClick.length<1 || busardClick.indexOf(coords)<0){
				sonClickTrue.play();
				traceDuClick("green",coords);
                busardClick.push(coords);
			}
		}
	}
	if(valide){
	}else{
		sonClickFalse.play();
        traceDuClick("red",evt);
		mRep++;
	}
	draw(x,y);
	changementImage();
}

//Changement d'image si tous les busards sont cliqués || temps écoulé
function changementImage(){
	if(busardClick.length==config['img'+niv].coord.length || tempsEcoule){ 
		bRep=bRep+busardClick.length;
		image.src=config["img"+niv].source;
		removeListener();
        stopChrono();
		a=0;
        setResquestAnimationFrame();
		
		setTimeout(function(){
			if(niv<2){
				niv++;
				afficheImg(niv);
			}else{
				endGame();
			}
		},4000)
	}
}

//test click sur busard r=50px
function testPosition(x,y,testX,testY){ 
	test=false;
	if(x<(testX+40)&& 
	   x>(testX-40)&& 
	   y<(testY+40)&& 
	   y>(testY-40)){
		test=true;
	}
	return test;
}

//affichage de la cible 
function draw(x,y){	
	context.beginPath();
	context.clearRect(0,0,canvas.width,canvas.height);
	context.arc(x,y,88,0,2*Math.PI);
	var radial=context.createRadialGradient(x,y,300,x,y,0);	
	radial.addColorStop(1,"#3F570D");
	radial.addColorStop(0,"#6C8F21");
	context.fillStyle=radial;
	context.fillRect(0,0,canvas.width,canvas.height);
	context.save();
	context.clip();
	context.drawImage(image,-x,-y,2048,1536);
	afficherCercle(x,y);
	context.drawImage(lunette,x-100,y-99.5,200,200);
	
	context.restore();
}

//fct mousemove
function drawWhenMousemove(evt){ 
	var x = evt.clientX;
	var y = evt.clientY;
	draw(x,y);
}

//animation agrandissement de l'image
function setResquestAnimationFrame(evt){  
	render(a,evt);
	a+=10;
	if(a<700){
		requestAnimationFrame(setResquestAnimationFrame);
	}
}		

function render(a,evt){
	context.beginPath();
	context.arc(512,384,a,0,2*Math.PI);
    context.fillRect(0,0,canvas.width,canvas.height);
	context.save();
	context.clip();
    context.drawImage(image,0,0,1024,768);
	afficherCercle(0,0);
	context.restore();
}	

//text "nombre de busard à trouver"
function affichageText(){  
	context.save();
    context.fillStyle = "#E4FF87";
	context.font='40pt CooperBlackStd';
	var textSize = context.measureText("Trouver 4 busard");
	var posX = 512 - (textSize.width/2);
   var txtel = document.getElementById("txthowmany");
	if(niv==1){
     txtel.textContent = "Trouve les 4 busards";
		//context.fillText("Trouver 4 Busards",posX,384);
	}else{
     txtel.textContent = "Trouve les 2 busards";
		//context.fillText("Trouver 2 Busards",posX,384);
	}
   txtel.style.display = "block";
	context.restore();
}

//remplissage de tabCercle
function traceDuClick(couleur, coords){
	coords.couleur=couleur;
	tabCercle.push(coords);
}

//affichage des cercles
function afficherCercle(x,y){
	
	for(var i=0; i<tabCercle.length; i++){
	    var positionXcercle = tabCercle[i].x;
		var positionYcercle = tabCercle[i].y;
		var couleur=tabCercle[i].couleur;
		
		context.save();
		context.beginPath();
		context.strokeStyle=couleur;
		context.lineWidth="8";
		
		if(x==0 && y==0){
			context.arc(positionXcercle-x,positionYcercle-y, 72, 0, 2 * Math.PI);
		}else{
			context.arc(positionXcercle*2-x,positionYcercle*2-y, 72, 0, 2 * Math.PI);
		}
  		context.stroke();
		context.restore();
		
	}
}	

//placer les ecouteurs
function startListener(){
	canvas.addEventListener('mouseup',clickCanvas);	document.addEventListener("mousemove",drawWhenMousemove);
}
	
//Remove les ecouteurs
function removeListener(){
	canvas.removeEventListener('mouseup',clickCanvas);
	document.removeEventListener("mousemove",drawWhenMousemove);
}

//temps ecoule = true
function finDuTemps(){
	tempsEcoule=true;
	changementImage();
}	

//fin du jeu et score
function endGame(){
	stopChrono();
	score=((bRep-(mRep/2))*5)/6;
	if(score<0){
		score=0;
	}
//	document.write("END! Résultat =>"+score+"/5");
	gameComplete(Math.floor(score));
}
}