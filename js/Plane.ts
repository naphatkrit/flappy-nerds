class Plane implements I3DObject {

    private _mesh: THREE.Mesh;
    private _velocity: THREE.Vector3;
    private _initialVelocity: THREE.Vector3;
    private _collisionEffect: CollisionEffect;
    private _texture: THREE.Texture;
    private _size: number;

    constructor(scene: THREE.Scene, y: number, velocity: THREE.Vector3, collisionEffect: CollisionEffect) {
        var texture = new THREE.TextureLoader().load( "js/textures/water.jpg" );
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        this._size = window.innerWidth * 1.5;
        this._mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(this._size, this._size, 1, 1),
            new THREE.MeshPhongMaterial({ map: texture, wireframe: false})
        );
        this._texture = texture;
        this._mesh.translateY(y);
        this._mesh.rotateX((y > 0 ? 1 : -1) * Math.PI / 2.0);
        // force the transforms to take effect right away, important for collision detection
        this._mesh.updateMatrixWorld(true);
        this._initialVelocity = velocity.clone();
        this._collisionEffect = collisionEffect;
        scene.add(this._mesh);
        this.reset();
    }

    public get mesh() {
        return this._mesh;
    }

    public get collisionEffect() {
        return this._collisionEffect;
    }

    public update(deltaSeconds: number) {
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
        this._texture.offset.x = (this._texture.offset.x + this._velocity.x * deltaSeconds / this._size);
    }

    public stop() {
        this._velocity.set(0, 0, 0);
    }

    public reset() {
        this._velocity = this._initialVelocity.clone();
        this._mesh.position.x = 0;
        this._mesh.position.z = 0;
        this._mesh.updateMatrixWorld(true); // update vertex positions
        this._texture.offset.x = 0;
    }

}
