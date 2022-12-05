let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

export class MessageBox {
  constructor() {}
  show(ctx) {
    let s = 'GAME OVER';
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    console.log(ctx.measureText(s));
    // ctx2.fillRect(
    //   (SCREEN_WIDTH - ctx2.measureText(s).width) / 2,
    //   SCREEN_HEIGHT / 2 - ctx2.measureText(s).emHeightAscent,
    //   ctx2.measureText(s).actualBoundingBoxRight,
    //   ctx2.measureText(s).emHeightAscent);
    ctx.fillText(s, (SCREEN_WIDTH - ctx.measureText(s).width) / 2, SCREEN_HEIGHT / 2);
    return [(SCREEN_WIDTH - ctx.measureText(s).width) / 2,
      SCREEN_HEIGHT / 2,
      ctx.measureText(s).actualBoundingBoxRight,
      ctx.measureText(s).emHeightAscent
    ]
  }
}