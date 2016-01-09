import React from 'react';
import {createRoot} from 'react-dom/client';

import App from 'app/App';

// render the app to a dom node
const rootNode = document.getElementById('app');
rootNode && createRoot(rootNode).render(<App/>);
