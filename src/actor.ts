export { actor, createActorAttack, createActorDefence, switchSwim, changeStatistics };
import * as Engine from './engine.js';

// Type definition for a position
interface position {
    x: number;
    y: number;
}

// Type definition for a displacement
interface displacement {
    dx: number;
    dy: number;
}

// Type definition for an actor
interface actor {
    position: position;
    zoneID: number;
    lifePointMax: number;
    lifePoint: number;
    damage: number;
    range: number;
    speed: number;
    swimming: boolean;
    megaActor: boolean;
    speedActor: boolean;
    actorID: number;
    is_arrived: boolean;
    actions: {
        // functions type = (actor: actor, world: number[][]): someType;
        move: (actor: actor, world: number[][]) => displacement;
        attack: (actor: actor, actorArray: actor[], world: number[][]) => number[];
        heal: (actor: actor, actorArray: actor[], world: number[][]) => number[][];
        block: (actor: actor, actorArray: actor[], world: number[][]) => number[];
        dodge: (actor: actor, world: number[][], n: number) => number[][];
    };
}

// Create a standard actor for defence
function createActorDefence(): actor {
    const actorDefence: actor = {
        position: { x: 0, y: 0 },
        lifePointMax: 1000,
        lifePoint: 1000,
        zoneID: 0,
        damage: 50,
        range: 2,
        speed: 0,
        swimming: false,
        megaActor: false,
        speedActor: false,
        actorID: Engine.type.tower,
        is_arrived: false,
        actions: {
            move: (actor: actor, world: number[][]) => ({ dx: 0, dy: 0 }),
            attack: (actor: actor, actorArray: actor[], world: number[][]) => {
                const actorRange = actor.range;
                const rangeArray = actorArray.filter((elem) => {
                    const actorPositionX = elem.position.x;
                    const actorPositionY = elem.position.y;
                    return ((actorPositionX <= actor.position.x + actor.range) && (actor.position.x - actor.range <= actorPositionX)) && (((actorPositionY <= actor.position.y + actor.range) && (actor.position.y - actor.range <= actorPositionY))) && ((elem.actorID === 4) || (elem.actorID === 5) || ((elem.actorID === 6)));
                });
                const finalArray = rangeArray.map((elem) => actorArray.indexOf(elem));
                return finalArray;
            },
            heal: (actor: actor, actorArray: actor[], world: number[][]) => {
                const diff = 0.9 * actor.lifePointMax;
                if (actor.lifePoint < diff) {
                    actor.lifePoint += 0.1 * actor.lifePointMax;
                }
                else {
                    actor.lifePoint = actor.lifePointMax;
                }
                return world;

            },
            block: (actor: actor, actorArray: actor[], world: number[][]) => {
                const arr = actor.actions.attack(actor, actorArray, world);
                return arr;
            },
            dodge: (actor: actor, world: number[][], n: number) => {
                if ((Math.floor(Math.random() * 100) % 100) >= n) {
                    const dmg_att = createActorAttack().damage;
                    actor.lifePoint += dmg_att;
                }
                return world;
            },
        }
    };
    return actorDefence;
}

