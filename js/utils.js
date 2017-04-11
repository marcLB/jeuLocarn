"use strict";

function getPixelRatio(canvas) {
   var ctx = canvas.getContext("2d");
   var dpr = window.devicePixelRatio || 1
      ,bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
   return dpr/bsr;
}
   
function makeHDPICanvas(canvas) {
   var ratio = getPixelRatio(canvas)
      ,bounds = canvas.getBoundingClientRect();
   if(ratio > 1) {
      canvas.width = bounds.width*ratio;
      canvas.height = bounds.height*ratio;
   }
   else {
      canvas.width = bounds.width;
      canvas.height = bounds.height;
   }
   canvas.getContext("2d").setTransform(ratio,0,0,ratio,0,0);
   return canvas;
}

function degToRad(angle) {
   return angle/57.2958;
}

window.l = console.info.bind(console);

function noop() {}
//noop = () => void

function toarray(a, s, e) {
   return Array.prototype.slice.call(a, s, e);
}

function reduce(f, a, acc) {
   for(var i = 0, n = a.length; i < n; i++)
      acc = f(a[i], acc);
   return acc;
}
//reduce = (f, a, acc) => {
//   for(let i = 0, n = a.length; i < n; i++)
//      acc = f(a[i], acc);
//   return acc;
//}

function map(f, a) {
   return a.map(f);
}
// map = (f, a) => a.map(f)

function each(f, a) {
   return a.forEach(f);
}

function filter(f, a) {
   return a.filter(f);
}

function partial(fn) {
   var args = toarray(arguments, 1);
   return function() {
      return fn.apply(null, args.concat(toarray(arguments)));
   }
}
//partial = (fn, ...val) => (...arg) => fn(...val, ...arg);

function compose() {
   var args = toarray(arguments).reverse();
   return reduce(function(nf, acc) {
      return function() {
         return nf(acc.apply(null, toarray(arguments)));
      }
   }, args.slice(1), args.shift());
}
//compose = (...fn) =>
//   reduce((nf, acc) => (...arg) => nf(acc(...arg)), fn.reverse().slice(1), fn.shift());

function flip(f) {
   return function() {
      return f.apply(null, toarray(arguments, 0, f.length).reverse());
   }
}
//flip = (f) => (...arg) => f(...arg.reverse());   

function arity(f, n) {
   return function() {
      return f.apply(null, toarray(arguments, 0, n));
   }
}
//arity = (f, n) => (...rest) => f(...rest.slice(0, n));

function tap(f) {
   return function(v) {
      f(v);
      return v;
   }
}
//tap = (f) => (v) => { f(v); return v; }

function getp(p, o) {
   return p[o];
}
//getp = (p, o) => o[p];

function ntimes(n, complete) {
   return function() {
      if (--n == 0) complete();
   }
}
//ntimes = (n, complete) => () => { if (--n == 0) complete() };

function cue() {
   return function s() {
      var arg = toarray(arguments);
      if (s._fs)
         map(function(f) { f.apply(null, arg) }, s._fs);
   }
}

cue.bind = function (f, c) {
   c._fs ? c._fs.push(f) : c._fs = [f];
}

cue.map = function (f, c) {
   var nc = cue();
   //cue.bind((...arg) => nc(f(...arg)), c);
   cue.bind(function() { return nc(f.apply(null, toarray(arguments))); }, c);
   return nc;
}

cue.filter = function (f, c) {
   var nc = cue();
   cue.bind(function() {
      var arg = toarray(arguments);
      if (f.apply(null, arg)) nc.apply(null, arg);
   }, c);
   return nc;
}

cue.from = function (evts, el) {
   var nc = cue();
   each(function(evt) { el.addEventListener(evt, nc); }, evts);
   return nc;
}

cue.sync = function (cs) {
   var nc = cue(),
       ec = [], vs = [], n = cs.length;
   each(function(c) {
      cue.bind(function(v) {
         var i = cs.indexOf(c);
         ec[i] = c; vs[i] = v;
         if (ec.length == n) {
            nc.apply(null, vs);
            ec = []; vs = [];
         }
      }, c);
   }, cs);
   return nc;
}

cue.merge = function (cs) {
   var nc = cue();
   each(partial(cue.bind, nc), cs);
   return nc;
}