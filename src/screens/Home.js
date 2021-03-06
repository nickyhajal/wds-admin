import React from 'react';
import styled from 'styled-components';
import query from '../util/query';
import Colors from '../constants/Colors';

const Shell = styled.div`
  display: flex;
`;
const Blocks = styled.div`
  display: flex;
  flex-direction: row;
  width: 940px;
  flex-wrap: wrap;
`;
const Divide = styled.div`
  height: 2px;
  flex: 1;
  background: ${Colors.blueDarker};
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: calc(100% - 24px);
  margin-top: -3px;
  margin-right: 24px;
  margin-bottom: 28px;
  opacity: 0.2;
`;
const Block = styled.div`
  flex: 1;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: calc(25%);
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
  const {
    current_wave_tickets,
    current_wave_plan,
    current_wave_total,
    total_tickets,
    num_assigned,
    single_buys,
    payment_plans,
    friends,
    rsvps,
    likes,
    meetups,
    posts,
    pw,
  } = Object.assign(
    {
      current_wave_tickets: '',
      total_tickets: 0,
      num_assigned: 0,
      current_wave_plan: '',
      current_wave_total: '',
    },
    data.stats,
  );
  const percentAssigned =
    total_tickets > 0
      ? `${Math.floor((num_assigned / total_tickets) * 100)}%`
      : '';
  return (
    <Shell>
      <Blocks>
        <Block>
          <div>{current_wave_total}</div>
          <label>Total (This Wave)</label>
        </Block>
        <Block>
          <div>{current_wave_tickets}</div>
          <label>Full Price Sales (This Wave)</label>
        </Block>
        <Block>
          <div>{current_wave_plan}</div>
          <label>Payment Plans (This Wave)</label>
        </Block>
        <Divide />
        <Block>
          <div>{total_tickets}</div>
          <label>Total Tickets (All Types)</label>
        </Block>
        <Block>
          <div>{single_buys}</div>
          <label>Total Sales (Alltime)</label>
        </Block>
        <Block>
          <div>{payment_plans}</div>
          <label>Payment Plans</label>
        </Block>
        <Divide />
        <Block>
          <div>{percentAssigned}</div>
          <label>Percent Assigned</label>
        </Block>
        <Block>
          <div>{posts}</div>
          <label>Feed Posts</label>
        </Block>
        <Block>
          <div>{likes}</div>
          <label>Feed Likes</label>
        </Block>
        {/* <Block>
          <div>{friends}</div>
          <label>New Friendships</label>
        </Block> */}
        <Divide />
        <Block>
          <div>{meetups}</div>
          <label>Approved Meetups</label>
        </Block>
        <Block>
          <div>{rsvps}</div>
          <label>Event RSVPs</label>
        </Block>
        <Block>
          <div>{pw}</div>
          <label>Lost Passwords</label>
        </Block>
      </Blocks>
    </Shell>
  );
};

export default query('stats', HomeScreen, {
  pollInterval: 10000,
  fetchPolicy: 'network-only',
});
