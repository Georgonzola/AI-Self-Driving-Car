class Genetics{
  constructor(mutation, popNum, x,y,r,s){
    
    this.numGenerations = 0;
    
    this.matingPool = [];
    this.mutationRate = mutation;
    
    this.bestScore = null;
    this.worstScore = null;
    
    this.bestIndex = null;
    
    this.population = [];
    for (let i = 0; i < popNum; i++) {
      this.population.push(new Car(x,y,r,s));
    } 
    
    this.endRound = false;
    
  }
  
  process(walls){
    for (let i = 0; i < this.population.length; i++) {

      this.population[i].process(walls);
    }
    
    for (let i = 0; i < this.population.length; i++) {
      if(this.population[i].dead == false)  {  return;  }
    }
    
    //print("NEW ROUND - ALL DEAD");
    
    frameStore = frameCount;
    roundCounter++;
    
    this.endRound = true;
    this.roundReset();
  }
  
  
  
  roundReset(){

    this.calcFitness()
    this.getSuccessBounds();
    
    topSpeedWeights = [this.population[this.bestIndex].brain.speedWeights]
    topSteerWeights = [this.population[this.bestIndex].brain.steerWeights]
    
    this.naturalSelection();
    this.generate();

  }
  
  calcFitness(){
      for (let i = 0; i < this.population.length; i++) {
        this.population[i].calcFitness();
      }
  }
  
  getSuccessBounds(){
    let winningScore = 0;
    let losingScore = Infinity;
    
    let winner;
    
    for (let i = 0; i < this.population.length; i++) {
      
      
      if(this.population[i].score > winningScore)
      {
        winningScore = this.population[i].score;
        winner = i;
      }
      
      if(this.population[i].score < losingScore)
      {  losingScore = this.population[i].score;  }
      
    }
    
    this.bestScore = winningScore;
    this.worstScore = losingScore;
    this.bestIndex = winner;
  }

  naturalSelection(){
    this.matingPool = [];
    let fitness;
    
    
    for (let i = 0; i < this.population.length; i++) {
      
      fitness = map(this.population[i].score, this.worstScore, this.bestScore,0,1);
      
      let n = floor(fitness * 100);
      
      for (let j = 0; j < n; j++) {  this.matingPool.push(this.population[i]);  }  
      
    }
  }
  
  generate(){
    
    //Refill the population with children from the mating pool
    for (let i = 0; i < this.population.length; i++) {
      //Get random parents
      let a = floor(random(this.matingPool.length));
      let b = floor(random(this.matingPool.length));
      
      
      let partnerA = this.matingPool[a].brain;
      let partnerB = this.matingPool[b].brain;
      //Calculate Child     
      let child = partnerA.reproduce(partnerB);
      //Mutate Child
      child.brain.mutate(this.mutationRate);
      //Add Child
      this.population[i] = child;
    }
    //Increment generations counter
    this.generations++; 
  }
  
  
}