class Bird {
    private _mesh: THREE.Mesh;
    private _velocity: THREE.Vector3;
    private _gravity: THREE.Vector3;
    private _jumpvelocity: THREE.Vector3;
    private needsJump: boolean;

    constructor(scene: THREE.Scene, initialVelocity: THREE.Vector3, gravity: THREE.Vector3, jumpvelocity: THREE.Vector3) {
        this._mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(100, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        );
        this._velocity = initialVelocity.clone();
        this._gravity = gravity.clone();
        scene.add(this._mesh);
        this.needsJump = false;
        this._jumpvelocity = jumpvelocity.clone();
    }

    public update(deltaSeconds: number) {
        if (this.needsJump) {
            this._velocity = this._jumpvelocity.clone();
            this.needsJump  = false;
        }
        this._velocity.addScaledVector(this._gravity, deltaSeconds);
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
    }

    public get position() {
        return this._mesh.position.clone();
    }
    public setNeedsJump() {
        this.needsJump = true;
    }
}
