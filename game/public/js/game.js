(function () {

  let FPS = 300;
  const HEIGHT = 300;
  const WIDTH = 1024;
  const PROB_NUVEM = 1;

  let gameLoop;
  let deserto;
  let dino;
  let nuvens = [];
  let frame = 0;
  let isGameStarted = false;
  let obstaculos = [];

  let isDay = true; 
  let turnoIntervalo; 
  const TURNO_DURATION = 60000;

  let velo = 0.5; 
  const TEMPO = 60000;
  let isPaused = false;
  let pontuacao = 0;


  function aumentarVelocidade() {
    if(!isGameStarted && !isPaused && !isGameOver){
      FPS += velo; 
      clearInterval(gameLoop); 
      gameLoop = setInterval(run, 1000 / FPS);
    }
    
  }

  setInterval(aumentarVelocidade, TEMPO);

  function alternarTurno() {
    isDay = !isDay; 
  
    
    setTimeout(function () {
      
      const desertoElement = document.querySelector(".deserto");
  
      
      if (isDay && !isGameOver && !isPaused && isGameStarted) {
        desertoElement.classList.add("noite");
      } else {
        desertoElement.classList.remove("noite");
      }
    }, 100);
  }
  
  turnoIntervalo = setInterval(alternarTurno, TURNO_DURATION);

  function init() {
    alternarTurno();
    gameLoop = setInterval(run, 1000 / FPS)
    deserto = new Deserto();
    dino = new Dino();

    dino.stop();
    deserto.stop();
    nuvens.forEach((nuvem)=>nuvem.stop());
  }

  pontuacao = 0;
  
  
  pontuacaoInterval = setInterval(() => {
    if(isGameStarted){
      pontuacao++; 
      atualizarPontuacao();
    }
     
  }, 1000/30);



  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if(!isGameStarted){
        isGameStarted = true;
        dino.start();
        deserto.start();
        nuvens.forEach((nuvem)=>nuvem.start());
      }else{
        dino.jump();
      }
    }else if (e.code === "ArrowDown") {
      dino.agachar();
    }else if (e.code === "KeyP") { 
      Pause(); 
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowDown") {
      
      dino.pararAgachar();
    }
  });

  function Pause() {
    if (isPaused) {
      isPaused = false;
      gameLoop = setInterval(run, 1000 / FPS);
      pontuacaoInterval = setInterval(() => {
        if (!isGameStarted && !isPaused && !isGameOver) {
        pontuacao++;
        atualizarPontuacao();
        }
      }, 1000/30);
    } else {
      isPaused = true;
      clearInterval(gameLoop);

      clearInterval(pontuacaoInterval);
    }
  }

  class Deserto {
    constructor() {
      this.isMoving = false;
      this.element = document.createElement("div")
      this.element.className = "deserto";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      document.getElementById("game").appendChild(this.element)

      this.chao = document.createElement("div")
      this.chao.className = "chao"
      this.chao.style.backgroundPositionX = 0;
      this.element.appendChild(this.chao)
    }

    start(){
      this.isMoving = true;
    }

    stop(){
      this.isMoving = false;
    }

    mover() {
      if(this.isMoving){
        this.chao.style.backgroundPositionX = `${parseInt(this.chao.style.backgroundPositionX) - 1}px`
      }
      
    }
  }

  class Dino {
    #status
    constructor() {
      this.backgroundPositionsX = {
        correndo1: "-1391px",
        correndo2: "-1457px",
        pulando: "-1259px"
      }
      this.#status = -1; 
      this.altumaMinima = 2;
      this.altumaMaxima = 100;
      this.element = document.createElement("div")
      this.element.className = "dino";
      this.element.style.backgroundPositionX = this.backgroundPositionsX.correndo1;
      this.element.style.backgroundPositionY = "-2px";
      this.element.style.bottom = `${this.altumaMinima}px`
      deserto.element.appendChild(this.element)
      this.isAgachado = false; 
      this.agacharTimeout = null;
    }
    /**
     * @param {number} value
     */
    set status(value) {
      if (value >= -1 && value <= 2) this.#status = value;
    }
    get status() {
      return this.#status;
    }


    start(){
      this.isMoving = true;
      this.status = 0;
    }

    stop(){
      this.isMoving = false;
      this.status = -1;
    }

    jump() {
      if (this.isMoving && this.#status === 0) {
        this.status = 1; 
      }
    }

    agachar() {
      if (this.isMoving && !this.isAgachado) {
        this.isAgachado = true;
        this.element.style.height = "60px"; 
        this.element.style.bottom = "0"; 
        this.element.style.backgroundPositionX = "-1750px"
        this.element.style.backgroundPositionY = "-2px"; 
      }
    }
  
    pararAgachar() {
      if (this.isMoving && this.isAgachado) {
        this.isAgachado = false;
        this.element.style.height = "70px"; 
        this.element.style.bottom = `${this.altumaMinima}px`; 
        this.element.style.backgroundPositionY = "-2px";
      }
    }

    correr() {
      if (this.#status === 0 && frame % 20 === 0) this.element.style.backgroundPositionX = this.element.style.backgroundPositionX === this.backgroundPositionsX.correndo1 ? this.backgroundPositionsX.correndo2 : this.backgroundPositionsX.correndo1;
      else if (this.#status === 1) {
        this.element.style.backgroundPositionX = this.backgroundPositionsX.pulando;
        this.element.style.bottom = `${parseInt(this.element.style.bottom) + 1}px`;
        if (parseInt(this.element.style.bottom) >= this.altumaMaxima) this.status = 2;
      }
      else if (this.#status === 2) {
        this.element.style.bottom = `${parseInt(this.element.style.bottom) - 1}px`;
        if (parseInt(this.element.style.bottom) <= this.altumaMinima) this.status = 0;
      }
    }
  }

  class Nuvem {
    constructor() {
      this.isMoving = false;
      this.element = document.createElement("div");
      this.element.className = "nuvem";
      this.element.style.right = 0;
      this.element.style.top = `${parseInt(Math.random() * 200)}px`
      deserto.element.appendChild(this.element);
    }

    //start(){
      //this.isMoving = true;
    //}

    //stop(){
      //this.isMoving = false;
    //}

    mover() {
      //if (this.isMoving && isGameStarted) {
        //this.element.style.right = `${parseInt(this.element.style.right) + 1}px`;
      //}
      this.element.style.right = `${parseInt(this.element.style.right) + 1}px`;
    }
  }


  class Obstaculo {
    constructor() {
      this.element = document.createElement("div");
      this.element.className = "obstaculo";
      this.element.style.left = "1024px"; 
      
      deserto.element.appendChild(this.element);
    }

    mover() {
      const posicaoAtual = parseInt(this.element.style.left);
      const novaPosicao = posicaoAtual - 1;
      this.element.style.left = `${novaPosicao}px`;

      
      if (novaPosicao < -100) {
        this.element.remove(); 
        return true; 
      }

      return false; 
    }
  }

  class Cacto extends Obstaculo {
    constructor() {
      super();
      this.element.className = "cacto cacto-1";
      this.aparenciaAtual = 1; 
      this.aparenciaMaxima = 2;
      this.intervaloAparencia = setInterval(() => {
        this.alternarAparencia(); 
      }, 30000);
    }
    alternarAparencia() {
      this.aparenciaAtual++;
      if (this.aparenciaAtual > this.aparenciaMaxima) {
        this.aparenciaAtual = 1;
      }
      this.element.className = `cacto cacto-${this.aparenciaAtual}`;
    }

  }

  class Pterossauro extends Obstaculo {
    constructor(altura) {
      super();
      this.element.className = "pterossauro";
      
      this.element.style.top = `${altura}px`;
      
      this.element.style.width = "66px"; 
      this.element.style.height = "60px"; 
      this.posicao1X = "-200px";
      this.posicao1Y = "-5px";
      this.posicao2X = "-265px";
      this.posicao2Y = "-5px";
      
      let alternar = false;

      
      const alternarPosicao = () => {
        
        if (alternar && !isGameOver && isGameStarted && !isPaused) {
          this.element.style.backgroundPositionX = this.posicao1X;
          this.element.style.backgroundPositionY = this.posicao1Y;
        } else {
          this.element.style.backgroundPositionX = this.posicao2X;
          this.element.style.backgroundPositionY = this.posicao2Y;
        }

        
        alternar = !alternar;
      };

      
      alternarPosicao();

      
      setInterval(alternarPosicao, 1000);

      
    }
  }
  
  
  function gerarObstaculo() {
    if (isGameStarted) {
    const random = Math.random();
  
    if (random < 0.4) {
      if (frame % 300 === 0) {
        const altura = Math.floor(Math.random() * 50) + 1; 
        obstaculos.push(new Cacto(altura));
      }
    } else {
      if (frame % 400 === 0) {
        const alturas = [10, 80, 180]; 
        const altura = alturas[Math.floor(Math.random() * alturas.length)];
        obstaculos.push(new Pterossauro(altura));
      }
    }
  }
}

  let isGameOver = false;

// ...

function checkCollisions() {
  if (!isGameOver) {
    
    for (let i = 0; i < obstaculos.length; i++) {
      const obstaculo = obstaculos[i];
      const dinoRect = dino.element.getBoundingClientRect();
      const obstaculoRect = obstaculo.element.getBoundingClientRect();

      
      if (
        dinoRect.right > obstaculoRect.left &&
        dinoRect.left < obstaculoRect.right &&
        dinoRect.bottom > obstaculoRect.top &&
        dinoRect.top < obstaculoRect.bottom
      ) {
        
        gameOver(); 
        break; 
      }
    }
  }
}

function gameOver() {
  isGameOver = true; 
  dino.stop(); 
  clearInterval(gameLoop); 


  pontuacao = 0;
  clearInterval(pontuacaoInterval);
  
  dino.element.style.backgroundPositionX = "-1590px";

  
  const gameOverMessage = document.createElement("div");
  gameOverMessage.className = "game-over-message";
  gameOverMessage.textContent = "Game Over";

  
  const restartButton = document.createElement("div");
  restartButton.className = "restart-button";
  restartButton.textContent = "Restart";

  restartButton.addEventListener("click", () => {
    resetGame();
  });

  
  document.getElementById("game").appendChild(gameOverMessage);
  document.getElementById("game").appendChild(restartButton);

  
}

function resetGame() {
  
  const gameOverMessage = document.querySelector(".game-over-message");
  const restartButton = document.querySelector(".restart-button");
  gameOverMessage.remove();
  restartButton.remove();

  
  nuvens.forEach((nuvem) => nuvem.element.remove());
  obstaculos.forEach((obstaculo) => obstaculo.element.remove());

  
  nuvens = [];
  obstaculos = [];

  
  dino.start();
  isGameOver = false;
  gameLoop = setInterval(run, 1000 / FPS);
}
function atualizarPontuacao() {
  if (isGameStarted && !isPaused && !isGameOver){
    const pontuacaoElement = document.getElementById("pontuacao");
    pontuacaoElement.textContent = `Pontuação: ${pontuacao}`;
  }
  
}
setInterval(() => {
  if (isGameStarted && !isPaused && !isGameOver){
    pontuacao++; 
    atualizarPontuacao();
  }
}, 1000/30);


  function run() {
    checkCollisions();
    if (isPaused) return;
    frame = frame + 1
    if (frame === FPS) frame = 0;
    deserto.mover()
    if (!dino.isAgachado) {
      dino.correr();
    }
    if (Math.random() * 100 <= PROB_NUVEM && isGameStarted) nuvens.push(new Nuvem());
    if (frame % 2 === 0) nuvens.forEach(nuvem => nuvem.mover());

    if (frame % 200 === 0) {
      gerarObstaculo();
    }

    
    for (let i = obstaculos.length - 1; i >= 0; i--) {
      const removeObstaculo = obstaculos[i].mover();
      if (removeObstaculo) {
        obstaculos.shift();
      }
    }
  }

  init();

})()
