export const addNewPageToURL = (url: string) => {
	const match = url.match(/page=(\d+)$/);
	if (!match) {
		const endWithSlash = url.endsWith('/');
		return url.concat(`${endWithSlash ? '?' : '&'}?page=2`);
	}
	const currentPage = match ? parseInt(match[1]) : 1;
	const nextPage = currentPage + 1;
	return url.replace(/page=(\d+)$/, `page=${nextPage}`);
};
