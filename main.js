status = "";
objects = [];

function preload() {
    siren = loadSound("siren.mp3");
}

function setup() {
    canvas = createCanvas(640, 420);
    canvas.center();

    video = createCapture(VIDEO);
    video.hide();

    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status = Detecting Objects";
}

function modelLoaded() {
    console.log("Model Loaded!");
    status = true;
    siren.loop();
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(results);
        objects = results;
    }
}

function draw() {
    image(video, 0, 0, 640, 420);
    objectDetector.detect(video, gotResult);

    if (status != "") {
        for (i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status = Objects Detected";
            
            fill("#FF0000");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("FF0000");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if (objects[i].label == "person") {
                console.log("stop");
                document.getElementById("msg").innerHTML = "Baby Found";
                siren.stop();
            }

            else {
                console.log("play");
                document.getElementById("msg").innerHTML = "Baby not found";
                siren.play();
          }

            if (objects.length == 0) {
                console.log("play");
                document.getElementById("msg").innerHTML = "Baby not found";
                siren.play();
            }
        }
    }
}