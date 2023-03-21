const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clear = document.getElementById("clear")

let isDrawing = false;
let points = [];

// document.getElementById('canvas').setAttribute("width", document.querySelector('#localVideo').offsetWidth);
// document.getElementById('canvas').setAttribute("height", document.querySelector('#localVideo').offsetHeigh);


canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawPoint);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);


clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  points = []
})

function startDrawing(e) {
  console.log("yep")
  isDrawing = true;
  let x = e.offsetX;
  let y = e.offsetY;
  console.log(x,y)
  points.push({x: x, y: y});
  drawPointOnce(x, y);
}

function drawPoint(e) {
  console.log("drawing...")
  if (!isDrawing) return;
  let x = e.offsetX;
  let y = e.offsetY;
  console.log(x,y)
  console.log(canvas.offsetLeft)
  console.log(canvas.offsetTop)
  points.push({x: x, y: y});
  drawLine(points[points.length-2], points[points.length-1]);
  // drawPointOnce(x,y);
  console.log(points)
}

function stopDrawing(e) {
  isDrawing = false;
  ctx.lineTo(points[0].x, points[0].y)
  ctx.stroke()
}

function drawPointOnce(x, y) {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(p1, p2) {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

// drawLine({x:0,y:0},{x:400, y:400})