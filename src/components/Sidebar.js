import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { darken } from 'polished';
import React from 'react';
import Colors from '../constants/Colors';

const SidebarShell = styled.div`
  width: 220px;
  background: ${Colors.sidebarBg};
  padding-top: 20px;
  height: 100%;
  cursor: pointer;
`;
const Button = styled(Link)`
  display: block;
  padding: 18px 42px;
  color: ${Colors.blueDarker};
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: 0.2s all;
  cursor: pointer;
  background: ${Colors.sidebarBg};
  &:hover {
    color: ${Colors.blueDarkest};
  }
`;

const Sidebar = () => (
  <SidebarShell>
    <Button to="/tickets">Tickets</Button>
    <Button to="/transactions">Transactions</Button>
  </SidebarShell>
);

export default Sidebar;
