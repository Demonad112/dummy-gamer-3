import Phaser from 'phaser';
import { PALETTE } from '../palette';

export class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(data: { ticks: number; hash: string }): void {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2 - 40, 'GAME OVER', { fontFamily: 'monospace', fontSize: '48px', color: PALETTE.text }).setOrigin(0.5);
    this.add
      .text(width / 2, height / 2 + 20, `ticks ${data.ticks}  #${data.hash}`, { fontFamily: 'monospace', fontSize: '18px', color: PALETTE.accent })
      .setOrigin(0.5);
    const again = () => this.scene.start('Menu');
    this.input.keyboard?.once('keydown-ENTER', again);
    this.input.once('pointerdown', again);
  }
}
