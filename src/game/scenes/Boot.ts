import Phaser from 'phaser';
import { unlockAudio } from '../audio';

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.input.once('pointerdown', unlockAudio);
    this.input.keyboard?.once('keydown', unlockAudio);
    this.scene.start('Preload');
  }
}
