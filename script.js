const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clear = document.getElementById("clear")
const submit = document.getElementById("submit")

let isDrawing = false;
let points = [];
let hasDrawn = false;

// document.getElementById('canvas').setAttribute("width", document.querySelector('#localVideo').offsetWidth);
// document.getElementById('canvas').setAttribute("height", document.querySelector('#localVideo').offsetHeigh);


canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawPoint);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

submit.addEventListener('click', () => {
  let newPoints = points.map(point => pointCornertoCenter(point))
  console.log(newPoints)
})

clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  points = []
})

function startDrawing(e) {
  if (hasDrawn) return;
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
  if (hasDrawn) return;
  if (!isDrawing) return;
  let x = e.offsetX;
  let y = e.offsetY;
  points.push({x: x, y: y});
  drawLine(points[points.length-2], points[points.length-1]);
  // drawPointOnce(x,y);
  console.log(points)
}

function stopDrawing(e) {
  if (hasDrawn) return;
  isDrawing = false;
  ctx.lineTo(points[0].x, points[0].y)
  ctx.stroke()
  if(isPointInside({x:e.offsetX, y:e.offsetY})){
    let newpoints = getPoints(points[points.length - 1], points[0])
    console.log(newpoints)
    points = points.concat(newpoints)
    console.log(points)
  }
  hasDrawn = true;
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


//function to get points on a line
const getPoints = (p1, p2) => {
  let newpoints = []
  let slope = (p1.y-p2.y)/(p1.x-p2.x)
  for(let i = p1.x; i !== p2.x;){
    let y = Math.round(p1.y + (i-p1.x)*slope) 
    newpoints.push({x:i, y:y})

    if(i < p2.x){
      i++;
    }
    else{
      i--;
    }
  }
  return newpoints
}

const pointCornertoCenter = (point) => {
  return {x:point.x-400, y:400-point.y}
}

const pointCentertoCorner = (point) => {
  return {x:point.x+400, y:point.y-400}
}

//func to check if pt is inside, wrt corner
const isPointInside = (point) => {
  if((point.x > 0 && point.x < 800) && (point.y > 0 && point.y < 800)){
    return true;
  }
  return false;
}
