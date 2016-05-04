class Plane implements I3DObject {

    private _mesh: THREE.Mesh;
    private _velocity: THREE.Vector3;

    constructor(scene: THREE.Scene, y: number, velocity: THREE.Vector3) {
        this._mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: false})
        );
        this._mesh.translateY(y);
        this._mesh.rotateX((y > 0 ? 1 : -1) * Math.PI / 2.0);
        // force the transforms to take effect right away, important for collision detection
        this._mesh.updateMatrixWorld(true);
        this._velocity = velocity.clone();
        scene.add(this._mesh);
    }

    public get mesh() {
        return this._mesh;
    }

    public update(deltaSeconds: number) {
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
    }
}
