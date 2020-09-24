/**
 * @module ResizeObserver
 *
 * Handles any resizes
 */

import Module from '../__module';
import * as _ from '../utils';

/**
 *
 */
export default class SizeObserver extends Module {
  /**
   * ResizeObserver instance
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  private observer: ResizeObserver;

  /**
   * Disconnect ResizeObserver
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = null;
  }

  /**
   * Preparation method
   *
   * @returns {Promise<void>}
   */
  public async prepare(): Promise<void> {
    if (!('ResizeObserver' in window)) {
      return;
    }

    const { UI } = this.Editor;

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.observer = new ResizeObserver(() => {
      this.resizeHandler();
    });
    this.observer.observe(UI.nodes.redactor);
  }

  /**
   * ResizeObserver events handler
   */
  private resizeHandler(): void {
    /**
     * Wait till Browser render Editor's Blocks
     */
    if (!this.Editor.BlockManager.currentBlock) {
      return;
    }

    /**
     * Adjust toolbar position
     */
    this.Editor.Toolbar.move();
  }
}
