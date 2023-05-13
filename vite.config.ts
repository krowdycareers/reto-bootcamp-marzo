import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';
import { crx } from '@crxjs/vite-plugin';
// import manifest from './manifest.json';
import { manifest } from './manifest.config';

export default defineConfig({
	root: resolve(__dirname),
	plugins: [preact(), crx({ manifest })],
	base: './',
	resolve: {
		alias: {
			'@': resolve(__dirname, './src/'),
		},
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		rollupOptions: {
			input: {
				content: 'src/scripts/contentScript.ts',
			},
		},
	},
});
