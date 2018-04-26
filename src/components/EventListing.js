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
  td {
    padding: 12px 10px;
    text-align: left;
    cursor: pointer;
    &:first-of-type {
      font-weight: 600;
    }
    opacity: 0.9;
  }
  &:hover {
    td {
      opacity: 1;
    }
  }
`;

const EventRow = ({ event: { what, who, hosts, start }, even, onClick }) => {
  return (
    <Row
      onClick={onClick}
      style={{
        backgroundColor: lighten(even ? 0.04 : 0.014, Colors.whiteBlue),
      }}
    >
      <td style={{ width: '90px' }}>{moment.utc(start).format('h:mm a')}</td>
      <td>{what}</td>
    </Row>
  );
};
const Heading = ({ heading }) => {
  return (
    <Row
      style={{
        borderBottom: `2px solid rgb(210, 222, 221)`,
        backgroundColor: 'rgb(235, 243, 239)',
        borderTop: `25px solid #fff`,
      }}
    >
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
  return (
    <Table>
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
