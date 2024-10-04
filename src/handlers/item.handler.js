import { getGameAssets } from '../init/assets.js';
import { getItem, setItem } from "../models/item.model.js";

export const itemGet = (userId, payload) => {
    
    // 클라이언트가 획득했다고 보낸 아이템 정보
    // userId
    let userGetItems = getItem(userId);
    const { items } = getGameAssets();
    const {currentStage, itemId} = payload;

    if (!userGetItems) {
        return { status: 'fail', message: 'No items found for user' };
    }

    if (!items.data.some((item) => item.id === payload.itemId)){
        return { status: 'fail', message: 'item not found' };
    }

    const serverTime = Date.now();

    setItem(userId, currentStage, itemId, serverTime); // 유저의 아이템 획득 시간을 기록

    return {status: itemId +' 추가 획득'};
}