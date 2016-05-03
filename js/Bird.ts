class Bird {
    private _mesh: THREE.Mesh
    private _velocity: THREE.Vector3

    constructor(scene: THREE.Scene, initialVelocity: THREE.Vector3) {
        this._mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(100, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        );
        this._velocity = initialVelocity.clone();
        scene.add(this._mesh);
    }

    public update(deltaSeconds: number) {
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
    }

    public get position() {
        return this._mesh.position.clone();
    }
}
