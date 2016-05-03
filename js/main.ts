var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var container: HTMLDivElement, stats;
var camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, bird: THREE.Mesh;
var cameraRig: THREE.Group, activeCamera: THREE.Camera;
var cameraPerspective: THREE.PerspectiveCamera, cameraOrtho: THREE.OrthographicCamera;
var cameraPerspectiveHelper;
var frustumSize = 600;
var activeHelper;

window.onload = function() {
    init();
    animate();
}

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );
	camera.position.z = 2500;

    //
    cameraPerspective = new THREE.PerspectiveCamera(50, 0.5 * aspect, 150, 1000);
    cameraPerspectiveHelper = new THREE.CameraHelper( cameraPerspective );
	scene.add( cameraPerspectiveHelper );
    //
    activeCamera = cameraPerspective;
    activeHelper = cameraPerspectiveHelper;
    // counteract different front orientation of cameras vs rig
    cameraPerspective.rotation.y = Math.PI;
    cameraPerspective.position.x = 0;
    cameraPerspective.position.y = 0;
    cameraPerspective.position.z = 1000;
    cameraPerspective.lookAt(new THREE.Vector3(0, 0, -1));

    cameraRig = new THREE.Group();
    cameraRig.add(cameraPerspective);
    scene.add(cameraRig);
    bird = new THREE.Mesh(
        new THREE.SphereBufferGeometry(100, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );
    scene.add(bird);

    var geometry = new THREE.Geometry();
    for (var i = 0; i < 10000; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = THREE.Math.randFloatSpread(2000);
        vertex.y = THREE.Math.randFloatSpread(2000);
        vertex.z = THREE.Math.randFloatSpread(2000);
        geometry.vertices.push(vertex);
    }
    var particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));
    scene.add(particles);
    //
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.domElement.style.position = "relative";
    container.appendChild(renderer.domElement);
    renderer.autoClear = false;
    //
    stats = new Stats();
    container.appendChild(stats.dom);
    //
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown, false);
}
//
function onKeyDown(event) {
    switch (event.keyCode) {
        case 80: /*P*/
            activeCamera = cameraPerspective;
            break;
    }
}
//
function onWindowResize(event) {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    cameraPerspective.aspect = aspect;
    cameraPerspective.updateProjectionMatrix();
}
//
function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}
var count = 0;
function render() {
    count += 1;
    bird.position.x = count;
    bird.position.y = 0;
    bird.position.z = 0;
    cameraRig.position.x = count;
    console.log(cameraRig.position);
    renderer.clear();
    activeHelper.visible = false;
	renderer.setViewport( 0, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
	renderer.render( scene, activeCamera );
	activeHelper.visible = true;
	renderer.setViewport( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
	renderer.render( scene, camera );
}
