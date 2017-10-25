// @flow
import { injectGlobal } from 'styled-components';
import Colors from './constants/Colors';

/* eslint-disable */

injectGlobal`
  html, body, #root {
    height: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: Lato;
    color: ${Colors.text};
    background: ${Colors.bg};
    font-family: 'Source Sans Pro', sans-serif;
  }
  h3 {
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
  textarea, input, button { 
    outline: none;
    font-family: 'Source Sans Pro', sans-serif;
   }
`;
