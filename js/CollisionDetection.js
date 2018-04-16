/**
 * Created by valk_ on 15/04/2018.
 */

class CollisionDetection {
    constructor() {
        this.raycasterDown = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
        this.raycasterUp = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0, 10);
        this.raycasterEnemies = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 100);
        this.raycasterForward = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 8);
        this.raycasterBackward = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 8);
        this.raycasterLeft = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 5);
        this.raycasterRight = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 8);
        this.tick = 0;

        this.toggle = 0;
        this.clock = new THREE.Clock();

    }

    DetectOnObject(position, objects) {
        this.raycasterDown.ray.origin.copy(position);
        this.raycasterDown.ray.origin.y -= 10;
        var intersections = this.raycasterDown.intersectObjects(objects, true);
        return intersections.length > 0;
    }

    DetectBelowObject(position, objects) {
        this.raycasterUp.ray.origin.copy(position);
        var intersections = this.raycasterUp.intersectObjects(objects, true);
        return intersections.length > 0;
    }

    DetectEnemies(position, direction, objects, spheres) {
        this.raycasterEnemies.ray.origin.copy(position);
        this.raycasterEnemies.ray.direction.copy(direction);
        //console.log(`Camera Position: X:${position.x} Y:${position.y} Z:${position.z}`);
        //console.log(`Camera Direction: X:${direction.x} Y:${direction.y} Z:${direction.z}`)
        //console.log(`Camera Direction: X:${this.raycasterEnemies.ray.direction.x} Y:${this.raycasterEnemies.ray.direction.y} Z:${this.raycasterEnemies.ray.direction.z}`);

        var intersections = this.raycasterEnemies.intersectObjects(objects, true);
        try {
            /*
             if(intersections.length > 0) {
             console.log('INTERSECTADO');
             }
             */

            var intersection = ( intersections.length ) > 0 ? intersections[0] : null;

            if (this.toggle > 0.02 && intersection !== null) {
                spheres[spheresIndex].position.copy(intersection.point);
                spheres[spheresIndex].scale.set(1, 1, 1);
                spheresIndex = ( spheresIndex + 1 ) % spheres.length;
                this.toggle = 0;
            }

            for (var i = 0; i < spheres.length; i++) {
                var sphere = spheres[i];
                sphere.scale.multiplyScalar(0.98);
                sphere.scale.clampScalar(0.01, 1);
            }

            this.toggle += this.clock.getDelta();

            if (intersections.length > 0) {
                return true
            }
            return false;
        }
        catch (err) {
            console.log(err);
        }

    }

    DetectWalls(position, direction, objects, spheres) {

        this.raycasterLeft.ray.origin.copy(position);
        this.raycasterLeft.ray.origin.y -= 5;
        this.raycasterLeft.ray.direction.copy(direction);
        this.raycasterLeft.ray.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), 1.5708);

        this.raycasterForward.ray.origin.copy(position);
        this.raycasterForward.ray.origin.y -= 5;
        this.raycasterForward.ray.direction.copy(direction);

        this.raycasterBackward.ray.origin.copy(position);
        this.raycasterBackward.ray.origin.y -= 5;
        this.raycasterBackward.ray.direction.copy(direction);
        this.raycasterBackward.ray.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), 3.14159);

        this.raycasterRight.ray.origin.copy(position);
        this.raycasterRight.ray.origin.y -= 5;
        this.raycasterRight.ray.direction.copy(direction);
        this.raycasterRight.ray.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), 4.71239);

        var playerMovement = new PlayerMovement();
        playerMovement.moveForward = !this.DetectIntersections(this.raycasterForward, objects, spheres);
        playerMovement.moveBackward = !this.DetectIntersections(this.raycasterBackward, objects, spheres);
        playerMovement.moveLeft = !this.DetectIntersections(this.raycasterLeft, objects, spheres);
        playerMovement.moveRight = !this.DetectIntersections(this.raycasterRight, objects, spheres);

        this.tick += 1;
        if (this.tick > 100) {
            console.clear();
            this.tick = 0;
        }

        console.log(`Left: ${playerMovement.moveLeft} Front: ${playerMovement.moveForward} Back: ${playerMovement.moveBackward} Right: ${playerMovement.moveRight}`);

        return playerMovement;
    }

    DetectIntersections(rayCaster, objects, spheres) {
        var intersections = rayCaster.intersectObjects(objects, true);
        var intersection = ( intersections.length ) > 0 ? intersections[0] : null;
        if (this.toggle > 0.02 && intersection !== null) {
            spheres[spheresIndex].position.copy(intersection.point);
            spheres[spheresIndex].scale.set(1, 1, 1);
            spheresIndex = ( spheresIndex + 1 ) % spheres.length;
            this.toggle = 0;
        }

        for (var i = 0; i < spheres.length; i++) {
            var sphere = spheres[i];
            sphere.scale.multiplyScalar(0.98);
            sphere.scale.clampScalar(0.01, 1);
        }

        this.toggle += this.clock.getDelta();

        if (intersections.length > 0) {
            return true
        }
        return false;
    }
}