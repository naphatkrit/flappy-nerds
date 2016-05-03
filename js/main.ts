class Main {
    private SCREEN_WIDTH = window.innerWidth;
    private SCREEN_HEIGHT = window.innerHeight;
    private aspect = window.innerWidth / window.innerHeight;
    private container: HTMLDivElement;
    private stats;
    private camera;
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer;
    private bird: Bird;
    private cameraRig: THREE.Group;
    private activeCamera: THREE.Camera;
    private cameraPerspective: THREE.PerspectiveCamera;
    private cameraPerspectiveHelper: THREE.CameraHelper;
    private frustumSize = 600;
    private activeHelper;

    private updater: Updater;
    private _initContainer() {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.renderer.domElement.style.position = "relative";
        this.container.appendChild(this.renderer.domElement);
        this.renderer.autoClear = false;
    }

    private _initScene() {
        this.scene = new THREE.Scene();
        var geometry = new THREE.Geometry();
        for (var i = 0; i < 10000; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = THREE.Math.randFloatSpread(2000);
            vertex.y = THREE.Math.randFloatSpread(2000);
            vertex.z = THREE.Math.randFloatSpread(2000);
            geometry.vertices.push(vertex);
        }
        var particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));
        this.scene.add(particles);
    }

    private _initCameras() {
        if (Config.DEBUG) {
            this.camera = new THREE.PerspectiveCamera(50, 0.5 * this.aspect, 1, 10000);
            this.camera.position.z = 2500;
        }

        this.cameraPerspective = new THREE.PerspectiveCamera(50, Config.DEBUG ? 0.5 * this.aspect : this.aspect, 150, 1000);
        // counteract different front orientation of cameras vs rig
        this.cameraPerspective.rotation.y = Math.PI;

        this.cameraPerspective.position.x = 0;
        this.cameraPerspective.position.y = 0;
        this.cameraPerspective.position.z = 1000;
        this.cameraPerspective.lookAt(new THREE.Vector3(0, 0, -1));
        this.activeCamera = this.cameraPerspective;

        if (Config.DEBUG) {
            this.cameraPerspectiveHelper = new THREE.CameraHelper(this.cameraPerspective);
            this.scene.add(this.cameraPerspectiveHelper);
            this.activeHelper = this.cameraPerspectiveHelper;
        }

        this.cameraRig = new THREE.Group();
        this.cameraRig.add(this.cameraPerspective);
        this.scene.add(this.cameraRig);
    }

    private _initBird() {
        this.bird = new Bird(this.scene, Config.VELOCITY);
    }

    private _initUpdater() {
        this.updater = new Updater(this.bird, this.cameraRig);
    }

    private _initStats() {
        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);
    }

    constructor() {
        this._initContainer();
        this._initScene();
        this._initCameras();
        this._initBird();
        this._initUpdater();
        this._initStats();
        window.addEventListener('resize', (event) => { this.onWindowResize(event) }, false);
        document.addEventListener('keydown', (event) => { this.onKeyDown(event) }, false);
    }

    private onKeyDown(event) {
        switch (event.keyCode) {
            case 80: /*P*/
                this.activeCamera = this.cameraPerspective;
                if (Config.DEBUG) {
                    this.activeHelper = this.cameraPerspectiveHelper;
                }
                break;
        }
    }

    private onWindowResize(event) {
        this.SCREEN_WIDTH = window.innerWidth;
        this.SCREEN_HEIGHT = window.innerHeight;
        this.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
        this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.cameraPerspective.aspect = this.aspect;
        this.cameraPerspective.updateProjectionMatrix();
    }

    public animate() {
        requestAnimationFrame(() => { this.animate() });
        this.render();
        this.stats.update();
    }

    private render() {
        this.updater.update();

        this.renderer.clear();
        if (Config.DEBUG) {
            this.activeHelper.visible = false;
            this.renderer.setViewport(0, 0, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT);
            this.renderer.render(this.scene, this.activeCamera);
            this.activeHelper.visible = true;
            this.renderer.setViewport(this.SCREEN_WIDTH / 2, 0, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT);
            this.renderer.render(this.scene, this.camera);
        } else {
            this.renderer.setViewport(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
            this.renderer.render(this.scene, this.activeCamera);
        }
    }
}

window.onload = function() {
    var main = new Main();
    main.animate();
}
