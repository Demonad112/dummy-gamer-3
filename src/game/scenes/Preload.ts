import Phaser from 'phaser';
import { GRID } from '../../sim';
import { PALETTE } from '../palette';

// No binary assets: generate textures from primitives.
export class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  create(): void {
    const g = this.make.graphics({}, false);
    g.fillStyle(PALETTE.player).fillRect(0, 0, GRID - 4, GRID - 4);
    g.generateTexture('player', GRID - 4, GRID - 4);
    g.clear().fillStyle(PALETTE.item).fillCircle(8, 8, 8);
    g.generateTexture('item', 16, 16);
    g.destroy();
    this.scene.start('Menu');
  }
}
