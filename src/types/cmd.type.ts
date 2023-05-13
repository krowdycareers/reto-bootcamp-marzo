import { MESSAGE_STATUS } from '@/enums';
import { statusScrapTypes } from './statusScrap.type';
const { NEXT, ONLINE, SCRAP } = MESSAGE_STATUS;

export type cmdBackgroundTypes = typeof NEXT | typeof ONLINE | statusScrapTypes;

export type cmdContentScriptTypes = typeof SCRAP;
