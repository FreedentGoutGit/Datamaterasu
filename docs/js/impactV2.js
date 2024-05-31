data = [{"Name":"Wildfire","Category":"Climate hazard","Tag":"Infrastructure","Id":1,"To":"7;8;10;11"},{"Name":"Droughts","Category":"Climate hazard","Tag":"Water","Id":2,"To":"1;10;9;31"},{"Name":"Heat waves","Category":"Climate hazard","Tag":"Other","Id":3,"To":"28;10;11"},{"Name":"Floods","Category":"Climate hazard","Tag":"Water","Id":4,"To":"32;13;11;12;29"},{"Name":"Sea Level Rise","Category":"Climate hazard","Tag":"Water","Id":5,"To":"4;14;13;11;10"},{"Name":"Tropical Storm","Category":"Climate hazard","Tag":"Water","Id":6,"To":"4;13;12;14;11"},{"Name":"Deforestation","Category":"Landscape change","Tag":"Land : Forestry","Id":7,"To":15},{"Name":"Desertification","Category":"Landscape change","Tag":"Land : Forestry","Id":8,"To":16},{"Name":"Reduce Water availability","Category":"Landscape change","Tag":"Water","Id":9,"To":18},{"Name":"Soil degradation","Category":"Landscape change","Tag":"Land : Agriculture;Land : Forestry","Id":10,"To":"19;20;21"},{"Name":"Infrastructure Damage","Category":"Landscape change","Tag":"Infrastructure","Id":11,"To":"21;19;21"},{"Name":"Vegetation and crop \n damage\/stress","Category":"Landscape change","Tag":"Land : Agriculture","Id":12,"To":21},{"Name":"Coastal erosion and \n inundation","Category":"Landscape change","Tag":"Water","Id":13,"To":"33;21"},{"Name":"Saltwater intrusion","Category":"Landscape change","Tag":"Water","Id":14,"To":"23;21;22"},{"Name":"Polution, air quality","Category":"Health determinant","Tag":"Other","Id":15,"To":24},{"Name":"Increased temperature","Category":"Health determinant","Tag":"Other","Id":16,"To":25},{"Name":"Water scarity and \n contamination","Category":"Health determinant","Tag":"Water","Id":17,"To":17},{"Name":"Poor hygiene and sanitation","Category":"Health determinant","Tag":"Infrastructure","Id":18,"To":26},{"Name":"Displacement and migration","Category":"Health determinant","Tag":"Other","Id":19,"To":26},{"Name":"Loss of livelihood","Category":"Health determinant","Tag":"Other","Id":20,"To":30},{"Name":"Food insecurity","Category":"Health determinant","Tag":"Land : Agriculture","Id":21,"To":"27;30;26"},{"Name":"Vector habitat expansion","Category":"Health determinant","Tag":"Water","Id":22,"To":"30;26;"},{"Name":"Increased salinity","Category":"Health determinant","Tag":"Water","Id":23,"To":25},{"Name":"Respiratory diseases","Category":"Health outcomes","Tag":"Health","Id":24,"To":30},{"Name":"Cardiovascular diseases","Category":"Health outcomes","Tag":"Health","Id":25,"To":30},{"Name":"Infectious deseases","Category":"Health outcomes","Tag":"Health","Id":26,"To":null},{"Name":"Malnutrition","Category":"Health outcomes","Tag":"Health","Id":27,"To":null},{"Name":"Heat-related diseases","Category":"Health outcomes","Tag":"Health","Id":28,"To":null},{"Name":"Fatalities and injuries","Category":"Health outcomes","Tag":"Health","Id":29,"To":null},{"Name":"Mental health","Category":"Health outcomes","Tag":"Health","Id":30,"To":null},{"Name":"Reduce water quality","Category":"Landscape change","Tag":"Water","Id":31,"To":20},{"Name":"Landslide","Category":"Climate hazard","Tag":"Other","Id":32,"To":null},{"Name":"Vector habitat expansion","Category":"Health determinant","Tag":"Water","Id":33,"To":"30;26"}];

HEIGHTOFBOX = 40;
DELATHEIGHT = 200;


COLOROTHER = "#fed828"
COLORWATER = "#5290fe"
COLORINFRASTRUCTURE = "#8c96aa"
COLORLANDFORESTRY = "#54565b"
COLORLANDAGRICULTURE = "#018450"
COLORHEALTH = "#00539a"


var allFigs = [];
var allConnections = [];


