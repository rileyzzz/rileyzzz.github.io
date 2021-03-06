import { GLTFLoader } from './loaders/GLTFLoader.js';
import { EffectComposer } from './threedist/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './threedist/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './threedist/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RGBELoader } from './threedist/examples/jsm/loaders/RGBELoader.js';
import { SSAOPass } from './threedist/examples/jsm/postprocessing/SSAOPass.js';
//import { ShaderPass } from './threedist/examples/jsm/postprocessing/ShaderPass.js';
//import { FXAAShader } from './threedist/examples/jsm/shaders/FXAAShader.js';
var loader = new GLTFLoader();

var params = {
	exposure: 1.0,
	bloomStrength: 0.4,
	bloomThreshold: 0.0,
	bloomRadius: 0.4
};

var ENVMAP;





new RGBELoader()
.setDataType(THREE.UnsignedByteType)
.setPath('assets/3d/previews/')
.load('env_small.hdr', async function (texture) {
	ENVMAP = texture;
	StartPreviews();
});

async function StartPreviews() {
	$('.previewgraphics').each(async function (i, obj) {

		let scene = new THREE.Scene();
		let camera = new THREE.PerspectiveCamera(75, obj.offsetWidth / obj.offsetHeight, 0.1, 1000);
		let renderer = new THREE.WebGLRenderer({ canvas: obj, alpha: true, antialias: true });
		renderer.setClearColor(0x000000, 0);

		//renderer.shadowMap.enabled = true;
		//renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		//PBR STUFF
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1;
		renderer.outputEncoding = THREE.sRGBEncoding;
		let pmremGenerator = new THREE.PMREMGenerator(renderer);
		pmremGenerator.compileEquirectangularShader();

		let envMap = pmremGenerator.fromEquirectangular(ENVMAP).texture;

		scene.environment = envMap;

		pmremGenerator.dispose();


		let pointlight = new THREE.PointLight(0xffffff, 0.8, 100);
		pointlight.position.set(2, 2, 4);
		pointlight.castShadow = true;
		scene.add(pointlight);



		//let composer = new EffectComposer(renderer);

		//var ssaoPass = new SSAOPass(scene, camera, obj.offsetWidth, obj.offsetHeight);
		//ssaoPass.kernelRadius = 16;
		//ssaoPass.minDistance = 0.003;
		//composer.addPass(ssaoPass);
		



		let previewmodel;

		camera.position.z = 2;
		camera.lookAt(0, 0, 0);




		loader.load('assets/3d/previews/' + obj.id + '.glb', async function (gltf) {

			previewmodel = gltf.scene;

			//previewmodel.receiveShadow = true;
			//previewmodel.position.set(0.0, -4.0, 0.0);
			let scale = 1.0;
			previewmodel.scale.set(scale, scale, scale);

			scene.add(previewmodel);

		}, undefined, function (error) {
			console.error(error);
		});


		let onPreviewResize = function () {

			camera.aspect = obj.offsetWidth / obj.offsetHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(obj.offsetWidth, obj.offsetHeight, false);
			//ssaoPass.setSize(obj.offsetWidth, obj.offsetHeight, false);
			//composer.setSize(obj.offsetWidth, obj.offsetHeight, false);

		}
		window.addEventListener('resize', onPreviewResize, false);

		let startTime = Date.now();
		let animate = function () {

			if (previewmodel) {

				var elapsedMilliseconds = Date.now() - startTime;

				//grid.rotation.y += 0.001;

				previewmodel.rotation.y = Math.sin(elapsedMilliseconds / 2000.0) / 10.0;
			}
			renderer.render(scene, camera);
			//composer.render();

			requestAnimationFrame(animate);
		};



		onPreviewResize();
		animate();
	});
}
