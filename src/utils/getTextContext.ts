export const getTextContext = (el: Element, selector: string): string =>
	el.querySelector(selector)!.textContent as string;
