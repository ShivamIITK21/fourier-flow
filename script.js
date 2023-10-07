import { Arrow } from "./arrow.js";
import { getMagnitude, getAngle } from "./utils.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clear = document.getElementById("clear")
const submit = document.getElementById("submit")

let isDrawing = false;
let points = [];
let hasDrawn = false;
let stopAnimating = false;

// document.getElementById('canvas').setAttribute("width", document.querySelector('#localVideo').offsetWidth);
// document.getElementById('canvas').setAttribute("height", document.querySelector('#localVideo').offsetHeigh);


canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawPoint);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

submit.addEventListener('click', async () => {
  let newPoints = points.map(point => pointCornertoCenter(point))
  console.log(newPoints)
  stopAnimating = false
  // let drawnPoints = []


  const URL = "http://localhost:8080/transform"

  let n = 200

  const body = {
    "points" : JSON.stringify(newPoints),
    "n" : n
  }
  console.log(body)
  console.log(JSON.stringify(body))

  const options = {
    method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
  }

  try {
    const response = await fetch(URL, options);
    const parsed = await response.json()

    const initial_conds = JSON.parse(parsed.initials)
    console.log(initial_conds)

    let start_point = {x:0, y:0}
    let arrows = []
    let blacklist = []
    initial_conds.forEach(cnum => {
      let mag = getMagnitude(cnum)
      console.log(mag)
      let ang = getAngle(cnum)
      let a = new Arrow(ctx, start_point, mag, ang)
      a.render()
      start_point = a.end_point
      arrows.push(a)
    });

    console.log(arrows)
    animate(arrows, n)

  } catch (error) {
    console.error(error);
  }

})

clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  points = []
  hasDrawn = false;
  stopAnimating = true
})

function startDrawing(e) {
  if (hasDrawn) return;
  isDrawing = true;
  stopAnimating = false
  let x = e.offsetX;
  let y = e.offsetY;
  console.log(x,y)
  points.push({x: x, y: y});
  drawPointOnce(x, y);
}

function drawPoint(e) {
  if (hasDrawn) return;
  if (!isDrawing) return;
  let x = e.offsetX;
  let y = e.offsetY;
  points.push({x: x, y: y});
  drawLine(points[points.length-2], points[points.length-1]);
  // let newpoints = getPoints(points[points.length-2], points[points.length-1])
  // console.log("These are the new ones", newpoints)
  // points = points.concat(newpoints)
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

//func to check if pt is inside, wrt corner
const isPointInside = (point) => {
  if((point.x > 0 && point.x < 800) && (point.y > 0 && point.y < 800)){
    return true;
  }
  return false;
}


const animate = (arrows, n) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let start_point = {x:0, y:0}
  let freq = -1*((n - n%2)/2)

  Array.from(arrows).forEach((arrow) => {
    arrow.rotate(2*Math.PI*freq)
    arrow.start_point = start_point
    arrow.render()
    start_point = arrow.end_point
    freq++
  })

  if (!stopAnimating) requestAnimationFrame(animate.bind(null, arrows, n))
}

