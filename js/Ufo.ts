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
        var materialUfoGun = new THREE.MeshPhongMaterial(
            {
                map: textureUfoBase,
                emissive: 0x999900,
                emissiveIntensity: 0.3,
            }
        );
        var geometryUfoBase = new THREE.SphereGeometry(Config.UFO_BASE_RADIUS, 15, 15)
        geometryUfoBase.applyMatrix(new THREE.Matrix4().makeScale(1.0, 0.4, 1));
        var meshUfoBase = new THREE.Mesh(geometryUfoBase, materialUfoBase)

        var geometryUfoUpper = new THREE.SphereGeometry(Config.UFO_UPPER_RADIUS, 15, 15)
        var meshUfoUpper = new THREE.Mesh(geometryUfoUpper, materialUfoUpper)

        var geometryUfoGun1 = new THREE.CylinderGeometry(12, 12, Config.UFO_GUN_LENGTH + 20)
        geometryUfoGun1.rotateZ(-Math.PI / 2)
        var meshUfoGun1 = new THREE.Mesh(geometryUfoGun1, materialUfoGun)
        var geometryUfoGun2 = new THREE.CylinderGeometry(10, 10, Config.UFO_GUN_MUZZLE_LENGTH)
        geometryUfoGun2.rotateZ(-Math.PI / 2)
        var meshUfoGun2 = new THREE.Mesh(geometryUfoGun2, new THREE.MeshBasicMaterial({color:0x000000}))
        var geometryUfoGun3 = new THREE.CylinderGeometry(15, 15, Config.UFO_GUN_MUZZLE_LENGTH)
        geometryUfoGun3.rotateZ(-Math.PI / 2)
        var meshUfoGun3 = new THREE.Mesh(geometryUfoGun3, materialUfoGun)
        //meshUfoGun1.position.x = 60
        //meshUfoGun1.updateMatrix()
        //geometryUfoBase.merge(geometryUfoGun1, meshUfoGun1.matrix)
        //var meshUfoBase = new THREE.Mesh(geometryUfoBase, materialUfoBase)


        this._mesh = new THREE.Mesh()
        this._mesh.updateMatrix()
        this._mesh.add(meshUfoBase)
        this._mesh.add(meshUfoUpper)
        this._mesh.add(meshUfoGun1)
        this._mesh.add(meshUfoGun2)
        this._mesh.add(meshUfoGun3)
        meshUfoGun1.position.x = Config.UFO_BASE_RADIUS + Config.UFO_GUN_LENGTH / 2.0
        meshUfoGun2.position.x = Config.UFO_BASE_RADIUS + Config.UFO_GUN_LENGTH + Config.UFO_GUN_MUZZLE_LENGTH / 2.0
        meshUfoGun3.position.x = Config.UFO_BASE_RADIUS + Config.UFO_GUN_LENGTH + Config.UFO_GUN_MUZZLE_LENGTH / 2.0
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

    public getBulletPos() : THREE.Vector3 {
        var tmp: THREE.Vector3 = new THREE.Vector3(110, 0, 0)
        return this._mesh.position.clone().add(tmp)
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
