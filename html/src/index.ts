import * as World from '../../dist/world';
import * as Actor from '../../dist/actor';
import * as Engine from '../../dist/engine';


// This function print each state of the Engine.
// It's also calling the next tick.
// The function is asynchronous to allow the user to click on the board.
async function play(matrix: number[][], spawn: number[], end: number[], actors: Actor.actor[], actions: ((actor: Actor.actor, actorArray: Actor.actor[], world: number[][]) => number[][])[], tick: number, count: number, lifePoint: number, tower: number) {
    const heart: Array<string> = Array.from({ length: lifePoint - count }, () => ' 💚').concat(Array.from({ length: count }, () => ' 🖤'));
    const attackers_array: Array<string> = Array.from({ length: actors.filter(actor => actor.actorID === Engine.type.attacker || actor.actorID === Engine.type.megAttacker || actor.actorID === Engine.type.speedAttacker).length }, () => ' 👾');
    const gameInfoElement = document.getElementById("game-info");
    if (gameInfoElement) {
        gameInfoElement.innerHTML = `
          <p>Tick: ${tick}</p>
          <p>Count: ${heart}</p>
          <p>Attackers: ${attackers_array}</p>
          <p>Defenders: ${actors.filter(actor => actor.actorID === 3).length}</p>
          <p>Attackers lifepoints: ${actors.filter(actor => actor.actorID === Engine.type.attacker || actor.actorID === Engine.type.megAttacker).map(actor => actor.lifePoint)}</p>
          <p>Defenders lifepoints: ${actors.filter(actor => actor.actorID === Engine.type.tower).map(actor => actor.lifePoint)}</p>
          
        `;
    }
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    let i = 0;
    const gameboard = document.getElementById("board");
    if (gameboard) {
        gameboard.innerHTML = `
        <style> #board{ background-image: url("./espace.webp");}</style>
        <p>${matrix.map(row => row.map(cell => {
            if (cell === Engine.type.start) {
                return '🚩';
            } else if (cell === Engine.type.end) {
                return '🏁';
            } else if (cell === Engine.type.land) {
                if (!Engine.typeOfGame.lvl1) {
                    return '🌫️';
                }
                else {
                    return '🌴';
                }
            } 
            else if (cell === Engine.type.megAttacker){
                return '🦸';
            }else if (cell === Engine.type.path) {
                return '🌌';
            } else if (cell === Engine.type.river) {
                return '🌊';
                
            }else if (cell === Engine.type.speedAttacker) {
                return '🚗';
            } else if (cell === Engine.type.tower) {
                
                if (!Engine.typeOfGame.lvl1) {
                    return '🏰';                }
                else {
                    return '🎣';
                }
            } else if (cell === Engine.type.attacker) {
                if (!Engine.typeOfGame.lvl1) {
                    return '🛸';
                }
                else {
                    return '🐠';
                }
            } else if (cell === -5) {
                const buttonHtml = `<button id="${x[i]}" class="clickable-cell">⭕️
                <style> 
                .clickable-cell {
                    font-size: 45px; 
                    text-align: center;
                } </style>
                </button>`;
                i++;
                return buttonHtml;
            }
            else {
                return '';
            }
        }).join('')).join('<br>')}</p>
        
        `;
        // if (!Engine.typeOfGame.lvl1){
        // gameboard.style.backgroundImage = 'url(../src/espace.webp)';
        //}
        
    }
    const item = document.getElementById("item");
    if (item) {
        item.innerHTML = `
        <p> Number of towers left: ${tower}</p>
        `;
    }
    const result = matrix.reduce((acc, row, i) => {
        const j = row.indexOf(-5);
        const j_second = row.indexOf(-5, j + 1);
        if (j !== -1) {
            acc.push([i, j]);
        }
        if (j_second !== -1) {
            acc.push([i, j_second]);
        }
        
        return acc;
    }, []);
    const clickableCells = document.querySelectorAll('.clickable-cell');
    if (clickableCells && tower > 0 && Engine.typeOfGame.acc > 0) {
        await new Promise<void>((resolve) => {
            clickableCells.forEach(cell => {
                cell.addEventListener('click', () => {
                    const index = parseInt(cell.id) - 1;
                    const newTower = Actor.createActorDefence();
                    const i = result[index][0];
                    const j = result[index][1];
                    matrix = Engine.spawnActor(matrix, newTower, [i, j], actors, Engine.type.tower);
                    tower--;
                    Engine.typeOfGame.acc--;
                });
                resolve();
            });

        });
    }
    const stopGame = document.getElementById("Stop-button");
    if (stopGame) {
        stopGame.addEventListener("click", () => { 
            if (gameButton){
                if(getComputedStyle(gameButton).display === "none"){
                    gameButton.style.display = "block";
                }
            }
            if (lvl1Button){
                if(getComputedStyle(lvl1Button).display === "none"){
                    lvl1Button.style.display = "block";
                }
            }
            count = lifePoint + 1; });
    }
    const pauseGame = document.getElementById("Pause-button");
    if (pauseGame) {
        await new Promise<void>((resolve) => {
            pauseGame.addEventListener("click", () => {
                resolve();
            });
        });
    }
    setTimeout(() => {
        if (count >= lifePoint) {
            return 0;
        }
        if (Engine.hasReachedEnd(matrix, actors, end)) {
            return Engine.oneTick(matrix, spawn, end, actors, actions, tick + 1, count + 1, lifePoint, tower,  play);
        }
        return Engine.oneTick(matrix, spawn, end, actors, actions, tick + 1, count, lifePoint, tower,  play);
    }, 250);
}






