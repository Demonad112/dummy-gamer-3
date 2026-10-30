import Phaser from 'phaser';
import { createState, GRID, hashState, step, type CommandLog, type SimState } from '../../sim';
import { sfxPickup } from '../audio';
import { applyCameraFx, pulse } from '../fx';
import { CommandInput } from '../input';
import { PALETTE } from '../palette';

export class Play extends Phaser.Scene {
  private sim!: SimState;
  private log: CommandLog = [];
  private input2!: CommandInput;
  private player!: Phaser.GameObjects.Image;
  private items: Phaser.GameObjects.Image[] = [];
  private hud!: Phaser.GameObjects.Text;

  constructor() {
    super('Play');
  }

  create(data: { seed: number }): void {
    this.sim = createState(data.seed);
    this.log = [];
    this.items = [];
    this.drawGrid();
    this.player = this.add.image(0, 0, 'player');
    this.hud = this.add.text(12, 8, '', { fontFamily: 'monospace', fontSize: '18px', color: PALETTE.text });
    this.input2 = new CommandInput(this);
    this.input.keyboard?.once('keydown-ESC', () => this.scene.start('Menu'));
    applyCameraFx(this.cameras.main);
    this.render();
  }

  update(_time: number, delta: number): void {
    const cmd = this.input2.poll(delta);
    if (!cmd) return;
    const prevScore = this.sim.score;
    this.sim = step(this.sim, cmd);
    this.log.push(cmd);
    if (this.sim.score > prevScore) {
      sfxPickup();
      pulse(this, this.player);
    }
    if (this.sim.status === 'won') {
      this.scene.start('GameOver', { score: this.sim.score, ticks: this.sim.tick, hash: hashState(this.sim) });
      return;
    }
    this.render();
  }

  private render(): void {
    const s = this.sim;
    this.player.setPosition(cell(s.playerX), cell(s.playerY));
    while (this.items.length < s.itemsX.length) this.items.push(this.add.image(0, 0, 'item'));
    this.items.forEach((img, i) => {
      const x = s.itemsX[i];
      const y = s.itemsY[i];
      img.setVisible(x !== undefined && y !== undefined);
      if (x !== undefined && y !== undefined) img.setPosition(cell(x), cell(y));
    });
    this.hud.setText(`SCORE ${s.score}  TICK ${s.tick}`);
  }

  private drawGrid(): void {
    const g = this.add.graphics().lineStyle(1, PALETTE.grid);
    const { width, height } = this.scale;
    for (let x = 0; x <= width; x += GRID) g.lineBetween(x, 0, x, height);
    for (let y = 0; y <= height; y += GRID) g.lineBetween(0, y, width, y);
  }
}

const cell = (n: number) => n * GRID + GRID / 2;
