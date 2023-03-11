class Checkpoint{
  constructor(p1,p2){
    this.point1 = p1;
    this.point2 = p2;
    
    
    let temp1 = p1.x - p2.x;
    let temp2 = p1.y - p2.y;
    this.midPoint = createVector(p1.x-temp1/2, p1.y-temp2/2 );
    this.index = null;
  }
  
  
  draw(){
    push();
    strokeWeight(3);
    stroke(30,255,30);
    line(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
    //ellipse(this.midPoint.x,this.midPoint.y,10)
    pop();
  }
  
}