/**
 * Created by valk on 18/11/2017.
 */
var camera, scene, renderer, light;
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
var gameState = 0;
var ballSprite;
function gameInit() {

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(60, 800 / 600, 1, 1000);
    camera.position.set(0, 0, 70);


    scene = new THREE.Scene();
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

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    var ballTexture = THREE.ImageUtils.loadTexture( 'img/target.png' );
    var ballMaterial = new THREE.SpriteMaterial( { map: ballTexture, fog: true });
    ballSprite = new THREE.Sprite( ballMaterial );
    ballSprite.scale.set( 5, 5, 1.0 );
    ballSprite.position.set( 50, 50, 0 );
    scene.add( ballSprite );
    scene.add(plane);
    $("#game-viewport").append(renderer.domElement);
    animate();
}

var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersectPoint = new THREE.Vector3();

function onDocumentMouseMove( event )
{sss
    mouse.x = ((event.clientX - (renderer.domElement.offsetLeft)) / renderer.domElement.clientWidth) * 2 -1;
    mouse.y = -((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectPoint);
    ballSprite.position.copy(intersectPoint);
    var angle = Radiants2Grads(Math.atan2(player.Position.y - intersectPoint.y, player.Position.x - intersectPoint.x));
    //var angleRadians = player.Position.angleTo(intersectPoint);
    var angleRadians = intersectPoint.angleTo(player.Position);

    player.rotatePlayer(GradsToRadians(-90 + angle));

}

function animate() {

    requestAnimationFrame(animate);
    
    var deltaTime = clock.getDelta();
    gameTime += deltaTime;
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
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    }

    if (gameState == 1) {
        keyboard.update();
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