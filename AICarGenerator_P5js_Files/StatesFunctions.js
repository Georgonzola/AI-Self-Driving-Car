let showControl = false;

let roundTime = 0;

let frameStore = 0;

let runTime = 500;

let roundCounter = 0;

function startMenu(){
  
  push();
  
  imageMode(CENTER)
  image(titleImage,200,200,width,height)
  textAlign(CENTER, CENTER);
  textSize(30)
  text("AI Car",190, 110);
  text("Generator",190, 150);  
  pop();
  
  for(let i = 1; i<5; i++){
    
    push();
    let temp = (i*80)
    translate(temp, 350);
  
    rectMode(CENTER);
    scale(3);
    
    fill(25, 68, 138, 200);
    rect(0,0,20,10);
    fill(33, 27, 28);
    rect(-6,-6,5,3);
    rect(6,-6,5,3);
    rect(-6,6,5,3);
    rect(6,6,5,3);
    
    pop();
  }
    
}

function stageSelect(){
  push();
  
  textAlign(CENTER, CENTER);
  textSize(30);
  
  text("Track",width/2, 30);
  let temp = trackSelection+1;
  
  text(temp,width/2, 60);
  text("<A",30, height/2);
  text("D>",width-30, height/2);
  
  textSize(20);  
  text(trackNames[trackSelection],width/2,90);
  
  imageMode(CENTER);
  image(trackImages[trackSelection],200,250,200,200)
  pop(); 
}

function createStage(){
  background(99,47,38);
  //customDraw
  
  //SET CURRENT TRACK SECTION VALUES
  if(!customDraw.complete){
    
    if (keyIsDown(65)){
      customDraw.sizing--
      if(customDraw.sizing < customDraw.sizeMin){  customDraw.sizing = customDraw.sizeMin  }
    }
    if (keyIsDown(68)){
      customDraw.sizing++
      if(customDraw.sizing > customDraw.sizeMax){  customDraw.sizing = customDraw.sizeMax  }
    } 
    
    
    //snap track to start
    if(keyIsDown(16)&& customDraw.startMade){

     customDraw.parts[customDraw.sectionNum].setData(createVector(customDraw.parts[0].midPoint.x, customDraw.parts[0].midPoint.y), customDraw.parts[0].rotation, customDraw.parts[0].size); 
    
      
    //regular track data
    }else{
     customDraw.parts[customDraw.sectionNum].setData(createVector(mouseX,mouseY), customDraw.rotation, customDraw.sizing);     
    } 
  }
  
  //draw track  
  for(let i = 0; i < customDraw.parts.length; i++){
    customDraw.parts[i].draw();
  } 
  
  
  
  if(customDraw.complete == true){
    completeButton.show();
  }
  
  showControls = simControls.checked();
  
  if(showControls){
    push();
    imageMode(CENTER)
    tint(255,170);
    image(controls1,200,200,width,height);
    pop();
  }
  
}

function selectAI(){
  push();
  imageMode(CENTER);
  image(trackImages[trackSelection],200,200,width,height)
  stroke(255)
  textStyle(BOLD);  
  textAlign(CENTER, CENTER);
  textSize(40)
  text("Select Mode",width/2, height/3);
  pop();
  
  
}

function presetCar(){
  currentTrack.draw(false);

  car.process(currentTrack.walls);

  showControls = simControls.checked();
  
  if(showControls){
    push();
    imageMode(CENTER)
    tint(255,170);
    image(controls2,200,200,width,height);
    pop();
  }
  
}


function customCar(){

  currentTrack.draw(true);
  population.process(currentTrack.walls);
  runTime = timerSlider.value();

  if(!checkbox.checked()){
  
  push();
  textAlign(LEFT, TOP);
  textSize(30);
  fill(255);
  text(roundTime,5, 5);
  
  timer();
  textSize(20);  
  textAlign(RIGHT, TOP); 
  text("ROUND TIME:",width-5, 5); 
  text(runTime,width-5, 25);
  pop();    
  }

  showControls = simControls.checked();
  
  if(showControls){
    push();
    imageMode(CENTER)
    tint(255,170);
    image(controls2,200,200,width,height);
    pop();
  }
  
}


function setMenuStage(num, change){
  menuStage = num;
  
  if(num == 1 || num == 2){
    customButton.hide();
    selectButton.hide();    
  }
  
  if(num == 1){
    trackSelection = 0;
    confirmButton.show();   
    returnButton.hide();
    timerSlider.hide();
    checkbox.hide();
    simControls.hide(); 
    trainButton.hide(); 
    presetButton.hide(); 
    
  if(customTrack == undefined){
    reCustomButton.show(); 
  }
    
  }
  
  if(num == 2){
    confirmButton.hide();
    simControls.show();  
    reCustomButton.hide();
  }

  
  if(num == 3){
    setTrack(change);
    reCustomButton.hide();
    confirmButton.hide();  
    completeButton.hide();
    trainButton.show(); 
    presetButton.show();
    simControls.hide();
    returnButton.show();
  }
  
  if(num == 4){
    trainButton.hide(); 
    presetButton.hide(); 
    runStage = change;
    createSubject(change);
    //returnButton.show();
  }

}

function setTrack(create){
  if(create){
    
    let temp = customDraw.parts[0].rotation - 90;
  
    if(temp < 0 ){temp = 360 + temp;}

    let loc = createVector(customDraw.parts[0].midPoint.x, customDraw.parts[0].midPoint.y);
    
    let rot = radians(temp);

    let walls = customDraw.coordStore;
    
    let check = customDraw.checkStore;
    
    customTrack = new Track(loc, rot, walls, check);
    
    currentTrack = customTrack;
    
    numTracks = 4;
    
    presetTracks.push(customTrack);
    
    customTrack.draw(false, creationStore)
    ///addIMAGE

    trackImages.push(creationStore);  
    trackSelection = 3;
    
  }
  else{   
    currentTrack = presetTracks[trackSelection];
  }
}

function createSubject(preset){
  simControls.show();
  simControls.checked(false);
  if(preset){
    //CREATE SINGLE CAR
    car = new Car(currentTrack.startLocation.x,currentTrack.startLocation.y,currentTrack.startRotation,2, true);
    car.brain.steerWeights = presetSteerWeights;
    car.brain.speedWeights = presetSpeedWeights;
    ///SET WEIGHTINGS
  }else{
    //CREATE POPULATION
    population = new Genetics(0.1,popNum, currentTrack.startLocation.x,currentTrack.startLocation.y,currentTrack.startRotation,2, false); 
    frameStore = frameCount;
    timerSlider.show();
    checkbox.show();
  }
  
}

function timer(){
  
    if ((frameCount - frameStore) > runTime){
      frameStore = frameCount;
      roundCounter++;
      //print("NEW ROUND - TIME")
      
      population.endRound = true;
      population.roundReset();
      
    }
  
    //Increment Timer 
  roundTime = frameCount - frameStore;
  
  
}