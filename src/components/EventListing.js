import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import moment from 'moment';
import Colors from '../constants/Colors';
import ConfirmButton from '../containers/ConfirmButton';
import apollo from '../util/apollo';

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
  listtype,
  user_id,
  even,
  deleteRsvp,
  onClick,
}) => {
  const norm = listtype === 'normal';
  return (
    <Row
      onClick={onClick}
      style={{
        backgroundColor: lighten(even ? 0.04 : 0.014, Colors.whiteBlue),
      }}
    >
      <td style={{ width: '90px' }}>{moment.utc(start).format('h:mm a')}</td>
      <td>{what}</td>
      {type === 'academy' &&
        norm && <td className="data">{`${num_free}/${free_max}`}</td>}
      {['academy', 'activity', 'meetup'].includes(type) &&
        norm && <td className="data">{`${num_rsvps}/${max}`}</td>}
      {user_id && <td className="data">{`${type}`}</td>}
      {user_id && (
        <td className="data" style={{ width: '160px' }}>
          <ConfirmButton
            readyMsg="unRsvp"
            confirmMsg="Again to Confirm"
            confirmed="unRsvping..."
            action={() => {
              console.log('delete');
            }}
          />
        </td>
      )}
    </Row>
  );
};
const Heading = ({ heading }) => {
  return (
    <Row className="heading">
      <td colSpan="30" style={{ fontSize: '18px', fontWeight: '700' }}>
        {heading}
      </td>
    </Row>
  );
};
const EventListing = ({ events, listtype, deleteRsvp, onClick, user_id }) => {
  let lastDay = false;
  const eventsWithHeadings = events.reduce((out, curr) => {
    if (!lastDay || !moment(lastDay).isSame(curr.start, 'day')) {
      lastDay = curr.start;
      out.push({ heading: moment(curr.start).format('dddd, MMMM Do') });
    }
    out.push(curr);
    return out;
  }, []);
  const norm = listtype === 'normal';

  const type = events[0].type;
  return (
    <Table>
      {['meetup', 'activity'].includes(type) &&
        norm && (
          <Head>
            <tr>
              <th />
              <th />
              <th>RSVPs</th>
            </tr>
          </Head>
        )}
      {type === 'academy' &&
        norm && (
          <Head>
            <tr>
              <th />
              <th />
              <th>Free</th>
              <th>Paid</th>
            </tr>
          </Head>
        )}
      {user_id && (
        <Head>
          <tr>
            <th />
            <th />
            <th>Type</th>
            <th />
          </tr>
        </Head>
      )}
      <tbody>
        {eventsWithHeadings.map(
          (e, i) =>
            e.heading ? (
              <Heading heading={e.heading} key={e.heading} />
            ) : (
              <EventRow
                deleteRsvp={deleteRsvp}
                listtype={listtype}
                user_id={user_id}
                key={e.event_id}
                onClick={() => onClick(e)}
                event={e}
                even={i % 2}
              />
            ),
        )}
      </tbody>
    </Table>
  );
};

EventListing.defaultProps = {
  listtype: 'normal',
};

export default EventListing;
