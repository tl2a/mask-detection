let classifier, objectDetector, detections = [];
let img;
let video;
let label = '', conf = ''

// When the model is loaded
function modelLoaded() {
    console.log('Model Loaded!');

    // Image Classification
    // classifier.classify(image, resultReady) // Here image is the data over which the classifier works
    // classifier.classify(resultReady) // Here video is already hooked, therefore no need to mention here

    // Object Detection
    // objectDetector.detect(img, resultReady);
    objectDetector.detect(video, resultReady);
}

const resultReady = (err, res) => {
    if(err) console.error(err);

    // console.log(res);
    detections = res;
    // label = res[0].label;
    // conf = res[0].confidence;

    // Recursive Call to keep classify / detect on live data
    // classifier.classify(resultReady)
    objectDetector.detect(video, resultReady);
}

// Preload dependencies
function preload() {
    // Image
    img = loadImage('./assets/images/cat.jpg')
}

function videoReady() {
    // Create a ObjectDetector method
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
}

function setup() {
    createCanvas(640, 480);
    
    // Image
    // img.resize(width, height);
    // image(img, 0, 0, width, height)

    // Video - Webcam
    video = createCapture(VIDEO, videoReady)
    video.size(width, height)
    video.hide()

    // Initialize the Image Classifier method with MobileNet
    // classifier = ml5.imageClassifier('MobileNet', modelLoaded);
    // classifier = ml5.imageClassifier('MobileNet', video, modelLoaded); // Here video is data over which the classifier works

    // Create a ObjectDetector method
    // objectDetector = ml5.objectDetector('cocossd', modelLoaded); // For Image it just works here
}

// Draws only at the beggining, thought data could stream or change
function draw() {
    // background(0);
    image(video, 0, 0) // Taking a default size
    // fill(255)
    // textSize(40)
    // text(label, 10, height - 20)
    // if(conf) text(nf(conf,0,2), width - 90, height - 20)
    
    detections.map(item => {
        noStroke()
        fill(0,255,0)
        textSize(20)
        text(
            `${item.label} ${nfc(item.confidence * 100.0, 2)}%`,
            item.x + 10,
            item.y + 25,
            );
        noFill()
        strokeWeight(4)
        stroke(0,255,0)
        rect(item.x, item.y, item.width, item.height)
    })
}