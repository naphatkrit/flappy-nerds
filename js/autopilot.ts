abstract class autopilot {

    private static getTargetHeight(box:THREE.Box3):number{
        if (box == null) {
            return 0;
        }

        var ymin:number = box.min.y
        var ymax:number = box.max.y

        return ymin;
        // return (ymax + ymin) / 2.0
    }

    public static control(bird:Bird, targetBox:THREE.Box3) {
        var birdPosY: number = bird.mesh.position.y
        var height = bird.height
        if ((birdPosY - this.getTargetHeight(targetBox)) - height < 30) {
            bird.setNeedsJump()
        }
    }
}
