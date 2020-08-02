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
scene.add(cube);

camera.position.z = 5;

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

var animate = function () {
	requestAnimationFrame(animate);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
};

animate();

$(window).on('load', function () {
	onWindowResize();
});

