import { defineManifest } from '@crxjs/vite-plugin';

export const manifest = defineManifest({
	name: 'OCC Scraper',
	description:
		'Scraping a página https://www.occ.com.mx/ para obtener los avisos de trabajos del día y generar indicadores agrupados por ciudad y rango salarial',
	manifest_version: 3,
	version: '1.0',
	action: {
		default_title: 'Scraping OCC',
		default_popup: 'index.html',
	},
	background: {
		service_worker: 'src/scripts/background.ts',
	},
	content_scripts: [
		{
			matches: ['https://www.occ.com.mx/*'],
			js: ['src/scripts/contentScript.ts'],
		},
	],
	icons: {
		'16': 'assets/icons/scrapper-icon.png',
		'32': 'assets/icons/scrapper-icon.png',
		'48': 'assets/icons/scrapper-icon.png',
		'128': 'assets/icons/scrapper-icon.png',
	},
	permissions: ['activeTab', 'scripting', 'tabs', 'storage', 'webNavigation'],
});
