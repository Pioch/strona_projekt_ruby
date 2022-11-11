"use strict";
var CameraType;
(function (CameraType) {
    CameraType[CameraType["Orthographic"] = 0] = "Orthographic";
    CameraType[CameraType["Perspective"] = 1] = "Perspective";
})(CameraType || (CameraType = {}));

class Blender {
    constructor(divName, glbfile, options) {
        this.gltf = null;
        this.scena = new Scena(divName, options);
        this.animation = null;
        this.scena.renderLoop();
        if(glbfile)
            this.loadGltfFile(glbfile);
    }


    loadGltfFile(fileName) {
        return new Promise((resolved, reject) => {
            const gltfLoader = new THREE.GLTFLoader();
            
            if(fileName.includes('draco')) {
                const dracoLoader = new THREE.DRACOLoader();
                dracoLoader.setDecoderPath( 'js/draco/' );
                dracoLoader.setDecoderConfig( { type: 'js' } );
                gltfLoader.setDRACOLoader(dracoLoader);
            }
        
            gltfLoader.load(fileName, (gltf) => {
                
                this.gltf = gltf;
                const root = gltf.scene;
                this.scena.scene.add(root);
                var mixer = new THREE.AnimationMixer(root);
                if (this.scena) {
                    this.animation = new AnimationClass(mixer, gltf.animations, this.scena);
                };

                resolved("File has been loaded");
            }, (xhr) => {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
             
               
            }, (error) => {
                console.log('An error happened', error);
                reject('An error happened: ' + error);
            });
        
        });

    }

