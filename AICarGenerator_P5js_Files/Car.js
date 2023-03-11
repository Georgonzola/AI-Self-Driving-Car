class Car{
  constructor(x,y,r,s, pre){
    this.startLocation = createVector(x,y);
    this.startRotation = r;
    this.location = createVector(x,y);
    this.rotation = r;
    this.speed = s;
    this.baseSpeed = s;
    this.size = createVector(18,8);
    
    this.cornerPoints = [createVector(0,0), createVector(0,0), createVector(0,0), createVector(0,0)];
    this.setCornerPoints();
    this.lines = [];
    this.sensorDistance = 80;
    this.sensors = [];
    this.numSensors = 9;
    this.createLines();
    //////////////////////////////////////////////////    
    this.dead = false;    
    this.currentCheckpoint = 0; 
    this.totalCheckpoints = 0;
    this.brain = new Neuron(this.numSensors+1);
    this.score = 0;
    
    this.preset = pre;
    
  }
  
  reset(){
    //print(currentTrack.startLocation)
    
  
    this.location = createVector(0,0);
    this.rotation = currentTrack.startRotation
    
    
    this.location.add(currentTrack.startLocation);
          
    topSpeedWeights = [this.brain.speedWeights];
    topSteerWeights = [this.brain.steerWeights];
    
  }
  
  process(walls){
    this.setLines();
    this.checkCollision(walls);
    this.checkSensors(walls);
    
    if(!this.preset){
      this.checkCheckpoint();  
      this.calcFitness();
    }

    this.drawEntity();    
    this.neuralMove();
  }
  
  calcFitness(){
      
    let carDistance = dist(this.location.x,this.location.y, currentTrack.checkpoints[this.currentCheckpoint].midPoint.x, currentTrack.checkpoints[this.currentCheckpoint].midPoint.y);
    let totalDistance;
    if(this.currentCheckpoint >0){
      totalDistance = dist(currentTrack.checkpoints[this.currentCheckpoint-1].midPoint.x, currentTrack.checkpoints[this.currentCheckpoint-1].midPoint.y, currentTrack.checkpoints[this.currentCheckpoint].midPoint.x, currentTrack.checkpoints[this.currentCheckpoint].midPoint.y);
    }else{
      totalDistance = dist(this.startLocation.x,this.startLocation.y, currentTrack.checkpoints[this.currentCheckpoint].midPoint.x, currentTrack.checkpoints[this.currentCheckpoint].midPoint.y);
    }
    
    if(carDistance > totalDistance){
      carDistance = totalDistance;
    }
    
    let percentage = map(carDistance, 0, totalDistance, 1, 0);
    
    this.score = this.totalCheckpoints+percentage;
  }
  
  createLines(){
    for(let i = 0; i<4; i++){
      let second = i+1;
      
      if (second>3){  second = 0;  }
      this.lines[i] = new CarLine(this.cornerPoints[i], this.cornerPoints[second]);
    }
    
    for(let i = 0; i<this.numSensors; i++){ 
      let rotation = this.rotation - PI/4;
      rotation += i*PI/8;
      let v = p5.Vector.fromAngle(rotation, this.sensorDistance);
      v.x+=this.location.x;
      v.y+=this.location.y;
      this.sensors[i] = new SensorLine(this.location,this.location+v);
    }
  }
  
  drawEntity(){
    push();
    noStroke();
    translate(this.location.x, this.location.y);
    rotate(this.rotation);
    rectMode(CENTER);
    
    scale(1);
    
    fill(25, 68, 138, 200);
    rect(0,0,this.size.x,this.size.y);

    fill(33, 27, 28);
    rect(-6,-6,5,3);
    rect(6,-6,5,3);
    rect(-6,6,5,3);
    rect(6,6,5,3);
    pop();
    
    
    /////DRAW COLLISION LINES
    for(let i = 0; i<4; i++){
      this.lines[i].drawLine();
    }
    
    ////////DRAW SENSOR LINES
    for(let i = 0; i<this.numSensors; i++){
      this.sensors[i].drawLine();
    }
  }
  
  setCornerPoints(){
    this.cornerPoints[0].x = this.location.x + (this.size.x/2  * cos(this.rotation)) - (this.size.y/2 * sin(this.rotation));
    this.cornerPoints[0].y = this.location.y + (this.size.x/2  * sin(this.rotation)) + (this.size.y/2 * cos(this.rotation));
    
    this.cornerPoints[1].x = this.location.x + (this.size.x/2  * cos(this.rotation)) - (-this.size.y/2 * sin(this.rotation));
    this.cornerPoints[1].y = this.location.y + (this.size.x/2  * sin(this.rotation)) + (-this.size.y/2 * cos(this.rotation));
    
    this.cornerPoints[2].x = this.location.x + (-this.size.x/2  * cos(this.rotation)) - (-this.size.y/2 * sin(this.rotation));
    this.cornerPoints[2].y = this.location.y + (-this.size.x/2  * sin(this.rotation)) + (-this.size.y/2 * cos(this.rotation));
    
    this.cornerPoints[3].x = this.location.x + (-this.size.x/2  * cos(this.rotation)) - (this.size.y/2 * sin(this.rotation));
    this.cornerPoints[3].y = this.location.y + (-this.size.x/2  * sin(this.rotation)) + (this.size.y/2 * cos(this.rotation));
    

    //for(let i = 0; i<4; i++){
    //  ellipse(this.cornerPoints[i].x, this.cornerPoints[i].y, 10);
    //}   
    
  }
  
  setLines(){
    
    this.setCornerPoints();
    
    /////////////////////////////////CAR COLLISION
    for(let i = 0; i<4; i++){
      let second = i+1;
      if (second>3){
        second = 0;
      }
      this.lines[i].setPoints(this.cornerPoints[i], this.cornerPoints[second]);
    }
   ///////////////////////////////////SENSORS
    
    for(let i = 0; i<this.numSensors; i++){
               
      let rotation = this.rotation - PI/2;
      rotation += i*PI/8;
      let v = p5.Vector.fromAngle(rotation, this.sensorDistance);
      v.x+=this.location.x;
      v.y+=this.location.y;
      this.sensors[i].setPoints(this.location,v);
    }
    
     
  }
  
  checkCollision(walls){
    
    let colliding = false;
    
    for(let i = 0; i<4; i++){

      let temp = this.lines[i].calcIntersect(walls);
      if(temp){
        colliding = true;
        
      }
    }
    
    if(colliding){
      this.dead = true;
    }

  }
  
  checkSensors(walls){
    for(let i = 0; i<this.numSensors; i++){  this.sensors[i].calcIntersect(walls);  }
  }
  
  checkCheckpoint(){
    
    
    ellipse(currentTrack.checkpoints[this.currentCheckpoint].midPoint.x, currentTrack.checkpoints[this.currentCheckpoint].midPoint.y, 10)
        
    for(let i = 0; i<4; i++){

      let temp = this.lines[i].calcIntersectSingular(currentTrack.checkpoints[this.currentCheckpoint]);
      if(temp){
        
        
        this.totalCheckpoints++;

        
        if(this.currentCheckpoint < currentTrack.checkpoints.length-1){
          this.currentCheckpoint++    
        }else{
          this.currentCheckpoint = 0;
        }

        return;
      }
    }

  }
  
  move(movement){
    if(!this.dead){
      this.rotation += movement;
    
      if(this.rotation > 2*PI){  this.rotation = 0;  }
      if(this.rotation < 0){  this.rotation = 2*PI;  }
    
      let v = p5.Vector.fromAngle(this.rotation, this.speed);
      this.location.add(v);      
    }

  }
  
  neuralMove(){

    //////STORE SENSORS 
    let inputs = []
    for(let i= 0; i<this.numSensors; i++){  inputs.push(this.sensors[i].value);  }  
    inputs.push(1); /////////////BIAS 
    
    
    ////////////STEERING    
    let steering;
    steering = this.brain.feedForwardSteer(inputs);
    
    
    //////////////////SPEED  
    let speed;

    
    this.speed = this.brain.feedForwardSpeed(inputs);
       
    if(!this.dead){
      this.rotation += steering;
    
      if(this.rotation > 2*PI){  this.rotation = 0;  }
      if(this.rotation < 0){  this.rotation = 2*PI;  }
    
      let v = p5.Vector.fromAngle(this.rotation, this.speed);
      this.location.add(v);      
    }
  }
  
}