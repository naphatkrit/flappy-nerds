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

    public update() {

        var collision = Collision.collide(this._bird, [this._topPlane, this._bottomPlane]);

        if (collision !== null) {
            switch (collision.collisionEffect) {
                case CollisionEffect.None:
                    break;
                case CollisionEffect.Fall:
                    this._bird.fall();
                    this._topPlane.stop();
                    this._bottomPlane.stop();
                    break;
                case CollisionEffect.Stop:
                    this._bird.die();
                    this._topPlane.stop();
                    this._bottomPlane.stop();
                    return;
            }
        }

        var currTime = Date.now();
        var deltaSeconds = (currTime - this._prevTime) / 1000;

        this._prevTime = currTime;
        this._topPlane.update(deltaSeconds);
        this._bottomPlane.update(deltaSeconds);
        this._bird.update(deltaSeconds);
        this._cameraRig.position.x = this._bird.mesh.position.x;
    }
}
