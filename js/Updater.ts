class Updater {
    private _prevTime: number;
    private _bird: Bird;
    private _ufo: Ufo;
    private _cameraRig: THREE.Group;
    private _firstPersonCam: THREE.Camera
    private _topPlane: Plane;
    private _bottomPlane: Plane;
    private _obstacles: IObstacle[];
    private _bullets: Bullet[];
    private _scene: THREE.Scene;
    private _needsShoot = false;

    private _rand: lfsr;
    private _prevVisibleObstacle: IObstacle = null;
    private _birdScore: number = 0;
    private _ufoScore: number = 0;

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

    constructor(scene: THREE.Scene, bird: Bird, ufo: Ufo, cameraRig: THREE.Group, firstPersonCam: THREE.Camera, topPlane: Plane, bottomPlane: Plane) {
        this._watch = new Stopwatch();
        this._watch.start();
        this._rand = new lfsr(Config.RAND_SEED);
        this._prevTime = this._watch.ms;
        this._nextObstacleTime = this._prevTime + this.obstacleInterval;
        this._bird = bird;
        this._ufo = ufo;
        this._cameraRig = cameraRig;
        this._firstPersonCam = firstPersonCam;
        this._topPlane = topPlane;
        this._bottomPlane = bottomPlane;
        this._obstacles = [];
        this._bullets = [];
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

        if (this._needsShoot) {
            this.shoot();
            this._needsShoot = false;
        }
        this._cleanBullets();

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

        for (var i = 0; i < this._bullets.length; ++i) {
            var kill = false;
            if (this._bullets[i].mesh.position.distanceTo(this._bird.mesh.position) < Config.BULLET_RADIUS + this._bird.boundingRadius) {
                this.ufoScore++;
                kill = true;
            } else {
                var bulletCollision = Collision.collide(this._bullets[i], obstacleObjects);
                if (bulletCollision !== null) {
                    kill = true;
                }
            }
            if (kill) {
                this._bullets[i].removeFromScene();
                this._bullets.splice(i, 1);
                i -= 1;
            }
        }

        var obstacleBird = this._nextVisibleOstacle(this._bird.mesh.position.x);
        var obstacleUfo = this._nextVisibleOstacle(this._ufo.mesh.position.x);
        if (this._prevVisibleObstacle !== obstacleBird) {
            if (this._prevVisibleObstacle !== null) {
                this.birdScore++;
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
        for (var i = 0; i < this._bullets.length; ++i) {
            this._bullets[i].update(deltaSeconds);
        }
        this._cameraRig.position.x = this._bird.mesh.position.x;
        this._firstPersonCam.position.y = this._ufo.mesh.position.y;
    }

    private get birdScore() {
        return this._birdScore;
    }

    private set birdScore(value: number) {
        this._birdScore = value;
        $('#score').text(this._birdScore);
    }

    private get ufoScore() {
        return this._ufoScore;
    }

    private set ufoScore(value: number) {
        this._ufoScore = value;
        $('#ufo-score').text(this._ufoScore);
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

        this.birdScore = 0;

        this._bird.reset();
        this._topPlane.reset();
        this._bottomPlane.reset();
        this._ufo.reset();
        this._cameraRig.position.x = this._bird.mesh.position.x;
    }

    private shoot() {
        var bullet = new Bullet(this._scene, new THREE.Ray(this._ufo.mesh.position, new THREE.Vector3(1, 0, 0)), Config.BULLET_SPEED);
        this._bullets.push(bullet);
    }

    public setNeedsShoot() {
        this._needsShoot = true;
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

    private _cleanBullets() {
        var maxXPos = this._bird.mesh.position.x + window.innerWidth/2;
        while (this._bullets.length > 0 && this._bullets[0].mesh.position.x > maxXPos) {
            var bullet = this._bullets.shift();
            bullet.removeFromScene();
        }
    }
}
