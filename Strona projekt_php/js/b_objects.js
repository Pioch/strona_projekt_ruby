const Color = {
    red: { r: 0.9, g: 0.01, b: 0.01 },
    darkred: { r: 0.025, g: 0, b: 0 },
    darkgreen: { r: 0, g: 0.025, b: 0 },
    green: { r: 0.01, g: 0.7, b: 0.01 },
    darkgray: { r: 0.184, g: 0.184, b: 0.184 },
    blue: { r: 0.01, g: 0.08, b: 0.604 },
    gray: { r: 0.487, g: 0.487, b: 0.487 },
    yellow: { r: 0.6, g: 0.5, b: 0.01 },
    dark: { r: 0.012, g: 0.012, b: 0.012 },
    brown: { r: 0.6, g: 0.20, b: 0 },
    orange: { r: 1, g: 0.55, b: 0 }
};

class B_objects {
    constructor(divName, model, area) {


        this.divName = divName;
        this.mapDimensions = [-14, 14, -1.6, 2.6, -6.5, 6.5]; //min_x, max_x, min_y, max_y, min_z, max_z
        this.modelLoaded = false;
        this.blender = null;
        this.blender = new Blender(divName, null, {
            backgroundColor: "white",
            enableControler: true,
            //cameraType: CameraType.Orthographic,
            cameraType: CameraType.Perspective,
            showArea: area
        });
        if (this.blender == null)
            return;
        var _this = this;
        this.blender.loadGltfFile(model)
        .then(() => {
            if (_this.blender == null)
                return;
            _this.blenderObjects = _this.blender.scena.scene.getObjectByName("Blender");
            _this.modelLoaded = true;
            $('#' + this.divName).trigger('modelLoaded');
        });
    }
    getObject(objectName) {
        var object;
        if (this.blenderObjects) {
            object = this.blenderObjects.getObjectByName(objectName);
            return object;
        }
        return null;
    };
    setColor(objectName, color) {
        var object = this.getObject(objectName);
        if (object) {
            object.material.color.setRGB(color.r, color.g, color.b);
        }
        return null;
    };


};