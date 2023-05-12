import * as Engine from '../src/engine';
import * as Actor from '../src/actor';
import { expect, jest, test } from '@jest/globals';

const world = [
  [0, 0, -2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 2, 2, 2, 2, 1, 1, 0, 0],
  [0, 0, 2, 2, 2, 2, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, -1, 0]
];

const newActor = Actor.createActorAttack();
const Tower = Actor.createActorDefence();
Tower.position['x'] = 1;
Tower.position['y'] = 3;


test('Building a Tower at the position ', () => {
  expect(Engine.spawnTower(world, Tower, [], Tower.position['x'], Tower.position['y'], 1)).toStrictEqual(
    [
      [0, 0, -2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 2, 2, 2, 2, 1, 1, 0, 0],
      [0, 0, 2, 2, 2, 2, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, -1, 0]
    ]
  );
});

// test( 'Attack a Tower at the position', () => {
//   expect( Engine.attack(newActor, [newActor, Tower], world, 0)).toStrictEqual(true)
//   });


newActor.lifePoint = 200;
Engine.heal(newActor, [newActor, Tower], world);
test('Heal test on attacker during 1 tick', () => {
  expect(newActor.lifePoint).toStrictEqual(230);
});



const testDodgeActor = Actor.createActorAttack();
testDodgeActor.lifePoint = 50;
Engine.dodge(testDodgeActor, [newActor, Tower], world);
test('heal to dodge test of an attacker', () => {
  (() => {
    const mock = jest.fn(() => Math.random());

    mock.withImplementation(
      () => 97,
      () => {
        mock(); // 'inside callback'
      },
    );

    mock(); // 'outside callback'
    const actual = Math.random();

    expect(actual).toEqual(97);
    expect(testDodgeActor.lifePoint).toStrictEqual(100);
    mock.mockReset();
  });
});



describe('chooseTowerPlaces', () => {
  test('returns a matrix with n tower places', () => {
    const matrix = [
      [0, 0, Engine.type.start, 0],
      [0, 0, 1, 0],
      [0, 2, 1, 0],
      [0, 0, Engine.type.end, 0]
    ];
    const numberOfPlacesToPutTower = 2;
    const result = Engine.chooseTowerPlaces(matrix, numberOfPlacesToPutTower);
    const count = result.reduce((acc, row) => acc.concat(row.filter(cell => cell === Engine.type.towerPlace)), []);
    expect(count.length).toBe(numberOfPlacesToPutTower);
  });
});

describe('Test the move function', () => {
  let actor: Actor.actor;
  let actorArray: Actor.actor[];
  let world: number[][];

  beforeEach(() => {
    actor = Actor.createActorAttack();
    actorArray = [actor];
    world = [[0, 0, Engine.type.start, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, Engine.type.end, 0, 0, 0],
    ];
    world = Engine.spawnActor(world, actor, [2, 0], actorArray, Engine.type.attacker);
  });
  it('should move the actor and update the world', () => {
    Engine.move(actor, actorArray, world);
    expect(actor.position.x).toEqual(1);
    expect(actor.position.y).toEqual(2);
  });

  it('should remove actor when it reaches the end', () => {
    world[4][1] = Engine.type.end;
    actor.position = { x: 1, y: 4 };
    actor.zoneID = Engine.type.end;
    actor.is_arrived = true;
    expect(Engine.hasReachedEnd(world, actorArray, [4, 1])).toEqual(true);
    expect(world[4][1]).toEqual(Engine.type.end);
    expect(actorArray.length).toEqual(0);
  });
});

describe('Test the actions functions', () => {
  test('Test the attack function', () => {
    let actor1: Actor.actor;
    let actor2: Actor.actor;
    let actorArray: Actor.actor[];
    let world: number[][];
    (() => {
      const mock = jest.fn(() => Math.random());

      mock.withImplementation(
        () => 97,
        () => {
          mock(); // 'inside callback'
        },
      );

      beforeEach(() => {
        actor1 = Actor.createActorAttack();
        actor2 = Actor.createActorDefence();
        actorArray = [actor1, actor2];
        world = [
          [0, Engine.type.start, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, Engine.type.end, 0, 0],
        ];
        const [x, y] = [Math.floor(Math.random() * world.length), Math.floor(Math.random() * world.length)];
        world = Engine.spawnTower(world, actor2, actorArray, x, y, 0);
        world = Engine.spawnActor(world, actor1, [1, 0], actorArray, Engine.type.attacker);
      });

      it('should attack the target and update the world', () => {
        const initialLifePoint = actor2.lifePoint;
        world = Engine.attack(actor1, actorArray, world);
        expect(actor2.lifePoint).toEqual(initialLifePoint - actor1.damage);
      });

      it('should block the actors and update the world', () => {
        const initialSpeed1 = actor1.speed;
        world = Engine.blockOrUnblock(actor1, actorArray, world);
        expect(actor1.speed).toEqual(0);
        world = Engine.blockOrUnblock(actor1, actorArray, world);
        expect(actor1.speed).toEqual(initialSpeed1);
      });
    });
});
});



describe('oneTick', () => {
  it('should update the game state correctly', () => {
    // Arrange
    const matrix = [      [Engine.type.start, 1, 0],
      [0, 1, 0],
      [0, 1, Engine.type.end],
    ];
    const spawn = [0, 0];
    const end = [2, 2];
    const actors: Actor.actor[] = [];
    const actionArray: ((actor: Actor.actor, actorArray: Actor.actor[], world: number[][]) => number[][])[] = [Engine.attack, Engine.move, Engine.heal, Engine.dodge, Engine.blockOrUnblock];
    const tick = 1;
    const count = 0;
    const lifePoint = 1000;
    const tower = 0;
    const func = (matrix: number[][], spawn: number[], end: number[], actors: Actor.actor[], actions: ((actor: Actor.actor, actorArray: Actor.actor[], world: number[][]) => number[][])[], tick: number, count: number, lifePoint: number, tower: number) => { return actionArray;};

    const result = Engine.oneTick(matrix, spawn, end, actors, actionArray, tick, count, lifePoint, tower, func);
    
    expect(actors.length).toEqual(2);
  });
});
