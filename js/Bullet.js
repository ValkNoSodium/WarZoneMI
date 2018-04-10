/**
 * Created by valk_ on 19/11/2017.
 */
function Bullet(position, rotation) {
    this.Position = new THREE.Vector3().copy(position);
    this.Rotation = new THREE.Euler().copy(rotation);
    this.InitialPosition = new THREE.Vector3();
    this.Mesh = null;
    //State 0 = NEW
    //State 1 = DESTROY
    //State 2 = COLLISION
    this.State = 0;

    this.Init = function () {
        this.Position.z = 15;
        this.InitialPosition.copy(this.Position);

        var material = new THREE.LineBasicMaterial({
            color: 0xFFFFFF
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 2),
        );
        this.Mesh = new THREE.Line(geometry, material);
        this.Mesh.position.copy(this.Position);
        this.Mesh.rotation.copy(this.Rotation);
        this.Mesh.translateX(-2.5);
        this.Mesh.translateY(0);
        this.Mesh.translateZ(5);
    };

    var cycle = 0;
    this.update = function (gameTime) {
        cycle += gameTime;
        this.Mesh.translateZ(2);
        this.Position.copy(this.Mesh.position);
        this.Rotation.copy(this.Mesh.rotation);
        if (cycle > 10) {
            this.State = 1;
            cycle = 0;
        }
    };
}