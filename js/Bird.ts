enum BirdState {
    Alive,
    Dead,
}
class Bird implements I3DObject {
    private _mesh: THREE.Mesh = null;
    private _velocity: THREE.Vector3;
    private _gravity: THREE.Vector3;
    private _jumpVelocity: THREE.Vector3;
    private _scene: THREE.Scene;
    private _needsJump: boolean;
    private _state: BirdState;
    private _height: number;
    private _mixer: THREE.AnimationMixer;
    private _light_left: THREE.PointLight;
    private _light_right: THREE.PointLight;
    private _light_front: THREE.PointLight;
    private _light_back: THREE.PointLight;
    private _initialVelocity: THREE.Vector3;

    private _counter: number;
    private _needmix: boolean;

    private _boundingRadius: number;

    constructor(scene: THREE.Scene, initialVelocity: THREE.Vector3, gravity: THREE.Vector3, jumpVelocity: THREE.Vector3) {
        this._initialVelocity = initialVelocity.clone();
        this._gravity = gravity.clone();
        this._jumpVelocity = jumpVelocity.clone();
        this._scene = scene;

        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load('animated_models/humming_bird.js',
            (geometry) => {
                //var material = new THREE.TextureLoader().load( "js/textures/bird.jpg" );
                geometry.computeVertexNormals();
                geometry.computeMorphNormals();
                var material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    morphTargets: true,
                    morphNormals: true,
                    vertexColors: THREE.FaceColors,
                    shading: THREE.SmoothShading
                });
                this._mesh = new THREE.Mesh(
                    geometry,
                    material
                );
                this._mesh.rotation.y = Math.PI / 2;
                this._mesh.scale.set(5, 5, 5);
                scene.add(this._mesh);
                this._mesh.geometry.computeBoundingBox();
                this._height = (this._mesh.geometry.boundingBox.max.y - this._mesh.geometry.boundingBox.min.y);
                this._mesh.geometry.computeBoundingSphere();
                this._boundingRadius = this._mesh.geometry.boundingSphere.radius;
                this._mixer = new THREE.AnimationMixer(this._mesh);
                var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
                this._mixer.clipAction(clip).setDuration(1).play();

                this.reset();
            }
        );

        this._light_left = new THREE.PointLight(0xffffee, 0.8, 2000, 2);
        this._light_left.castShadow = true;
        this._light_right = new THREE.PointLight(0xffffee, 0.8, 2000, 2);
        this._light_right.castShadow = true;
        this._light_front = new THREE.PointLight(0xffffee, 1, 1000, 2);
        this._light_front.castShadow = true;
        this._light_back = new THREE.PointLight(0xffffee, 1, 1000, 2);
        this._light_back.castShadow = true;
        scene.add(this._light_left);
        scene.add(this._light_right);
        scene.add(this._light_front);
        scene.add(this._light_back);

        this.reset();
    }

    public get mesh() {
        return this._mesh;
    }

    public get collisionEffect() {
        return CollisionEffect.None;
    }

    public get height() {
        return this._height;
    }

    public get boundingRadius() {
        return this._boundingRadius;
    }

    public update(deltaSeconds: number) {
        if (this._needmix) {
            if (this._mixer) {
                this._mixer.update(deltaSeconds);
            }
            this._counter = this._counter + 1;
            if (this._counter == 15) {
                this._needmix = false;
            }
        }

        if (this._needsJump && this._state == BirdState.Alive) {
            this._velocity = this._jumpVelocity.clone();
            this._needsJump = false;
            this._needmix = true;
            this._counter = 0;
        }

        this._velocity.addScaledVector(this._gravity, deltaSeconds);
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);

        var temp_velocity = new THREE.Vector3(this._velocity.x, this._velocity.y / 3, this._velocity.z);

        this._light_left.position.addScaledVector(temp_velocity, deltaSeconds);
        this._light_right.position.addScaledVector(temp_velocity, deltaSeconds);
        this._light_front.position.addScaledVector(temp_velocity, deltaSeconds);
        this._light_back.position.addScaledVector(temp_velocity, deltaSeconds);
    }

    public reset(): void {
        console.log('Reset');
        this._state = BirdState.Alive;
        this._needsJump = false;
        this._needmix = false;
        this._counter = 0;

        this._velocity = this._initialVelocity.clone();

        this._light_left.position.set(-50, 50, 0);
        this._light_right.position.set(50, -50, 0);
        this._light_front.position.set(0, 0, 300);
        this._light_back.position.set(0, 0, -300);
        if (this._mesh !== null) {
            this._mesh.position.x = 0;
            this._mesh.position.y = 0;
            this._mesh.position.z = 0;
            this._mesh.updateMatrixWorld(true); // update vertex positions
        }
    }

    public removeFromScene() {
        this._scene.remove(this._mesh);
        this._scene.remove(this._light_left);
        this._scene.remove(this._light_right);
        this._scene.remove(this._light_front);
        this._scene.remove(this._light_back);
    }

    public setNeedsJump() {
        this._needsJump = true;
    }

    public fall() {
        if (this._state == BirdState.Alive) {
            this._velocity.set(0, 0, 0);
            this.die();
        }
    }

    public die() {
        console.log('Die');
        this._state = BirdState.Dead;
    }
}
