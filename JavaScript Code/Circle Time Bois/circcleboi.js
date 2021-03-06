/* So this is a cool animation and all, but how does it work?
 * Quite simply!, but I'm going to explain the math in a confusing way so it is harder for you to understand. 
 *  
 * First, to avoid clutter and confusion, let theta = a, where theta is an input angle that's used to draw points.
 * We can draw circles using the coordinate set, (cos(a), sin(a)), to draw circles thanks to the relation trigonometry has with the unit circle. 
 * This draws them clockwise, but that looked lame so I drew them counter-clockwise using the inverse, (sin(a), cos(a)). 
 * The size of this circle can be increased by multiplying both coordinates by some number, s, which looks like this: (sin(a)*s, cos(a)*s).
 * Now for every point we do this for, we make another point using (sin(a*n), cos(a*n)), where n is some multiplier we increment every interval at which the program runs.
 * We then draw a line from the orignal point, (sin(a), cos(a)), to the new one, (sin(a*n), cos(a*n)).
 * This process is iterated over for the number of points selected, p.
 * The angle a is determined and incremented by Δa, where Δa = 360 / p, we do this to find out how much we need to space out every point to keep them even.
 * From this chaotic and relatively simple operation that is run every few milliseconds, complex shapes arises, such as cardioids and shuriken-like figures 
 *
 * TL;DR, we take one point, multiply it's "x" value, and draw a line from the orginal point to the new multiplied point. We then do this for hundreds of points, thousands of times per second. 
 */

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.width; 
var height = canvas.height;

var Point = 200; // The number of points to draw lines from, massivley increses complexity of animation
var strt = 1; // The value from which to start the animation with
var speed = 0.00002; // The amount used to increment the multiplier for the lines
var size = 335; // The size of the over circle generated   580
var csh = true; // If true: line color shifts between black & white, if false: line color stays white

var angSp = 360 / Point; // Gets the increment of the angles for the number of points used 
var angR; // Starting point for angles
var cntr; // Makes sure the lines don't go over other lines starting points
if (csh) {
  var lines = 0;  
} else {
  var lines = 255;
}
var cdir = true;
var phase1 = width/2; // Gets the center x position 
var phase2 = height/2; // Gets the center y position

ctx.lineWidth = 1; 
ctx.strokeStyle = "rgba("+lines+","+lines+","+lines+")"; // Starts Black
ctx.fillStyle = "rgba(0,0,0)"; // Starts black

var draw = setInterval(drawThing, 2); // Starts program

function drawThing() { // Used to draw the circle
  ctx.strokeStyle = "rgba("+lines+","+lines+","+lines+")"; // Shifts between black & white
  
  ctx.beginPath; // Starts drawing 
  ctx.fillRect(0, 0, width, height); // Resets the canvas for the next circle
  
  angR = 0; // Resets the angle start
  cntr = 0; // Used to prevent overdrawing lines
  while (angR <= 360 && cntr <= Point) { // Draws circle
    ctx.beginPath(); // Resets drawing path
    
    ctx.moveTo((Math.sin(angR) * size) + phase1, (Math.cos(angR) * size) + phase2); // Starts all point at (sin(0),cos(0)), where 0 is the input angle theta 
    ctx.lineTo((Math.sin(angR*strt) * size) + phase1, (Math.cos(angR*strt) * size) + phase2); // Draws lines from all starting points to points (sin(0*/0/),cos(0*/0/)), where 0 is the input angle theta and /0/ is the multiplier placed upon theta
    ctx.stroke(); // Draws line

    cntr++; // Increments counter
    angR += angSp; // Increments theta by delta theta 
  }
  
  if (csh) { // Enables/disables color shift
    if (lines >= 255) { 
      cidr = false; // Reverses color shift direction
    } else if (lines <= 0) {
      cidr = true; // Reverses color shift direction
    }
    if(cidr) {
      lines += 0.05; // Increments color shift positivly
    }else{
      lines -= 0.05; // Increments color shift negativly
    }
  }
   
  strt += speed; // Increments multiplier by the speed of the animation
}