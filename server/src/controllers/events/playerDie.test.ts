import World from "../world";

import Hunter from "./hunter";
import PlayerDie from "./playerDie";
import { State } from "../../models/player";
class TestWorld extends World {
  setPlayerState() {
    const player = this.players.get(0);

    player.addState({ day: 0, state: State.Die });
  }
}

test("action test", async () => {
  const playerDie = new PlayerDie.PlayerDie();
  const hunterKill = new Hunter.HunterKill();
  const world = new TestWorld({
    dayEvents: [playerDie],
    stateEvents: [hunterKill],
  });
  world.addPlayer({ role: "hunter", id: 0 , camp:'' });
  world.addPlayer({ role: "wolf", id: 1 , camp:'' });
  world.addPlayer({ role: "wolf", id: 2 , camp:'' });
  world.start();
  world.addAction({
    initiatorId: 0,
    targetId: 1,
    eventName: "HUNTER_KILL",
    isLock: false,
  });

  const target = world.targets({initiatorId:0})

  world.addAction({
    initiatorId: 0,
    targetId: 2,
    eventName: "HUNTER_KILL",
    isLock: false,
  });

  world.addAction({
    initiatorId: 0,
    targetId: 1,
    eventName: "HUNTER_KILL",
    isLock: true,
  });

  console.log("end");
});
