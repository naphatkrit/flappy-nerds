interface I3DObject {
    mesh: THREE.Mesh;
    collisionEffect: CollisionEffect;
    update(deltaSeconds: number): void;
}
