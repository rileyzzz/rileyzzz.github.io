import { GLTFLoader } from './loaders/GLTFLoader.js';

document.addEventListener('click', musicPlay);
var context;
var bufferLoader;
var analyser;
var bufferLength;
var dataArray;
dataArray = new Uint8Array(1024);
dataArray.fill(255);
var dTex;

//function FractionData() {
//	for (var i = 0; i < size; i++) {

//		data[i] /= 256;

//	}
//}
//var GLCanvas = document.getElementById("glCanvas");
//var GLContext = GLCanvas.getContext('webgl2', { antialias: true });


//pixel setup
//function setPixelFromInt(pixels, width, x, y, intValue) {
//	var r = (intValue >> 24) & 0xFF;
//	var g = (intValue >> 16) & 0xFF;
//	var b = (intValue >> 8) & 0xFF;
//	var a = (intValue >> 0) & 0xFF;
//	var offset = (y * width + x) * 4;
//	pixels[offset + 0] = r;
//	pixels[offset + 1] = g;
//	pixels[offset + 2] = b;
//	pixels[offset + 3] = a;
//}
//var DataPixels = new Uint8Array(32 * 32 * 4);

//function SetPixelBuffer(data) {
//	var i;
//	for (i = 0; i < 32 * 32; i++)
//	{
//		setPixelFromInt(pixels, width, x, y, intValue);
//    }
//}


function init() {
	// Fix up prefixing
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();
	analyser = context.createAnalyser();
	analyser.fftSize = 2048;
	bufferLength = analyser.frequencyBinCount;
	

	//alert(bufferLength); //1024
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
	source1.connect(analyser);
	analyser.connect(context.destination);
	source1.start(0);
}

function musicPlay() {
	document.removeEventListener('click', musicPlay);
	init();
};


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ canvas: glCanvas });
//var renderer = new THREE.WebGLRenderer({ GLCanvas, GLContext });

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
var grid;
var GridMaterial;
scene.add(cube);

camera.position.y = 5;
camera.lookAt(0, 0, 0);
var loader = new GLTFLoader();

loader.load('assets/3d/grid.glb', function (gltf) {

	//gltf.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	//grid = gltf.scene;
	dTex = new THREE.DataTexture(dataArray, 32, 32, THREE.RedFormat);
	dTex.wrapS = dTex.wrapT = THREE.RepeatWrapping;

	let uniforms = {
		colorB: { type: 'vec3', value: new THREE.Color(0xACB6E5) },
		colorA: { type: 'vec3', value: new THREE.Color(0x74ebd5) },
		soundTex: { type: 't', value: dTex }
	}
	GridMaterial = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent
	});

	gltf.scene.traverse(function (child) {
		if (child.isMesh) {
			child.material = GridMaterial;
		}
	});

	grid = gltf.scene;
	//grid = new THREE.Mesh(gltf.scene.geometry, GridMaterial);
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
var frame = 0;

var animate = function () {
	requestAnimationFrame(animate);
	frame++;
	if (grid) {

		if (analyser) {
			//dataArray.fill((Math.sin(frame/50) / 2 + 1) * 255);
			dataArray.fill(0);
			analyser.getByteTimeDomainData(dataArray);

			dTex.needsUpdate = true;
			GridMaterial.uniforms.soundTex.needsUpdate = true;

		}


		//cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		//grid.rotation.x += 0.01;
		grid.rotation.y += 0.01;
		
	}
	renderer.render(scene, camera);
};



$(window).on('load', function () {
	onWindowResize();
	animate();
});

