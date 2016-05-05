class StandardObstacle implements IObstacle {

    private _topObject: I3DObject;
    private _bottomObject: I3DObject;
    private _safeBox: THREE.Box3;
    private _scene: THREE.Scene;

    constructor(scene: THREE.Scene, boundingBox: THREE.Box3, minY: number, maxY: number) {
        //var material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false});
        var texture = new THREE.TextureLoader().load( "js/textures/wood.jpg" );
        var material = new THREE.MeshLambertMaterial(
            {map: texture,
            side: THREE.DoubleSide,
            emissive: 0x331a00,
            emissiveIntensity: 0.7}
            );
        var topBox = new THREE.BoxGeometry(boundingBox.max.x - boundingBox.min.x, maxY - boundingBox.max.y, boundingBox.max.z - boundingBox.min.z);
        var topMesh = new THREE.Mesh(topBox, material);

        topMesh.translateY(maxY - topBox.parameters.height / 2);
        topMesh.translateX(boundingBox.min.x);

        var bottomBox = new THREE.BoxGeometry(boundingBox.max.x - boundingBox.min.x, boundingBox.min.y - minY, boundingBox.max.z - boundingBox.min.z);
        var bottomMesh = new THREE.Mesh(bottomBox, material);
        bottomMesh.translateY(minY + bottomBox.parameters.height / 2);
        bottomMesh.translateX(boundingBox.min.x);

        scene.add(topMesh);
        scene.add(bottomMesh);
        topMesh.updateMatrixWorld(true);
        bottomMesh.updateMatrixWorld(true);

        this._topObject = new MeshObject(topMesh, CollisionEffect.Fall);
        this._bottomObject = new MeshObject(bottomMesh, CollisionEffect.Stop);
        this._safeBox = boundingBox;
        this._scene = scene;
    }

    public get objects() {
        return [this._topObject, this._bottomObject];
    }

    public get type() {
        return ObstacleType.Standard;
    }

    public get safeBox() {
        return this._safeBox;
    }

    public update(deltaSeconds: number) {
    }

    public removeFromScene() {
        this._scene.remove(this._topObject.mesh);
        this._scene.remove(this._bottomObject.mesh);
    }
}
