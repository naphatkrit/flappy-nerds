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

    constructor(scene: THREE.Scene, initialVelocity: THREE.Vector3, gravity: THREE.Vector3, jumpVelocity: THREE.Vector3) {
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load('animated_models/humming_bird.js',
        	( geometry, mat ) => {
                //var material = new THREE.MeshFaceMaterial( mat );
                var material = new THREE.TextureLoader().load( "js/textures/bird.jpg" );
        		this._mesh = new THREE.Mesh(
                    geometry,
                    new THREE.MeshBasicMaterial({ color: 0xffffff, map: material, wireframe: true, morphTargets: true })
                );
                this._mesh.position.x = 0;
                this._mesh.position.y = 0;
                this._mesh.position.z = 0;
                this._mesh.rotation.y = Math.PI / 2;
                this._mesh.scale.set(5, 5, 5);
                scene.add(this._mesh);
                this._mesh.geometry.computeBoundingBox();
                this._height = (this._mesh.geometry.boundingBox.max.y - this._mesh.geometry.boundingBox.min.y);
                this._mixer = new THREE.AnimationMixer(this._mesh);
                var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
                this._mixer.clipAction(clip).setDuration(1).play();
            }
        );

        this._velocity = initialVelocity.clone();
        this._gravity = gravity.clone();
        this._needsJump = false;
        this._jumpVelocity = jumpVelocity.clone();
        this._scene = scene;
        this._state = BirdState.Alive;
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

    public update(deltaSeconds: number) {
        if (this._mixer) {
            this._mixer.update(deltaSeconds);
        }

        if (this._needsJump && this._state == BirdState.Alive) {
            this._velocity = this._jumpVelocity.clone();
            this._needsJump = false;
        }
        this._velocity.addScaledVector(this._gravity, deltaSeconds);
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
    }

    public removeFromScene() {
        this._scene.remove(this._mesh);
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
        this._state = BirdState.Dead;
    }
}
