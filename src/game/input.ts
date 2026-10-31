import Phaser from 'phaser';
import type { Command } from '../sim';

// Maps key presses to sim commands. One entry per Command variant the player can issue.
export class CommandInput {
  private queue: Command[] = [];

  constructor(scene: Phaser.Scene) {
    const kb = scene.input.keyboard!;
    kb.on('keydown-SPACE', () => this.queue.push({ t: 'act' }));
    scene.input.on('pointerdown', () => this.queue.push({ t: 'act' }));
  }

  poll(): Command | null {
    return this.queue.shift() ?? null;
  }
}
