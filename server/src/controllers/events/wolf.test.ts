import  World  from "../world";
import wolf from "./wolf";

class TestWorld extends World {
  getResult() {}
  setPlayerState(){

  }
}

class WolfTest extends wolf.WolfKill {
  get testAction() {
    return this.actions;
  }
}

const wolfTest = new WolfTest();
const world = new TestWorld({ dayEvents: [wolfTest] , stateEvents:[]});
world.addPlayer({ role: "wolf", id: 0 });
world.addPlayer({ role: "wolf", id: 1 });
world.addPlayer({ role: "wolf", id: 2 });
world.addPlayer({ role: "human", id: 3 });

test("action test", async () => {
  world.start();
  world.addAction({
    initiatorId: 0,
    targetId: 3,
    eventName: "WOLF_KILL",
    isLock: false,
  });
  
  world.addAction({
    initiatorId: 0,
    targetId: 2,
    eventName: "WOLF_KILL",
    isLock: false,
  });
  world.addAction({
    initiatorId: 1,
    targetId: 2,
    eventName: "WOLF_KILL",
    isLock: true,
  });
  

  world.addAction({
    initiatorId: 0,
    targetId: 2,
    eventName: "WOLF_KILL",
    isLock: true,
  });
  world.addAction({
    initiatorId: 2,
    targetId: 2,
    eventName: "WOLF_KILL",
    isLock: true,
  });
  
  expect(world.statuses).toEqual({
    _statuses: [
      {
        targetId: 2,
        eventName: "WOLF_KILL",
        day: 0,
        initiatorIds: [0,1,2],
      },
    ],
  });
});
