interface IObstacle {
    type: ObstacleType;
    objects: I3DObject[];
    update(deltaSeconds: number): void;
}
