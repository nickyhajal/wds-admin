import styled from 'styled-components';
import Colors from '../constants/Colors';

const Content = styled.div`
  padding: 40px;
  background: ${Colors.contentBg};
  width: 100%;
  color: ${Colors.contentText};
  h2 {
    font-size: 36px;
    line-height: 24px;
  }
  h3 {
    font-size: 26px;
    line-height: 24px;

    button {
      display: inline;
      border: 1px solid #ced7da;
      border-radius: 3px;
      margin-left: 8px;
      background: #fff;
      padding: 3px 10px 3px;
      position: relative;
      top: -5px;
      color: ${Colors.blue};
      font-size: 13px;
      cursor: pointer;
      transition: 0.5s all;
      font-weight: 600;
      box-shadow: 1px 1px 1px rgba(206, 215, 218, 0.55);
      &:hover {
        background: ${Colors.whiteBlue};
      }
    }
  }
  h2,
  h3,
  h4,
  h5 {
    &:first-child {
      margin-top: 0;
    }
  }
  .react-tabs__tab-list {
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    list-style-type: none;
    margin-top: 42px;
    li {
      margin-right: 36px;
    }
    .react-tabs__tab {
      cursor: pointer;
    }
    .react-tabs__tab--selected {
      color: ${Colors.blue};
      font-weight: 700;
    }
  }
  .react-tabs__tab-panel {
    padding: 32px;
    background: ${Colors.tabBg};
    margin-top: 18px;
    box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    display: none;
    width: 920px;
  }
  .react-tabs__tab-panel--selected {
    display: block;
  }
`;

export default Content;
