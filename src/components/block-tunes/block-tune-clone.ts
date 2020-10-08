import $ from '../dom';
import { SavedData } from '../../types-internal/block-data';
import { API, BlockTune } from '../../../types';

/**
 *
 */
export default class CloneTune implements BlockTune {
  /**
   * Property that contains Editor.js API methods
   *
   * @see {@link docs/api.md}
   */
  private readonly api: API;

  /**
   * Styles
   *
   * @type {{wrapper: string}}
   */
  private CSS = {
    button: 'ce-settings__button',
    wrapper: 'ce-tune-move-down',
    animation: 'wobble',
  };

  /**
   * CloneTune constructor
   *
   * @param {API} api — Editor's API
   */
  constructor({ api }) {
    this.api = api;
  }

  /**
   * Return 'move down' button
   *
   * @returns {HTMLElement}
   */
  public render(): HTMLElement {
    const button = $.make('div', [this.CSS.button, this.CSS.wrapper], {});

    button.appendChild($.svg('content_copy-24px', 20, 20));
    this.api.listeners.on(
      button,
      'click',
      this.handleClick,
      false
    );

    /**
     * Enable tooltip module on button
     */
    this.api.tooltip.onHover(button, '複製');

    return button;
  }

  /**
   * Handle clicks
   */
  private handleClick = async (): Promise<void> => {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const currentBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);

    const { data, tool } = (await currentBlock.clone()) as SavedData;

    this.api.blocks.insert(tool, data);

    const nextBlock = this.api.blocks.getBlockByIndex(currentBlockIndex + 1);
    const nextBlockElement = nextBlock.holder;
    const nextBlockCoords = nextBlockElement.getBoundingClientRect();

    let scrollOffset = Math.abs(window.innerHeight - nextBlockElement.offsetHeight);

    /**
     * Next block ends on screen.
     * Increment scroll by next block's height to save element onscreen-position
     */
    if (nextBlockCoords.top < window.innerHeight) {
      scrollOffset = window.scrollY + nextBlockElement.offsetHeight;
    }

    window.scrollTo(0, scrollOffset);

    /** Change blocks positions */
    this.api.blocks.move(currentBlockIndex + 1);

    /** Hide the Tooltip */
    this.api.tooltip.hide();
  }
}
