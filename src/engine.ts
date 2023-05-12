import * as Actor from './actor.js';

export { type, typeOfGame, printMatrix, spawnActor, move, attack, heal, hasReachedEnd, spawnTower, dodge, blockOrUnblock, chooseTowerPlaces, oneTick };

type func = (matrix: number[][], spawn: number[], end: number[], actors: Actor.actor[], actions: ((actor: Actor.actor, actorArray: Actor.actor[], world: number[][]) => number[][])[], tick: number, count: number, lifePoint: number, tower: number) => void;

// Const about the world case type
const type = {
    start: -2,
    end: -1,
    land: 0,
    path: 1,
    river: 2,
    tower: 3,
    attacker: 4,
    megAttacker: 5,
    speedAttacker: 6,
    towerPlace: -5,
};

// Const about the type of the game.
const typeOfGame = {
    acc: 10,
    auto: false,
    lvl1: false
};

// This funtion only make one tick of the game.
// It will call the actions of each actor and then move them.
// It will also spawn new actors and towers.
// It will also check if the game is over.
// The type of the game is defined by the typeOfGame object.
function oneTick(matrix: number[][], spawn: number[], end: number[], actors: Actor.actor[], actions: ((actor: Actor.actor, actorArray: Actor.actor[], world: number[][]) => number[][])[], tick: number, count: number, lifePoint: number, tower: number, func: func) {
    if (typeOfGame.lvl1) {
        if (tick % 2 === 0 && tick >= 10) {
            const newActor = Actor.createActorAttack();
            Actor.changeStatistics(newActor, 0, "swimming", true);
            matrix = spawnActor(matrix, newActor, spawn, actors, type.attacker);
        }
    }
    else {
        if (tick % 10 === 0 || tick === 1) {
            const swimmer = Math.floor(Math.random() * 3);
            const megaActor = Math.floor(Math.random() * 10);
            const newActor = Actor.createActorAttack();
            const speedActor = Math.floor(Math.random() * 10);
            let engineType = type.attacker;
            if (swimmer === 0) {
                Actor.changeStatistics(newActor, 0, 'swimming', true);
            }
            if (megaActor === 0) {
                Actor.changeStatistics(newActor, 0, 'damage', 350, 'lifePoint', 950, 'swimming', false, 'megaActor', 1);
                engineType = type.megAttacker;
            }
            else if(speedActor === 0 ) {
                Actor.changeStatistics(newActor,0,'speed', 2, 'swimming', false,'mgaActor',false,'speedAttacker',true);
                engineType = type.speedAttacker;
            }
            matrix = spawnActor(matrix, newActor, spawn, actors, engineType);
        }
        if ((tick % 10 === 0 || tick === 1) && !typeOfGame.auto) {
            const newTower = Actor.createActorDefence();
            const [x, y] = [Math.floor(Math.random() * matrix.length), Math.floor(Math.random() * matrix.length)];
            matrix = spawnTower(matrix, newTower, actors, x, y, 0);
        }
    }
    if (tick % 15 === 0 && tick > 0 && typeOfGame.auto && typeOfGame.acc > 0) {
        tower++;
    }

    actions.forEach((action) => {
        actors.forEach((actor) => {
            matrix = action(actor, actors, matrix);
        });
    });
    if (matrix[spawn[0]][spawn[1]] === 1) { matrix[spawn[0]][spawn[1]] = type.start; }
    return func(matrix, spawn, end, actors, actions, tick, count, lifePoint, tower);
}

