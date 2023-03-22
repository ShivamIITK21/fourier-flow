import { pointCentertoCorner } from "./utils.js"

export class Arrow{
    constructor(ctx, start_point, length, angle){
        this.ctx = ctx
        this.start_point = start_point
        this.length = length
        this.angle = angle

        let x_end = start_point.x + length*Math.cos(angle)
        let y_end = start_point.y + length*Math.sin(angle)

        this.end_point = {x:x_end, y:y_end}

    }

    render(){
        let transformed_start = pointCentertoCorner(this.start_point)
        let transformed_end = pointCentertoCorner(this.end_point)
        let ang = Math.atan2(transformed_end.y - transformed_start.y, transformed_end.x - transformed_start.x);
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 2;

        let headlength = this.length/4
        if(headlength > 10){
            headlength = 10
        }

        this.ctx.beginPath()
        this.ctx.moveTo(transformed_start.x, transformed_start.y)
        this.ctx.lineTo(transformed_end.x, transformed_end.y)
        // this.ctx.moveTo(transformed_end.x, transformed_end.y)
        this.ctx.lineTo(transformed_end.x - headlength * Math.cos(ang - Math.PI / 6), transformed_end.y - headlength * Math.sin(ang - Math.PI / 6))
        this.ctx.moveTo(transformed_end.x, transformed_end.y)
        this.ctx.lineTo(transformed_end.x - headlength * Math.cos(ang + Math.PI / 6), transformed_end.y - headlength * Math.sin(ang + Math.PI / 6))
        this.ctx.stroke()
    }

    //to rotate the arrow in one frame of the animation, assuming 60 fps
    rotate(w){
        this.angle += (w/240)

        //update the end point
        let x_end = this.start_point.x + this.length*Math.cos(this.angle)
        let y_end = this.start_point.y + this.length*Math.sin(this.angle)

        this.end_point = {x:x_end, y:y_end}
    }
}