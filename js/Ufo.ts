class Ufo implements I3DObject {
    private _mesh: THREE.Mesh = null;
    private _bird: Bird = null;
    private _velocity: THREE.Vector3;
    private _scene: THREE.Scene;
    private _mixer: THREE.AnimationMixer;

    private _needmix: boolean = false;

    constructor(scene: THREE.Scene, bird: Bird, initialVelocity: THREE.Vector3, initialPosition: THREE.Vector3) {
        var texture1 = new THREE.TextureLoader().load("js/textures/wood.jpg");
        var texture2 = new THREE.TextureLoader().load("js/textures/metal.jpg");
        var material1 = new THREE.MeshBasicMaterial(
            {
                map: texture1,
                side: THREE.DoubleSide
            }
        );
        var material2 = new THREE.MeshBasicMaterial(
            {
                map: texture2,
                side: THREE.DoubleSide
            }
        );
        var geometry1 = new THREE.SphereGeometry(60, 30, 30)
        geometry1.applyMatrix(new THREE.Matrix4().makeScale(1.0, 0.4, 1));

        this._mesh = new THREE.Mesh(geometry1, material1)
        this._bird = bird
        this._mesh.position.x = 0
        this._mesh.position.y = -15
        this._mesh.position.z = 0

        var geometry2 = new THREE.SphereGeometry(30, 30, 30)
        this._mesh.updateMatrix()
        geometry2.merge(geometry1, this._mesh.matrix)
        var mesh2 = new THREE.Mesh(geometry2, material2)
        this._mesh = mesh2

        this._velocity = initialVelocity.clone();
        this._scene = scene;
        scene.add(this._mesh);
        this.reset();
    }

    public get mesh() {
        return this._mesh;
    }

    public get collisionEffect() {
        return CollisionEffect.None;
    }

    public update(deltaSeconds: number) {
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
    }

    public removeFromScene() {
        this._scene.remove(this._mesh);
    }

    public reset() {
        this._mesh.position.x = -200
        this._mesh.position.y = 0
        this._mesh.position.z = 0
        this._mesh.updateMatrixWorld(true); // update vertex positions
    }
}
