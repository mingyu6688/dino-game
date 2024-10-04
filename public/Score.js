// 서버에 정보를 보내 핸들러
import { sendEvent } from './socket.js';

import stageJson from './assets/stage.json' with { type: 'json' };
import itemJson from './assets/item.json' with { type: 'json' };

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stage = 0;
  stageChange = false;
  scorePerSecond = 1;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * this.scorePerSecond; // 현재 배율만큼 점수 증가

    const currentScore = Math.floor(this.score); // 현재 점수

    if (stageJson.data[this.stage + 1]) {
      // 다음 스테이지가 존재하는가?
      if (this.stageChange && currentScore >= stageJson.data[this.stage + 1].score) {
        // 현재 점수가 다음 스테이지의 점수 조건을 충족?
        this.stageChange = false;
        this.scorePerSecond = stageJson.data[this.stage + 1].scorePerSecond;
        sendEvent(11, {
          currentStage: stageJson.data[this.stage].id,
          targetStage: stageJson.data[this.stage + 1].id,
        });
        this.stage += 1;
        console.log(this.stage);
      }
      else {
        this.stageChange = true;
      }
    }
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
