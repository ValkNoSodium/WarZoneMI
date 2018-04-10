/**
 * Created by valk_ on 19/11/2017.
 */
function Enemy() {
    this.Position = new THREE.Vector3();
    this.Rotation = new THREE.Euler();
    this.Life = 3;
    this.Mesh = null;
    this.Cycle = 0;
    this.Init = function () {

        var geometry = new THREE.BoxGeometry(5, 5, 5);
        var material = new THREE.MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: true
        } )
        this.Mesh = new THREE.Mesh(geometry, material);
        //NÚMERO ALEATORIO ENTRE 1 Y 10
        var posX = Math.floor((Math.random() * 10) + 1);
        var posY = Math.floor((Math.random() * 10) + 1);
        this.Mesh.position.x = RandomCoordinate();
        this.Mesh.position.y = RandomCoordinate();
        this.Mesh.position.z = 5;
    }

    var rotation = 0;

    this.update = function (gameTime) {
        this.Cycle += gameTime;
        this.Position.copy(this.Mesh.position);
        this.Rotation.copy(this.Mesh.rotation);
        rotation+= 1;
        this.Mesh.rotation.x = (GradsToRadians(rotation));
        this.Mesh.rotation.y = (GradsToRadians(rotation));
        this.Mesh.rotation.z = (GradsToRadians(rotation));
    }
}
