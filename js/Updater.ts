class Updater {
    private _prevTime: number;
    private _bird: Bird;
    private _cameraRig: THREE.Group;
    private _topPlane: Plane;
    private _bottomPlane: Plane;

    constructor(bird: Bird, cameraRig: THREE.Group, topPlane: Plane, bottomPlane: Plane) {
        this._prevTime = Date.now();
        this._bird = bird;
        this._cameraRig = cameraRig;
        this._topPlane = topPlane;
        this._bottomPlane = bottomPlane;
    }

    private _detectCollisions() {
        if (Collision.collide(this._bird, [this._topPlane, this._bottomPlane])) {
            this._bird.removeFromScene();
        }
    }

    public update() {
        this._detectCollisions();
        var currTime = Date.now();
        var deltaSeconds = (currTime - this._prevTime) / 1000;
        this._prevTime = currTime;
        this._topPlane.update(deltaSeconds);
        this._bottomPlane.update(deltaSeconds);
        this._bird.update(deltaSeconds);
        this._cameraRig.position.x = this._bird.mesh.position.x;
    }
}
