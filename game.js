import './js/libs/weapp-adapter'
import './js/libs/symbol'
import {
  Home,
  Main
} from './js/main';
// import {
//   scene
// } from './js/global'
// import {
//   Scene
// } from './js/base/Scene';

// game
// home
// more


// let scene = "HOME";
// let sceneMap = new Map();
// sceneMap.set('HOME', new Home());
// // sceneMap.set('GAME', new Main());

// console.log(sceneMap);

// function listen() {
//   if (scene === "HOME") {
//     // new Home();
//     sceneMap.delete('GAME');
//     sceneMap.set('HOME', new Home());
//     console.log(111);
//   } else if (scene === "GAME") {

//     sceneMap.delete('HOME');
//     sceneMap.set('GAME', new Main());
//     // new Main();
//   }
// }
new Main();
// setTimeout(() => {
//   // scene = 'GAME';
//   // listen()
//   sceneMap.delete('HOME');
//   console.log(sceneMap);
  
//   console.log(111);
//   console.log(scene);
// }, 1000)
// // new Scene();
// // new Main();