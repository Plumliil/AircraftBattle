import {
  ResourceLoader
} from "./base/ResourceLoader";
import {
  Background
} from "./background/Background";
import {
  MessageBox
} from "./background/MessageBox";
import './libs/weapp-adapter'
import {
  Enemy
} from "./enemy/enemy";
import {
  Player
} from "./player/player";
import {
  Bullet
} from "./player/bullet";
import {
  Sound
} from "./sound/sound";
import {
  sceneMap
} from './global'

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

let isGameOver = false;
let animationID;
let enemyTimerID;
let bulletTimerID;
let score = 0; // 得分

let restarBtn = [];

const ctx = canvas.getContext('2d');



let background = [];
let enemys = [];
let player = null;
let bullets = [];
let timer = null;




export class Main {
  constructor() {
    console.log('分辨率:', window.innerWidth, window.innerHeight);
    let rl = ResourceLoader.getInstance();
    rl.load(() => this.init());
  }
  init() {
    // let background = new Background();
    // background.draw(ctx)
    background[0] = new Background();
    background[1] = new Background();
    background[1].y = -window.innerHeight;

    // 初始化敌机
    enemyTimerID = setInterval(() => {
      this.createEnemy()
    }, 1000)

    // 初始化子弹
    bulletTimerID = setInterval(() => {
      this.shoot()
    }, 500)

    // 初始化玩家
    player = new Player();

    new MessageBox()
    // 初始化bgm
    // Sound.getInstance().playBGMAudio();

    // 启动run产生帧动画
    this.run();
  }
  backgroundAutoRun() {
    for (let i = 0; i < background.length; i++) {
      background[i].addY(2);
      background[i].draw(ctx);
      if (background[i].y >= window.innerHeight) {
        background[i].y = -window.innerHeight + 2;
      }
    }
  }
  // 敌机生成,并且将敌机放入enemy方便统一管理
  createEnemy() {
    enemys.push(new Enemy());
  }
  // 敌军运动,超出屏幕销毁
  enemyMove() {
    // 飞出屏幕边界的索引
    let indexs = [];
    for (let i = 0; i < enemys.length; i++) {
      enemys[i].draw(ctx);
      enemys[i].addY(4);
      if (enemys[i].y > SCREEN_HEIGHT) {
        indexs.push(i);
      }
      // 敌机碰撞
      if (enemys[i].collisionDetection(player)) {
        // 如果敌机和玩家飞机发生碰撞,游戏结束
        console.log('GameOver');
        isGameOver = true;
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";

        console.log(ctx.measureText(s));

        // ctx2.fillRect(
        //   (SCREEN_WIDTH - ctx2.measureText(s).width) / 2,
        //   SCREEN_HEIGHT / 2 - ctx2.measureText(s).emHeightAscent,
        //   ctx2.measureText(s).actualBoundingBoxRight,
        //   ctx2.measureText(s).emHeightAscent);

      }
    }
    for (let i of indexs) {
      enemys[i].destory();
      enemys.splice(i, 1);
    }
  }
  // 设计
  shoot() {
    // Sound.getInstance().playBulletAudio();
    bullets.push(new Bullet(player.x + player.width / 2, player.y))
  }
  bulletMove() {
    // 飞出屏幕边界的索引
    let indexs = [];
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].draw(ctx);
      bullets[i].addY(-10);
      if (bullets[i].y < 0) {
        indexs.push(i);
      }
      for (let j = 0; j < enemys.length; j++) {
        if (bullets[i].collisionDetection(enemys[j])) {
          Sound.getInstance().playBoomAudio();
          score++;
          bullets[i].visible = false;
          bullets[i].isCollection = false;
          enemys[j].visible = false;
          enemys[j].isCollection = false;
        }
      }
    }
    for (let i of indexs) {
      bullets[i].destory();
      bullets.splice(i, 1);
    }
    console.log(score);
  }
  // 分数显示
  showScore() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 34);
  }
  gameOverHandler(e) {
    e.preventDefault(); // 阻止默认事件
    const fingerX = e.touches[0].clientX;
    const fingerY = e.touches[0].clientY;
    // let x = restarBtn[0];
    // let y = restarBtn[1];
    // let w = restarBtn[2];
    // let h = restarBtn[3];
    if (this.checkPoint(fingerX, fingerY)) {
      this.restart()
    }

  }
  重新开始游戏
  restart() {
    canvas.removeEventListener('touchstart', this.gameOverHandler);
    // isGameOver = false;
    // score = 0;
    // this.init();
    isGameOver = false;
    score = 0;
    enemys = [];
    bullets = [];
    this.init();
  }

  checkPoint(fx, fy) {
    let s = 'GAME OVER';
    // let t_x_l = (SCREEN_WIDTH - ctx.measureText(s).width) / 2;
    // let t_x_r = (SCREEN_WIDTH + ctx.measureText(s).width) / 2;
    // let t_y_t = SCREEN_HEIGHT / 2 - ctx.measureText(s).emHeightAscent;
    // let t_y_b = SCREEN_HEIGHT / 2 + ctx.measureText(s).emHeightAscent;
    let t_x_l = (SCREEN_WIDTH - ctx.measureText(s).width) / 2;
    let t_x_r = (SCREEN_WIDTH + ctx.measureText(s).width) / 2;
    let t_y_t = SCREEN_HEIGHT / 2 - ctx.measureText(s).emHeightAscent;
    let t_y_b = SCREEN_HEIGHT / 2 + ctx.measureText(s).emHeightAscent;
    if (fx < t_x_r && fx > t_x_l &&
      fy > t_y_t && fy < t_y_b) {
      return true;
    }
    return false;
  }


  run() {
    if (isGameOver) {
      cancelAnimationFrame(animationID);
      clearInterval(enemyTimerID);
      clearInterval(bulletTimerID);
      Sound.getInstance().bgmAudio.pause();
      restarBtn = new MessageBox().show(ctx);
      addEventListener('touchstart', (e) => this.gameOverHandler(e))
      return;
    }
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this.backgroundAutoRun();
    this.enemyMove();
    player.draw(ctx);
    this.bulletMove();
    this.showScore()
    // 玩家生成
    animationID = requestAnimationFrame(() => this.run())
  }
}

