abstract class Collision {
    private static rayCaster = new THREE.Raycaster();
    public static collide(src: I3DObject, collidables: I3DObject[]): I3DObject {
        var collidableMeshList = [];
        for (var i = 0; i < collidables.length; ++i) {
            collidableMeshList.push(collidables[i].mesh);
        }

        // TODO this doesn't work for THREE.BufferGeometry
        var geometry = <THREE.Geometry> src.mesh.geometry;

        // adapted from http://stackoverflow.com/questions/11473755/how-to-detect-collision-in-three-js
        for (var vertexIndex = 0; vertexIndex < geometry.vertices.length; vertexIndex++) {
            var localVertex = geometry.vertices[vertexIndex].clone();
            // var globalVertex: THREE.Vector3 = src.mesh.matrix.multiplyVector3(localVertex);
            var globalVertex = localVertex.applyProjection(src.mesh.matrix);
            var directionVector = globalVertex.sub(src.mesh.position);

            this.rayCaster.set(src.mesh.position, directionVector.clone().normalize());
            var collisionResults = this.rayCaster.intersectObjects(collidableMeshList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                var result = collisionResults[0]['object'];
                for (var i = 0; i < collidables.length; ++i) {
                    if (result === collidableMeshList[i]) {
                        return collidables[i];
                    }
                }
                console.warn('Inconsistency in collision detected. Intersected object not in list of collidables.')
                return null;
            }
        }
        return null;
    }
}
