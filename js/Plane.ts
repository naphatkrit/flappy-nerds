class Plane implements I3DObject {

    private _mesh: THREE.Mesh;
    private _velocity: THREE.Vector3;
    private _collisionEffect: CollisionEffect;

    constructor(scene: THREE.Scene, y: number, velocity: THREE.Vector3, collisionEffect: CollisionEffect) {
        //var texture = new THREE.TextureLoader().load( "js/textures/water.jpg" );
        this._mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(window.innerWidth, window.innerWidth, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xEB7D07, wireframe: false})
        );
        this._mesh.translateY(y);
        this._mesh.rotateX((y > 0 ? 1 : -1) * Math.PI / 2.0);
        // force the transforms to take effect right away, important for collision detection
        this._mesh.updateMatrixWorld(true);
        this._velocity = velocity.clone();
        this._collisionEffect = collisionEffect;
        scene.add(this._mesh);
    }

    public get mesh() {
        return this._mesh;
    }

    public get collisionEffect() {
        return this._collisionEffect;
    }

    public update(deltaSeconds: number) {
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
    }

    public stop() {
        this._velocity.set(0, 0, 0);
    }

}
