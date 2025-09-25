import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';


//MARK: SCENE, CAMERA, RENDERER
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener("resize", ()=>{
  renderer.setSize( window.innerWidth, window.innerHeight )
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
});


//MARK: First-person controls
const controls = new PointerLockControls(camera, document.body);

// Variables for movement
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveDown = false;
let moveUp = false;
let canJump = false;

const onKeyDown = function (event) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
      moveDown = true;
      break;
    case 'Space':
      moveUp = true;
      // if (canJump === true) velocity.y += 350;
      // canJump = false;
      break;
  }
};

const onKeyUp = function (event) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;
    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
      moveDown = false;
      break;
    case 'Space':
      moveUp = false;
      break;
  }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Click to enable pointer lock
const instructions = document.getElementById('instructions');
const havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {
  const element = document.body;
  
  const pointerlockchange = function (event) {
    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
      controls.enabled = true;
      if (instructions) instructions.style.display = 'none';
    } else {
      controls.enabled = false;
      if (instructions) instructions.style.display = '';
    }
  };

  const pointerlockerror = function (event) {
    if (instructions) instructions.style.display = '';
  };

  document.addEventListener('pointerlockchange', pointerlockchange, false);
  document.addEventListener('mozpointerlockchange', pointerlockchange, false);
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
  document.addEventListener('pointerlockerror', pointerlockerror, false);
  document.addEventListener('mozpointerlockerror', pointerlockerror, false);
  document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

  document.addEventListener('click', function () {
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();
  });
} else {
  if (instructions) instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}



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
  bee.position.set(0, -1.4, 0);
  scene.add( bee );
  
}, undefined, function ( error ) {
  
  console.error( error );
  
} );

let village;

loader.load( 'assets/a_minecraft_village/scene.gltf', function (gltf ) {
  village = gltf.scene;
  village.scale.set(2, 2, 2);
  village.position.set(5, -10, -20);
  scene.add( village );
  
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
  // Update movement
  const delta = 0.006; // Roughly 60fps
  
  // Get the direction the camera is looking
  direction.set(0, 0, -1);
  direction.applyQuaternion(camera.quaternion);
  direction.y = 0; // Keep movement horizontal only
  direction.normalize();
  
  // Calculate movement based on input
  const moveDistance = 200 * delta; // Movement speed
  
  if (moveForward) {
    velocity.x += direction.x * moveDistance;
    velocity.z += direction.z * moveDistance;
  }
  if (moveBackward) {
    velocity.x -= direction.x * moveDistance;
    velocity.z -= direction.z * moveDistance;
  }
  if (moveLeft) {
    // Get the left direction (perpendicular to forward)
    const leftDirection = new THREE.Vector3();
    leftDirection.crossVectors(camera.up, direction);
    velocity.x += leftDirection.x * moveDistance;
    velocity.z += leftDirection.z * moveDistance;
  }
  if (moveRight) {
    // Get the right direction (perpendicular to forward)
    const rightDirection = new THREE.Vector3();
    rightDirection.crossVectors(direction, camera.up);
    velocity.x += rightDirection.x * moveDistance;
    velocity.z += rightDirection.z * moveDistance;
  }
  if (moveUp) {
    velocity.y += moveDistance;
  }
  if (moveDown) {
    velocity.y -= moveDistance;
  }
  
  // Apply movement to camera
  camera.position.x += velocity.x * delta;
  camera.position.y += velocity.y * delta;
  camera.position.z += velocity.z * delta;
  
  // Apply friction
  velocity.x *= 0.9;
  velocity.y *= 0.9;
  velocity.z *= 0.9;
  
  // Object animations
  if (bee) bee.rotation.y += 0.01;
  if (flower) flower.rotation.y += -0.003;
  
  controls.update();
  renderer.render(scene, camera);
  camera.updateProjectionMatrix();
  renderer.clearDepth();
}
renderer.setAnimationLoop( animate );