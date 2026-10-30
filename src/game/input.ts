import Phaser from 'phaser';
import type { Command } from '../sim';

const REPEAT_MS = 110;

// Maps held keys to sim commands with a fixed repeat rate.
export class CommandInput {
  private keys: Record<'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;
  private cooldown = 0;

  constructor(scene: Phaser.Scene) {
    const kb = scene.input.keyboard!;
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = kb.addKeys({ up: K.UP, down: K.DOWN, left: K.LEFT, right: K.RIGHT, w: K.W, a: K.A, s: K.S, d: K.D }) as CommandInput['keys'];
  }

  poll(deltaMs: number): Command | null {
    const k = this.keys;
    const dx = (k.right.isDown || k.d.isDown ? 1 : 0) - (k.left.isDown || k.a.isDown ? 1 : 0);
    const dy = (k.down.isDown || k.s.isDown ? 1 : 0) - (k.up.isDown || k.w.isDown ? 1 : 0);
    if (dx === 0 && dy === 0) {
      this.cooldown = 0;
      return null;
    }
    this.cooldown -= deltaMs;
    if (this.cooldown > 0) return null;
    this.cooldown = REPEAT_MS;
    return { t: 'move', dx: dx as -1 | 0 | 1, dy: dy as -1 | 0 | 1 };
  }
}
