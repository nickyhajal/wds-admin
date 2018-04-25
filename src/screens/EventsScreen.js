import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment';
import query from '../util/query';
import Container from '../components/Container';
import Form from '../components/Form';
import FormRow from '../components/FormRow';
import Input from '../components/Input';
import AddressForm from '../components/AddressForm';
import ShirtSize from '../components/ShirtSize';
import Colors from '../constants/Colors';
import Table from '../components/Table';
import Label from '../components/Label';
import apollo from '../util/apollo';
import EventListing from '../components/EventListing';

const Page = styled.div``;

const ColContent = styled.div`
  display: flex;
  align-items: flex-start;
`;
const ContentSide = styled.div`
  background: ${Colors.white};
  padding: 32px;
  margin-left: 24px;
  border-radius: 4px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.08);
  flex: 1;
  margin-top: 110px;
`;
const Badge = styled.div`
  background: ${({ type, attending18, pre18, ticket_type }) => {
    let color = Colors.grayDark;
    if (type === 'staff') {
      color = Colors.blueDarker;
    } else if (+attending18 === 1) {
      if (+ticket_type === 360) {
        color = Colors.orange;
      } else if (ticket_type === 'connect') {
        color = Colors.green;
      }
    }
    return color;
  }};
  border-radius: 3px;
  padding: 0px 12px;
  text-transform: uppercase;
  color: ${Colors.white};
  font-size: 15px;
  display: inline-block;
  margin-left: 16px;
  position: relative;
  top: -7px;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 24px;
`;

class EventScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      giveTicketText: 'Give Ticket',
      user: {
        first_name: '',
        last_name: '',
        user_name: '',
        hash: '',
        address: '',
        address2: '',
        region: '',
        city: '',
        country: '',
        site: '',
        instagram: '',
        twitter: '',
        facebook: '',
      },
    };
  }
  showEvent = e => {
    console.log(e);
    let { type } = e;
    if (['program', 'event', 'activity'].includes(type)) {
      type = 'event';
    }
    this.props.history.push(`/${type}/${e.event_id}`);
  };
  render() {
    const { loading, events } = this.props.data;
    console.log(events);
    return (
      <ColContent>
        <div>
          <h2>Events</h2>
          {loading && <div>Loading...</div>}
          {!loading &&
            events.length && (
              <Tabs>
                <TabList>
                  <Tab>Schedule</Tab>
                  <Tab>Meetups</Tab>
                  <Tab>Academies</Tab>
                  <Tab>Activities</Tab>
                </TabList>
                <TabPanel>
                  <Form>
                    <h3>
                      WDS Schedule <button>Add Schedule Event</button>
                    </h3>
                    <EventListing
                      events={events.filter(({ type }) => type === 'academy')}
                      onClick={this.showEvent}
                    />
                  </Form>
                </TabPanel>
                <TabPanel>
                  <h3>
                    Meetups<button>Add Meetup</button>
                  </h3>
                </TabPanel>
                <TabPanel>
                  <h3>
                    Academies <Link to="/add-academy">Add Academy</Link>
                  </h3>
                  <EventListing
                    events={events.filter(({ type }) => type === 'academy')}
                    onClick={this.showEvent}
                  />
                </TabPanel>
                <TabPanel>
                  <h3>
                    Activities <button>Add Activity</button>
                  </h3>
                </TabPanel>
              </Tabs>
            )}
        </div>
      </ColContent>
    );
  }
}
export default withRouter(
  query('events', EventScreen, {
    variables: { year: 18, showInactive: true },
  }),
);
