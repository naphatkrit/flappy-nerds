class StandardObstacle implements IObstacle {

    private _topObject: I3DObject
    private _bottomObject: I3DObject

    constructor(scene: THREE.Scene, boundingBox: THREE.Box3, minY: number, maxY: number) {
        var material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false});
        var topBox = new THREE.BoxGeometry(boundingBox.max.x - boundingBox.min.x, maxY - boundingBox.max.y, boundingBox.max.z - boundingBox.min.z);
        var topMesh = new THREE.Mesh(topBox, material);

        topMesh.translateY(maxY - topBox.parameters.height / 2);

        var bottomBox = new THREE.BoxGeometry(boundingBox.max.x - boundingBox.min.x, boundingBox.min.y - minY, boundingBox.max.z - boundingBox.min.z);
        var bottomMesh = new THREE.Mesh(bottomBox, material);
        bottomMesh.translateY(minY + bottomBox.parameters.height / 2);

        scene.add(topMesh);
        scene.add(bottomMesh);
        topMesh.updateMatrixWorld(true);
        bottomMesh.updateMatrixWorld(true);

        this._topObject = new MeshObject(topMesh);
        this._bottomObject = new MeshObject(bottomMesh);
    }

    public get objects() {
        return [this._topObject, this._bottomObject];
    }

    public get type() {
        return ObstacleType.Standard;
    }

    public update(deltaSeconds: number) {
    }
}
