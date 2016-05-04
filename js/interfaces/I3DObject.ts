interface I3DObject {
    mesh: THREE.Mesh;
    update(deltaSeconds: number): void;
}
