import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { split, drawto, discretize } from './split';

const LEVELS_COUNT = 10;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );

renderer.setSize( window.innerWidth, window.innerHeight );

const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
//const light = new THREE.AmbientLight( 0x404040 );
//const light = new THREE.PointLight( 0xff0000, 1, 100 );

light.position.set(0, 1000, 100);

const light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
light2.position.set(0, -1000, 100);

scene.add(light);
scene.add(light2);

document.body.appendChild( renderer.domElement );


function addPlate(width, height) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0)
    
    scene.add(mesh);

}

async function init() {
    const { data, width, image, DIF } = await split();
    const discrete = discretize(data, LEVELS_COUNT);
    window.cyls = discrete;
    console.log(discrete)
    //addPlate(image.width, image.height);
    addCylynders(discrete, width, DIF, image)

    //camera.position.set(200, 0, 200);
    camera.position.set(0, 0, 1000);

    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    controls.update();
    animate();
}

function animate() {
    requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );

}

function addCylynders(data, rowCount, DIF, image) {
    console.log(data.length, rowCount, DIF)
    const vOffset = image.height / 2;
    const hOffset = image.width / 2;

    for (let i = 0, c = 0; i < data.length / rowCount; i++) {
        for (let j = 0; j < rowCount; j++) {
            addCylynder(data[c], i, j, DIF, vOffset, hOffset);
            c++;
        }
    }
}

function addCylynder(value, vPos, hPos, width, vOffset, hOffset) {
    const cylgeo = new THREE.CylinderGeometry(width/2, width/2, value, 32);
    const cylmat = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    //const cylmat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    //cylgeo.translate(0, value / 2, 0)

    const cylinder = new THREE.Mesh(cylgeo, cylmat);
    cylinder.rotation.x = (Math.PI / 2);
    cylinder.position.x = (hPos * width - hOffset);
    cylinder.position.y = -(vPos * width - vOffset);
    cylinder.position.z = value / 2 + 50;

    scene.add(cylinder);
}

init();


//drawto('my-canvas', data, width);
