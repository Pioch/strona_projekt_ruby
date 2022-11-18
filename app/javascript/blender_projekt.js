var color_ = null;
var x_dim_ = 0.25;
var y_dim_ = 0.25;
var z_dim_ = 0.25;
var login = {};


$(document).ready(() => {

    const {createApp} = Vue;
    
    const labels_color = createApp({
        data() {
            return {
                color: null,
                x_dim: 0.25,
                y_dim: 0.25, 
                z_dim: 0.25     
            }
        },
        watch: {
            color() {
                color_ = this.color;
            },
            x_dim() {
                x_dim_ = this.x_dim;
            },
            y_dim() {
                y_dim_ = this.y_dim;
            },
            z_dim() {
                z_dim_ = this.z_dim;
            }
        },

    })
    labels_color.mount('#layer_buttons');
   

    Obiekt();

    if(sessionStorage.getItem('loaded_text') != null) {
        sessionStorage.removeItem('loaded_text');
    }

    $("#inputfile").on("change", function () {
        var fr = new FileReader();
        fr.onload = function () {
            var file_text = fr.result;
            sessionStorage.setItem('loaded_text', file_text);
        }
        fr.readAsText(this.files[0]);
            
    });
   
});

function Obiekt() {
    var model = "3d_objects/Map.glb"

    Bobject = new B_objects("layer_blender", model, {
        left: -9.6, 
        right: 9.6, 
        bottom: -4.7,
        top: 4.7
    });

    Bobject.blender.scena.setBackgroundColor("#efffff");

    $("#layer_blender").on("modelLoaded", function () {
        $(document).ready(function () {
            addEvents()
        });
    });

    Obiekt3D();

    setInterval(() => {
        if(new_objects.length > 0) {
            var interactions = Bobject.blender.scena.ObjectEvents;
                for(let i = 0; i <= new_objects.length-1; i++) {
                    let obj_name = new_objects[i];
                    let obj = Bobject.getObject(obj_name);
                    interactions.add(obj); 
    
                    obj.addEventListener('click', (event) => {
                        if(event.originalEvent.ctrlKey == true) {
                            Bobject.blender.removeCube(obj.name);
                            for(let j = 0;  j <= interactions.interactiveObjects.length-1; j++) {
                                let io = interactions.interactiveObjects[j];
                                if(io.name == obj.name) {
                                    interactions.interactiveObjects.splice(j, 1);
                                    if(obj.name.slice(0, 2) == "pX") {
                                        var pre_name = obj.name.slice(6, obj.name.length);
                                        var pre_obj = Bobject.getObject(pre_name);
                                        if(pre_obj !== undefined) {
                                            pre_obj.added.px = false;
                                        }
                                    }
                                    else if(obj.name.slice(0, 2) == "mX") {
                                        var pre_name = obj.name.slice(6, obj.name.length);
                                        var pre_obj = Bobject.getObject(pre_name);
                                        if(pre_obj !== undefined) {
                                            pre_obj.added.mx = false;
                                        }
                                    }
                                    else if(obj.name.slice(0, 2) == "pY") {
                                        var pre_name = obj.name.slice(6, obj.name.length);
                                        var pre_obj = Bobject.getObject(pre_name);
                                        if(pre_obj !== undefined) {
                                            pre_obj.added.y = false;
                                        } 
                                    }
                                    else if(obj.name.slice(0, 2) == "pZ") {
                                        var pre_name = obj.name.slice(6, obj.name.length);
                                        var pre_obj = Bobject.getObject(pre_name);
                                        if(pre_obj !== undefined) {
                                            pre_obj.added.pz = false;
                                        }
                                    }
                                    else if(obj.name.slice(0, 2) == "mZ") {
                                        var pre_name = obj.name.slice(6, obj.name.length);
                                        var pre_obj = Bobject.getObject(pre_name);
                                        if(pre_obj !== undefined) {
                                            pre_obj.added.mz = false;
                                        }
                                    }
                                    else {
                                        var pre_name = obj.name.slice(4, obj.name.length);
                                        var pre_obj = Bobject.getObject(pre_name);
                                        pre_obj.added = false;
                                    }
                                    break;
                                } 
                            }
                           
                        }
                        else {      
                            var size_x = obj.size.x;
                            var size_y = obj.size.y;
                            var size_z = obj.size.z;               
                            if(event.face.normal.x == 1 && obj.added.px == false) {
                                if(checkCollision(obj.position.x+size_x/2+x_dim_/2, obj.position.y, obj.position.z, x_dim_/2, y_dim_/2, z_dim_/2) == 1) {
                                    Bobject.blender.createBox(obj.position.x+size_x/2+x_dim_/2, obj.position.y, obj.position.z, "pXCube"+obj.name, color_, x_dim_, y_dim_, z_dim_);
                                    event.stopPropagation();
                                    new_objects.push("pXCube"+obj.name);
                                    obj.added.px = true;
                                } 
                            }
                            else if(event.face.normal.x == -1 && obj.added.mx == false) {
                                if(checkCollision(obj.position.x-size_x/2-x_dim_/2, obj.position.y, obj.position.z, x_dim_/2, y_dim_/2, z_dim_/2) == 1) {
                                    Bobject.blender.createBox(obj.position.x-size_x/2-x_dim_/2, obj.position.y, obj.position.z, "mXCube"+obj.name, color_, x_dim_, y_dim_, z_dim_);
                                    event.stopPropagation();
                                    new_objects.push("mXCube"+obj.name);
                                    obj.added.mx = true;
                                }
                               
                            }
                            else if(event.face.normal.y == 1 && obj.added.y == false) {
                                if(checkCollision(obj.position.x, obj.position.y+size_y/2+y_dim_/2, obj.position.z, x_dim_/2, y_dim_/2, z_dim_/2) == 1) {
                                    Bobject.blender.createBox(obj.position.x, obj.position.y+size_y/2+y_dim_/2, obj.position.z, "pYCube"+obj.name, color_, x_dim_, y_dim_, z_dim_);
                                    event.stopPropagation();
                                    new_objects.push("pYCube"+obj.name);
                                    obj.added.y = true;
                                }
                    
                            }
                            else if(event.face.normal.z == 1 && obj.added.pz == false) {
                                if(checkCollision(obj.position.x, obj.position.y, obj.position.z+size_z/2+z_dim_/2, x_dim_/2, y_dim_/2, z_dim_/2) == 1) {
                                    Bobject.blender.createBox(obj.position.x, obj.position.y, obj.position.z+size_z/2+z_dim_/2, "pZCube"+obj.name, color_, x_dim_, y_dim_, z_dim_);
                                    event.stopPropagation();
                                    new_objects.push("pZCube"+obj.name);
                                    obj.added.pz = true;
                                }
                               
                            }
                            else if(event.face.normal.z == -1 && obj.added.mz == false) {
                                if(checkCollision(obj.position.x, obj.position.y, obj.position.z-size_z/2-z_dim_/2, x_dim_/2, y_dim_/2, z_dim_/2) == 1) {
                                    Bobject.blender.createBox(obj.position.x, obj.position.y, obj.position.z-size_z/2-z_dim_/2, "mZCube"+obj.name, color_, x_dim_, y_dim_, z_dim_);
                                    event.stopPropagation();
                                    new_objects.push("mZCube"+obj.name);
                                    obj.added.mz = true;
                                }
                               
                            }
                        }
                       
                    })
                }
               
       
            new_objects = [];
        }
    }, 500)


}


