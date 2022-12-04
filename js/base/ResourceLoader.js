const IMAGE_PATH = "images/";
const IMAGES = [
  ["background", `${IMAGE_PATH}bg.jpg`],
  ["enemy", `${IMAGE_PATH}enemy.png`],
  ["player", `${IMAGE_PATH}hero.png`],
  ["bullet", `${IMAGE_PATH}bullet.png`],
];

let instance;

/**
 * 资源加载器
 */

export class ResourceLoader {
  constructor() {
    this.imageMap = new Map(IMAGES);
    for (let [key, value] of this.imageMap) {
      let img = new Image();
      img.src = value;
      this.imageMap.set(key, img)
    }
    console.log(this.imageMap);
  }
  load(callback) {
    let loadCount = 0;
    for (let img of this.imageMap.values()) {
      img.onload = () => {
        loadCount++;
        if (loadCount == this.imageMap.size) {
          callback()
        }
      }
    }
  }

  getImage(key) {
    return this.imageMap.get(key);
  }

  /**
   * 单例模式获得资源加载器对象
   */
  static getInstance() {
    if (!instance) {
      instance = new ResourceLoader();
    }
    return instance;
  }
}