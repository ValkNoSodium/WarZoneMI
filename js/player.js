/**
 * Created by valk on 18/11/2017.
 */
/*
Player State
0 = Stand
1 = Walking
2 = Shooting
3 = Damaged
4 = Dead
 */
function Player() {
    this.Life = 100;
    this.State = 0;
    this.Ammo = 100;
    this.ModelShooting = null;
    this.ModelStand = null;
    this.ModelWalking = null;
    this.ModelDamaged = null;
    this.ModelDead = null;
    this.Cycle = 0;
    this.Position = new THREE.Vector3();
    this.Rotation = new THREE.Euler();
    this.Mixers = [];
    this.ClipActionShoot = null;
    this.Bullets = [];

    this.IsReady = false;

    this.getMesh = function () {
        if (this.State == 0) {
            return this.ModelStand;
        }
        else if (this.State == 1) {
            return this.ModelWalking;
        }
        else if (this.State == 2) {
            return this.ModelShooting;
        }
        else if (this.State == 3) {
            return this.ModelDamaged;
        }
        else if (this.State == 4) {
            return this.ModelDead;
        }
    };

    this.setModel = function (model, state) {

        model.scale.x = 0.03;
        model.scale.y = 0.03;
        model.scale.z = 0.03;
        model.rotateX(GradsToRadians(90));
        model.rotateY(GradsToRadians(90));

        if (state == 0) {
            this.ModelStand = model;
        }
        else if (state == 1) {
            this.ModelWalking = model;
        }
        else if (state == 2) {
            this.ModelShooting = model;
            this.ModelShooting.mixer = new THREE.AnimationMixer(this.ModelShooting);
            this.Mixers.push(this.ModelShooting.mixer);

            this.ClipActionShoot = this.ModelShooting.mixer.clipAction(this.ModelShooting.animations[0]);
            this.ClipActionShoot.setLoop(THREE.LoopOnce);
            this.ClipActionShoot.timeScale = 2;

            this.ModelShooting.mixer.addEventListener('finished', (e) => {
                this.State = 0;
                this.ClipActionShoot.stop();
            });
        }
        else if (state == 3) {
            this.ModelDamaged = model;
        }
        else if (state == 4) {
            this.ModelDead = model;
        }

        if (this.ModelShooting != null && this.ModelStand != null && this.ModelWalking != null && this.ModelDamaged != null && this.ModelDead != null) {
            this.IsReady = true;
        }
    }

    this.update = function (gameTime, keyboard) {
        this.Cycle += gameTime;
        var o = this.getMesh();
        var moveDistance = 0;
        var rotateAngle = (Math.PI / 1 * gameTime);   // pi/2 radians (90 degrees) per second

        if (this.ClipActionShoot.isRunning() == false) {
            if (keyboard.pressed("W")) {
                moveDistance = 0.5;
            }
            if (keyboard.pressed("S")) {
                moveDistance = -0.5;
            }
            if (keyboard.pressed("A")) {
                o.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
            }
            if (keyboard.pressed("D")) {
                o.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
            }
            if(keyboard.pressed("P")) {
                $("#myModal").modal()
            }

            o.translateZ(moveDistance);

            if (moveDistance != 0) {
                this.State = 1;
            } else {
                this.State = 0;
            }
        }

        this.Position.copy(o.position);
        this.Rotation.copy(o.rotation);

        //if (this.ClipActionShoot.isRunning() === false) {
        if (keyboard.down("Q")) {
            this.State = 2;
            this.ClipActionShoot.reset();
            var b = new Bullet(this.Position, this.Rotation);
            b.Init();
            this.Bullets.push(b);
            this.ClipActionShoot.play();
        }
        //}

        if (this.Mixers.length > 0) {
            for (var i = 0; i < mixers.length; i++) {
                if (this.Mixers[i] != null) {
                    this.Mixers[i].update(gameTime);
                }
            }
        }

        if (this.Bullets.length > 0) {
            for (var i = 0; i < this.Bullets.length; i++) {
                this.Bullets[i].update(gameTime);
            }
        }

        this.updateMeshes();
    }

    this.updateMeshes = function () {
        //POSITION
        this.ModelShooting.position.copy(this.Position);
        this.ModelStand.position.copy(this.Position);
        this.ModelWalking.position.copy(this.Position);
        this.ModelDamaged.position.copy(this.Position);
        this.ModelDead.position.copy(this.Position);
        //ROTATION
        this.ModelShooting.rotation.copy(this.Rotation);
        this.ModelStand.rotation.copy(this.Rotation);
        this.ModelWalking.rotation.copy(this.Rotation);
        this.ModelDamaged.rotation.copy(this.Rotation);
        this.ModelDead.rotation.copy(this.Rotation);
    }

    this.rotatePlayer = function (rotation) {
        this.getMesh().rotation.y = rotation;
    }
}