var centi=0; var seconde=0;	var minute=0;
	
function chrono(){
	centi++;
	if (centi>9){centi=0;seconde++}
	if (seconde>59){seconde=0;minute++} 
		document.chronometre.deciSec.value=" "+centi; 
		document.chronometre.sec.value=" "+seconde; 
	if(minute!=0){
		document.chronometre.min.value=" "+minute; 
	}else{}
	if(seconde>9){
		document.chronometre.sec.className='chron_10';
		document.chronometre.deciSec.className='chron_10';
	}
	compte=setTimeout('chrono()',100);
}

function RaZ(){
	clearTimeout(compte);
	centi=0; seconde=0; minute=0;
	document.chronometre.deciSec.value=" "+centi;
	document.chronometre.sec.value=" "+seconde;
	document.chronometre.min.value=" "+minute;
}

function getPixelRatio(canvas){
	var ctx = canvas.getContext("2d");
	var dpr = window.devicePixelRatio || 1 
		,bsr = ctx.webkitBackingStorePixelRadio || 
		ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio ||
		ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
	return dpr/bsr;
}
	
function makeHDPICanvas(canvas){
	var ratio = getPixelRatio(canvas)
		,bounds = canvas.getBoundingClientRect();
	
		
	if(ratio>1){
		canvas.width = bounds.width*ratio;
		canvas.height = bounds.height*ratio;
		canvas.getContext("2d").setTransform(ratio,0,0,ratio,0,0);
	}else{
		canvas.width = bounds.width;
		canvas.height = bounds.height;
	}
}