function popElements(){ 

    
    const popElements = document.querySelectorAll('.pop');
    let delay = 0;

    popElements.forEach(element => {
        setTimeout(() => {
            element.classList.add('pop-in');
        }, delay);
        delay += 1500; 
    });
}

function popElements2(){ 

    
    const popElements2 = document.querySelectorAll('.pop2');
    let delay = 0;

    popElements2.forEach(element => {
        setTimeout(() => {
            element.classList.add('pop2-in');
        }, delay);
        delay += 1500; 
    });
}

function popElements3(){ 

    
    const popElements3 = document.querySelectorAll('.pop3');
    let delay = 0;

    popElements3.forEach(element => {
        setTimeout(() => {
            element.classList.add('pop3-in');
        }, delay);
        delay += 1500; 
    });
}


function loadImpactFully()
{
    var canvas = new draw2d.Canvas("gfx_holder");

    var header = document.getElementsByClassName("HeaderContainer")[0];
    var height = header.offsetHeight;
    DELATHEIGHT = height + 50;


    var div = document.getElementsByClassName("impactDiv")[0];
    var parent = document.getElementById("gfx_holder");
    parent.style.height = div.offsetHeight;
    var child = parent.firstChild;

    //style the child
		child.style.width = "100%";
    child.style.position = "relative";
    child.style.height = div.offsetHeight;
    child.style.width = div.offsetWidth;
    child.style.backgroundColor = "transparent";

    canvas.installEditPolicy(  new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection: function(){
            var connection = new draw2d.Connection({
                stroke:3,
                outlineStroke:1,
                outlineColor:"#303030",
                color:"91B93E",
                router:new draw2d.layout.connection.SplineConnectionRouter(),
            });
            return connection;
        }
    }));

    makeTheMenuSelectable(canvas);
}


function makeTheMenuSelectable(canvas){
    var allMenues = document.getElementsByClassName("event");
    for(var i = 0; i < allMenues.length; i++){
        allMenues[i].addEventListener("click", function(){ // expand the of the selected category + remove all the last boxes and connection
            var value = this.getAttribute("data-value");

            removeAll(canvas);

            var dataSelected = data.filter(function(d){
                return d.Name == value;
            })[0];

            AddAccordingToCategory(canvas, dataSelected);
            
        });
    }
}


function removeAll(canvas){
    allConnections.forEach(function(e){
        console.log(e);
        canvas.remove(e);
    });


    allFigs.forEach(function(e){
        canvas.remove(e);
    });


    allFigs = [];
    allConnections = [];
}

function addCOnnection(id1, id2, canvas){ // creates a connection between two boxes
    var connection = new draw2d.Connection({
        stroke:1,
        outlineStroke:1,
        outlineColor:"#303030",
        color:"91B93E",
        source:canvas.getFigure(id1).getOutputPort(0),
        target:canvas.getFigure(id2).getInputPort(0),
        router:new draw2d.layout.connection.SplineConnectionRouter(),
        unselectable:true,

     });

    dataArrival = getDataById(id1);
    color = getCorrectColor(dataArrival);
    connection.setColor(color);

    canvas.add(connection);

    allConnections.push(connection);
}

function AddAccordingToCategory(canvas, d, offsetY=0){
    var category = d.Category;

    var col = document.getElementById(category);
    
    if(col == null){
        return false;
    }

    if(canvas.getFigure(d.Id) != null){
        return true;
    }

    var width = col.offsetWidth*0.7;
    var height = HEIGHTOFBOX;
    var x = col.offsetLeft + (col.offsetWidth - width)/2;
    var y = col.offsetTop + DELATHEIGHT + offsetY;

    var box = addBox(canvas, d, x, y, width, height);

    //add liserner when the window is resized
    window.addEventListener("resize", function(){ // Need to update the design of the boxes when the window is resized fixed size boxes draw2d.js...
        updateSize(box, canvas);
    });


    return true;
}

function updateSize(box, canvas){ // function to update the pos and size of the box when the window is resized

    var header = document.getElementsByClassName("HeaderContainer")[0];
    var height = header.offsetHeight;
    DELATHEIGHT = height + 50;

    var div = document.getElementsByClassName("impactDiv")[0];
    
    var parent = document.getElementById("gfx_holder");
    parent.style.height = div.offsetHeight;
    var child = parent.firstChild;


    child.style.position = "relative";
    child.style.height = div.offsetHeight;
    child.style.width = div.offsetWidth;

    var category = getDataById(box.id).Category;

    var col = document.getElementById(category);
    var width = col.offsetWidth*0.7;
    var height = HEIGHTOFBOX;
    var x = col.offsetLeft + (col.offsetWidth - width)/2;
    var y = box.y;

    box.xPos = x;

    box.setWidth(width);
    box.setHeight(height);
    box.setPosition(x, y);



}

