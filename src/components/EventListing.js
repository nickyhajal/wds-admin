import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import moment from 'moment';
import Colors from '../constants/Colors';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Row = styled.tr`
  &.heading {
    border-bottom: 2px solid rgb(210, 222, 221);
    background: rgb(235, 243, 239);
    border-top: 25px solid #fff;
  }
  td {
    padding: 12px 10px;
    text-align: left;
    cursor: pointer;
    opacity: 0.9;
    &:first-of-type {
      font-weight: 600;
    }
    &.data {
      text-align: center;
    }
  }
  &:hover {
    td {
      opacity: 1;
    }
  }
  &:first-of-type {
    border-top: 0;
  }
`;
const Head = styled.thead`
  padding: 0;

  th,
  tr {
    margin: 0;
    padding: 4px;
    text-align: center;
  }
`;

const EventRow = ({
  event: { type, what, who, hosts, start, num_free, num_rsvps, max, free_max },
  even,
  onClick,
}) => {
  return (
    <Row
      onClick={onClick}
      style={{
        backgroundColor: lighten(even ? 0.04 : 0.014, Colors.whiteBlue),
      }}
    >
      <td style={{ width: '90px' }}>{moment.utc(start).format('h:mm a')}</td>
      <td>{what}</td>
      {type === 'academy' && (
        <td className="data">{`${num_free}/${free_max}`}</td>
      )}
      {['academy', 'activity', 'meetup'].includes(type) && (
        <td className="data">{`${num_rsvps}/${max}`}</td>
      )}
    </Row>
  );
};
const Heading = ({ heading }) => {
  return (
    <Row className="heading">
      <td colspan="30" style={{ fontSize: '18px', fontWeight: '700' }}>
        {heading}
      </td>
    </Row>
  );
};
const EventListing = ({ events, onClick }) => {
  let lastDay = false;
  const eventsWithHeadings = events.reduce((out, curr) => {
    if (!lastDay || !moment(lastDay).isSame(curr.start, 'day')) {
      lastDay = curr.start;
      out.push({ heading: moment(curr.start).format('dddd, MMMM Do') });
    }
    out.push(curr);
    return out;
  }, []);
  const type = events[0].type;
  return (
    <Table>
      {['meetup', 'activity'].includes(type) && (
        <Head>
          <tr>
            <th />
            <th />
            <th>RSVPs</th>
          </tr>
        </Head>
      )}
      {type === 'academy' && (
        <Head>
          <tr>
            <th />
            <th />
            <th>Free</th>
            <th>Paid</th>
          </tr>
        </Head>
      )}
      <tbody>
        {eventsWithHeadings.map(
          (e, i) =>
            e.heading ? (
              <Heading heading={e.heading} />
            ) : (
              <EventRow onClick={() => onClick(e)} event={e} even={i % 2} />
            ),
        )}
      </tbody>
    </Table>
  );
};

export default EventListing;
