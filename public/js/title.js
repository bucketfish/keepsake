import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(12, 1.0, 0.1, 1000);

const title_canvas = document.querySelector("#title-3d");

const renderer = new THREE.WebGLRenderer({
  canvas: title_canvas,
  alpha: true,
});

// Enable physically correct lighting
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

camera.position.setZ(20);
camera.position.setY(4);
camera.position.setX(0.3);
camera.rotation.x = -0.2;


var window_width = window.innerWidth;
var width_percent = 1.0;
console.log(window_width);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window_width * width_percent, window_width * width_percent * 0.3);

// Also update the camera aspect ratio to match
camera.aspect = 1000 / 300;
camera.updateProjectionMatrix();

// Load HDR environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

// add light
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2.0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Add multiple directional lights for better metallic highlights
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight1.position.set(1, 1, 1);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight2.position.set(-1, -1, -1);
scene.add(directionalLight2);

// Add a point light for additional highlights
const pointLight = new THREE.PointLight(0xffffff, 2.0);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// const generator = new THREE.PMREMGenerator(renderer);
// const envMap = generator.fromScene(scene, 0, 0.1, 1300);

// scene.environment = envMap.texture;
// scene.background = null; // Ensure background is transparent
// generator.dispose();

let model;
let mouseX = 0;
let mouseY = 0;
let time = 0;

// Track mouse movement
document.addEventListener('mousemove', (event) => {
  // Normalize mouse position to -1 to 1 range
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Create rainbow gradient texture
const createRainbowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  gradient.addColorStop(0, '#ff9eb5');
  gradient.addColorStop(0.17, '#ff9ed3');
  gradient.addColorStop(0.33, '#d699ff');
  gradient.addColorStop(0.5, '#9999ff');
  gradient.addColorStop(0.67, '#99e6ff');
  gradient.addColorStop(0.83, '#ff9999');
  gradient.addColorStop(1, '#ff9eb5');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

const rainbowTexture = createRainbowTexture();

// load a GLTF model
const loader = new GLTFLoader();
loader.load(
  "assets/title.glb",
  (gltf) => {
    model = gltf.scene;
    scene.add(gltf.scene);

    // Traverse through all meshes and adjust material properties
    model.traverse((node) => {
      if (node.isMesh) {
        if (node.material) {
          // Create a new physical material
          const physicalMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, // White base color*
            metalness: 0.35,
            roughness: 0.05,
            envMapIntensity: 1.2,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2,
            reflectivity: 0.1,
            ior: 1.2,
            transmission: 1.2,
            thickness: 0.1,
            specularIntensity: 0.3,
            map: rainbowTexture // Add the rainbow texture*

          });

          // Copy over the map if it exists
          if (node.material.map) {
            physicalMaterial.map = node.material.map;
          }

          node.material = physicalMaterial;
        }
      }
    });

    model.position.x = -0.2;
    model.position.y = 0;
    model.scale.x = 0.1;
    model.scale.y = 0.1;
    model.scale.z = 0.1;
    model.rotation.y = Math.PI; // Rotate 180 degrees to face forward
  },
  undefined,
  (error) => {
    console.error("Error loading GLTF:", error);
  }
);

function animate() {
  if (model) {
    // Animate the rainbow texture
    rainbowTexture.offset.x += 0.001;

    // Smoothly rotate the model based on mouse position
    model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, Math.PI + mouseX * 0.5, 0.05);
    model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, -mouseY * 0.2, 0.05);
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

function onWindowResize() {


  var window_width = window.innerWidth;
  var width_percent = 1.0;
  console.log(window_width);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window_width * width_percent, window_width * width_percent * 0.3);

  // Also update the camera aspect ratio to match
  camera.aspect = 1000 / 300;
  camera.updateProjectionMatrix();
  // renderer.setSize(title_canvas.width, title_canvas.height);
}

window.addEventListener("resize", () => {
  onWindowResize();
});