// Print the world in console ( -1 = end, -2 = start, 0 = land, 1 = path, 2 = river, 3 = tower, 4 = attacker, 5 = megaAttacker, 6 = speedAttacker)
function printMatrix(matrix: number[][]) {
    const coloredMatrix: (string|number)[][] = matrix.map((row) => [...row]);
    coloredMatrix.map((row) => row.map((cell) => {
        if (cell === type.start) {
            row[row.indexOf(cell)] = '🚩';
        } else if (cell === type.end) {
            row[row.indexOf(cell)] = '🏁';
        } else if (cell === type.land) {
            row[row.indexOf(cell)] = '🌳';
        } else if (cell === type.path) {
            row[row.indexOf(cell)] = '🟫';
        } else if (cell === type.river) {
            row[row.indexOf(cell)] = '🟦';
        } else if (cell === type.tower) {
            row[row.indexOf(cell)] = '🏰';
        } else if (cell === type.attacker) {
            row[row.indexOf(cell)] = '👾';
        } else if (cell === type.megAttacker) {
            row[row.indexOf(cell)] = '🦸';
        } else if (cell === type.speedAttacker) {
            row[row.indexOf(cell)] = '🚗';
        }
        return cell;
    }));
    coloredMatrix.map((row) => console.log(row.join('')));
    console.log('');
}

// Spawn an actor in the world
function spawnActor(world: number[][], actor: Actor.actor, spawn: number[], actorArray: Actor.actor[], type: number): number[][] {
    const x = spawn[1];
    const y = spawn[0];
    actor.position = { x: x, y: y };
    actor.actorID = type;
    actorArray.push(actor);
    world[y][x] = type;
    return world;
}

// Spawn a tower in the world
// It find a random place neir a path such as a river or a land
function spawnTower(world: number[][], actor: Actor.actor, actorArray: Actor.actor[], index_i: number, index_j: number, yrandom: number): number[][] {
    let irdm = 0;
    let jrdm = 0;
    let rdm = 0;
    if (yrandom === 0) {
        rdm = Math.floor(Math.random() * 2);
    }
    if (world[index_i][index_j] === 1 || world[index_i][index_j] === 2) {
        if (world[index_i][index_j + 1] === 0 && rdm === 0) {
            return spawnActor(world, actor, [index_i, index_j + 1], actorArray, 3);
        }
        if (world[index_i][index_j - 1] === 0) {
            return spawnActor(world, actor, [index_i, index_j - 1], actorArray, 3);
        }
    }
    if (index_i < world.length - 1 && rdm === 0) {
        irdm = Math.floor(Math.random() * 2);
    }
    else if (index_i > 1) {
        irdm = -Math.floor(Math.random() * 2);
    }
    if (index_j < world.length - 1 && rdm === 1) {
        jrdm = Math.floor(Math.random() * 2);
    }
    else if (index_j > 1) {
        jrdm = -Math.floor(Math.random() * 2);
    }
    return spawnTower(world, actor, actorArray, index_i + irdm, index_j + jrdm, yrandom);
}

// Check if an actor has reached the end and remove it
function hasReachedEnd(world: number[][], actors: Actor.actor[], end: number[]): boolean {
    const arrived: Actor.actor[] = actors.filter((actor) => (actor.position.x === end[1] && actor.position.y === end[0]) || actor.is_arrived === true);
    if (arrived.length > 0) {
        arrived.forEach((actor) => {
            const index = actors.indexOf(actor);
            world[actor.position.y][actor.position.x] = actor.zoneID;
            actors.splice(index, 1);
        });
        world[end[0]][end[1]] = -1;
        return true;
    }
    return false;
}

// Move an actor to a place in the world
function move(actor: Actor.actor, actorArray: Actor.actor[], world: number[][]): number[][] {
    function move_rec(speed: number): number[][] {
        if (speed <= 0) return world;
        const x = actor.position.x;
        const y = actor.position.y;
        const dx = actor.actions.move(actor, world).dx;
        const dy = actor.actions.move(actor, world).dy;
        if (world[y + dy][x + dx] === 4 || world[y + dy][x + dx] === 5 || world[y + dy][x + dx] === 6) return world;
        if (world[y + dy][x + dx] === -1) {
            world[y][x] = 1;
        }
        else world[y][x] = actor.zoneID;
        actor.zoneID = world[y + dy][x + dx];
        if (world[y + dy][x + dx] !== -1) world[y + dy][x + dx] = actor.actorID;
        actor.position.x += dx;
        actor.position.y += dy;
        const end = [world.length - 1, world[world.length - 1].indexOf(-1)];
        if (actor.position.x === end[1] && actor.position.y === end[0]){
            actor.is_arrived = true;
        }
        return move_rec(speed - 1);
    }

    return move_rec(actor.speed);
}

