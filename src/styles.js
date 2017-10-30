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
   .ReactModal__Content {
     width: 720px;
     margin: 0 auto !important;
     border: 0 !important;
     box-shadow: 2px 2px 18px rgba(0,0,0,0.1);
     padding: 50px !important;
     bottom: auto !important;
     top: 120px !important;

     h1{ margin-top: 0; color: ${Colors.blueDarkest}; line-height: 120%;}
   }
`;
