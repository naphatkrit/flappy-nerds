class Ufo implements I3DObject {
    private _mesh: THREE.Mesh = null;
    private _bird: Bird = null;
    private _velocity: THREE.Vector3;
    private _scene: THREE.Scene;
    private _mixer: THREE.AnimationMixer;
    private _needmix: boolean = false;
    private _targetbox: THREE.Box3 = null;

    constructor(scene: THREE.Scene, bird: Bird, initialVelocity: THREE.Vector3, initialPosition: THREE.Vector3) {
        var textureUfoBase = new THREE.TextureLoader().load("js/textures/metal.jpg");
        var textureUfoUpper = new THREE.TextureLoader().load("js/textures/water.jpg");
        var materialUfoBase = new THREE.MeshPhongMaterial(
            {
                map: textureUfoBase,
            }
        );
        var materialUfoUpper = new THREE.MeshPhongMaterial(
            {
                map: textureUfoUpper,
                emissive: 0x007a99,
            }
        );
        var geometryUfoBase = new THREE.SphereGeometry(60, 30, 30)
        geometryUfoBase.applyMatrix(new THREE.Matrix4().makeScale(1.0, 0.4, 1));
        var meshUfoBase = new THREE.Mesh(geometryUfoBase, materialUfoBase)

        var geometryUfoUpper = new THREE.SphereGeometry(30, 30, 30)
        var meshUfoUpper = new THREE.Mesh(geometryUfoUpper, materialUfoUpper)

        this._mesh = new THREE.Mesh()
        this._mesh.updateMatrix()
        this._mesh.add(meshUfoBase)
        this._mesh.add(meshUfoUpper)
        meshUfoUpper.position.y = 15

        this._bird = bird
        this._velocity = initialVelocity.clone();
        this._scene = scene;
        scene.add(this._mesh);
        this.reset();
    }

    private getTargetHeight(box: THREE.Box3): number {
        if (box == null) {
            return 0;
        }

        var ymin: number = box.min.y
        var ymax: number = box.max.y

        return (ymax + ymin) / 2.0
    }

    public get mesh() {
        return this._mesh;
    }

    public get collisionEffect() {
        return CollisionEffect.None;
    }

    public set targetbox(target: THREE.Box3) {
        this._targetbox = target
    }

    public update(deltaSeconds: number) {
        var ufoPosY: number = this._mesh.position.y
        var disDiff: number = ufoPosY - this.getTargetHeight(this._targetbox)
        if (disDiff < - 10 || disDiff > 10) {
            this._velocity.y = - 1000 * disDiff / (Config.MAX_Y - Config.MIN_Y)
        }
        else {
            this._velocity.y = 0
        }
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
    }

    public removeFromScene() {
        this._scene.remove(this._mesh);
    }

    public reset() {
        this._mesh.position.x = -Config.UFO_BIRD_DISTANCE
        this._mesh.position.y = 0
        this._mesh.position.z = 0
        this._mesh.updateMatrixWorld(true); // update vertex positions
    }
}
