import * as World from './world.js';
import * as Actor from './actor.js';
import * as Engine from './engine.js';

// This function print each state of the Engine.
// It is called recursively until the game is over.
// It is called with a setTimeout to slow down the game.
function play(matrix: number[][], spawn: number[], end: number[], actors: Actor.actor[], actions: ((actor: Actor.actor, actorArray: Actor.actor[], world: number[][]) => number[][])[], tick: number, count: number, lifePoint: number, tower: number): number {
    console.log('Tick: ' + tick);
    console.log('Count: ' + count + '/' + lifePoint);
    console.log('Attackers: ' + actors.filter(actor => (actor.actorID === Engine.type.attacker) || (actor.actorID === Engine.type.megAttacker) || (actor.actorID === Engine.type.speedAttacker) ).length);
    console.log('Defenders: ' + actors.filter(actor => actor.actorID === 3).length);
    console.log('Attackers lifepoints: ' + actors.filter(actor => actor.actorID === Engine.type.attacker || actor.actorID === Engine.type.megAttacker || actor.actorID === Engine.type.speedAttacker ).map(actor => actor.lifePoint));
    console.log('Defenders lifepoints: ' + actors.filter(actor => actor.actorID === Engine.type.tower).map(actor => actor.lifePoint));
    console.log('Actions order : attack, move, heal, dodge, block');
    console.log("\n");
    Engine.printMatrix(matrix);
    console.log("- - - - - - - - - -");
    setTimeout(() => {
        if (count >= lifePoint || tick >= 20) { //Conditions for the make run test
            console.log('Game Over : attacker arrived or tick > 20 (for make run)');
            return 0;
        }
        if (Engine.hasReachedEnd(matrix, actors, end)) {
            return Engine.oneTick(matrix, spawn, end, actors, actions, tick + 1, count + 1, lifePoint, tower, play);
        }
        return Engine.oneTick(matrix, spawn, end, actors, actions, tick + 1, count, lifePoint, tower, play);
    }, 1000);
    return 0;
}

// ---------- Main ----------
const launchGame = () => {
    const width = 10;
    const height = 10;
    Engine.typeOfGame.lvl1 = false;
    const pathPoints = World.selectRandomlyPathPoints(width, height);
    const world = World.createWorld(width, height, pathPoints);
    const spawn = [0, world[0].indexOf(-2)];
    const end = [world.length - 1, world[world.length - 1].indexOf(-1)];
    const actorArray: Actor.actor[] = [];
    const actionArray: ((actor: Actor.actor, actorArray: Actor.actor[], world: number[][]) => number[][])[] = [Engine.attack, Engine.move, Engine.heal, Engine.dodge, Engine.blockOrUnblock];
    const tick = 0;
    const count = 0;
    const lifepoint = 1;
    const tower = 0;
    play(world, spawn, end, actorArray, actionArray, tick, count, lifepoint, tower);
};

launchGame();