/*import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

import './index.css';
import { App } from './App';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);*/

import * as ReactDOM from 'react-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import  App  from './App';

import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <FluentProvider theme={webLightTheme}> 
      <App/>
  </FluentProvider>,
  document.getElementById('root'),
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




