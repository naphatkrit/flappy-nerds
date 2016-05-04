class Updater {
    private _prevTime: number;
    private _bird: Bird;
    private _cameraRig: THREE.Group;
    private _topPlane: Plane;
    private _bottomPlane: Plane;
    private _obstacles: IObstacle[];
    private _scene: THREE.Scene;

    private _rand: lfsr;

    constructor(scene: THREE.Scene, bird: Bird, cameraRig: THREE.Group, topPlane: Plane, bottomPlane: Plane) {
        this._rand = new lfsr(Config.RAND_SEED);
        this._prevTime = Date.now();
        this._nextObstacleTime = this._prevTime + this.obstacleInterval;
        this._bird = bird;
        this._cameraRig = cameraRig;
        this._topPlane = topPlane;
        this._bottomPlane = bottomPlane;
        this._obstacles = [];
        this._scene = scene;
    }

    public update() {
        if (this._bird.mesh == null) {
            return;
        }
        this._generateObstacles();

        var obstacleObjects = new Array<I3DObject>();
        for (var i = 0; i < this._obstacles.length; ++i) {
            obstacleObjects = obstacleObjects.concat(this._obstacles[i].objects);
        }
        obstacleObjects.push(this._topPlane, this._bottomPlane);


        var collision = Collision.collide(this._bird, obstacleObjects);

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

    private _nextObstacleTime: number;

    private get obstacleInterval() {
        return Config.OBSTACLE_INTERVAL + Config.OBSTACLE_RANGE * (this._rand.getNext() * 2 - 1);
    }

    private _generateObstacles() {
        if (this._prevTime > this._nextObstacleTime) {
            this._nextObstacleTime += this.obstacleInterval;

            var xPos = this._bird.mesh.position.x + window.innerWidth/2;

            var boxSize = Config.OBSTACLE_BOX_SIZE + Config.OBSTACLE_BOX_RANGE * (this._rand.getNext() * 2 - 1);
            var yCenter = (Config.MAX_Y - Config.MIN_Y - boxSize)/2 * (this._rand.getNext() * 2 - 1);
            var obstacle = new StandardObstacle(this._scene, new THREE.Box3(new THREE.Vector3(xPos, yCenter - boxSize/2, -100), new THREE.Vector3(xPos + 100, yCenter + boxSize/2, 100)), Config.MIN_Y, Config.MAX_Y);

            this._obstacles.push(obstacle);
        }
    }

    private _nextVisibleOstacle(): IObstacle {
        var xPos = this._bird.mesh.position.x;
        for (var i = 0; i < this._obstacles.length; ++i) {
            if (this._obstacles[i].safeBox.max.x > xPos) {
                return this._obstacles[i];
            }
        }
        return null;
    }
}
