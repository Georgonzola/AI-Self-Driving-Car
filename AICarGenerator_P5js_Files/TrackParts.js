class Road{
  constructor(l,r){
    this.leftPoints = [l,createVector(0,0)];
    this.rightPoints = [r,createVector(0,0)];
    this.rotation = null;
    this.size = null;
    this.midPoint = createVector(0,0);
  }
  
  setData(mid, rot, s){
    this.rotation = rot;
    this.midPoint = mid;
    this.size = s;
    
    this.leftPoints[1] = createVector(0,0);
    this.rightPoints[1] = createVector(0,0);
    

      
    this.leftPoints[1].add(this.midPoint); 
    this.rightPoints[1].add(this.midPoint);
    
    let temp
    temp = p5.Vector.fromAngle(radians(this.rotation), this.size)  
    
    this.leftPoints[1].add(temp)
    
    temp = p5.Vector.fromAngle(radians(this.rotation+180), this.size)  
    
    this.rightPoints[1].add(temp)
    
  }
  
  draw(){
    
    push();
    fill(181,163,110)
    noStroke();
    quad(this.leftPoints[0].x, this.leftPoints[0].y, this.leftPoints[1].x, this.leftPoints[1].y, this.rightPoints[1].x, this.rightPoints[1].y, this.rightPoints[0].x, this.rightPoints[0].y);
    pop();
    
    push();
    strokeWeight(2);
    stroke(101,0,12);
    line(this.leftPoints[0].x, this.leftPoints[0].y, this.leftPoints[1].x, this.leftPoints[1].y);
    line(this.rightPoints[0].x, this.rightPoints[0].y, this.rightPoints[1].x, this.rightPoints[1].y);
    pop();
    
    
  }
}

class StartLine{
  constructor(){
    this.leftPoint = createVector(0,0);
    this.rightPoint = createVector(0,0);
    this.rotation = null;
    this.size = null;
    this.midPoint = createVector(0,0);
  }
  
  setData(mid, rot, s){
    this.rotation = rot;
    this.midPoint = mid;
    this.size = s;
    
    this.leftPoint = createVector(0,0);
    this.rightPoint = createVector(0,0);
    

      
    this.leftPoint.add(this.midPoint); 
    this.rightPoint.add(this.midPoint);
    
    let temp
    temp = p5.Vector.fromAngle(radians(this.rotation), this.size)  
    
    this.leftPoint.add(temp)
    
    temp = p5.Vector.fromAngle(radians(this.rotation+180), this.size)  
    
    this.rightPoint.add(temp)
    
  }
  
  draw(){
    push();
    strokeWeight(2);
    stroke(0,127,70);
    line(this.leftPoint.x, this.leftPoint.y, this.rightPoint.x, this.rightPoint.y );
    pop();
  }
  
  
  
}

class DrawData{
  constructor(){
    this.sectionNum = 0;
    this.rotation = 90;
    this.sizeMax = 40;
    this.sizeMin = 10;
    this.sizing = 20;
    
    this.parts = [];
    
    this.coordStore = [];
    
    this.checkStore = [];
    
    this.complete = false;
    
    this.startMade = false;
    
    this.startClick = false;
  }
  
  
  draw(){
    
  }
  
  createTrack(){
    
    if(!this.complete){
      if(this.startClick){
        if(this.startMade){
          if (keyIsDown(16)){this.complete = true;} 
          this.coordStore.push(floor(this.parts[this.sectionNum].leftPoints[0].x));
          this.coordStore.push(floor(this.parts[this.sectionNum].leftPoints[0].y));

          this.coordStore.push(floor(this.parts[this.sectionNum].leftPoints[1].x));
          this.coordStore.push(floor(this.parts[this.sectionNum].leftPoints[1].y));

          this.coordStore.push(floor(this.parts[this.sectionNum].rightPoints[0].x));
          this.coordStore.push(floor(this.parts[this.sectionNum].rightPoints[0].y));

          this.coordStore.push(floor(this.parts[this.sectionNum].rightPoints[1].x));
          this.coordStore.push(floor(this.parts[this.sectionNum].rightPoints[1].y));


          this.checkStore.push(floor(this.parts[this.sectionNum].leftPoints[1].x));
          this.checkStore.push(floor(this.parts[this.sectionNum].leftPoints[1].y));

          this.checkStore.push(floor(this.parts[this.sectionNum].rightPoints[1].x));
          this.checkStore.push(floor(this.parts[this.sectionNum].rightPoints[1].y));

          if(!this.complete){
            this.parts.push(new Road( this.parts[this.sectionNum].leftPoints[1], this.parts[this.sectionNum].rightPoints[1]));    
          }
        }else{
          this.startMade = true;
          this.parts.push(new Road( this.parts[this.sectionNum].leftPoint, this.parts[this.sectionNum].rightPoint));
        }

        this.sectionNum++;   


      }else{
        this.startClick = true;
      }
    }
    
    
    
  }
  
  changeSize(event){
    this.rotation -= event.delta * 0.05;
  }
  
  
}