import Item from './Item.js';
import itemUnlockJson from './assets/item_unlock.json' with { type: 'json' };

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 5000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem(score) {
    // 스테이지 id 값을 전달할 방법이 필요하다?
    // const itemUnlockData = itemUnlockJson.data.find((idx) => idx.stageId === score.stageId);
    const itemUnlockData = itemUnlockJson.data[score.stage].itemId;

    const index = Math.floor(Math.random() * itemUnlockData.length);
    const randomItemIndex = itemUnlockData[index];

    const itemInfo = this.itemImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      randomItemIndex,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime, score) {
    if (this.nextInterval <= 0) {
      this.createItem(score);
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
