abstract class autopilot {
	private static thresh:number = 0.0

	private static getTargetHeight(box:THREE.Box3):number{
		var ymin:number = box.min.y
		var ymax:number = box.max.y

		return (ymax + ymin) / 2.0
	}

	public static control(bird:Bird, targetBox:THREE.Box3) {
		var birdPosY: number = bird.mesh.position.y
		if ((birdPosY - this.getTargetHeight(targetBox)) < this.thresh) {
			bird.setNeedsJump() 
		}
	}
}