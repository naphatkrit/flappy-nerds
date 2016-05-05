class Main {
    private SCREEN_WIDTH = window.innerWidth;
    private SCREEN_HEIGHT = window.innerHeight;
    private aspect = window.innerWidth / window.innerHeight;
    private container: JQuery;
    private stats;
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer;
    private bird: Bird;
    private cameraRig: THREE.Group;
    private activeCamera: THREE.Camera;
    private activeCamera2: THREE.Camera;
    private cameraPerspective: THREE.PerspectiveCamera;
    private cameraPerspectiveHelper: THREE.CameraHelper;
    private cameraFirstPerson: THREE.PerspectiveCamera;
    private cameraFirstPersonHelper: THREE.CameraHelper;
    private frustumSize = 600;
    private activeHelper;
    private activeHelper2;

    private topPlane: Plane;
    private bottomPlane: Plane;

    private updater: Updater;
    private _initContainer() {
        this.container = $('#container');
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.renderer.domElement.style.position = "relative";
        this.container.append($(this.renderer.domElement));
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

    private _initPlanes() {
        // the y positions should be close to the far plane of the perspective camera / 2
        this.topPlane = new Plane(this.scene, Config.MAX_Y, Config.VELOCITY, CollisionEffect.Fall);
        this.bottomPlane = new Plane(this.scene, Config.MIN_Y, Config.VELOCITY, CollisionEffect.Stop);
    }

    private _initCameras() {

        this.cameraPerspective = new THREE.PerspectiveCamera(50, 0.5 * this.aspect, 150, 1500);
        // counteract different front orientation of cameras vs rig
        this.cameraPerspective.rotation.y = Math.PI;

        this.cameraPerspective.position.x = Config.SIDE_CAMERA_OFFSET;
        this.cameraPerspective.position.y = 0;
        this.cameraPerspective.position.z = 1000;
        this.cameraPerspective.lookAt(new THREE.Vector3(this.cameraPerspective.position.x, this.cameraPerspective.position.y, -1));

        this.cameraFirstPerson = new THREE.PerspectiveCamera(50, 0.5 * this.aspect, Config.FIRST_PERSON_DISTANCE - 100, Config.FIRST_PERSON_DISTANCE + 3000);
        // counteract different front orientation of cameras vs rig
        this.cameraFirstPerson.rotation.y = Math.PI;

        this.cameraFirstPerson.position.x = -Config.FIRST_PERSON_DISTANCE;
        this.cameraFirstPerson.position.y = 0;
        this.cameraFirstPerson.position.z = 0;
        this.cameraFirstPerson.lookAt(new THREE.Vector3(0, 0, 0));

        this.activeCamera = this.cameraPerspective;
        this.activeCamera2 = this.cameraFirstPerson;

        if (Config.DEBUG) {
            this.cameraPerspectiveHelper = new THREE.CameraHelper(this.cameraPerspective);
            this.scene.add(this.cameraPerspectiveHelper);
            this.cameraFirstPersonHelper = new THREE.CameraHelper(this.cameraFirstPerson);
            this.scene.add(this.cameraFirstPersonHelper);
            this.activeHelper = this.cameraPerspectiveHelper;
            this.activeHelper2 = this.cameraFirstPersonHelper;
        }

        this.cameraRig = new THREE.Group();
        this.cameraRig.add(this.cameraPerspective);
        this.cameraRig.add(this.cameraFirstPerson);
        this.scene.add(this.cameraRig);
    }

    private _initBird() {
        this.bird = new Bird(this.scene, Config.VELOCITY, Config.GRAVITY, Config.JUMP_VELOCITY);
    }

    private _initUpdater() {
        this.updater = new Updater(this.scene, this.bird, this.cameraRig, this.topPlane, this.bottomPlane);
    }

    private _initStats() {
        this.stats = new Stats();
        this.container.append($(this.stats.dom));
    }

    constructor() {
        this._initContainer();
        this._initScene();
        this._initBird();
        this._initCameras();
        this._initPlanes();
        this._initUpdater();
        this._initStats();
        window.addEventListener('resize', (event) => { this.onWindowResize(event) }, false);
        document.addEventListener('keydown', (event) => { this.onKeyDown(event) }, false);

        $('#autopilot-btn').on('click', ()=> {
            $('#autopilot-btn').blur();
            this._toggleAutopilot();
        });
        $('#pause-btn').on('click', ()=>{
            $('#pause-btn').blur();
            this._togglePause();
        })
    }

    private _toggleAutopilot() {
        $('#autopilot-btn').toggleClass('btn-default btn-primary');
        this.updater.autopilotEnabled = !this.updater.autopilotEnabled;
    }

    private _togglePause() {
        $('#pause-btn').toggleClass('btn-default btn-primary');
        this.updater.paused = !this.updater.paused;
    }

    private onKeyDown(event) {
        switch (event.keyCode) {
            case 49: /*1*/
                this.activeCamera = this.cameraPerspective;
                if (Config.DEBUG) {
                    this.activeHelper = this.cameraPerspectiveHelper;
                }
                break;
            case 50: /*2*/
                this.activeCamera = this.cameraFirstPerson;
                if (Config.DEBUG) {
                    this.activeHelper = this.cameraFirstPersonHelper;
                }
                break;
            case 65: /*a*/
                this._toggleAutopilot();
                break;
            case 80: /*p*/
                this._togglePause();
                break;
            case 81: /*q*/
                this.activeCamera2 = this.cameraPerspective;
                if (Config.DEBUG) {
                    this.activeHelper2 = this.cameraPerspectiveHelper;
                }
                break;
            case 87: /*w*/
                this.activeCamera2 = this.cameraFirstPerson;
                if (Config.DEBUG) {
                    this.activeHelper2 = this.cameraFirstPersonHelper;
                }
                break;
            case 32: /* spacebar */
                /* put something here*/
                // this.bird.update(10);
                this.bird.setNeedsJump();
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
        this.cameraFirstPerson.aspect = this.aspect;
        this.cameraFirstPerson.updateProjectionMatrix();
    }

    public animate() {
        requestAnimationFrame(() => { this.animate() });
        this.render();
        this.stats.update();
    }

    private render() {
        this.updater.update();

        this.renderer.clear();
        this.renderer.setViewport(0, 0, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT);
        this.renderer.render(this.scene, this.activeCamera);
        this.renderer.setViewport(this.SCREEN_WIDTH / 2, 0, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT);
        this.renderer.render(this.scene, this.activeCamera2);
    }
}

window.onload = function() {
    var main = new Main();
    main.animate();
}
