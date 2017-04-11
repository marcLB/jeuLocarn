(function(){
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    height  = 100,
    width  = 100,
    count = 1024,
    update_speed = 1000 / 60,
    speed = .15, // 1 is insane fast. .05 is descent. 
    pass = 1,
    segments = [];
context.globalAlpha = .5; // idk, looks kinda cool.
function Segment(x, y, l, a, c) {
    this.x = x;
    this.y = y;
    this.l = 1;
    this.ml = l; // max length
    this.a = a; // angle
    this.sa = a; // start angle
    this.c = c; // colour
}
Segment.prototype = {
    constructor: Segment,
    render: function (context) {
        var endX = this.x + Math.cos(this.a * (Math.PI / 180)) * this.l,
            endY = this.y + Math.sin(this.a * (Math.PI / 180)) * this.l;
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.quadraticCurveTo(this.x, this.y + (endY - this.y) / 1.5, endX, endY);
        context.strokeStyle = this.c;
        context.stroke();
        context.closePath();
    }
}

//init();

window.startInit = function init() {
    for (var i = 0; i < count; i++) {
        var x = width / 2 + Math.random()*100 - 50,
            y = height - (Math.random()*50),
            len = Math.random() * 15 + 55,
            ang = Math.random() * 30 - 15 + 90,
            c = i%2?'#567E3A':'#526F35';
        segments.push(new Segment(x, y, len, -ang, c));
    }
    update();
    render();
}

function render() {
    context.clearRect(0, 0, width, height);
    for (var i = 0; i < count; i++) {
        segments[i].render(context);
    }
    requestAnimationFrame(render);
}

function update() {
    pass += speed;
    for (var i = 0; i < count; i++) {
        segments[i].a = segments[i].sa + Math.sin(pass)*10;
        segments[i].l += segments[i].l < segments[i].ml ? speed*5 : 0;
    }
    setTimeout(update, update_speed);
    }
})();
