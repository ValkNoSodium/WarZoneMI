/**
 * Created by valk_ on 10/04/2018.
 */
class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.manager = new THREE.LoadingManager();
        this.onError = function (xhr) {
            console.error(xhr);
        };

        this.onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                //console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        this.manager.onProgress = function (item, loaded, total) {
            //console.log(item, loaded, total);
        };

        this.fbxLoader = new THREE.FBXLoader(this.manager);
        this.fbxLoader.crossOrigin = true;
    }

    load(model, fx) {

        this.fbxLoader.load(
            model,
            fx,
            this.onProgress,
            this.onError);
    }
}