function enableCamera() {
    if(Bobject.blender.scena.controls.enabled == false) {
        Bobject.blender.scena.controls.enabled = true;
        Bobject.blender.scena.controls.update();
    }
    else { 
        Bobject.blender.scena.controls.reset();
        Bobject.blender.scena.controls.enabled = false;
        Obiekt3D();
    }
}


var new_objects = [];

function Obiekt3D() {
    Bobject.blender.scena.camera.zoom = 30.455;
    Bobject.blender.scena.camera.position.set(53.702, 43.912, 71.848);
    Bobject.blender.scena.controls.target.set(-0.362, 0, 0.095);
    Bobject.blender.scena.camera.updateProjectionMatrix();
    Bobject.blender.scena.controls.enabled = false;
}


function addEvents() {

    var interactions = Bobject.blender.scena.ObjectEvents;

    for(let i = 0; i <= Bobject.blenderObjects.children.length-1; i++) {
        let obj = Bobject.blenderObjects.children[i];
        interactions.add(obj);

        if(obj.isMesh) {
            obj.addEventListener('click', (event) => {
                if(obj.added == undefined && event.originalEvent.ctrlKey == false) {
                    if(checkCollision(obj.position.x, obj.position.y+y_dim_/2, obj.position.z, x_dim_/2, y_dim_/2, z_dim_/2) == 1) {
                        Bobject.blender.createBox(obj.position.x, obj.position.y+y_dim_/2, obj.position.z, "Cube"+obj.name, color_, x_dim_, y_dim_, z_dim_);
                        event.stopPropagation();
                        new_objects.push("Cube"+obj.name);
                        obj.added = true;
                    }  
                }
               
            })
        }

    }

}