    getElementByName(objectName) {
        if (this.scena) {
            let object = this.scena.scene.getObjectByName(objectName);
            if (object) {
                return object;
            }
            else
                return null;
        }
        else
            return null;
    }
    hideObject(objectName) {
        if (objectName) {
            let obj3d = this.getElementByName(objectName);
            if (obj3d) {
                obj3d.visible = false;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    showObject(objectName) {
        if (objectName) {
            let obj3d = this.getElementByName(objectName);
            if (obj3d) {
                obj3d.visible = true;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    setColor(objectName, color, materialNumber) {
        if (objectName) {
            let obj3d = this.getElementByName(objectName);
            if ((obj3d) && (obj3d instanceof THREE.Mesh) && (obj3d.isMesh)) {
                if ((obj3d.material instanceof Array) && (materialNumber)) {
                    if (obj3d.material.length >= materialNumber)
                        return null;
                    let material = obj3d.material[materialNumber];
                    if (material instanceof THREE.MeshStandardMaterial) {
                        material.color = color;
                        return obj3d;
                    }
                    else {
                        return null;
                    }
                }
                else if (obj3d.material instanceof THREE.MeshStandardMaterial) {
                    obj3d.material.color = color;
                    return obj3d;
                }
            }
        }
        return null;
    }

    setPosition(objectName, position) {
        if (objectName) {
            let obj3d = this.getElementByName(objectName);
            if ((obj3d) && (position) && (position.isVector3)) {
                obj3d.position.set(position.x, position.y, position.z);
                return obj3d;
            }
        }
        return null;
    }


     //Dodanie tekstu
     changeText(name, text, fontSize, color = '', mat = true) {
        var loader = this.FontText = new THREE.FontLoader();
        var sc = this.scena.scene.getObjectByName("Blender");
        var obj = this.getElementByName(name);
        this.removeObj(name);
        loader.load( 'js/fonts/TimesNewRomanPSMT_Regular.json', function (font) { 
            var textGeo = new THREE.TextGeometry(text, {
                font: font,
                size: fontSize,
                height: 0.01,
                curveSegments: 12,
                bevelEnabled: false
            } );

            textGeo.computeBoundingBox();

            textGeo.center();

            var textMaterial = '';
            if(color != '') {
                textMaterial = new THREE.MeshStandardMaterial( { color: color } );
            }
            else {
                textMaterial = obj.material;
            }

            if(mat == true) {
                textMaterial.roughness = 1;
            }
            else {
                textMaterial.roughness = 0.5;
            }
            
            var mesh = new THREE.Mesh( textGeo, textMaterial );

            if(obj.created === undefined) {
                mesh.position.set(obj.position.x-0.01, obj.position.y+fontSize/2, obj.position.z-fontSize/2);
                mesh.rotation.set(obj.rotation._x-Math.PI/2, obj.rotation._y, obj.rotation.z);
            }
            else {
                mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
                mesh.rotation.set(obj.rotation._x, obj.rotation._y, obj.rotation.z);
            }
            
            mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
            mesh.modelViewMatrix.elements = obj.modelViewMatrix.elements;
            mesh.normalMatrix.elements = obj.normalMatrix.elements;
            mesh.created = "true";

            //mesh.quaternion.set(obj.quaternion._x, obj.quaternion._y, obj.quaternion._z, obj.quaternion._w);
            
            mesh.name = name;
            sc.add( mesh );
    
        } );

    
    }


    createText(name, text, p_x, p_y, p_z, color) {
        var loader = this.FontText = new THREE.FontLoader();
        var sc = this.scena.scene.getObjectByName("Blender");
        loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
            var textGeo = new THREE.TextGeometry( text, {
                font: font,
                size: 0.15,
                height: 0.01,
                curveSegments: 12,
                bevelEnabled: false
            } );

            textGeo.center();
            var textMaterial = new THREE.MeshStandardMaterial( { color: color } );
            var mesh = new THREE.Mesh( textGeo, textMaterial );
            mesh.position.set(p_x, p_y, p_z);
            mesh.name = name;
            sc.add( mesh );
    
        } );

    
    }


    createBox(pos_x, pos_y, pos_z, name, color_ = null, dim_x = 0.25, dim_y = 0.25, dim_z = 0.25, geometry_ = 0) {
        var geometry = null;
        if(geometry_ == 0) {
            geometry = new THREE.BoxGeometry(dim_x, dim_y, dim_z);
        }
        else if(geometry_ == 1) {
            geometry = new THREE.SphereGeometry(0.125, 20, 12);
        }
        
        var colors = ["red", "green", "yellow", "blue"];
        var color_nr = Math.round(Math.random() * 3);
        var color = colors[color_nr];
        if(color_ != null) {
            color = color_; 
        }
        var material = new THREE.MeshStandardMaterial({
            name: "cube_material",
            color: color,
            transparent: false,
            opacity: 1,
        });
        var cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.name = name;
        cube.position.x = pos_x;
        cube.position.y = pos_y;
        cube.position.z = pos_z;
        cube.added = {mx: false, px: false, y: false, mz: false, pz: false};
        cube.color = color;
        cube.size = {x: dim_x, y: dim_y, z: dim_z}

        var group = this.scena.scene.getObjectByName("Cubes");
        group.add(cube);
        var blender_group = this.scena.scene.getObjectByName("Blender");
        blender_group.children.push(cube);
        
    }



    createProjectile(pos_x, pos_y, pos_z, nr) {
        var geometry = new THREE.SphereGeometry(0.15, 20, 12);
        var material = new THREE.MeshStandardMaterial({
            name: "projectile_material",
            color: "blue",
            transparent: true,
            opacity: 1,
        });
        var proj = new THREE.Mesh(geometry, material);
        proj.castShadow = true;
        proj.receiveShadow = true;
        proj.name = "Projectile" + nr;
        proj.position.x = pos_x;
        proj.position.y = pos_y;
        proj.position.z = pos_z;
        var group = this.scena.scene.getObjectByName("Projectiles");
        group.add(proj);
        var blender_group = this.scena.scene.getObjectByName("Blender");
        blender_group.children.push(proj);

    }


    removeObj(name) {
        var obj = this.getElementByName(name);  
        this.scena.scene.getObjectByName("Blender").remove(obj);
    }

    removeCube(name) {
        var obj = this.getElementByName(name); 
        this.scena.scene.getObjectByName("Blender").remove(obj);
        this.scena.scene.getObjectByName("Cubes").remove(obj);
    }

    removeProjectile(name) {
        var obj = this.getElementByName(name); 
        this.scena.scene.getObjectByName("Blender").remove(obj);
        this.scena.scene.getObjectByName("Projectiles").remove(obj);
    }

  
}

class Scena {
    constructor(divName, options) {
        this.scene = new THREE.Scene();
        this.camera = null;
        this.controls = null;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
        this.mixer = null;
        //
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.mouse = new THREE.Vector2();                                      
        this.divWidth = 0;
        this.divHeight = 0;
        this.clock = new THREE.Clock();
        let defaultOptions = {
            backgroundColor: 'lightblue',  
            enableControler: true,
            //cameraType: CameraType.Orthographic,
            cameraType: CameraType.Perspective,
            showArea: {
                left: -2.6,
                right: 2.6,
                bottom: -0.5,
                top: 5.3
            }
        };
        let tempOptions = $.extend(defaultOptions, options);
        this.createScene(divName, tempOptions);
        if (this.scene) {
            this.initLamp();
            this.initBlenderGroups();
           
        }
        if(THREE.InteractionManager) {
            this.ObjectEvents = new THREE.InteractionManager(
                this.renderer,
                this.camera,
                this.renderer.domElement
              );
        }


    }


    setMixer(mixer) {
        this.mixer = mixer;
    }



    turnOffHelper() {
        var gridXZ = this.scene.getObjectByName("grid_helper");
        if (gridXZ)
            this.scene.remove(gridXZ);
        if (this.camera) {
            var cameraHelper = this.scene.getObjectByName("camera_helper");
            if (cameraHelper)
                this.scene.remove(cameraHelper);
        }
    }
    turnOnHelper() { 
        var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color("red"), new THREE.Color("blue"));
        gridXZ.name = "grid_helper";
        this.scene.add(gridXZ);
        if (this.camera) {
            var cameraHelper = new THREE.CameraHelper(this.camera);
            cameraHelper.name = "camera_helper";
            this.scene.add(cameraHelper);
        }
    }

    setBackgroundColor(color) {
        this.scene.background = new THREE.Color(color);
    }

    createScene(divName, options) {
        if (divName.indexOf("#") < 0)
            divName = "#" + divName;
        this.divWidth = $(divName).width() || 0;
        this.divHeight = $(divName).height() || 0;
        if ((typeof this.divWidth == 'undefined') || (typeof this.divHeight == 'undefined')) {
            console.log("Nie można odczytać wysokości/szerokości div-a pod scenę.");
            return;
        }
        this.initRenderer(this.divWidth, this.divHeight);
        $(divName).append(this.renderer.domElement);
        // scene
        this.scene = new THREE.Scene();
        this.setBackgroundColor(options.backgroundColor);
        this.initCamera(options);
        if (this.camera)
            this.initControler(options);
           
 
    }


    initCamera(options) {
        if ((options.cameraType) && (options.cameraType == CameraType.Perspective)) {
            let aspect = 0;
            if (this.divHeight != 0) {
                aspect = this.divWidth / this.divHeight;
            }
            this.camera = new THREE.PerspectiveCamera(80, aspect, 0.1, 1000);
            this.camera.position.set(5, 5, 5);
			this.camera.lookAt(new THREE.Vector3(0, 1, 0));

        }
        else if (options.cameraType == CameraType.Orthographic) {
            console.log("Ortographics camera");
            let showArea = options.showArea;
            this.camera = new THREE.OrthographicCamera(showArea.left, showArea.right, showArea.top, showArea.bottom, 0.1, 1000);
            this.camera.position.set(3, 1, 5);
            this.camera.lookAt(new THREE.Vector3(0, 1, 0));
        }
    }

    initControler(options) {
        if (this.camera) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enabled = options.enableControler;         
            this.controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
            this.controls.dampingFactor = 0.25;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 10;
            this.controls.maxDistance = 1000;
            this.controls.maxPolarAngle = Math.PI / 2;
        }
    }

    setCameraPosition(position, lookAtVector) {
        if ((this.camera) && (position.isVector3)) {
            this.camera.position.set(position.x, position.y, position.z);
            this.camera.lookAt(lookAtVector);
        }
    }

    initRenderer(width, height) {
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //Korekcja Gamma - dobrze zawsze to ustawić
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

    }



    initLamp() {
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLight );
        directionalLight.position.set(0, 0, 5);

        const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLight2 );
        directionalLight2.position.set(0, 5, 0);

        const directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLight3 );
        directionalLight3.position.set(5, 0, 0);

