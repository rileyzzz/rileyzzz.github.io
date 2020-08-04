import { GLTFLoader } from './loaders/GLTFLoader.js';
import { EffectComposer } from './threedist/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './threedist/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './threedist/examples/jsm/postprocessing/UnrealBloomPass.js';
//import { ShaderPass } from './threedist/examples/jsm/postprocessing/ShaderPass.js';
//import { FXAAShader } from './threedist/examples/jsm/shaders/FXAAShader.js';

var params = {
	exposure: 1.0,
	bloomStrength: 0.6,
	bloomThreshold: 0.0,
	bloomRadius: 0.8
};
var MOUSEX, MOUSEY = 0;
//mouse handling, thank you stackoverflow
(function () {
	document.onmousemove = handleMouseMove;
	function handleMouseMove(event) {
		var eventDoc, doc, body;

		event = event || window.event; // IE-ism

		// If pageX/Y aren't available and clientX/Y are,
		// calculate pageX/Y - logic taken from jQuery.
		// (This is to support old IE)
		if (event.pageX == null && event.clientX != null) {
			eventDoc = (event.target && event.target.ownerDocument) || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;

			event.pageX = event.clientX +
				(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
				(doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY +
				(doc && doc.scrollTop || body && body.scrollTop || 0) -
				(doc && doc.clientTop || body && body.clientTop || 0);
		}

		// Use event.pageX / event.pageY here
		MOUSEX = event.pageX;
		MOUSEY = event.pageY;
	}
})();


document.addEventListener('click', musicPlay);
document.addEventListener('touchstart', musicPlay);
var context;
var bufferLoader;
var analyser;
var bufferLength;
var dataArray;
var timeArray;
dataArray = new Uint8Array(1024);
timeArray = new Uint8Array(2048);
//dataArray.fill(255);
var dTex;
var d2Tex;



async function init() {
	// Fix up prefixing
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();
	analyser = context.createAnalyser();
	analyser.fftSize = 2048;
	//analyser.fftSize = 4096; // increase size so i dont have to uv transform
	bufferLength = analyser.frequencyBinCount;
	

	//alert(bufferLength); //1024
	bufferLoader = new BufferLoader(
		context,
		[
			'bruh2.mp3',
			//'../sounds/hyper-reality/laughter.wav',
		],
		finishedLoading
	);

	bufferLoader.load();
}

async function finishedLoading(bufferList) {
	// Create two sources and play them both together.
	var source1 = context.createBufferSource();
	source1.buffer = bufferList[0];
	source1.connect(analyser);
	analyser.connect(context.destination);
	source1.start(0);
}
var musicStartTime;
function musicPlay() {
	document.removeEventListener('click', musicPlay);
	document.removeEventListener('touchstart', musicPlay);
	init();
	musicStartTime = Date.now();
};


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
var renderer = new THREE.WebGLRenderer({ canvas: glCanvas });

var imageloader = new THREE.TextureLoader();
imageloader.load(
	// resource URL
	'assets/space2.png',

	// onLoad callback
	function (texture) {
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1;
		//renderer.outputEncoding = THREE.sRGBEncoding;

		scene.environment = texture;
		scene.background = texture;
	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function (err) {
		console.error('An error happened.');
	}
);


//post processing
var renderScene = new RenderPass(scene, camera);
//renderScene.clearColor = new THREE.Color(0, 0, 0);
//renderScene.clearAlpha = 0;

var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;
//bloomPass.material.transparent = true;

//var fxaaPass = new ShaderPass(FXAAShader);
var pixelRatio = renderer.getPixelRatio();




var composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
//composer.addPass(fxaaPass);
renderer.setClearColor(0x000000, 0);

//initial render
composer.render(scene, camera);

//var geometry = new THREE.BoxGeometry();
//var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//var cube = new THREE.Mesh(geometry, material);
var grid;
var GridMaterial;
var SpinMaterial;
var BarMaterial;
var spinningstuff = new Array();
var BarList = new Array();
//scene.add(cube);

camera.position.y = 5;
camera.position.z = 5;
camera.lookAt(0, -0.5, 0);
var loader = new GLTFLoader();


dTex = new THREE.DataTexture(dataArray, 32, 32, THREE.RedFormat);
dTex.wrapS = dTex.wrapT = THREE.RepeatWrapping;

loader.load('assets/3d/grid.glb', function (gltf) {



	let uniforms = {
		colorA: { type: 'vec3', value: new THREE.Color(0xb967ff) },
		colorB: { type: 'vec3', value: new THREE.Color(0xfaa80f) },
		time: { type: 'float', value: 1.0 },
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

	grid.position.set(0.0, -4.0, 0.0);
	let scale = 3.0;
	grid.scale.set(scale, scale, scale);

	scene.add(grid);
	LoadBars();

}, undefined, function (error) {

	console.error(error);

});

const BarCount = 256;
const BarScale = 0.01;

function LoadBars() {
	loader.load('assets/3d/bar.glb', function (gltf) {

		let uniforms = {
			colorA: { type: 'vec3', value: new THREE.Color(0xb967ff) },
			colorB: { type: 'vec3', value: new THREE.Color(0xfaa80f) },
			time: { type: 'float', value: 1.0 }
		}
		BarMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: document.getElementById('barvertShader').textContent,
			fragmentShader: document.getElementById('barfragShader').textContent
		});

		gltf.scene.traverse(function (child) {
			if (child.isMesh) {
				child.material = BarMaterial;
			}
		});

		//width 8
		for (let Side = 0; Side < 4; Side++) {
			let SideGroup = new THREE.Group();
			for (let BarID = 0; BarID <= BarCount; BarID++) {
				let curbar = gltf.scene.clone();

				curbar.scale.set(BarScale, 0.1, BarScale);
				let sidedist = -4.0;
				let along = BarID / BarCount;

				curbar.position.set((along * 8.0) - 4.0, 0.0, sidedist);

				SideGroup.add(curbar);
			}
			SideGroup.rotation.set(0.0, Side * (Math.PI / 2), 0.0);

			BarList.push(SideGroup);
			grid.add(BarList[BarList.length - 1]);
		}


	}, undefined, function (error) {

		console.error(error);

	});
}



loader.load('assets/3d/spin.glb', function (gltf) {

	let uniforms = {
		colorB: { type: 'vec3', value: new THREE.Color(0x8400b8) },
		colorA: { type: 'vec3', value: new THREE.Color(0xfaa80f) },
		time: { type: 'float', value: 1.0 }
	}
	SpinMaterial = new THREE.ShaderMaterial({
		uniforms: uniforms,
		side: THREE.DoubleSide,
		transparent: true,
		vertexShader: document.getElementById('spinvertShader').textContent,
		fragmentShader: document.getElementById('spinfragShader').textContent
	});
	
	gltf.scene.traverse(function (child) {
		if (child.isMesh) {
			child.material = SpinMaterial;
		}
	});

	gltf.scene.position.set(0.0, -0.4, 0.0);

	for (let SpinID = 1; SpinID < 8; SpinID++) {
		let curspinner = gltf.scene.clone();

		let scale = SpinID / 8;
		curspinner.scale.set(scale, scale, scale);

		spinningstuff.push(curspinner);
		scene.add(spinningstuff[spinningstuff.length - 1]);
	}

}, undefined, function (error) {
	console.error(error);
});






window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	composer.setSize(window.innerWidth, window.innerHeight);

	//bg resizing
	const targetAspect = window.innerWidth / window.innerHeight;
	const imageAspect = 1920 / 1080;
	const factor = imageAspect / targetAspect;

	scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
	scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
	scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
	scene.background.repeat.y = factor > 1 ? 1 : factor;
}


//var BPM = 110.8 / 4.0;
var frame = 0;
var startTime = Date.now();
var animate = function () {
	requestAnimationFrame(animate);
	frame++;
	var elapsedMilliseconds = Date.now() - startTime;

	if (SpinMaterial && BarMaterial) {
		SpinMaterial.uniforms.time.value = (elapsedMilliseconds / 1000.0);
		SpinMaterial.uniforms.time.needsUpdate = true;
		BarMaterial.uniforms.time.value = (elapsedMilliseconds / 1000.0);
		BarMaterial.uniforms.time.needsUpdate = true;
    }

	if (grid) {
		GridMaterial.uniforms.time.value = (elapsedMilliseconds / 1000.0);
		GridMaterial.uniforms.time.needsUpdate = true;
		

		if (analyser) {
			//dataArray.fill((Math.sin(frame/50) / 2 + 1) * 255);
			dataArray.fill(0);
			analyser.getByteTimeDomainData(timeArray);
			analyser.getByteFrequencyData(dataArray);


			dTex.needsUpdate = true;
			GridMaterial.uniforms.soundTex.needsUpdate = true;

			//let elapsedmusicMilliseconds = Date.now() - (musicStartTime + 500.0);
			//let RotationBPM = elapsedmusicMilliseconds % ((BPM / 60.0) * 1000.0);

			let NewX = MOUSEX - (window.innerWidth / 2);
			let NewY = MOUSEY - (window.innerHeight / 2);

			for (let i = 0; i < spinningstuff.length; i++) {

				let corescale = (i + 1) / 8;
				


				let TargetPosition = Math.floor((i / spinningstuff.length) * 2048);
				let TargetRotation = (timeArray[TargetPosition] - 127) / 250;

				//if (Math.abs(TargetRotation) > 0.08) spinningstuff[i].rotation.x += TargetRotation * 1.4;
				//spinningstuff[i].rotation.x /= 1.1;
				//Math.abs(TargetRotation) > 0.08

				let NewScale = corescale + TargetRotation / ((spinningstuff.length - i) * 2.0 + 8.0);
				spinningstuff[i].scale.set(NewScale, NewScale, NewScale);

				//if (TargetRotation > 0.08) {
				//	let NewScale = corescale + Math.abs(TargetRotation) / 4;
				//	spinningstuff[i].scale.set(NewScale, NewScale, NewScale);
				//}
				//else {
				//	let RelativeScale = spinningstuff[i].scale.getComponent(0) - corescale;
				//	let NewScale = corescale + (RelativeScale / 1.01);
				//	spinningstuff[i].scale.set(NewScale, NewScale, NewScale);
				//}
				//spinningstuff[i].lookAt(NewX / 2000.0, -0.3, -NewY / 2000.0);
				//spinningstuff[i].position.set(0.0, TargetRotation - 0.4, 0.0);

				//spinningstuff[i].rotation.x = (Math.PI / 2);
				//let RotationFactor = ((spinningstuff.length - i) / spinningstuff.length) / 2 + 0.5;
				spinningstuff[i].rotation.set(0.0, spinningstuff[i].rotation.y, 0.0);
				let RotationFactor = ((spinningstuff.length - i) / spinningstuff.length);
				spinningstuff[i].rotation.z = (-NewX / 2000.0) * RotationFactor;
				spinningstuff[i].rotation.x = (NewY / 2000.0) * RotationFactor;


				spinningstuff[i].rotation.y += TargetRotation / 8.0;
				//spinningstuff[i].rotation.y += (RotationBPM / 1000.0) / 100.0;
				//spinningstuff[i].rotation.y += i / 1800;
				//spinningstuff[i].rotation.x = i * (Math.sin(elapsedMilliseconds / 1000) / 32);
            }

			//cube.rotation.y += (dataArray[512] - 127) / 250;

			//Bar visualizer
			for (let Side = 0; Side < BarList.length; Side++) {
				let SideGroup = BarList[Side];

				let BarID = 0;
				SideGroup.traverse(function (child) {
					if (child.isMesh) {
						let along = BarID / BarCount;
						let target = Math.floor((along / 4.0) * analyser.fftSize);
						child.scale.set(1.0, dataArray[target] / 10.0, 1.0);

						BarID++;
					}
				});
			}

		}


		//cube.rotation.x += 0.01;
		//cube.rotation.y += 0.01;
		
		//grid.rotation.x += 0.01;
		grid.rotation.y += 0.001;

		

		//grid.position.set(NewX / 2000.0, -4.0, NewY / 2000.0);
	}
	//renderer.render(scene, camera);
	composer.render(scene, camera);
};



$(window).on('load', function () {
	onWindowResize();
	animate();
});

