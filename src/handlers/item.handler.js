import { getGameAssets } from '../init/assets.js';
import { getItem, setItem } from "../models/item.model.js";

export const itemGet = (userId, payload) => {
    
    // 클라이언트가 획득했다고 보낸 아이템 정보
    // userId
    let userGetItems = getItem(userId);
    const { items, itemUnlocks } = getGameAssets();
    const {currentStage, itemId, itemScore} = payload;

    if (!items.data.some((item) => item.id === payload.itemId)){
        return { status: 'fail', message: 'item not found' };
    }

    const unlockItemCheck = itemUnlocks.data.find((idx)=> idx.stageId === payload.currentStage);

    if(!unlockItemCheck.itemId.includes(payload.itemId)){
        return { status: 'fail', message: '현재 스테이지에 획득할 수 없는 아이템입니다' };
    }

    const serverTime = Date.now();

    setItem(userId, currentStage, itemId, itemScore, serverTime); // 유저의 아이템 획득 시간을 기록

    return {status: itemScore +'점 추가 획득'};
}