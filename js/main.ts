var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var container: HTMLDivElement, stats;
var camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, bird: Bird;
var cameraRig: THREE.Group, activeCamera: THREE.Camera;
var cameraPerspective: THREE.PerspectiveCamera, cameraOrtho: THREE.OrthographicCamera;
var cameraPerspectiveHelper;
var frustumSize = 600;
var activeHelper;

var updater: Updater;

window.onload = function() {
    init();
    animate();
}

function _initContainer() {
    container = document.createElement('div');
    document.body.appendChild(container);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.domElement.style.position = "relative";
    container.appendChild(renderer.domElement);
    renderer.autoClear = false;
}

function _initScene() {
    scene = new THREE.Scene();
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
}

function _initCameras() {
    if (Config.DEBUG) {
        camera = new THREE.PerspectiveCamera(50, 0.5 * aspect, 1, 10000);
        camera.position.z = 2500;
    }

    cameraPerspective = new THREE.PerspectiveCamera(50, Config.DEBUG ? 0.5 * aspect : aspect, 150, 1000);
    // counteract different front orientation of cameras vs rig
    cameraPerspective.rotation.y = Math.PI;

    cameraPerspective.position.x = 0;
    cameraPerspective.position.y = 0;
    cameraPerspective.position.z = 1000;
    cameraPerspective.lookAt(new THREE.Vector3(0, 0, -1));
    activeCamera = cameraPerspective;

    if (Config.DEBUG) {
        cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);
        scene.add(cameraPerspectiveHelper);
        activeHelper = cameraPerspectiveHelper;
    }

    cameraRig = new THREE.Group();
    cameraRig.add(cameraPerspective);
    scene.add(cameraRig);
}

function _initBird() {
    bird = new Bird(scene, Config.VELOCITY);
}

function _initUpdater() {
    updater = new Updater(bird, cameraRig);
}

function _initStats() {
    stats = new Stats();
    container.appendChild(stats.dom);
}

function init() {
    _initContainer();
    _initScene();
    _initCameras();
    _initBird();
    _initUpdater();
    _initStats();
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown, false);
}
//
function onKeyDown(event) {
    switch (event.keyCode) {
        case 80: /*P*/
            activeCamera = cameraPerspective;
            if (Config.DEBUG) {
                activeHelper = cameraPerspectiveHelper;
            }
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

function render() {
    updater.update();

    renderer.clear();
    if (Config.DEBUG) {
        activeHelper.visible = false;
        renderer.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
        renderer.render(scene, activeCamera);
        activeHelper.visible = true;
        renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
        renderer.render(scene, camera);
    } else {
        renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.render(scene, activeCamera);
    }
}
