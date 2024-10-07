// key: uuid, value: array
const stages = {};

// 스테이지 생성, 조회, 변경
export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

// 스테이지마다 타임스탬프를 가짐
export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};
