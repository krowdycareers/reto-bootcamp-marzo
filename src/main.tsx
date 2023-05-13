import { render } from 'preact';
import { App } from './app.tsx';
import './styles/index.scss';
const root = document.createElement('div');
root.id = 'crx-root';
document.body.append(root);
render(<App />, root);
