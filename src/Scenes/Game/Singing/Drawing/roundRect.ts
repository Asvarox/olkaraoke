export default function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean,
    stroke: boolean,
) {
    const actualWidth = Math.max(width, height);
    const actualRadius = Math.min(actualWidth / 2, height / 2, radius);

    ctx.beginPath();
    ctx.moveTo(x + actualRadius, y);
    ctx.lineTo(x + actualWidth - actualRadius, y);
    ctx.quadraticCurveTo(x + actualWidth, y, x + actualWidth, y + actualRadius);
    ctx.lineTo(x + actualWidth, y + height - actualRadius);
    ctx.quadraticCurveTo(x + actualWidth, y + height, x + actualWidth - actualRadius, y + height);
    ctx.lineTo(x + actualRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - actualRadius);
    ctx.lineTo(x, y + actualRadius);
    ctx.quadraticCurveTo(x, y, x + actualRadius, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}