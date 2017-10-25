import React from 'react';
import styled from 'styled-components';
import query from '../util/query';
import Colors from '../constants/Colors';

const Shell = styled.div`display: flex;`;
const Blocks = styled.div`
  display: flex;
  flex-direction: row;
  width: 940px;
`;
const Block = styled.div`
  flex: 1;
  border-radius: 6px;
  background: ${Colors.white};
  padding: 18px 32px;
  box-shadow: 3px 3px 22px rgba(0, 0, 0, 0.07);
  text-align: center;
  margin-bottom: 32px;
  margin-right: 24px;
  div {
    font-size: 64px;
  }
  label {
    text-transform: uppercase;
    font-weight: 800;
    opacity: 0.8;
    font-size: 15px;
  }
`;
const HomeScreen = ({ data }) => {
  const { current_wave_tickets, total_tickets, num_assigned } = Object.assign(
    { current_wave_tickets: '', total_tickets: '', num_assigned: '' },
    data.stats,
  );
  return (
    <Shell>
      <Blocks>
        <Block>
          <div>{current_wave_tickets}</div>
          <label>Sales This Wave</label>
        </Block>
        <Block>
          <div>{total_tickets}</div>
          <label>Total Tickets Sold</label>
        </Block>
        <Block>
          <div>{Math.floor(num_assigned / total_tickets * 100)}%</div>
          <label>Percent Assigned</label>
        </Block>
      </Blocks>
    </Shell>
  );
};

export default query('stats', HomeScreen, {
  pollInterval: 20000,
  fetchPolicy: 'network-only',
});