function resetColor() {
    color_ = null;
}


function Remove3DObjectEvent() { 
    var dom = Bobject.blender.scena.ObjectEvents;
    if(typeof dom === 'undefined') return;

    for (var i = 0; i < dom.interactiveObjects.length; i++) {
        delete Bobject.getObject(dom.interactiveObjects[i].name)._listeners;
    };
    dom.interactiveObjects = [];
}

function Save() {
    var data = {"objects_1_layer": [], "new_objects": []};
    for(let i = 0; i <= Bobject.blenderObjects.children.length-1; i++) {
        let obj = Bobject.blenderObjects.children[i];
        if(typeof obj.added == "boolean") {
            let obj_data = {"name": '', "added": false};
    
            obj_data.name = obj.name;
            obj_data.added = obj.added;
            data.objects_1_layer.push(obj_data);
        }
        else if(obj.added) {
            let obj_data = {"name": '', "color": '', "position": [], "size": [], "added": []};
    
            obj_data.name = obj.name;
            obj_data.color = obj.color;
            obj_data.position = obj.position;
            obj_data.size = obj.size;
            obj_data.added = obj.added;
            data.new_objects.push(obj_data); 
        }
    }

    var save_JSON = JSON.stringify(data);

    const text_to_blob = new Blob([save_JSON], {type: 'text/plain'});
    const file_name = 'do wczytania';
    let new_link = document.createElement("a");
    new_link.download = file_name;

    if (window.webkitURL != null) {
        new_link.href = window.webkitURL.createObjectURL(text_to_blob);
    }
    else {
        new_link.href = window.URL.createObjectURL(text_to_blob);
        new_link.style.display = "false";
        document.body.appendChild(new_link);
    }

    new_link.click(); 
}

function Load() {

    var loaded_text = sessionStorage.getItem('loaded_text');
    var parsed_text = JSON.parse(loaded_text);

    if(parsed_text != null) {
        var to_delete = [];
        for(let i = 0; i <= Bobject.blenderObjects.children.length-1; i++) {
                let obj = Bobject.blenderObjects.children[i];
            if(obj.name.slice(0, 4) == "Cube" || obj.name.slice(2, 6) == "Cube") {
                to_delete.push(obj);
                
            }
        }

        for(let i = 0; i <= to_delete.length-1; i++) {
            Bobject.blender.removeCube(to_delete[i].name);
        }

        for(let i = 0; i <= parsed_text.objects_1_layer.length-1; i++) {
            Bobject.getObject(parsed_text.objects_1_layer[i].name).added = parsed_text.objects_1_layer[i].added;
        }

        for(let i = 0; i <= parsed_text.new_objects.length-1; i++) {
            let obj = parsed_text.new_objects[i];
            Bobject.blender.createBox(obj.position.x, obj.position.y, obj.position.z, obj.name, obj.color, obj.size.x, obj.size.y, obj.size.z);
            new_objects.push(obj.name);
        }

        sessionStorage.removeItem('loaded_text');
        $('#inputfile').val('');
    }

}


