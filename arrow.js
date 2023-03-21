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
        console.log(transformed_start)
        console.log(transformed_end)
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(transformed_start.x, transformed_start.y)
        this.ctx.lineTo(transformed_end.x, transformed_end.y)
        this.ctx.stroke()
    }   
}