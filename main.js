import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Datepicker } from "vanillajs-datepicker";

// Setup
const elem = document.querySelector('input[name="foo"]');
const datepicker = new Datepicker(elem, {
  // ...options
});
console.log("### datepicker ", datepicker.getDate());

document
  .querySelector('input[name="foo"]')
  .addEventListener("change", function () {
    console.log(this.value);
  });

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(-10, 5, 0);

renderer.render(scene, camera);

// Lights

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(-15, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

scene.add(directionalLight, ambientLight);

// Helpers

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);

const gridHelper = new THREE.GridHelper(200, 20);
const axesHelper = new THREE.AxesHelper(10);
scene.add(directionalLightHelper, gridHelper, axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);

// Moon
const MOON_RADIUS = 1.7374; // megameter
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const moonNormalTexture = new THREE.TextureLoader().load("normal.jpg");
const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  normalMap: moonNormalTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
// scene.add(moon);
moon.translateX(-10);

// Earth
const EARTH_RADIUS = 6.371; // megameter
const AXIAL_TILT = 23.439281; // degree
const SECONDS_IN_SOLAR_DAY = 86400;
const SOLAR_DAYS_IN_YEAR = 365.256363004;
const earthTexture = new THREE.TextureLoader().load("earth.png");
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add(earth);

const date = new Date("1970-01-01T00:00:00.000+00:00");

const secondsFromZeroHour =
  date.getUTCHours() * 3600 +
  date.getUTCMinutes() * 60 +
  date.getUTCSeconds() +
  date.getUTCMilliseconds() / 1000;
const dayGauge = secondsFromZeroHour / SECONDS_IN_SOLAR_DAY;
console.log(dayGauge);
const someDegree = 0.98561;
let earthDegreeY = (360 + someDegree) * dayGauge;
earthDegreeY -= earthDegreeY >= 360 ? 360 : 0;
console.log(earthDegreeY);

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.set(0, 0, 0);
  earth.rotateZ(THREE.MathUtils.degToRad(AXIAL_TILT));
  earth.rotateY(THREE.MathUtils.degToRad(earthDegreeY));

  moon.translateX(10);
  moon.rotateY(0.01);
  moon.translateX(-10);

  directionalLight.translateX(15);
  directionalLight.rotateY(0.0);
  directionalLight.translateX(-15);
  controls.update();
  renderer.render(scene, camera);
}

animate();
