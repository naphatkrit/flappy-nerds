class MeshObject implements I3DObject {
    private _mesh: THREE.Mesh;
    private _collisionEffect: CollisionEffect;

    constructor(mesh: THREE.Mesh, collisionEffect: CollisionEffect) {
        this._mesh = mesh;
        this._collisionEffect = collisionEffect;
    }

    public get mesh() {
        return this._mesh;
    }

    public get collisionEffect() {
        return this._collisionEffect;
    }

    public update(deltaSeconds: number): void {
    }
}
