import React from 'react';
import { Link } from 'react-router-dom';
import { darken, lighten } from 'polished';
import styled from 'styled-components';
import Colors from '../constants/Colors';
import img from '../util/img';
import Search from '../containers/Search';

const Shell = styled.div`
  background: ${Colors.headerBg};
  height: 88px;
  width: 100%;
  display: flex;
`;
const Logo = styled(Link)`
  display: block;
  background: ${Colors.logoBg};
  width: 257px;
  height: 82px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  transition: 0.2s all;
  &:before {
    background: url(${img('admin-logo')});
    width: 94px;
    height: 41px;
    background-repeat: no-repeat;
    background-size: contain;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    content: '';
  }
  &:hover {
    background: ${lighten(0.05, Colors.logoBg)};
  }
`;
const Content = styled.div`
  padding: 6px 8px;
  width: 100%;
  height: 100%;
`;
const Header = () => {
  return (
    <Shell>
      <Logo to="/" />
      <Content>
        <Search />
      </Content>
    </Shell>
  );
};

export default Header;
