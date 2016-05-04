class MeshObject implements I3DObject {
    private _mesh: THREE.Mesh;

    constructor(mesh: THREE.Mesh) {
        this._mesh = mesh;
    }

    public get mesh() {
        return this._mesh;
    }

    public update(deltaSeconds: number): void {
    }
}
