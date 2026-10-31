import Phaser from 'phaser';
import { createState, hashState, step, type CommandLog, type SimState } from '../../sim';
import { sfxBlip } from '../audio';
import { applyCameraFx, pulse } from '../fx';
import { CommandInput } from '../input';
import { PALETTE } from '../palette';

export class Play extends Phaser.Scene {
  private sim!: SimState;
  private log: CommandLog = [];
  private input2!: CommandInput;
  private block!: Phaser.GameObjects.Image;
  private hud!: Phaser.GameObjects.Text;

  constructor() {
    super('Play');
  }

  create(data: { seed: number }): void {
    this.sim = createState(data.seed);
    this.log = [];
    const { width, height } = this.scale;
    this.block = this.add.image(width / 2, height / 2, 'block');
    this.hud = this.add.text(12, 8, '', { fontFamily: 'monospace', fontSize: '18px', color: PALETTE.text });
    this.add
      .text(width / 2, height - 40, 'Space / Click: act   Esc: end', { fontFamily: 'monospace', fontSize: '16px', color: PALETTE.accent })
      .setOrigin(0.5);
    this.input2 = new CommandInput(this);
    this.input.keyboard?.once('keydown-ESC', () =>
      this.scene.start('GameOver', { ticks: this.sim.tick, hash: hashState(this.sim) }),
    );
    applyCameraFx(this.cameras.main);
    this.render();
  }

  update(): void {
    const cmd = this.input2.poll();
    if (!cmd) return;
    this.sim = step(this.sim, cmd);
    this.log.push(cmd);
    if (cmd.t === 'act') {
      sfxBlip();
      pulse(this, this.block);
    }
    this.render();
  }

  private render(): void {
    this.hud.setText(`TICK ${this.sim.tick}  ROLL ${this.sim.roll}`);
  }
}
