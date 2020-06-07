import World  from "../world";
import vote from "./vote";

class TestWorld extends World {
  setPlayerState() {}
}

class VoteTest extends vote.VoteKill {
  get testAction() {
    return this.actions;
  }
}

const voteTest = new VoteTest();
const world = new TestWorld({ dayEvents: [voteTest], stateEvents:[] });
world.addPlayer({ role: "wolf", id: 0 , camp:'' });
world.addPlayer({ role: "wolf", id: 1 , camp:'' });
world.addPlayer({ role: "wolf", id: 2 , camp:'' });
world.addPlayer({ role: "human", id: 3 , camp:'' });

test("action test", async () => {
  world.start();
  world.addAction({
    initiatorId: 0,
    targetId: 1,
    eventName: "VOTE_KILL",
    isLock: false,
  });
  world.addAction({
    initiatorId: 1,
    targetId: 1,
    eventName: "VOTE_KILL",
    isLock: true,
  });
  world.addAction({
    initiatorId: 2,
    targetId: 1,
    eventName: "VOTE_KILL",
    isLock: true,
  });
  world.addAction({
    initiatorId: 3,
    targetId: 1,
    eventName: "VOTE_KILL",
    isLock: true,
  });


  world.addAction({
    initiatorId: 0,
    targetId: 3,
    eventName: "VOTE_KILL",
    isLock: true,
  });
  

  expect(world.statuses).toEqual({
    _statuses: [
      {
        targetId: 1,
        eventName: "VOTE_KILL",
        day: 0,
        initiatorIds: [1,2,3],
      },
      {
        targetId: 3,
        eventName: "VOTE_KILL",
        day: 0,
        initiatorIds: [0],
      },
    ],
  });

});
