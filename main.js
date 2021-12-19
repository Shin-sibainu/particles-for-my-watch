import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.15/+esm";

//UIデバッグ
const gui = new GUI();

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

/**
 * テクスチャ設定
 */

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/textures/particles/1.png");

/**
 * パーティクルを作ってみよう
 */
//geometry
const particlesGeometry = new THREE.BufferGeometry(); //最初はsphereGeometryで確認する。
const count = 7000;

const position = new Float32Array(count * 3); //型配列。メモリ効率がよくなる。汎用型Arrayだと効率が悪いらしい。
console.log(position);
const color = new Float32Array(count * 3);

//[0,0,0, 1,1,1 , 2,2,2, ....]3つの成分はそれぞれ頂点座標や法線、色の情報が入っている？
for (let i = 0; i < count * 3; i++) {
  position[i] = (Math.random() - 0.5) * 10; //全ての配列に0~1までランダムに数字(頂点)を入れる。
  color[i] = Math.random();
}
console.log(position);

console.log(particlesGeometry);
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(position, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(color, 3));

//material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.15,
  sizeAttenuation: true, //falseにするとどの位置でも同じ大きさで表示される
  // color: "#ff88cc",
  transparent: true,
  alphaMap: particlesTexture,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

//point
const particles = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(particles);

//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", onWindowResize);

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}

animate();
