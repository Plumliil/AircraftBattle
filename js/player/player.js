import {
  ResourceLoader
} from "../base/ResourceLoader";
import {
  Sprite
} from "../base/Sprite";
import '../libs/weapp-adapter'

const WIDTH = 60;
const HEIGHT = 60;
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

export class Player extends Sprite {
  constructor() {
    let img = ResourceLoader.getInstance().getImage("player");
    let x = (SCREEN_WIDTH - WIDTH) / 2;
    let y = SCREEN_HEIGHT - 150;
    super(img, x, y, WIDTH, HEIGHT, true);
    this.touched = false;
    this.addTouchListener();
  }
  // 添加手指触摸响应
  addTouchListener() {
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault(); // 阻止默认事件
      const fingerX = e.touches[0].clientX;
      const fingerY = e.touches[0].clientY;
      if (this.checkFingerOnPlane(fingerX, fingerY)) {
        this.touched = true;
        this.setPlaneToFingerPos(fingerX, fingerY)
      }
    })
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault(); // 阻止默认事件
      const fingerX = e.touches[0].clientX;
      const fingerY = e.touches[0].clientY;
      if (this.touched) {
        this.setPlaneToFingerPos(fingerX, fingerY)
      }
    })
    canvas.addEventListener("touchend", (e) => {
      e.preventDefault(); // 阻止默认事件
      this.touched = false;
    })
  }
  // 判断手指是否停留在玩家飞机上
  checkFingerOnPlane(fx, fy) {
    let judgeX = fx >= this.x && fx <= this.x + this.width;
    let judgeY = fy >= this.y && fy <= this.y + this.height;
    if (judgeX && judgeY) {
      return true;
    } else {
      return false;
    }
  }

  // 飞机正中心设置为手指坐标
  setPlaneToFingerPos(fx, fy) {
    let dx = fx - this.width / 2;
    let dy = fy - this.height / 2;
    // 超出屏幕判断,始终在屏幕内
    if (dx < 0) {
      dx = 0
    } else if (dx >= SCREEN_WIDTH - WIDTH) {
      dx = SCREEN_WIDTH - WIDTH;
    }
    if (dy < 0) {
      dy = 0
    } else if (dy > SCREEN_HEIGHT - HEIGHT) {
      dy = SCREEN_HEIGHT - HEIGHT;
    }
    this.x = dx;
    this.y = dy;
  }
}