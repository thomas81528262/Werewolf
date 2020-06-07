import  World  from "./world";
import { DayTimeingEvent } from "./event";

class TestEvent extends DayTimeingEvent {
  targets({ initiatorId }) {
    return [
      {
        initiatorId,
        eventName: "test target",
        initiatorsId: [],
        value: "test value",
        targetId: 0,
      },
    ];
  }

  get testAction() {
    return this.actions;
  }
}

class TestWorld extends World {
  setPlayerState() {}
}

describe("basic world test", () => {
  const event = new TestEvent({
    name: "test",
    accessRole: ["testRole"],
    timeOut: 2,
  });
  const world = new TestWorld({ dayEvents: [event], stateEvents:[] });
  test("add player test", async () => {
    world.addPlayer({ role: "testRole", id: 0 , camp:'' });
    world.addPlayer({ role: "wolf", id: 3 , camp:'' });
  });

  test("add action test", async () => {
    world.start();
    world.addAction({ initiatorId: 0, targetId: 3, eventName: "test" , isLock:false});
    world.addAction({ initiatorId: 3, targetId: 0, eventName: "test" , isLock:false});

    expect(event.testAction).toEqual({
      _actions: [
        {
          eventName: "test",
          initiatorId: 0,
          targetId: 3,
          date: expect.any(Date),
          day: 0,
        },
        {
          eventName: "test",
          initiatorId: 3,
          targetId: 0,
          date: expect.any(Date),
          day: 0,
        },
      ],
    });
  });

  test("target test", async () => {
    expect(world.targets({ initiatorId: 3 })).toStrictEqual([
      {
        initiatorId: 3,
        eventName: "test target",
        initiatorsId: [],
        value: "test value",
        targetId: 0,
      },
    ]);
  });
});