        const directionalLigh4 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLigh4 );
        directionalLigh4.position.set(0, 0, -5);

        const directionalLigh5 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLigh5 );
        directionalLigh5.position.set(0, -5, 0);

        const directionalLigh6 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLigh6 );
        directionalLigh6.position.set(-5, 0, 0);

        var ambient = new THREE.AmbientLight(0xffffff, 0.6);
        ambient.name = "ambientLight";
        this.scene.add(ambient);

    }


    initBlenderGroups() {
        const group_cubes = new THREE.Group();
        group_cubes.name = "Cubes";
        this.scene.add(group_cubes); 

        const group_projectiles = new THREE.Group();
        group_projectiles.name = "Projectiles";
        this.scene.add(group_projectiles);
    }

    setControlerStatus(state) {
        if (this.controls != null) {
            if (state == undefined) {
                this.controls.enabled = this.controls.enabled == true ? false : true;
            }
            else {
                if (state) {
                    this.controls.enabled = true;
                }
                else {
                    this.controls.enabled = false;
                }
            }
        }
    }

    renderLoop() {

        var _this = this;
        requestAnimationFrame(() => {

            _this.renderLoop();
        
        });

        this.render();
        this.update();
        
    };

    render() {
         
        if (this.camera)   
            this.renderer.render(this.scene, this.camera);

    };

    update() {
       
        if (this.controls)
            this.controls.update();
       
        if (this.mixer)
            this.mixer.update(this.clock.getDelta());
    
    };
}