// ---------- Main ----------

const launchGame = () => {
    const ntower = 10;
    const width = 20;
    const height = 10;
    Engine.typeOfGame.acc = 10;
    Engine.typeOfGame.lvl1 = false;
    Engine.typeOfGame.auto = true;
    const pathPoints = World.selectRandomlyPathPoints(width, height);
    const world = World.createWorld(width, height, pathPoints);
    const spawn = [0, world[0].indexOf(-2)];
    const end = [world.length - 1, world[world.length - 1].indexOf(-1)];
    const actorArray: Actor.actor[] = [];
    const actionArray: ((actor: Actor.actor, actorArray: Actor.actor[], world: number[][]) => number[][])[] = [Engine.attack, Engine.move];
    const towerPlaces = Engine.chooseTowerPlaces(world, ntower);
    const tick = 0;
    const count = 0;
    const lifepoint = 5; 
    play(world, spawn, end, actorArray, actionArray, tick, count, lifepoint, 5);
};

const launchGamelvl1 = () => {
    const tower = 5;
    Engine.typeOfGame.acc = 9;
    Engine.typeOfGame.lvl1 = true;
    Engine.typeOfGame.auto = true;
    const wrd = [
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, -5, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2
        ],
        [
            0, 0, 0, 0, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2
        ],
        [
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2
        ],
        [
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, -5, 0, 0, 0, 0, 0, 0, 0, 2
        ],
        [
            2, 2, 0, 0, 0, 0, 0, 0, -5, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
        ],
        [
            2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
        ],
        [
            2, 2, 0, 0, 0, 0, 0, 0, -5, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        [
            2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        [
            2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        [
            2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        [
            2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, -5, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        [
            2, 2,-5, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        [
            2, 2, 0, 0, 0, 0, 0, 0, -5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        [
            2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        [
            -1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]
    ];
    const spawn = [0, wrd[0].indexOf(-2)];
    const end = [wrd.length - 1, wrd[wrd.length - 1].indexOf(-1)];
    const actorArray: Actor.actor[] = [];
    const actionArray: ((actor: Actor.actor, actorArray: Actor.actor[], world: number[][]) => number[][])[] = [Engine.attack, Engine.move];
    const tick = 0;
    const count = 0;
    const lifepoint = 3; 
    play(wrd, spawn, end, actorArray, actionArray, tick, count, lifepoint, tower);
};



// ------------------  LVL 1 ------------------  //

const lvl1Button = document.getElementById("lvl1-button");
if (lvl1Button) {
    lvl1Button.addEventListener("click", () => { 
        if (gameButton){
            if(getComputedStyle(gameButton).display !== "none"){
                gameButton.style.display = "none";
            }
        }
          launchGamelvl1(); });
}

// ------------------  Random Generation ------------------  // 

const gameButton = document.getElementById("Launch-button");
if (gameButton) {
    gameButton.addEventListener("click", () => { 
        if (lvl1Button){
            if(getComputedStyle(lvl1Button).display !== "none"){
                lvl1Button.style.display = "none";
            }
        }
        launchGame(); });
}





