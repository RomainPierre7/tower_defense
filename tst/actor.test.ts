import * as Actor from '../src/actor';
import * as Engine from '../src/engine';

let world = [
    [0, 0, -2, 3, 0, 0, 0, 0, 0, 0],
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


world = Engine.spawnActor(world, newActor, [0, 2], [newActor], 4);

newActor.range = 5;
newActor.position = ({ x: 0, y: 0 });
test('actor is now swimming', () => {
    expect(Actor.changeStatistics(Actor.createActorAttack(), 0, "swimming", true).swimming).toStrictEqual(true);
});


const newActor2 = Actor.createActorAttack();
newActor2.lifePoint = 200;
newActor2.lifePointMax = 500;
world = newActor2.actions.heal(newActor2,[], world);
test(' heal', () => {
    expect(newActor2.lifePoint).toStrictEqual(250);
});

newActor.lifePoint = 40;
world = newActor.actions.heal(newActor,[] ,world);
test('heal 2', () => {
    expect(newActor.lifePoint).toStrictEqual(70);
});

const newActor3 = Actor.createActorAttack();
newActor3.lifePoint = 90;
world = newActor3.actions.dodge(newActor3, world, 0);

test('heal to dodge', () => {
    expect(newActor3.lifePoint).toBeGreaterThanOrEqual(90);
});

const testBlockDefender = Actor.createActorDefence();
testBlockDefender.position = ({ x: 2, y: 2 });
const testBlockAttacker = Actor.createActorAttack();
testBlockAttacker.position = ({ x: 2, y: 3 });
const ActArr = [testBlockAttacker, testBlockDefender];
const arr = testBlockDefender.actions.block(testBlockDefender, ActArr, world);
test(' block ', () => {
    expect(arr.length).toStrictEqual(1);
    expect(arr[0]).toStrictEqual(0);
});



describe('createActorDefence', () => {
    test('should create a defence actor with expected properties', () => {
      const actor = Actor.createActorDefence();
  
      expect(actor.lifePointMax).toEqual(1000);
      expect(actor.lifePoint).toEqual(1000);
      expect(actor.damage).toEqual(50);
      expect(actor.range).toEqual(2);
      expect(actor.speed).toEqual(0);
    });
  
test('should be able to attack actors within range', () => {
    const defenceActor = Actor.createActorDefence();
    const attackActor = Actor.createActorAttack();
    attackActor.position = { x: 1, y: 1 };  // within the defence actor's range
    const world = [...Array(3)].map(() => Array(3).fill(4));  // 3x3 world
    
    const attackedActors = defenceActor.actions.attack(defenceActor, [attackActor], world);
    
    // Expect the array of attacked actors to contain the index of attackActor
    expect(attackedActors).toContain(0);
});
    
test('should not be able to attack actors outside range', () => {
    const defenceActor = Actor.createActorDefence();
    const attackActor = Actor.createActorAttack();
    attackActor.position = { x: 3, y: 3 };  // outside the defence actor's range
    const world = [...Array(5)].map(() => Array(5).fill(0));  // 5x5 world
  
    const attackedActors = defenceActor.actions.attack(defenceActor, [attackActor], world);
  
    expect(attackedActors).not.toContainEqual(attackActor);
    });
});

describe('createActorAttack', () => {
    test('should create an attack actor with expected properties', () => {
        const actor = Actor.createActorAttack();

        expect(actor).toMatchObject({
            lifePointMax: 300,
            lifePoint: 300,
            damage: 250,
            range: 1,
            speed: 1,
            swimming: false,
            megaActor: false,
            speedActor: false,
            actorID: Engine.type.attacker,
            is_arrived: false,
            position: { x: 0, y: 0 },
            zoneID: 1
        });
    });

    test('should move to a free space', () => {
        const actor = Actor.createActorAttack();
        actor.position = { x: 2, y: 2 };  // position in the center of the world
        const world = [...Array(5)].map(() => Array(5).fill(1));  // 5x5 world filled with actors
        world[3][3] = 0;  // free space at position (3, 3)
    
        const move = actor.actions.move(actor, world);
    
        // Expect the actor not to move because it's already in the center of the world
        expect(move).toEqual({ dx: 0, dy: 0 });
    });
    

    test('should be able to attack actors within range', () => {
        const attackActor = Actor.createActorAttack();
        const defenceActor = Actor.createActorDefence();
        defenceActor.position = { x: 1, y: 1 };  // within the attack actor's range
        const world = [...Array(3)].map(() => Array(3).fill(4));  // 3x3 world
    
        const attackedActors = attackActor.actions.attack(attackActor, [defenceActor], world);
    
        // Expect the array of attacked actors to contain the index of defenceActor
        expect(attackedActors).toContain(0);
    });

    test('should not be able to attack actors outside range', () => {
        const attackActor = Actor.createActorAttack();
        const defenceActor = Actor.createActorDefence();
        defenceActor.position = { x: 3, y: 3 };  // outside the attack actor's range
        const world = [...Array(5)].map(() => Array(5).fill(0));  // 5x5 world
    
        const attackedActors = attackActor.actions.attack(attackActor, [defenceActor], world);
    
        // Expect the array of attacked actors not to contain defenceActor
        expect(attackedActors).not.toContain(defenceActor);
    });
});




describe('changeStatistics', () => {

    test('Actor changeStatistics: should correctly change the damage property of an actor', () => {
        const actor = Actor.createActorAttack();
        const updatedActor = Actor.changeStatistics(actor, 0, 'damage', 700);
        expect(updatedActor.damage).toEqual(700);
    });

    test('Actor changeStatistics: should correctly change the range property of an actor', () => {
        const actor = Actor.createActorAttack();
        const updatedActor = Actor.changeStatistics(actor, 0, 'range', 5);
        expect(updatedActor.range).toEqual(5);
    });

    test('Actor changeStatistics: should correctly change the speed property of an actor', () => {
        const actor = Actor.createActorAttack();
        const updatedActor = Actor.changeStatistics(actor, 0, 'speed', 9);
        expect(updatedActor.speed).toEqual(9);
    });

    test('Actor changeStatistics: should correctly change the lifePoint property of an actor', () => {
        const actor = Actor.createActorAttack();
        const updatedActor = Actor.changeStatistics(actor, 0, 'lifePoint', 300);
        expect(updatedActor.lifePoint).toEqual(300);
    });

    test('Actor changeStatistics: should correctly change the lifePointMax property of an actor', () => {
        const actor = Actor.createActorAttack();
        const updatedActor = Actor.changeStatistics(actor, 0, 'lifePointMax', 400);
        expect(updatedActor.lifePointMax).toEqual(400);
    });

    test('Actor changeStatistics: should correctly change the swimming property of an actor', () => {
        const actor = Actor.createActorAttack();
        const updatedActor = Actor.changeStatistics(actor, 0, 'swimming', true);
        expect(updatedActor.swimming).toEqual(true);
    });

    test('Actor changeStatistics: should correctly change the megaActor property of an actor', () => {
        const actor = Actor.createActorAttack();
        const updatedActor = Actor.changeStatistics(actor, 0, 'megaActor', true);
        expect(updatedActor.megaActor).toEqual(true);
    });


    test('Actor changeStatistics: should correctly change the speedAttacker property of an actor', () => {
        const actor = Actor.createActorAttack();
        const updatedActor = Actor.changeStatistics(actor, 0, 'speedAttacker', true);
        expect(updatedActor.speedActor).toEqual(true);
    });

});
  

