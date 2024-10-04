import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  // 유저는 스테이지를 하나씩 올라갈 수 있다. (1스테이지 -> 2, 2 -> 3)
  // 유저는 일정 점수가 되면 다음 스테이지로 이동한다.
  // currentStage, targetStage

  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  const { stages } = getGameAssets();
  const { currentStage, targetStage } = payload;

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

  const scorePerSecond = nowStageId.scorePerSecond;

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - userStageInfo.timestamp) / 1000; // 현재 서버 시간에서 현 스테이지가 시작한 시간을 뺀 값
  const nowStageScore = elapsedTime * scorePerSecond; // 현 스테이지에서 얻은 점수
  const scoreCheck = Math.abs((targetStageId.score - currentStageId.score) - nowStageScore);
  // 1스테이지 -> 2스테이지로 넘어가는 가정
  // 5라는 숫자는 임의로 정한 오차범위

  console.log("현재 스테이지에서 얻은 점수 ", nowStageScore);
  console.log("다음 스테이지 필요 점수 ", targetStageId.score);
  console.log("점수 오차", scoreCheck);
  if (scoreCheck > 50) {
    return { status: 'fail', message: 'Invaild elapsed time' };
  }

  // targetStage에 대한 검증 <- 게임 에셋에 존재하는가?
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime); // 각 스테이지 시작시간을 저장
  // console.log(getStage(userId));
  return { status: 'success' };
};
