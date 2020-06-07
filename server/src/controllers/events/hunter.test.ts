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
const world = new TestWorld({ dayEvents: [voteTest] , stateEvents:[]});
world.addPlayer({ role: "hunter", id: 0, camp:'' });


test("action test", async () => {
  world.start();
  

});