function checkCollision(pos_x, pos_y, pos_z, dim_x, dim_y, dim_z) {
    var draw = 1;
    if(Bobject.blender.scena.scene.getObjectByName("Cubes").children.length > 0) {
        for(let i = 0; i <= Bobject.blender.scena.scene.getObjectByName("Cubes").children.length-1; i++) {
            let obj = Bobject.blender.scena.scene.getObjectByName("Cubes").children[i];
            let d_x = Math.abs(pos_x - obj.position.x) + 0.001;
            let d_y = Math.abs(pos_y - obj.position.y) + 0.001;
            let d_z = Math.abs(pos_z - obj.position.z) + 0.001;
            
            if(d_x < (dim_x + obj.size.x/2) && d_y < (dim_y + obj.size.y/2) && d_z < (dim_z + obj.size.z/2)) {
                draw = 0;
                break;   
            }
    
        }
    }

    return draw;
   
}

function saveToDB() {
    var data = {"objects_1_layer": [], "new_objects": []};
    for(let i = 0; i <= Bobject.blenderObjects.children.length-1; i++) {
        let obj = Bobject.blenderObjects.children[i];
        if(typeof obj.added == "boolean") {
            let obj_data = {"name": '', "added": false};
    
            obj_data.name = obj.name;
            obj_data.added = obj.added;
            data.objects_1_layer.push(obj_data);
        }
        else if(obj.added) {
            let obj_data = {"name": '', "color": '', "position": [], "size": [], "added": []};
    
            obj_data.name = obj.name;
            obj_data.color = obj.color;
            obj_data.position = obj.position;
            obj_data.size = obj.size;
            obj_data.added = obj.added;
            data.new_objects.push(obj_data); 
        }
    }

    var save_JSON = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: "php/save_blender_json.php",
        data: save_JSON,
        success: function() {
            console.log("Zapisano");
        }
    })
}

var loaded_json_db = {};
function readFromDB() {
    $.getJSON('php/get_saved_data.php', (data) => {
        loaded_json_db = data;
    }).done(() => {
        //wyświetlenie odczytanych zapisów
        html = '';

        for(let i = 0; i <= loaded_json_db.length-1; i++) {
            html += '<option value=' + i + '> Zapis ' + i + '&nbsp&nbsp&nbsp data zapisu: ' + loaded_json_db[i].data + '</option>';
        }

        $('#saved_data').html(html);
    });

}

function loadFromDB() {
    var loaded_text = loaded_json_db[$('#saved_data').val()].saved_json;
    var parsed_text = JSON.parse(loaded_text);

    if(parsed_text != null) {
        var to_delete = [];
        for(let i = 0; i <= Bobject.blenderObjects.children.length-1; i++) {
                let obj = Bobject.blenderObjects.children[i];
            if(obj.name.slice(0, 4) == "Cube" || obj.name.slice(2, 6) == "Cube") {
                to_delete.push(obj);
                
            }
        }

        for(let i = 0; i <= to_delete.length-1; i++) {
            Bobject.blender.removeCube(to_delete[i].name);
        }

        for(let i = 0; i <= parsed_text.objects_1_layer.length-1; i++) {
            Bobject.getObject(parsed_text.objects_1_layer[i].name).added = parsed_text.objects_1_layer[i].added;
        }

        for(let i = 0; i <= parsed_text.new_objects.length-1; i++) {
            let obj = parsed_text.new_objects[i];
            Bobject.blender.createBox(obj.position.x, obj.position.y, obj.position.z, obj.name, obj.color, obj.size.x, obj.size.y, obj.size.z);
            new_objects.push(obj.name);
        }

    }
}

function controlsInfo() {
    var html = '<div id="controlsInfo">';

        //wiersz
        html += '<div class="row" style="text-align: center; margin-top: 10px">';
        html += '<label>LPM - Utworzenie klocka</label>';
        html += '</div>';

        html += '<div class="row" style="text-align: center; margin-top: 10px">';
        html += '<label>CTRL + LPM - Usunięcie klocka</label>';
        html += '</div>';

        html += '</div>';

        BootstrapDialog.show({
            type: 'type-primary',

            title: 'Sterowanie',

            message: html,

            size: 'size-auto',

            buttons: [
                {
                    label: 'Zamknij',
                    action: function (dialog) {
                        dialog.close();
                    }
                }],

            draggable: true,
            onshow: function (dialog) {
                dialog.getModalHeader().css({ 'cursor': 'move' });
            }


        });
}