let s = '开始游戏';
let o = '游戏结束';
// export class Home {
//   constructor() {
//     console.log(SCREEN_WIDTH, SCREEN_HEIGHT);
//     this.ctx2 = canvas.getContext('2d');
//     this.draw();
//     this.addTouchListener()
//   }
//   checkPointInPolyline(point, polylinePoints) {
//     //射线法
//     let leftSide = 0;
//     const A = point;
//     for (let i = 0; i < polylinePoints.length; i++) {
//       let B, C;
//       if (i === polylinePoints.length - 1) {
//         B = {
//           x: polylinePoints[i][0],
//           y: polylinePoints[i][1]
//         };
//         C = {
//           x: polylinePoints[0][0],
//           y: polylinePoints[0][1]
//         };
//       } else {
//         B = {
//           x: polylinePoints[i][0],
//           y: polylinePoints[i][1]
//         };
//         C = {
//           x: polylinePoints[i + 1][0],
//           y: polylinePoints[i + 1][1]
//         };
//       }
//       //判断左侧相交
//       let sortByY = [B.y, C.y].sort((a, b) => a - b)
//       if (sortByY[0] < A.y && sortByY[1] > A.y) {
//         if (B.x < A.x || C.x < A.x) {
//           leftSide++
//         }
//       }
//     }

//     // 奇数点击 偶数未点击
//     return leftSide % 2 === 1
//   }
//   draw() {
//     this.ctx2.fillStyle = "black";
//     this.ctx2.font = "24px Arial";

//     console.log(this.ctx2.measureText(s));

//     // ctx2.fillRect(
//     //   (SCREEN_WIDTH - ctx2.measureText(s).width) / 2,
//     //   SCREEN_HEIGHT / 2 - ctx2.measureText(s).emHeightAscent,
//     //   ctx2.measureText(s).actualBoundingBoxRight,
//     //   ctx2.measureText(s).emHeightAscent);
//     this.ctx2.fillText(s, (SCREEN_WIDTH - this.ctx2.measureText(s).width) / 2, SCREEN_HEIGHT / 2);

//   }
//   addTouchListener() {
//     canvas.addEventListener("touchstart", (e) => {
//       e.preventDefault(); // 阻止默认事件
//       const fingerX = e.touches[0].clientX;
//       const fingerY = e.touches[0].clientY;
//       // console.log(fingerX, fingerY);
//       if (this.checkPoint(fingerX, fingerY)) {
//         console.log('点击成功');
//         // canvas.clear();
//         // canvas.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT)
//         // new Main()
//         sceneMap.delete('HOME');
//         sceneMap.set('GAME', new Main());
//       }
//     })
//   }
//   checkPoint(fx, fy) {
//     let t_x_l = (SCREEN_WIDTH - this.ctx2.measureText(s).width) / 2;
//     let t_x_r = (SCREEN_WIDTH + this.ctx2.measureText(s).width) / 2;
//     let t_y_t = SCREEN_HEIGHT / 2 - this.ctx2.measureText(s).emHeightAscent;
//     let t_y_b = SCREEN_HEIGHT / 2 + this.ctx2.measureText(s).emHeightAscent;
//     if (fx < t_x_r && fx > t_x_l &&
//       fy > t_y_t && fy < t_y_b) {
//       return true;
//     }
//     return false;
//   }
// }