// Grab all the DOM elements
const video = document.getElementById('video');
const label1Button = document.getElementById('label1Button');
const label2Button = document.getElementById('label2Button');
const amountOfLabel1Images = document.getElementById('amountOfLabel1Images');
const amountOfLabel2Images = document.getElementById('amountOfLabel2Images');
const train = document.getElementById('train');
const loss = document.getElementById('loss');
const result = document.getElementById('result');
const confidence = document.getElementById('confidence');
const predict = document.getElementById('predict');
const save = document.getElementById('save');
const load = document.getElementById('load');

let featureExtractor = null;
let classifier = null;

const main = () => {
  // Create a webcam capture
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    video.play();
  });

  featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
  classifier = featureExtractor.classification(video, videoReady);
};

// A function to be called when the model has been loaded
const modelLoaded = () => {
  console.log('MobileNet model is loaded');
};

// A function to be called when the video is finished loading
const videoReady = () => {
  console.log('Video is ready');
};

main();

label1Button.onclick = () => {
    let i = 1
    const interval = setInterval(() => console.log(`${i++}`), 1000);
    setTimeout(() => {
        clearInterval(interval);  
        console.log("Gotcha!");
        classifier.addImage('no_mask');
        amountOfLabel1Images.innerText = Number(amountOfLabel1Images.innerText) + 1;
    }, 3000);
};


label2Button.onclick = () => {
    let i = 1
    const interval = setInterval(() => console.log(`${i++}`), 1000);
    setTimeout(() => {
        clearInterval(interval);
        console.log("Gotcha!");
        classifier.addImage('with_mask');
        amountOfLabel2Images.innerText = Number(amountOfLabel2Images.innerText) + 1;
    }, 3000);
};

train.onclick = () => {
  classifier.train((lossValue) => {
    if (lossValue) {
      totalLoss = lossValue;
      loss.innerHTML = `Loss: ${totalLoss}`;
    } else {
      loss.innerHTML = `Done Training! Final Loss: ${totalLoss}`;
    }
  });
};

let enable = false;
const gotResults = (err, results) => {
  if (err) {
    console.error(err);
  } else if (results && results[0]) {
    result.innerText = results[0].label;
    confidence.innerText = results[0].confidence;
    enable && classifier.classify(gotResults); // recall the classify function again
  }
}

predict.onclick = () => {
    enable = !enable;
    classifier.classify(gotResults);
    predict.innerText = enable ? "Stop Detecting!" : "Start Detecting!";
};

save.onclick = () => {
    featureExtractor.save();
};

load.onclick = () => {
    featureExtractor.load('./models/model.json');
};