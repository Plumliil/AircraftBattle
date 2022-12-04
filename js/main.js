import {
  ResourceLoader
} from "./base/ResourceLoader";
import {
  Background
} from "./background/Background";
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
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

let isGameOver = false;
let animationID;
let enemyTimerID;
let bulletTimerID;
let score = 0; // 得分


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

  run() {
    if (isGameOver) {
      cancelAnimationFrame(animationID);
      clearInterval(enemyTimerID);
      clearInterval(bulletTimerID);
      Sound.getInstance().bgmAudio.pause();
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