function getDataById(id){
    try
    {
        return data.filter(function(d){
            return d.Id == id;
        })[0];
    }
    catch(err){
        return null;
    }
}

function getBestOffsetY(canvas, d){ // this function manages the position of the boxes in the y axis when spawned, it adatps the position of the box to avoid overlap
    console.log(d);
    var category = d.Category;
    
    //get all the boxes displayed in the canvas with the same category
    var boxes = canvas.getFigures().data.filter(function(e){
        dataSelected = getDataById(e.id);
        return dataSelected.Category == category;
        }
    );



    allY = boxes.map(function(e){
        return e.y;
    });
    //sort the y values from the smallest to the largest
    allY.sort(function(a, b){
        return a - b;
    });

    var i = 0;
    while(i < 1000){
        var possibleY = i*HEIGHTOFBOX+DELATHEIGHT;
        var overlap = false;
        allY.forEach(function(e){
            if(Math.abs(e - possibleY) < 1.2*HEIGHTOFBOX){      
                overlap = true;
            }
        });

        if(overlap == false){
            return possibleY-DELATHEIGHT;
        }
        i+=0.5;
    }
    return 0;
}

function getCorrectColor(d){
    if(d.Tag.includes("Water")){
        return COLORWATER;
    }
    else if(d.Tag.includes("Infrastructure")){
        return COLORINFRASTRUCTURE;
    }
    else if(d.Tag.includes("Land : Forestry")){
        return COLORLANDFORESTRY;
    }
    else if(d.Tag.includes("Land : Agriculture")){
        return COLORLANDAGRICULTURE;
    }
    else if(d.Tag.includes("Health")){
        return COLORHEALTH;
    }
    else{
        return COLOROTHER;
    }
}

function addBox(canvas, d, x, y, width, height){ // this function interacts with the draw2d.js library to create a box
    var box = new BoundingboxFigure({id:d.id, x:x, y:y, width:width, height:height});

    box.setResizeable(false);
    box.setCanSnapToHelper(false);
    box.setBackgroundColor(getCorrectColor(d));

    box.getHybridPort(0).setVisible(false);

    box.on("click", function(emitter, event){
        console.log("clicked");         
        if(d.To == null){
            return;
        }

        to = String(d.To);

        if(to.includes(";") == true){
            expandNode =  d.To.split(";");
            expandNode.forEach(function(e){
                if(e != ""){
                    dataSent = getDataById(e);
                    var done = AddAccordingToCategory(canvas, dataSent, offsetY=getBestOffsetY(canvas, dataSent));
                    if(done == false){
                        return;
                    }
                    addCOnnection(d.Id, dataSent.Id, canvas);
                }
            });
        }
        else{
            if(d.To == null){
                alert("No connection");
                return;
            }
            dataSent = getDataById(d.To);
            var done = AddAccordingToCategory(canvas, dataSent, offsetY=getBestOffsetY(canvas, dataSent));
            if(done == false){
                return;
            }
            addCOnnection(d.Id, dataSent.Id, canvas);
        }
    });

    box.xPos = x;

    //disable the mpvement in the x axis
    box.installEditPolicy(new draw2d.policy.figure.DragDropEditPolicy({
        onDrag:function(canvas, figure){

            figure.setPosition(box.xPos, figure.y);
        }
    }));

    box.createPort("output", new draw2d.layout.locator.RightLocator());
    box.createPort("input", new draw2d.layout.locator.LeftLocator());

    box.getOutputPort(0).setVisible(false);
    box.getInputPort(0).setVisible(false);    

    //create the text and put it in the center of the box
    var label = new draw2d.shape.basic.Label({
        text:d.Name,
        fontSize:"10rem",
        stroke:0,
        fontColor:"#ffffff",
        radius:1,
        padding:5,
        resizeable:false,
    });

    //color text in black if Other
    if(d.Tag.includes("Other")){
        label.setFontColor("#000000");
    }

    console.log(label.width);

    box.add(label, new draw2d.layout.locator.CenterLocator());
    label.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
    
    
    box.id = d.Id;
    canvas.add(box);
    allFigs.push(box);
    
    return box;
}
