// key: uuid, value: array
const items = {};

// 아이템 생성, 조회, 변경
export const createItem = (uuid) => {
  items[uuid] = [];
};

export const getItem = (uuid) => {
  return items[uuid];
};

// 아이템 획득한 시간을 기록
export const setItem = (uuid, itemId, timestamp) => {
  return items[uuid].push({ itemId, timestamp });
};

export const clearItem = (uuid) => {
  items[uuid] = [];
};