// Attack an actor in the world
function attack(actor: Actor.actor, actorArray: Actor.actor[], world: number[][]): number[][] {
    const actorsIndexToAttack: number[] = actor.actions.attack(actor, actorArray, world);
    actorsIndexToAttack.forEach(idx => actorArray[idx].lifePoint -= actor.damage);
    actorArray.forEach((actor) => {
        if (actor.lifePoint <= 0) {
            const index = actorArray.indexOf(actor);
            world[actor.position['y']][actor.position['x']] = actor.zoneID;
            actorArray.splice(index, 1);
        }
    });
    return world;
}

// Heal an actor in the world
function heal(actor: Actor.actor, actorArray: Actor.actor[], world: number[][]): number[][] {
    return actor.actions.heal(actor, actorArray, world);

}
// Dodge an actor in the world
function dodge(actor: Actor.actor, actorArray: Actor.actor[], world: number[][]): number[][] {
    actor.actions.dodge(actor, world, 97);
    return world;
}

// Block or unblock an actor in the world
function blockOrUnblock(actor: Actor.actor, actorArray: Actor.actor[], world: number[][]): number[][] {
    const NonRunners = actorArray.filter(actor => (actor.speed === 0));
    const indexOfNonRunners = NonRunners.map((actor) => actorArray.indexOf(actor));
    indexOfNonRunners.forEach(idx => (actor.speed = 1));
    const indexOfRunners: number[] = actor.actions.block(actor, actorArray, world);
    indexOfRunners.forEach(idx => {
        if ((Math.floor(Math.random() * 100) % 100) >= 90) {
            actorArray[idx].speed = 0;
        }
    });
    return world;
}

//This function is here to choose the places where the tower could be placed
// The tower will be placed near the path( value 1 ) and river( value 2 )
// n is the number of tower that we want to place
// Useful for HTML version.
function chooseTowerPlaces(matrix: number[][], n: number) {
    function chooseTowerPlacesRecTerminal(matrix: number[][], n: number, index_i: number, index_j: number): number[][] {
        const rdm = Math.floor(Math.random() * 2);
        let irdm = 0;
        let jrdm = 0;
        if (n === 0) {
            return matrix;
        }
        if ((matrix[index_i][index_j] === 1 || matrix[index_i][index_j] === 2) && matrix[index_i][index_j + 1] === 0 && rdm === 0) {
            matrix[index_i][index_j + 1] = type.towerPlace;
            return chooseTowerPlacesRecTerminal(matrix, n - 1, Math.floor(Math.random() * matrix.length), Math.floor(Math.random() * matrix.length));
        }
        else if ((matrix[index_i][index_j] === 1 || matrix[index_i][index_j] === 2) && matrix[index_i][index_j - 1] === 0) {
            matrix[index_i][index_j - 1] = type.towerPlace;
            return chooseTowerPlacesRecTerminal(matrix, n - 1, Math.floor(Math.random() * matrix.length), Math.floor(Math.random() * matrix.length));
        }
        else {
            if (index_i < matrix.length - 1 && rdm === 0) {
                irdm = Math.floor(Math.random() * 2);
            }
            else if (index_i > 1) {
                irdm = -Math.floor(Math.random() * 2);
            }
            if (index_j < matrix.length - 1 && rdm === 1) {
                jrdm = Math.floor(Math.random() * 2);
            }
            else if (index_j > 1) {
                jrdm = -Math.floor(Math.random() * 2);
            }
            return chooseTowerPlacesRecTerminal(matrix, n, index_i + irdm, index_j + jrdm);
        }
    }
    const [x, y] = [Math.floor(Math.random() * matrix.length), Math.floor(Math.random() * matrix.length)];
    return chooseTowerPlacesRecTerminal(matrix, n, x, y);
}