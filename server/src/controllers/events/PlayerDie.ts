import { DayConditionalEvent } from "../event";
import { State as PlayerState } from "../../models/player";
enum State {
  WaitResult = "WaitResult",
  WaitCharacter = "WaitCharacter",
}

class PlayerDie extends DayConditionalEvent {
  private waitState: State = State.WaitResult;
  constructor() {
    super({ name: "PLAYER_DIE", accessRole: [] });
  }

  targets() {
    return [];
  }

  start() {
    super.start();
    this.waitState = State.WaitResult;
  }

  async wait() {
    if (this.waitState === State.WaitResult) {
      this.world.setPlayerState();
      this.world.players.forEach((player) => {
        player.startEvent(PlayerState.Die);
      });
      this.waitState = State.WaitCharacter;
    } else {
      let isFinish = true;

      this.world.players.forEach((player) => {
        const { isBusy } = player;
        if (isBusy) {
          isFinish = false;
        }
      });

      if (isFinish) {
        this.next();
      }
    }
  }
  addAction({
    initiatorId,
    targetId,
    eventName,
    day,
    isLock,
  }: {
    initiatorId: number;
    targetId: number;
    eventName: string;
    day: number;
    isLock: boolean;
  }) {
    if (this.waitState === State.WaitCharacter) {
      const player = this.world.players.get(initiatorId);

      if (player) {
        player.addEventAction({ eventName, day, isLock, targetId });
      }
    }
  }
}

const dayEvents = [new PlayerDie()];

export default { PlayerDie, dayEvents };
