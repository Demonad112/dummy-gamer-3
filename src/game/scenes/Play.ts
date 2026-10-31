import Phaser from 'phaser';
import { advanceClock, createState, encodeReplay, step, type Command, type CommandLog, type SimState } from '../../sim';
import { sfxBlip } from '../audio';
import { bindReplayExport } from '../debug';
import { applyCameraFx, pulse } from '../fx';
import { CommandInput } from '../input';
import { PALETTE } from '../palette';

// 'realtime': the sim ticks at TICK_HZ and idle ticks log 'wait'. 'turn': the sim ticks only on input.
const TICK_MODE: 'realtime' | 'turn' = 'realtime';

export class Play extends Phaser.Scene {
  private sim!: SimState;
  private log: CommandLog = [];
  private accMs = 0;
  private input2!: CommandInput;
  private block!: Phaser.GameObjects.Image;
  private hud!: Phaser.GameObjects.Text;

  constructor() {
    super('Play');
  }

  create(data: { seed: number }): void {
    this.sim = createState(data.seed);
    this.log = [];
    this.accMs = 0;
    const { width, height } = this.scale;
    this.block = this.add.image(width / 2, height / 2, 'block');
    this.hud = this.add.text(12, 8, '', { fontFamily: 'monospace', fontSize: '18px', color: PALETTE.text });
    this.add
      .text(width / 2, height - 40, 'Space / Click: act   Esc: end   F8: save replay', { fontFamily: 'monospace', fontSize: '16px', color: PALETTE.accent })
      .setOrigin(0.5);
    this.input2 = new CommandInput(this);
    const replay = () => encodeReplay(data.seed, this.log, this.sim);
    bindReplayExport(this, replay);
    this.input.keyboard?.once('keydown-ESC', () => this.scene.start('GameOver', { replay: replay() }));
    applyCameraFx(this.cameras.main);
    this.render();
  }

  update(_time: number, delta: number): void {
    if (TICK_MODE === 'turn') {
      const cmd = this.input2.poll();
      if (cmd) this.apply(cmd);
    } else {
      const { steps, accMs } = advanceClock(this.accMs, delta);
      this.accMs = accMs;
      for (let i = 0; i < steps; i++) this.apply(this.input2.poll() ?? { t: 'wait' });
    }
    this.render();
  }

  private apply(cmd: Command): void {
    this.sim = step(this.sim, cmd);
    this.log.push(cmd);
    if (cmd.t === 'act') {
      sfxBlip();
      pulse(this, this.block);
    }
  }

  private render(): void {
    this.hud.setText(`TICK ${this.sim.tick}  ROLL ${this.sim.roll}`);
  }
}
