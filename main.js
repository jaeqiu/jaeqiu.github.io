import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//MARK: SCENE, CAMERA, RENDERER
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;        // smooth motion
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 20;
controls.target.set(0, 0, 0);

//MARK: Objects
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

camera.position.z = 10;

//LOADER
const loader = new GLTFLoader();

let bee;

loader.load( 'assets/minecraft_bee/bee.gltf', function ( gltf ) {
  bee = gltf.scene;
  bee.scale.set(10, 10, 10);
  bee.position.set(0, -1.8, 0);
  scene.add( bee );
  
}, undefined, function ( error ) {
  
  console.error( error );
  
} );

let flower;

loader.load( 'assets/minecraft_bee/flower.gltf', function ( gltf ) {
  flower = gltf.scene;
  flower.scale.set(2, 2, 2);
  flower.position.set(0, -2, 0);
  scene.add( flower );
  
}, undefined, function ( error ) {
  
  console.error( error );
  
} );

let grass;

loader.load( 'assets/minecraft_grass_block/scene.gltf', function ( gltf ) {
  grass = gltf.scene;
  grass.scale.set(1, 1, 1);
  grass.position.set(0, -4, 0);
  scene.add( grass );
  
}, undefined, function ( error ) {
  
  console.error( error );
  
} );

//RENDER CYCLE
function animate() {
  if (bee) bee.rotation.y += 0.01
  renderer.render( scene, camera );
  if (flower) flower.rotation.y += -.003
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );