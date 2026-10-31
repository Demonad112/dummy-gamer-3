import Phaser from 'phaser';
import type { Command } from '../sim';
import { markMuted } from './debug';
import { getSettings, setMuted } from './settings';

// Maps key presses to sim commands. One entry per Command variant the player can issue.
export class CommandInput {
  private queue: Command[] = [];

  constructor(scene: Phaser.Scene) {
    const kb = scene.input.keyboard!;
    kb.on('keydown-SPACE', () => this.queue.push({ t: 'act' }));
    scene.input.on('pointerdown', () => this.queue.push({ t: 'act' }));
  }

  clear(): void {
    this.queue.length = 0;
  }

  poll(): Command | null {
    return this.queue.shift() ?? null;
  }
}

// M toggles mute in any scene that calls this. Mute is a persisted view setting, not a sim command.
export function bindMute(scene: Phaser.Scene): void {
  markMuted(scene.game.canvas, getSettings().muted);
  scene.input.keyboard?.on('keydown-M', () => {
    setMuted(!getSettings().muted);
    markMuted(scene.game.canvas, getSettings().muted);
  });
}
