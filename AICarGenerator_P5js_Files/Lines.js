class WallLine{
  constructor(x1,y1,x2,y2){
    this.point1 = createVector(x1,y1);
    this.point2 = createVector(x2,y2);
  }
  
  drawLine(){
    
    push();
    strokeWeight(2);
    stroke(101,0,12);
    line(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
    pop();
  }
  
}

class CarLine{
  constructor(p1,p2){
    this.point1 = p1;
    this.point2 = p2; 
    this.length = dist(p1.x,p1.y,p2.x,p2.y);
  }
  
  
  setPoints(p1,p2){
    this.point1 = p1;
    this.point2 = p2;
  }
  
  drawLine(){
    line(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
  }
  
  
  calcIntersect(walls){
    
        let point;
    
    for(let i = 0; i< walls.length; i++)
      {
        point = this.checkIntersect(walls[i])
        if(point){
          let distance = dist(this.point1.x,this.point1.y,point.x,point.y)
          if(distance < this.length){  return true;  }        
        }  
      }
    return false;
  }
  
    calcIntersectSingular(wall){
    
      let point;
    

      point = this.checkIntersect(wall)
      if(point){
        let distance = dist(this.point1.x,this.point1.y,point.x,point.y)
        if(distance < this.length){  return true;  }        
      }  
      
    return false;
  }
  
  
  
  checkIntersect(wall){
    const x3 = this.point1.x;
    const y3 = this.point1.y;
    const x4 = this.point2.x;
    const y4 = this.point2.y;  
    
    const x1 = wall.point1.x;
    const y1 = wall.point1.y;
    const x2 = wall.point2.x;
    const y2 = wall.point2.y;
    
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if(den == 0){
      return false;
    }
      
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if(t > 0 && t < 1 && u > 0){
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    }      else{
      return false;
    }
        
  }
  
}

class SensorLine{
  constructor(p1,p2){
    this.point1 = p1;
    this.point2 = p2;
    this.stopPoint = null;
    this.active = false;
    this.distance = null;

    this.rayDistance = 90;   
    
    this.value = 0;
  }
 
  
  setValue(){
    
    
    if(this.distance){
      this.value = map(this.distance, 0, this.rayDistance, 1,0);
    }else{
      this.value = 0;
    }
  }
  
  setPoints(p1,p2){
    this.point1 = p1;
    this.point2 = p2;
    
    this.rayDistance = dist(this.point1.x,this.point1.y, this.point2.x,this.point2.y)
  }
  
  drawLine(){
    if(!this.active){
    push(); 
    stroke(20,20,20, 50);
    line(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
    pop();
    }else{
      push();
      stroke(255,20,20, 50);
      line(this.point1.x, this.point1.y, this.stopPoint.x, this.stopPoint.y); 
      pop();
    }

  }
   
  calcIntersect(walls){

       
    this.active = false;
    this.stopPoint = null;
    this.distance = null;
    
    
    let point;
    
    let closestDistance = Infinity;
    
    let closestPoint = null;
    
    
    for(let i = 0; i< walls.length; i++)
      {
        point = this.checkIntersect(walls[i])
        if(point){
          //ellipse(point.x,point.y, 10);
          let distance = dist(this.point1.x,this.point1.y,point.x,point.y)
          if(distance < closestDistance){
            closestDistance = distance;
            closestPoint = point;}        
        }
        //print("intersecting")    
      }
    
   if(closestDistance <= this.rayDistance){
     this.active = true;
     this.stopPoint = closestPoint;
     this.distance = closestDistance;
   }
    
    this.setValue();
  }
  
  checkIntersect(wall){
    
    const x3 = this.point1.x;
    const y3 = this.point1.y;
    const x4 = this.point2.x;
    const y4 = this.point2.y;  
    
    const x1 = wall.point1.x;
    const y1 = wall.point1.y;
    const x2 = wall.point2.x;
    const y2 = wall.point2.y;
    
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if(den == 0){
      return false;
    }
      
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if(t > 0 && t < 1 && u > 0){
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    }      else{
      return false;
    }
    
  } 

}