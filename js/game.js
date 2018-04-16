/**
 * Created by valk on 18/11/2017.
 */
var camera, scene, renderer, light, controls;
var clock;
var gameTime = 0;
var player = null;
var manager, onError, onProgress;
var fbxLoader;
var keyboard = new KeyboardState();
var mixers = [];
var enemies = [];
var cycle = 0;

/*
GameState
0 = NotReady
1 = Ready
2 = Pause
3 = Ended
4 = GameOver
 */
var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

var gameState = 0;
var ballSprite;
function gameInit() {

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
    controls = new THREE.PointerLockControls( camera );

    scene = new THREE.Scene();
    scene.add(controls.getObject());
    //

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    //
    scene.background = new THREE.Color(0x000000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(640, 480);
    light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);

    manager = new THREE.LoadingManager();
    onError = function (xhr) {
        console.error(xhr);
    };
    onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };
    fbxLoader = new THREE.FBXLoader(manager);
    fbxLoader.crossOrigin = true;


    var ballTexture = THREE.ImageUtils.loadTexture( 'img/target.png' );
    var ballMaterial = new THREE.SpriteMaterial( { map: ballTexture, fog: true });
    ballSprite = new THREE.Sprite( ballMaterial );
    ballSprite.scale.set( 5, 5, 1.0 );
    ballSprite.position.set( 50, 50, 0 );
    scene.add( ballSprite );
    //scene.add(plane);

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if(!havePointerLock) {
        alert('No hay pointer lock');
        return;
    }
    var element = document.getElementById('game-viewport');

    var pointerlockchange = function (event) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controlsEnabled = true;
            controls.enabled = true;
        } else {

            controls.enabled = false;
        }

    };

    var pointerlockerror = function ( event ) {


    };

    element.addEventListener( 'pointerlockchange', pointerlockchange, false );
    element.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    element.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    element.addEventListener( 'pointerlockerror', pointerlockerror, false );
    element.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    element.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    element.addEventListener( 'click', function ( event ) {

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

    }, false );





    $("#game-viewport").append(renderer.domElement);
    animate();
}

var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersectPoint = new THREE.Vector3();

function animate() {

    requestAnimationFrame(animate);
    
    var deltaTime = clock.getDelta();
    gameTime += deltaTime;
    //
    if ( controlsEnabled === true ) {

        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects( objects );

        var onObject = intersections.length > 0;

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveLeft ) - Number( moveRight );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        if ( onObject === true ) {

            velocity.y = Math.max( 0, velocity.y );
            canJump = true;

        }

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

        prevTime = time;

    }

    //
    render();
    gameUpdate(deltaTime);

}

function gameUpdate(gameTime) {
    if (player == null) {
        player = new Player();

        fbxLoader.load('models/SoldierWalk.fbx', function (o) {
            player.setModel(o, 1);
            o.mixer = new THREE.AnimationMixer(o);
            mixers.push(o.mixer);
            o.mixer.clipAction(o.animations[0]).play();
        }, onProgress, onError);

        fbxLoader.load('models/SoldierTakeDamage.fbx', function (o) {
            player.setModel(o, 3);
        }, onProgress, onError);

        fbxLoader.load('models/SoldierStand.fbx', function (o) {
            player.setModel(o, 0);
            o.mixer = new THREE.AnimationMixer(o);
            mixers.push(o.mixer);
            o.mixer.clipAction(o.animations[0]).play();
        }, onProgress, onError);

        fbxLoader.load('models/SoldierShoot.fbx', function (o) {
            player.setModel(o, 2);
        }, onProgress, onError);

        fbxLoader.load('models/SoldierDeath.fbx', function (o) {
            player.setModel(o, 4);
        }, onProgress, onError);
    }

    if (player.IsReady == true && gameState == 0) {
        gameState = 1;
        //document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    }

    if (gameState == 1) {
        //keyboard.update();
        scene.remove(player.getMesh());
        player.update(gameTime, keyboard);

        if(player.Bullets.length > 0) {
            for(var i = 0; i < player.Bullets.length; i++) {
                var b = player.Bullets[i];
                if(b.State == 0) {
                    scene.add(b.Mesh);
                    b.State = 1;
                }

                if(b.State == 3 || b.State == 2) {
                    scene.remove(b.Mesh);
                }
            }
        }

        scene.add(player.getMesh());
        gameProcess(gameTime);
    }

    if (mixers.length > 0) {
        for (var i = 0; i < mixers.length; i++) {
            mixers[i].update(gameTime);
        }
    }
}

function render() {
    renderer.render(scene, camera);
}

function gameProcess(gameTime){
    cycle += gameTime;
    if(cycle > 5) {
        cycle = 0;
        var enemy = new Enemy();
        enemy.Init();
        scene.add(enemy.Mesh);
        enemies.push(enemy);
    }

    for(var i = 0; i < enemies.length; i++) {
        enemies[i].update(gameTime);
    }
}