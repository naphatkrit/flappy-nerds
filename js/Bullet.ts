class Bullet implements I3DObject {

    private _velocity: THREE.Vector3;
    private _mesh: THREE.Mesh;
    private _scene: THREE.Scene;

    constructor(scene: THREE.Scene, ray: THREE.Ray, speed: number) {
        this._velocity = ray.direction.clone().setLength(speed);
        var head = new THREE.TextureLoader().load( "js/textures/bullet.jpg" );
        var body = new THREE.TextureLoader().load( "js/textures/cannon.jpg" );
        //syntax: THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
        var geometry_head = new THREE.CylinderGeometry(0, Config.BULLET_RADIUS, Config.BULLET_LENGTH, 20, 1);
        var geometry_body = new THREE.CylinderGeometry(Config.BULLET_RADIUS, Config.BULLET_RADIUS, Config.BULLET_LENGTH, 20, 1);
        var material_head = new THREE.MeshPhongMaterial({ map: head, wireframe: false});
        var material_body = new THREE.MeshPhongMaterial({ map: body, wireframe: false});

        var singleGeometry = new THREE.Geometry();
        //bullet head
        var mesh_head = new THREE.Mesh(
            geometry_head,
            material_head
        );
        var mesh_body = new THREE.Mesh(
            geometry_body,
            material_body
        );

        this._mesh = new THREE.Mesh()
        this._mesh.updateMatrix()
        this._mesh.add(mesh_body)
        this._mesh.add(mesh_head)
        mesh_body.position.y = mesh_head.position.y - 20;

        this._mesh.rotateZ(-Math.PI/2);
        this._mesh.position.copy(ray.origin);
        scene.add(this._mesh);
        this._mesh.updateMatrixWorld(true);
        this._scene = scene;
    }

    public update(deltaSeconds: number): void {
        this._mesh.position.addScaledVector(this._velocity, deltaSeconds);
    }

    public get mesh() {
        return this._mesh;
    }

    public get collisionEffect() {
        return CollisionEffect.None;
    }

    public reset() {
    }

    public removeFromScene() {
        this._scene.remove(this._mesh);
    }
}
