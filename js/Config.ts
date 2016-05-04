abstract class Config {
    public static VELOCITY = new THREE.Vector3(100, 0, 0);
    public static DEBUG = true;
    public static GRAVITY = new THREE.Vector3(0, -2000, 0);
    public static JUMP_VELOCITY = new THREE.Vector3(100, 600, 0);
    public static MAX_Y = 400;
    public static MIN_Y = -400;
    public static OBSTACLE_INTERVAL = 4500;
    public static OBSTACLE_RANGE = 1500;
    public static RAND_SEED = 35;
    public static OBSTACLE_BOX_SIZE = (Config.MAX_Y - Config.MIN_Y)/3;
    public static OBSTACLE_BOX_RANGE = Config.OBSTACLE_BOX_SIZE / 4;
    public static OBSTACLE_BOX_Y_RANGE = (Config.MAX_Y - Config.MIN_Y - Config.OBSTACLE_BOX_SIZE - Config.OBSTACLE_BOX_RANGE) / 2;
}
