class StarsBlock {
    private _scene: THREE.Scene;
    private _minX: number;
    private _range: number;
    private _particles: THREE.Points;

    constructor(scene: THREE.Scene, minX: number, range: number) {
        this._scene = scene;
        this._minX = minX;
        this._range = range;
        var geometry = new THREE.Geometry();
        for (var i = 0; i < 10000; ++i) {
            var vertex = new THREE.Vector3();
            vertex.x = THREE.Math.randFloat(minX, minX + range);
            vertex.y = THREE.Math.randFloatSpread(2000);
            vertex.z = THREE.Math.randFloatSpread(1000);
            geometry.vertices.push(vertex);
        }
        this._particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));
        this._scene.add(this._particles)
    }

    public get minX() {
        return this._minX;
    }

    public get maxX() {
        return this._minX + this._range;
    }

    public get range() {
        return this._range;
    }

    public removeFromScene() {
        this._scene.remove(this._particles);
    }
}
