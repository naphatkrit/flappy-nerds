class Updater {
    private _prevTime: number;
    private _bird: Bird;
    private _ufo: Ufo;
    private _cameraRig: THREE.Group;
    private _topPlane: Plane;
    private _bottomPlane: Plane;
    private _obstacles: IObstacle[];
    private _scene: THREE.Scene;

    private _rand: lfsr;
    private _prevVisibleObstacle: IObstacle = null;
    private _score: number = 0;

    private _watch: Stopwatch;

    public autopilotEnabled = true;
    private _paused = false;

    public get paused() {
        return this._paused;
    }

    public set paused(newValue: boolean) {
        this._paused = newValue;
        if (this._paused) {
            this._watch.stop();
        } else {
            this._watch.start();
        }
    }

    constructor(scene: THREE.Scene, bird: Bird, ufo: Ufo, cameraRig: THREE.Group, topPlane: Plane, bottomPlane: Plane) {
        this._watch = new Stopwatch();
        this._watch.start();
        this._rand = new lfsr(Config.RAND_SEED);
        this._prevTime = this._watch.ms;
        this._nextObstacleTime = this._prevTime + this.obstacleInterval;
        this._bird = bird;
        this._ufo = ufo;
        this._cameraRig = cameraRig;
        this._topPlane = topPlane;
        this._bottomPlane = bottomPlane;
        this._obstacles = [];
        this._scene = scene;
    }

    public update() {
        // it looks like every time we pause, we lose about 0.2 seconds worth of time
        // this is large enough to matter in animation, but too small to matter
        // in obstacles generation
        var currTime = this._watch.ms;
        var deltaSeconds = (currTime - this._prevTime) / 1000;
        this._prevTime = currTime;

        if (this.paused) {
            return;
        }

        if (this._bird.mesh == null) {
            return;
        }

        this._generateObstacles();
        this._cleanObstacles();

        var obstacleObjects = new Array<I3DObject>();
        for (var i = 0; i < this._obstacles.length; ++i) {
            obstacleObjects = obstacleObjects.concat(this._obstacles[i].objects);
        }
        obstacleObjects.push(this._topPlane, this._bottomPlane);

        var collision = Collision.collide(this._bird, obstacleObjects);

        if (collision !== null) {
            if (this._bird.state == BirdState.Alive) {
                console.log('Just died');
                collision = Collision.collide(this._bird, obstacleObjects);
            }
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

        var obstacleBird = this._nextVisibleOstacle(this._bird.mesh.position.x);
        var obstacleUfo = this._nextVisibleOstacle(this._ufo.mesh.position.x);
        if (this._prevVisibleObstacle !== obstacleBird) {
            if (this._prevVisibleObstacle !== null) {
                this.score++;
            }
            this._prevVisibleObstacle = obstacleBird;
        }
        if (this.autopilotEnabled) {
            var controlTarget = obstacleBird === null ? null : obstacleBird.safeBox;
            autopilot.control(this._bird, controlTarget)
        }
        this._topPlane.update(deltaSeconds);
        this._bottomPlane.update(deltaSeconds);
        this._bird.update(deltaSeconds);
        this._ufo.targetbox = (obstacleUfo === null ? null : obstacleUfo.safeBox);
        this._ufo.update(deltaSeconds);
        this._cameraRig.position.x = this._bird.mesh.position.x;
    }

    private get score() {
        return this._score;
    }

    private set score(value: number) {
        this._score = value;
        $('#score').text(this._score);
    }

    public reset() {
        this._rand = new lfsr(Config.RAND_SEED);
        this._prevTime = this._watch.ms;
        this._nextObstacleTime = this._prevTime + this.obstacleInterval;

        this._prevVisibleObstacle = null;

        for (var i = 0; i < this._obstacles.length; ++i) {
            this._obstacles[i].removeFromScene();
        }
        this._obstacles = [];

        this.score = 0;

        this._bird.reset();
        this._topPlane.reset();
        this._bottomPlane.reset();
        this._ufo.reset();
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

    private _nextVisibleOstacle(xPos): IObstacle {
        for (var i = 0; i < this._obstacles.length; ++i) {
            if (this._obstacles[i].safeBox.max.x > xPos) {
                return this._obstacles[i];
            }
        }
        return null;
    }

    private _cleanObstacles() {
        var minXPos = this._bird.mesh.position.x - window.innerWidth/2;
        while (this._obstacles.length > 0 && this._obstacles[0].safeBox.max.x < minXPos) {
            var obstacle = this._obstacles.shift();
            obstacle.removeFromScene();
        }
    }
}
