enum Difficulty {
    Easy, Medium, Hard,
}
abstract class Config {
    public static DIFFICULTY = Difficulty.Medium;

    public static VELOCITY = new THREE.Vector3(150, 0, 0);
    public static DEBUG = false;
    public static GRAVITY = new THREE.Vector3(0, -2000, 0);
    public static JUMP_VELOCITY = new THREE.Vector3(Config.VELOCITY.x, 600, 0);
    public static MAX_Y = 400;
    public static MIN_Y = -400;
    public static get OBSTACLE_INTERVAL() {
        switch (Config.DIFFICULTY) {
            case Difficulty.Easy:
                return 5000;
            case Difficulty.Medium:
                return 4000;
            case Difficulty.Hard:
                return 2500;
        }
    }
    public static get OBSTACLE_RANGE() {
        switch (Config.DIFFICULTY) {
            case Difficulty.Easy:
                return 2000;
            case Difficulty.Medium:
                return 1000;
            case Difficulty.Hard:
                return 250;
        }
    }
    public static OBSTACLE_Y_POS_SCALE = 0.9;

    public static RAND_SEED = 35;
    public static get OBSTACLE_BOX_SIZE() {
        switch (Config.DIFFICULTY) {
            case Difficulty.Easy:
                return (Config.MAX_Y - Config.MIN_Y)/ 2.5;
            case Difficulty.Medium:
                return (Config.MAX_Y - Config.MIN_Y)/ 3;
            case Difficulty.Hard:
                return (Config.MAX_Y - Config.MIN_Y)/ 3.5;
        }
    }
    public static OBSTACLE_BOX_RANGE = Config.OBSTACLE_BOX_SIZE / 8;
    public static OBSTACLE_BOX_Y_RANGE = (Config.MAX_Y - Config.MIN_Y - Config.OBSTACLE_BOX_SIZE - Config.OBSTACLE_BOX_RANGE) / 2;

    public static FIRST_PERSON_DISTANCE = 500;

    public static SIDE_CAMERA_OFFSET = 0;
    public static UFO_BIRD_DISTANCE = 300;

    public static BULLET_RADIUS = 7;
    public static BULLET_LENGTH = 30;
    public static BULLET_COLOR = 0xff00ff;
    public static BULLET_SPEED = 500;

    public static BULLET_COST = 1;
    public static BULLET_HIT_REWARD = 3;
    public static DEAD_BIRD_REWARD = 10;
    public static STARS_BLOCK_SIZE = 2000;

    //parameters for the UFO
    public static UFO_BASE_RADIUS = 60;
    public static UFO_UPPER_RADIUS = 30;
    public static UFO_GUN_LENGTH = 50;
    public static UFO_GUN_MUZZLE_LENGTH = 20;
    public static get UFO_BASE_SPPED() {
        switch (Config.DIFFICULTY) {
            case Difficulty.Easy:
                return 1500;
            case Difficulty.Medium:
                return 2000;
            case Difficulty.Hard:
                return 10000;
        }
    }
}
