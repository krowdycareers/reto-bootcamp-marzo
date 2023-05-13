type objToLocalStorage = { [key: string]: unknown };

export const setLocalStorage = async (
	key: string,
	objToSave: objToLocalStorage
) => await chrome.storage.local.set({ [key]: objToSave });

export const getLocalStorage = async (key: string) =>
	await chrome.storage.local.get(key);

export const clearLocalStorage = () => {
	chrome.storage.local.clear();
};
