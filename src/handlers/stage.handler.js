import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  // 유저는 스테이지를 하나씩 올라갈 수 있다. (1스테이지 -> 2, 2 -> 3)
  // 유저는 일정 점수가 되면 다음 스테이지로 이동한다.
  // currentStage, targetStage

  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  const { stages, items } = getGameAssets();
  const { currentStage, targetStage, stageItemScore } = payload;

  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);

  // 서버가 가진 유저 현재 스테이지 정보 가져오기
  const userStageInfo = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (userStageInfo.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // 스테이지 정보를 nowStage에 저장
  const nowStageId = stages.data.find((idx) => idx.id === userStageInfo.id);
  const currentStageId = stages.data.find((idx) => idx.id === currentStage);
  const targetStageId = stages.data.find((idx) => idx.id === targetStage);
  const itemMaxScore = items.data.reduce((prev, value) => {
    return prev.score >= value.score ? prev.score : value.score;
  });
  const scorePerSecond = nowStageId.scorePerSecond;
  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - userStageInfo.timestamp) / 1000; // 현 스테이지가 진행된 시간
  const timeScore = Math.floor(elapsedTime * scorePerSecond); // 현 스테이지 시간 점수 계산
  const nowStageScore = timeScore + stageItemScore; // 현 스테이지에서 얻은 점수 + 아이템으로 획득한 점수

  const scoreCheck = Math.abs(targetStageId.score - currentStageId.score - nowStageScore);
  // 5라는 숫자는 임의로 정한 오차범위

  console.log('현재 스테이지 시작 점수 ', currentStageId.score);
  console.log('다음 스테이지 필요 점수 ', targetStageId.score);
  console.log('스테이지 시간 점수 종합 ', timeScore);
  console.log('스테이지 아이템 획득 점수 종합 ', stageItemScore);
  console.log('현재 스테이지에서 얻은 점수 ', nowStageScore);
  console.log('점수 오차', scoreCheck);
  if (scoreCheck > 5 + itemMaxScore) {
    return { status: 'fail', message: 'Invaild elapsed time' };
  }

  // targetStage에 대한 검증 <- 게임 에셋에 존재하는가?
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime); // 각 스테이지 시작시간을 저장
  // console.log(getStage(userId));
  return { status: targetStageId.id * 1 - 999 + ' 스테이지로 이동' };
};
