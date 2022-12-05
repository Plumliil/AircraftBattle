import {
  scene
} from '../global.js'
let instance;
export class Scene {
  constructor() {
    this.changeScene();
  }
  changeScene() {
    console.log(scene);
  }
  getInstance() {
    if (!instance) {
      instance = new Scene();
    }
    return instance;
  }
}