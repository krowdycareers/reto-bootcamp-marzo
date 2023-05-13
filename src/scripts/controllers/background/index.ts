import { IJobsInformation } from '@/interfaces';
import { MESSAGE_STATUS, PORTS_NAME } from '@/enums';
import { clearLocalStorage } from '@/utils';
import { statusScrapTypes } from '@/types';
import { cmdStop, cmdStart, cmdNext } from './commands';

class BackgroundCtrl {
	private statusScrap: statusScrapTypes;
	private port: chrome.runtime.Port;
	constructor() {
		this.statusScrap = MESSAGE_STATUS.STOP;
		this.port = chrome.runtime.connect({ name: PORTS_NAME.DEFAULT });
	}
	setPort(port: chrome.runtime.Port) {
		this.port = port;
	}
	async START() {
		this.statusScrap === MESSAGE_STATUS.STOP && clearLocalStorage();
		this.statusScrap = MESSAGE_STATUS.START;
		await cmdStart();
	}
	async ONLINE() {
		this.statusScrap === MESSAGE_STATUS.START && (await this.START());
	}
	async NEXT(jobs: IJobsInformation[]) {
		await cmdNext(jobs, this.port);
	}
	async STOP() {
		this.statusScrap = MESSAGE_STATUS.STOP;
		await cmdStop();
	}
}

export const backgroundCtrl = new BackgroundCtrl();
