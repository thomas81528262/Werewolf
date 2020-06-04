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
const world = new TestWorld({ dayEvents: [voteTest] });
world.addPlayer({ role: "wolf", id: 0 });
world.addPlayer({ role: "wolf", id: 1 });
world.addPlayer({ role: "wolf", id: 2 });
world.addPlayer({ role: "human", id: 3 });

test("action test", async () => {
  world.start();
  world.addAction({
    initiatorId: 0,
    targetId: 1,
    eventName: "VOTE_KILL",
    isLock: true,
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
  const stop = true;
});
