import { gameEnd, gameStart } from './game.handler.js';
import { moveStageHandler } from './stage.handler.js';
import { itemGet } from './item.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  21: itemGet
};

export default handlerMappings;
