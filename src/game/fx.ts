import Phaser from 'phaser';

// All visual FX live here. Phaser 4 filters: check the v3-to-v4 migration skill before changing.
export function applyCameraFx(camera: Phaser.Cameras.Scene2D.Camera): void {
  if (camera.scene.game.renderer.type !== Phaser.WEBGL) return; // filters are WebGL-only
  Phaser.Actions.AddEffectBloom(camera, {
    threshold: 0.5,
    blurRadius: 2,
    blurSteps: 4,
    blendAmount: 0.8,
    useInternal: true,
  });
  camera.filters.internal.addVignette(0.5, 0.5, 0.9, 0.35);
}

export function pulse(scene: Phaser.Scene, target: Phaser.GameObjects.Components.Transform): void {
  scene.tweens.add({ targets: target, scale: { from: 1.4, to: 1 }, duration: 120, ease: 'Quad.easeOut' });
}
