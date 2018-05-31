// @flow
import { injectGlobal } from 'styled-components';
import Colors from './constants/Colors';

/* eslint-disable */

injectGlobal`
  html, body, #root {
    height: 100%;
    background: #F6FCFD;
  }
  body {
    margin: 0;
    padding: 0;
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
   .wide .react-tabs__tab-panel {
     width: 100% !important;
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
   .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
     padding: 0 !important;
   }
   .react-datepicker__input-container input {

  padding: 9px;
  border: 1px solid #ccc;
  font-size: 15px;
  border-radius: 4px;
  width: 100%;
  color: ${Colors.inputText};
   }
`;
