var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var container: HTMLDivElement, stats;
var scene: THREE.Scene, renderer: THREE.WebGLRenderer, mesh: THREE.Mesh;
var cameraRig: THREE.Group, activeCamera: THREE.Camera;
var cameraPerspective: THREE.PerspectiveCamera;
var frustumSize = 600;

window.onload = function() {
    init();
    animate();
}

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    scene = new THREE.Scene();
    //
    cameraPerspective = new THREE.PerspectiveCamera(50, aspect, 150, 1000);
    //
    activeCamera = cameraPerspective;
    // counteract different front orientation of cameras vs rig
    cameraPerspective.rotation.y = Math.PI;
    cameraRig = new THREE.Group();
    cameraRig.add(cameraPerspective);
    scene.add(cameraRig);
    // white ball
    mesh = new THREE.Mesh(
        new THREE.SphereBufferGeometry(100, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );
    scene.add(mesh);

    // green ball
    var mesh2 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(50, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );
    mesh2.position.y = 150;
    mesh.add(mesh2);

    // inner blue ball
    var mesh3 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(5, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    );
    mesh3.position.z = 150;
    cameraRig.add(mesh3);


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
function render() {
    var r = Date.now() * 0.0005;
    mesh.position.x = 700 * Math.cos(r);
    mesh.position.z = 700 * Math.sin(r);
    mesh.position.y = 700 * Math.sin(r);
    mesh.children[0].position.x = 70 * Math.cos(2 * r);
    mesh.children[0].position.z = 70 * Math.sin(r);
    if (activeCamera === cameraPerspective) {
        cameraPerspective.fov = 35 + 30 * Math.sin(0.5 * r);
        cameraPerspective.far = mesh.position.length();
        cameraPerspective.updateProjectionMatrix();
    }
    cameraRig.lookAt(mesh.position);
    renderer.clear();
    renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.render(scene, activeCamera);
}
