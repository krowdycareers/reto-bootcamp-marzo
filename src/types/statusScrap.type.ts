import { MESSAGE_STATUS } from '@/enums';
const { START, STOP } = MESSAGE_STATUS;

export type statusScrapTypes = typeof START | typeof STOP;
