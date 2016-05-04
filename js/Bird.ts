enum BirdState {
    Alive,
    Dead,
}
class Bird implements I3DObject {
    private _mesh: THREE.Mesh;
    private _velocity: THREE.Vector3;
    private _gravity: THREE.Vector3;
    private _jumpVelocity: THREE.Vector3;
    private _scene: THREE.Scene;
    private _needsJump: boolean;
    private _state: BirdState;

    constructor(scene: THREE.Scene, initialVelocity: THREE.Vector3, gravity: THREE.Vector3, jumpVelocity: THREE.Vector3) {
        this._mesh = new THREE.Mesh(
            new THREE.SphereGeometry(30, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        );
        this._velocity = initialVelocity.clone();
        this._gravity = gravity.clone();
        scene.add(this._mesh);
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

    public update(deltaSeconds: number) {
        if (this._needsJump && this._state == BirdState.Alive) {
            this._velocity = this._jumpVelocity.clone();
            this._needsJump  = false;
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
