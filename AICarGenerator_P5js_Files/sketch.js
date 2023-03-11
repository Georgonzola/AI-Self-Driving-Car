let presetSteerWeights = [   -0.15719016707852473, 0.11544241265136909, 0.6612218769815554, 0.4787739136078194, 0.15625383191753678, -0.33722575338184224, -0.7513075008951124, -0.33800271074413113, -0.4029206631912169, 0.5413792502143439 ];

let presetSpeedWeights = [ 0.014509567720007222, 0.29410910648005084, 0.19366846511862085, 0.06236043648338305, -0.31736138514886036, -0.25698793818828547, 0.10474190279034004, 0.4592505936501023, 0.45684960211145753, -0.39121539123035853
  ];


let menuStage = 0;
let runStage = null;

let customDraw;
let customTrack;

let presetTracks = [];
let trackSelection = null;

let numTracks = 3;

let currentTrack = null;

var topSpeedWeights = [];
var topSteerWeights = [];

let car;

let popNum = 60;
let population;


let customButton;
let selectButton;
let completeButton;

let track1;
let track2;
let track3;

let trackImages;

let trackNames = ["Hairpin","Dumbell","Space Man", "Custom"];

let timerSlider;

let checkbox;
let simControls;

let titleImage;

let controls1;
let controls2;

let creationStore;

function preload(){
  track1 = loadImage("Track1.PNG");
  track2 = loadImage("Track2.png");
  track3 = loadImage("Track3.PNG");
  
  titleImage = loadImage("TitleScreen.PNG");
  
  controls1 = loadImage("CreateControls.png");
  controls2 = loadImage("SimulationControls.png");
  
  creationStore = createGraphics(400,400);
}

function setup() {
  createCanvas(400, 400);
  
  trackImages = [track1, track2, track3];

  genPresets();

  customDraw = new DrawData();
  
  
  customDraw.parts.push(new StartLine());
  
  //BUTTONS
  
  //START MENU
  selectButton = createButton('Select Pre-Made Track');
  selectButton.mousePressed(() => setMenuStage(1, null));
  
  customButton = createButton('Create Custom Track');
  customButton.mousePressed(() => setMenuStage(2, null));

  selectButton.position(width/3.15-10, 226);
  customButton.position(width/3-10, 287);
  
  
  //CUSTOM TRACK
  completeButton = createButton('Submit');
  completeButton.mousePressed(() => setMenuStage(3, true));
  completeButton.hide();
  
  //PRESET TRACKS
  confirmButton = createButton('Select');
  confirmButton.mousePressed(() => setMenuStage(3, false));
  confirmButton.hide();
  
  
  //TRAIN AI
  trainButton = createButton('Train Custom AI');
  trainButton.mousePressed(() => setMenuStage(4, false));
  trainButton.hide(); 
  
  //PRESET AI
  presetButton = createButton('Use Preset AI');
  presetButton.mousePressed(() => setMenuStage(4, true));
  presetButton.hide();
  
  trainButton.position(width/2.7, height*0.5);
  presetButton.position(width/2.6, height*0.6);
  
  
  timerSlider = createSlider(200, 1000, 500);
  timerSlider.style('width', '80px');
  timerSlider.hide();
  timerSlider.size(200,20);
  
  
  checkbox = createCheckbox('Disable Timer', false);
  checkbox.hide();
  
  simControls = createCheckbox('Show Controls', false);
  simControls.hide();
  
  //RETURN TO TRACK SELECTION
  returnButton = createButton('Return to track selection');
  returnButton.mousePressed(() => setMenuStage(1, null));
  returnButton.size(160,AUTO)
  returnButton.position(width-160, height);
  returnButton.hide();
  
  //CREATE CUSTOM
  reCustomButton = createButton('Create Custom Level');
  reCustomButton.mousePressed(() => setMenuStage(2, null));
  reCustomButton.size(150,AUTO)
  reCustomButton.position(width-150, height);
  reCustomButton.hide(); 
  
}

function draw() {
  background(220);
  
  
 
  switch(menuStage){
    case 0:
    {
      startMenu();
      break;
    }
    case 1:
    {
      stageSelect();
      break;
    }
    case 2:
    {
      createStage();
      break;
    }
    case 3:
    {
      selectAI();
      break;
    }
    case 4:
    {
      if (runStage){presetCar();}
      else{customCar();}
      break;
    }
  }
   
}


function mousePressed(){
  
  //print(mouseX,mouseY)
  
  if(mouseX>0 && mouseX < width && mouseY>0 && mouseY < height){
     if(menuStage== 2){
    customDraw.createTrack();
  }
} 
  }
  
  


function mouseWheel(event) { 
   if(menuStage== 2){
    customDraw.changeSize(event);
  }
}


function keyPressed(){
/////////////MANUAL RESET 
  
  ////R
  if(keyCode == 82){
    if(runStage != null){
      if(runStage === true){
        car.reset();
      }else{
        population.roundReset();          
      }
    }
  }
  
  ////P
  if(keyCode == 80){
    /////////////////PRINT GENES
    print("SPEED - ")
    print(topSpeedWeights);
    print("STEER - ")    
    print(topSteerWeights);   
  }
  
  
  if(menuStage == 1){
    ////A
    if(keyCode == 65){
      trackSelection--;
      if(trackSelection<0){  trackSelection = numTracks-1;  }
    }

    ////D
    if(keyCode == 68){
      trackSelection++;
      if(trackSelection>numTracks-1){  trackSelection = 0;  }
    }    
  }

}

function calcMovement(){
  
  let movement = 0;
  
  if(keyIsDown(65)){movement--}
  
  if(keyIsDown(68)){movement++}
  
  movement *= 0.1
  
  car.move(movement);
  
}
