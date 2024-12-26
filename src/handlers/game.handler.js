import { getGameAssets } from '../init/assets.js';
import { clearItem, getItem } from '../models/item.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  clearStage(uuid);
  clearItem(uuid);
  // stages 배열에서 0번째 = 첫 번째 스테이지
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('stage: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트는 게임 종료 시 타임스탬프와 총 점수를 서버에 전달
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid); // uuid에 해당하는 스테이지 정보들을 가진 배열

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속 시간을 계산하여 점수 계산
  let totalScore = 0;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 종료 시간을 페이로드로 받은 gameEndTime으로 저장
      stageEndTime = gameEndTime;
    } else {
      // 모든 스테이지의 종료 시간을 사용
      stageEndTime = stages[index + 1].timestamp;
    }

    const stageData = getGameAssets().stages.data;

    const stageDuration = Math.floor((stageEndTime - stage.timestamp) / 1000); // 모든 스테이지의 종료 시간 - 시작 시간으로 스테이지가 지속된 시간을 계산
    // 스테이지별로 가진 시간별 점수
    const thisStage = stageData.find((data) => data.id === stage.id); // 해당하는 스테이지를 json에서 조회
    if (!thisStage) {
      return { status: 'fail', message: `Stage ${stage.id} not found in stage.json` };
    }

    // 스테이지별 자연 획득 점수 게산
    totalScore += stageDuration * thisStage.scorePerSecond;
  });

  // 총 획득한 아이템 점수
  const getItemList = getItem(uuid);
  getItemList.forEach((time) => {
    totalScore += time.itemScore;
  })

  console.log('계산된 총 점수: ', totalScore);
  // 점수와 타임스탬프 검증
  // 오차범위 5
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  return { status: 'success', message: 'Game ended', totalScore };
};