// Create a standard actor for attack
function createActorAttack(): actor {
    const actorAttack: actor = {
        position: { x: 0, y: 0 },
        lifePointMax: 300,
        lifePoint: 300,
        zoneID: 1,
        damage: 250,
        range: 1,
        speed: 1,
        swimming: false,
        megaActor: false,
        speedActor: false,
        actorID: Engine.type.attacker,
        is_arrived: false,
        actions: {
            move: (actor: actor, world: number[][]) => {
                const x = actor.position.x;
                const y = actor.position.y;
                let dx = 0;
                let dy = 0;
                const end = [world.length - 1, world[world.length - 1].indexOf(-1)];
                const distMatrix = world.map((row) => [...row]);
                distMatrix.forEach((row, i) => {
                    row.forEach((element, j) => {
                        distMatrix[i][j] = -1;
                    });
                });
                distMatrix[end[0]][end[1]] = 0;
                let idx: number = 1;
                while ((distMatrix[y][x] === -1) && (idx < world.length * world.length)) {
                    for (let i = 0; i < world.length; i++) {
                        for (let j = 0; j < world[0].length; j++) {
                            if (actor.swimming === false) {
                                if (distMatrix[i][j] === idx - 1) {
                                    if ((i < world.length - 1) && (distMatrix[i + 1][j] === -1) && ( (world[i + 1][j] === 1) || (world[i + 1][j] === 4) || (world[i + 1][j] === 5) || (world[i + 1][j] === 6) ) ) {
                                        distMatrix[i + 1][j] = idx;
                                    }
                                    if ((i > 0) && (distMatrix[i - 1][j] === -1) && ( (world[i - 1][j] === 1) || (world[i - 1][j] === 4) || (world[i - 1][j] === 5) || (world[i - 1][j] === 6) )) {
                                        distMatrix[i - 1][j] = idx;
                                    }
                                    if ((j > 0) && (distMatrix[i][j - 1] === -1) && ( (world[i][j - 1] === 1) || (world[i][j - 1] === 4) || (world[i][j - 1] === 5) || (world[i][j - 1] === 6) )) {
                                        distMatrix[i][j - 1] = idx;
                                    }
                                    if ((j < world[0].length - 1) && (distMatrix[i][j + 1] === -1) && ((world[i][j + 1] === 1) || (world[i][j + 1] === 4) || (world[i][j + 1] === 5) ||  (world[i][j + 1] === 6))) {
                                        distMatrix[i][j + 1] = idx;
                                    }
                                }
                            } else {
                                if (distMatrix[i][j] === idx - 1) {
                                    if ((i < world.length - 1) && (distMatrix[i + 1][j] === -1) && ( (world[i + 1][j] === 1) || (world[i + 1][j] === 2) || (world[i + 1][j] === 4) || (world[i + 1][j] === 5) || (world[i + 1][j] === 6) )) {
                                        distMatrix[i + 1][j] = idx;
                                    }
                                    if ((i > 0) && (distMatrix[i - 1][j] === -1) && ( (world[i - 1][j] === 1) || (world[i - 1][j] === 2) || (world[i - 1][j] === 4) || (world[i - 1][j] === 5) || (world[i - 1][j] === 6) )) {
                                        distMatrix[i - 1][j] = idx;
                                    }
                                    if ((j > 0) && (distMatrix[i][j - 1] === -1) && ((world[i][j - 1] === 1) || (world[i][j - 1] === 2) || (world[i][j - 1] === 4) || (world[i][j - 1] === 5) || (world[i][j - 1] === 6))) {
                                        distMatrix[i][j - 1] = idx;
                                    }
                                    if ((j < world[0].length - 1) && (distMatrix[i][j + 1] === -1) && ((world[i][j + 1] === 1) || (world[i][j + 1] === 2) || (world[i][j + 1] === 4) || (world[i][j + 1] === 5) || (world[i][j + 1] === 6))) {
                                        distMatrix[i][j + 1] = idx;
                                    }
                                }
                            }
                        }
                    }
                    idx++;
                }
                if ((y > 0) && (distMatrix[y - 1][x] === distMatrix[y][x] - 1)) {
                    dy = -1;
                }
                else if (((y < world.length - 1)) && (distMatrix[y + 1][x] === distMatrix[y][x] - 1)) {
                    dy = 1;
                }
                else if ((x > 0) && (distMatrix[y][x - 1] === distMatrix[y][x] - 1)) {
                    dx = -1;
                }
                else if (((x < world[0].length - 1)) && (distMatrix[y][x + 1] === distMatrix[y][x] - 1)) {
                    dx = 1;
                }
                return { dx: dx, dy: dy };
            },
            attack: (actor: actor, actorArray: actor[], world: number[][]) => {
                const actorRange = actor.range;
                const rangeArray = actorArray.filter((elem) => {
                    const actorPositionX = elem.position.x;
                    const actorPositionY = elem.position.y;
                    return ((actorPositionX <= actor.position.x + actor.range) && (actor.position.x - actor.range <= actorPositionX)) && (((actorPositionY <= actor.position.y + actor.range) && (actor.position.y - actor.range <= actorPositionY))) && (elem.actorID === 3);
                });
                const finalArray = rangeArray.map((elem) => actorArray.indexOf(elem));
                return finalArray;
            },
            heal: (actor: actor, actorArray: actor[], world: number[][]) => {
                const diff = 0.9 * actor.lifePointMax;
                if (actor.lifePoint < diff) {
                    actor.lifePoint += 0.1 * actor.lifePointMax;
                }
                else {
                    actor.lifePoint = actor.lifePointMax;
                }
                return world;
            },
            block: (actor: actor, actorArray: actor[], world: number[][]) => {
                return [];
            },
            dodge: (actor: actor, world: number[][], n: number) => {
                if ((Math.floor(Math.random() * 100) % 100) >= n) {
                    const dmg_def = createActorDefence().damage;
                    actor.lifePoint += dmg_def;
                }
                return world;
            },
        },
    };
    return actorAttack;
}



function switchSwim(actor: actor) {
    actor.swimming = true;
    return actor;
}
// damage: number, range: number, speed: number, lifePoint: number swimming: boolean 
// All can be changed with this function you need to the actor and to initialize the acc 
// at 0 and the args with first the type of the stat you want to change and then the value.
// THE ORDER OF THE ARGUMENTS IS IMPORTANT!!!
// This function is recursive and is for the the flex.
function changeStatistics(actor: actor, acc: number, ...args: any): actor {
    if (acc >= args.length) {
        return actor;
    }
    switch (args[acc]) {
        case 'damage':
            actor.damage = args[acc + 1];
            break;
        case 'range':
            actor.range = args[acc + 1];
            break;
        case 'speed':
            actor.speed = args[acc + 1];
            break;
        case 'lifePoint':
            actor.lifePoint = args[acc + 1];
            break;
        case 'lifePointMax':
            actor.lifePointMax = args[acc + 1];
            break;
        case 'swimming':
            actor.swimming = args[acc + 1];
            break;
        case 'megaActor':
            actor.megaActor = args[acc + 1];
            break;
        case 'speedAttacker':
            actor.speedActor = args[acc + 1];
            break;
        default:
            console.log("Error in changeStatistics");
            break;
    }
    return changeStatistics(actor, acc + 2, ...args);
}