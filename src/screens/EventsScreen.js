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
  background: ${({ type, attending19, pre19, ticket_type }) => {
    let color = Colors.grayDark;
    if (type === 'staff') {
      color = Colors.blueDarker;
    } else if (+attending19 === 1) {
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
  tabs = [
    'schedule',
    'academies',
    'activities',
    'meetups',
    'meetup-proposals',
    'ambassador',
    // 'registration',
  ];
  constructor() {
    super();
    this.state = {
      tab: 0,
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
  componentDidMount() {
    this.updateTab();
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.updateTab();
    }
  }
  updateTab() {
    const props = this.props;
    if (props.match && props.match.params && props.match.params.tab) {
      const tab = this.tabs.findIndex(x => x === props.match.params.tab);
      this.setState({ tab });
    }
  }
  showEvent = e => {
    let { type } = e;
    if (['program', 'event', 'activity'].includes(type)) {
      type = 'event';
    }
    this.props.history.push(`/event/${e.event_id}`);
  };
  changeTab = (index, last, event) => {
    const tabName = this.tabs[index];
    this.props.history.push(`/events/${tabName}`);
  };
  render() {
    const { loading, events } = this.props.data;
    return (
      <ColContent>
        <div>
          <h2>Events</h2>
          {loading && <div>Loading...</div>}
          {!loading && events.length && (
            <Tabs onSelect={this.changeTab} selectedIndex={this.state.tab}>
              <TabList>
                <Tab>Schedule</Tab>
                <Tab>Academies</Tab>
                <Tab>Activities</Tab>
                <Tab>Meetups</Tab>
                <Tab>Meetup Proposals</Tab>
                {/* <Tab>Registration</Tab> */}
                <Tab>Ambassador</Tab>
              </TabList>
              <TabPanel>
                <Form>
                  <h3>
                    WDS Schedule
                    <Link to="/add-event/program">Add Schedule Event</Link>
                  </h3>
                  <EventListing
                    events={events.filter(({ type }) => type === 'program')}
                    onClick={this.showEvent}
                  />
                </Form>
              </TabPanel>
              <TabPanel>
                <h3>
                  Academies <Link to="/add-event/academy">Add Academy</Link>
                </h3>
                <EventListing
                  events={events.filter(({ type }) => type === 'academy')}
                  onClick={this.showEvent}
                />
              </TabPanel>
              <TabPanel>
                <h3>
                  Activities
                  <Link to="/add-event/activity">Add Activity</Link>
                </h3>
                <EventListing
                  events={events.filter(({ type }) => type === 'activity')}
                  onClick={this.showEvent}
                />
              </TabPanel>
              <TabPanel>
                <h3>
                  Meetups <Link to="/add-event/meetup">Add Meetup</Link>
                </h3>
                <EventListing
                  events={events.filter(
                    ({ type, active }) => type === 'meetup' && +active,
                  )}
                  onClick={this.showEvent}
                />
              </TabPanel>
              <TabPanel>
                <h3>Meetup Proposals</h3>
                <EventListing
                  events={events.filter(
                    ({ type, ignored, active }) =>
                      type === 'meetup' && !+ignored && !+active,
                  )}
                  onClick={this.showEvent}
                />
              </TabPanel>
              {/* <TabPanel>
                  <h3>
                    Registration{' '}
                    <Link to="/add-event/registration">
                      Add Registration Session
                    </Link>
                  </h3>
                  <EventListing
                    events={events.filter(
                      ({ type }) => type === 'registration',
                    )}
                    onClick={this.showEvent}
                  />
                </TabPanel> */}
              <TabPanel>
                <h3>
                  Ambassador Events{' '}
                  <Link to="/add-event/ambassador">Add Ambassador Event</Link>
                </h3>
                <EventListing
                  events={events.filter(({ type }) => type === 'ambassador')}
                  onClick={this.showEvent}
                />
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
    variables: { year: '19', showInactive: true },
  }),
);
