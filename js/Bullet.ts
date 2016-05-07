class Bullet implements I3DObject {

    private _velocity: THREE.Vector3;
    private _mesh: THREE.Mesh;
    private _scene: THREE.Scene;

    constructor(scene: THREE.Scene, ray: THREE.Ray, speed: number) {
        this._velocity = ray.direction.clone().setLength(speed);
        this._mesh = new THREE.Mesh(
            new THREE.SphereGeometry(Config.BULLET_RADIUS),
            new THREE.MeshPhongMaterial({ color: Config.BULLET_COLOR, wireframe: false})
        )
        this._mesh.position.copy(ray.origin);
        scene.add(this._mesh);
        this._mesh.updateMatrixWorld(true);
        this._scene = scene;
    }

    public update(deltaSeconds: number): void {
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
    }

    public get mesh() {
        return this._mesh;
    }

    public get collisionEffect() {
        return CollisionEffect.None;
    }

    public reset() {
    }

    public removeFromScene() {
        this._scene.remove(this._mesh);
    }
}
