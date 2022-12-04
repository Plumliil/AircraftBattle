import {
  ResourceLoader
} from "../base/ResourceLoader";
import {
  Sprite
} from "../base/Sprite";


const WIDTH = 50;
const HEIGHT = 50;
export class Enemy extends Sprite {
  constructor() {
    let img = ResourceLoader.getInstance().getImage("enemy");
    let randX = Math.floor(Math.random() * window.innerWidth + WIDTH);
    // let randY = Math.floor(Math.random() * window.innerHeight - HEIGHT);
    let y = -HEIGHT + 20;
    super(img, randX, y, WIDTH, HEIGHT, true)
  }
}