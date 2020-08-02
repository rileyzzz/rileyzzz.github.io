import { GLTFLoader } from './loaders/GLTFLoader.js';

document.addEventListener('click', musicPlay);
var context;
var bufferLoader;

function init() {
	// Fix up prefixing
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();

	bufferLoader = new BufferLoader(
		context,
		[
			'bruh.mp3',
			//'../sounds/hyper-reality/laughter.wav',
		],
		finishedLoading
	);

	bufferLoader.load();
}

function finishedLoading(bufferList) {
	// Create two sources and play them both together.
	var source1 = context.createBufferSource();
	source1.buffer = bufferList[0];
	source1.connect(context.destination);
	source1.start(0);
}

function musicPlay() {
	document.removeEventListener('click', musicPlay);

	init();
};

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ canvas: glCanvas });

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
var grid;
scene.add(cube);

camera.position.y = 5;
camera.lookAt(0, 0, 0);
var loader = new GLTFLoader();

loader.load('assets/3d/grid.glb', function (gltf) {

	//gltf.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	//grid = gltf.scene;
	let uniforms = {
		colorB: { type: 'vec3', value: new THREE.Color(0xACB6E5) },
		colorA: { type: 'vec3', value: new THREE.Color(0x74ebd5) }
	}
	gltf.scene.traverse(function (child) {

		if (child.isMesh) {

			child.material = new THREE.ShaderMaterial({
				uniforms: uniforms,
				vertexShader: document.getElementById('vertexShader').textContent,
				fragmentShader: document.getElementById('fragmentShader').textContent
			});
		}

	});
	grid = gltf.scene;
	scene.add(grid);
	//grid.rotation.x = Math.PI / 2;

}, undefined, function (error) {

	console.error(error);

});

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

var animate = function () {
	requestAnimationFrame(animate);

	//cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	//grid.rotation.x += 0.01;
	grid.rotation.y += 0.01;
	renderer.render(scene, camera);
};



$(window).on('load', function () {
	onWindowResize();
	animate();
});

