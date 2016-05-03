class Updater {
    private _prevTime: number;
    private _bird: Bird;
    private _cameraRig: THREE.Group;

    constructor(bird: Bird, cameraRig: THREE.Group) {
        this._prevTime = Date.now();
        this._bird = bird;
        this._cameraRig = cameraRig;
    }

    public update() {
        var currTime = Date.now();
        var deltaSeconds = (currTime - this._prevTime) / 1000;
        this._prevTime = currTime;
        this._bird.update(deltaSeconds);
        this._cameraRig.position.x = this._bird.position.x;
    }
}