class AnimationClass {
    constructor(mixer, animations, scena) {
        this.mixer = null;
        this.animations = {};
        animations.forEach((clip) => {
            if (mixer) {
                this.mixer = mixer;
                mixer.clipAction(clip).stop();
                scena.setMixer(mixer);
                this.animations[clip.name] = clip;
            }
        });
    }
    play(animationName, loopStyle, repetitions, duration) {
        var clip = this.animations[animationName];
        if ((clip) && (this.mixer)) {
            var animationAction = this.mixer.existingAction(clip);
            if (duration)
                animationAction.setDuration(duration);
            if ((!repetitions) || (repetitions == 0))
                animationAction.setLoop(loopStyle, Infinity).reset().play();
            else
                animationAction.setLoop(loopStyle, repetitions).reset().play();
        }
        else {
            console.log(`Clip ${animationName} lub mixer nie istnieje.`);
        }
    }
    setDuration(animationName, duration) {
        var clip = this.animations[animationName];
        if ((clip) && (this.mixer)) {
            this.mixer.existingAction(clip).setDuration(duration).stop().reset();
        }
        else {
            console.log(`Clip ${animationName} lub mixer nie istnieje.`);
        }
    }
    setTimeScale(animationName, timeScale) {
        var clip = this.animations[animationName];
        if ((clip) && (this.mixer)) {
            this.mixer.existingAction(clip).timeScale = timeScale;
            this.mixer.existingAction(clip).stop().reset();
        }
        else {
            console.log(`Clip ${animationName} lub mixer nie istnieje.`);
        }
    }
    pause(animationName) {
        var clip = this.animations[animationName];
        if ((clip) && (this.mixer)) {
            this.mixer.existingAction(clip).paused = true;
        }
        else {
            console.log(`Clip ${animationName} lub mixer nie istnieje.`);
        }
    }
    resume(animationName) {
        var clip = this.animations[animationName];
        if ((clip) && (this.mixer)) {
            this.mixer.existingAction(clip).paused = false;
        }
        else {
            console.log(`Clip ${animationName} lub mixer nie istnieje.`);
        }
    }
    stop(animationName) {
        var clip = this.animations[animationName];
        if ((clip) && (this.mixer)) {
            this.mixer.existingAction(clip).stop().reset();
        }
        else {
            console.log(`Clip ${animationName} lub mixer nie istnieje.`);
        }
    }
    halt(animationName, duration) {
        var clip = this.animations[animationName];
        if ((clip) && (this.mixer)) {
            this.mixer.existingAction(clip).halt(duration);
        }
        else {
            console.log(`Clip ${animationName} lub mixer nie istnieje.`);
        }
    }
    getAnimations() {
        return Object.keys(this.animations);
    }

    
}