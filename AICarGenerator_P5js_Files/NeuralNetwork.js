

class Neuron{
  constructor(num){   
    this.steerWeights = [];
    
    for(let i =0; i< num; i++){  this.steerWeights.push(random(-1,1));  }
    
    this.speedWeights = [];
    
    for(let i =0; i< num; i++){  this.speedWeights.push(random(-1,1));  }
    
  }
  
  feedForwardSteer(inputs){
    
    //////////////INPUTS ARE SENSORS + BIAS
    let sum = 0;
    
    for (let i=0; i< this.steerWeights.length; i++)
    
    {  sum += inputs[i]*this.steerWeights[i];  }
    
    
    ////RETURN STEERING FORCE
    sum*=0.03
    
    return sum;
  }
  
  feedForwardSpeed(inputs){
    
    //////////////INPUTS ARE SENSORS + BIAS
    let sum = 0;
    
    for (let i=0; i< this.speedWeights.length; i++)
    
    {  sum += inputs[i]*this.speedWeights[i];  }
    
    
    ////RETURN STEERING FORCE
    return sum;
  }
  
  
  reproduce(spouse){
    let child = new Car(currentTrack.startLocation.x,currentTrack.startLocation.y,currentTrack.startRotation,2);
    
    for(let i = 0; i< child.brain.steerWeights.length; i++){
      child.brain.steerWeights[i] = (this.steerWeights[i] + spouse.steerWeights[i])/2;
    }
    
    for(let i = 0; i< child.brain.speedWeights.length; i++){
      child.brain.speedWeights[i] = (this.speedWeights[i] + spouse.speedWeights[i])/2;
    }
   
    return child;
  }
  
  mutate(mutationRate){
    for (let i = 0; i < this.steerWeights.length; i++) {
      if (random(1) < mutationRate) {this.steerWeights[i] += random(-0.2,0.2);}
      if (random(1) < mutationRate) {this.speedWeights[i] += random(-0.2,0.2);}
    }
  }
}