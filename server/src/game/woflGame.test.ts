import { WolfGame } from "./wolfGame";
import Wolf from "../controllers/events/wolf";
import ChiefCandidate from "../controllers/events/chiefCandidate";
import ChiefVote from "../controllers/events/chiefVote";
import { timeout } from "../util";

function addPlayer(game: WolfGame) {
  game.addPlayer({ role: "wolf", id: 1, camp: "bad" });
  game.addPlayer({ role: "wolf", id: 2, camp: "bad" });
  game.addPlayer({ role: "wolf", id: 3, camp: "bad" });
  game.addPlayer({ role: "wolf", id: 4, camp: "bad" });
  game.addPlayer({ role: "human", id: 5, camp: "good" });
  game.addPlayer({ role: "human", id: 6, camp: "good" });
}

function addCandidate(candidatesIds: number[], game: WolfGame) {
  candidatesIds.forEach((id) => {
    game.players.forEach((player) => {
      if (candidatesIds.includes(player.id)) {
        game.addAction({
          initiatorId: player.id,
          eventName: ChiefCandidate.eN.ChiefCandidate,
          isLock: true,
          targetId: player.id,
        });
      } else {
        game.addAction({
          initiatorId: player.id,
          eventName: ChiefCandidate.eN.ChiefCandidate,
          isLock: true,
          targetId: -1,
        });
      }
    });
  });
}

describe("wolf test", async () => {
  const game = new WolfGame([Wolf.eN.wolfKill]);
  addPlayer(game);
  game.start();
  game.addAction({
    initiatorId: 1,
    targetId: 5,
    eventName: Wolf.eN.wolfKill,
    isLock: true,
  });
  let targes = game.targets({ initiatorId: 1 });

  game.addAction({
    initiatorId: 2,
    targetId: 5,
    eventName: Wolf.eN.wolfKill,
    isLock: true,
  });
  game.addAction({
    initiatorId: 3,
    targetId: 5,
    eventName: Wolf.eN.wolfKill,
    isLock: true,
  });
  let targes1 = game.targets({ initiatorId: 1 });

  game.addAction({
    initiatorId: 4,
    targetId: 5,
    eventName: Wolf.eN.wolfKill,
    isLock: true,
  });
  //start chief candidate
  game.addAction({
    initiatorId: 1,
    targetId: 1,
    eventName: ChiefCandidate.eN.ChiefCandidate,
    isLock: false,
  });
  targes = game.targets({ initiatorId: 1 });
  game.addAction({
    initiatorId: 1,
    targetId: 2,
    eventName: ChiefCandidate.eN.ChiefCandidate,
    isLock: false,
  });
  game.addAction({
    initiatorId: 1,
    targetId: -1,
    eventName: ChiefCandidate.eN.ChiefCandidate,
    isLock: false,
  });
  targes = game.targets({ initiatorId: 1 });
  game.addAction({
    initiatorId: 1,
    targetId: 1,
    eventName: ChiefCandidate.eN.ChiefCandidate,
    isLock: true,
  });
  targes = game.targets({ initiatorId: 1 });
  game.addAction({
    initiatorId: 2,
    targetId: -1,
    eventName: ChiefCandidate.eN.ChiefCandidate,
    isLock: true,
  });
  targes = game.targets({ initiatorId: 2 });
  game.addAction({
    initiatorId: 3,
    targetId: 3,
    eventName: ChiefCandidate.eN.ChiefCandidate,
    isLock: true,
  });
  game.addAction({
    initiatorId: 4,
    targetId: -1,
    eventName: ChiefCandidate.eN.ChiefCandidate,
    isLock: true,
  });
  game.addAction({
    initiatorId: 5,
    targetId: -1,
    eventName: ChiefCandidate.eN.ChiefCandidate,
    isLock: true,
  });
  game.addAction({
    initiatorId: 6,
    targetId: -1,
    eventName: ChiefCandidate.eN.ChiefCandidate,
    isLock: true,
  });

  //wait one second for vote
  await timeout(1000);

  //start election
  const chiefTarget = game.targets({ initiatorId: 0 });
  game.targets({ initiatorId: 1 });
  //game.addAction({initiatorId})
  game.addAction({
    initiatorId: 2,
    targetId: 1,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  game.addAction({
    initiatorId: 3,
    targetId: 1,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  game.addAction({
    initiatorId: 4,
    targetId: 3,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  game.addAction({
    initiatorId: 5,
    targetId: 1,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  game.addAction({
    initiatorId: 6,
    targetId: 1,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  game.targets({ initiatorId: 1 });
});

describe("chief two times vote test", async () => {
  const game = new WolfGame([]);
  addPlayer(game);
  game.start();
  addCandidate([1,3], game);
  //start election
  
  //first time
  game.addAction({
    initiatorId: 2,
    targetId: 1,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  
  game.addAction({
    initiatorId: 4,
    targetId: 3,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  game.addAction({
    initiatorId: 5,
    targetId: 1,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  game.addAction({
    initiatorId: 6,
    targetId: 3,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });

  //second time
  game.addAction({
    initiatorId: 2,
    targetId: 1,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  
  game.addAction({
    initiatorId: 4,
    targetId: 1,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  game.addAction({
    initiatorId: 5,
    targetId: 1,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });
  game.addAction({
    initiatorId: 6,
    targetId: 3,
    eventName: ChiefVote.eN.ChiefVote,
    isLock: true,
  });

  const chiefTarget = game.targets({ initiatorId: 0 });

});
