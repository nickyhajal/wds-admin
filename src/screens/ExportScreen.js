import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment';
import Select from 'react-select';
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
import WideCol from '../components/WideCol';
import Filter from '../components/Filter';
import SubmitButton from '../components/SubmitButton';
import EventSelect from '../components/EventSelect';
import toQueryString from '../util/toQueryString';

const Page = styled.div``;

const ContentSide = styled.div`
  background: ${Colors.white};
  padding: 32px;
  margin-left: 24px;
  border-radius: 4px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.08);
  flex: 1;
  margin-top: 110px;
`;

const exps = {
  transfers: { filters: [], defaultParams: {} },
  hotel: { filters: [], defaultParams: {} },
  tickets: {
    defaultParams: {
      year: ['2018'],
      type: ['360', 'connect'],
      status: ['active'],
    },
    filters: [
      [
        {
          id: 'year',
          name: 'Year',
          multi: true,
          options: [
            '2018',
            '2017',
            '2016',
            '2015',
            '2014',
            '2013',
            '2012',
            '2011',
          ],
        },
        {
          id: 'status',
          multi: true,
          name: 'Status',
          options: [
            'Active',
            'Unclaimed',
            'Purchased',
            'Canceled',
            'Refunded',
            'Pending',
          ],
        },
      ],
      [
        {
          id: 'type',
          name: 'Type',
          options: ['360', 'Connect'],
          multi: true,
        },
      ],
    ],
  },
  events: {
    defaultParams: {
      year: ['2018'],
      type: ['program', 'meetup', 'activity', 'academy'],
      rejected: 'no',
      for_type: ['360', 'Connect'],
      rsvp: 'all',
      active: 'yes',
      available: 'all',
    },
    filters: [
      [
        {
          id: 'year',
          name: 'Year',
          multi: true,
          options: [
            '2018',
            '2017',
            '2016',
            '2015',
            '2014',
            '2013',
            '2012',
            '2011',
          ],
        },
      ],
      [
        {
          id: 'type',
          multi: true,
          name: 'Event Type',
          options: ['Program', 'Meetup', 'Activity', 'Academy'],
        },
        {
          id: 'for_type',
          name: 'For Attendee Type',
          options: ['360', 'Connect'],
          multi: true,
        },
      ],
      [
        {
          id: 'active',
          name: 'Active',
          options: ['All', 'Yes', 'No'],
        },
        {
          id: 'rejected',
          name: 'Rejected',
          options: ['All', 'Yes', 'No'],
        },
      ],
      [
        {
          id: 'rsvp',
          name: 'RSVP Required',
          options: ['All', 'Yes', 'No'],
        },
        {
          id: 'available',
          name: 'Space Remains',
          options: ['All', 'Yes', 'No'],
        },
      ],
    ],
  },
  people: {
    defaultParams: {
      year: ['2018'],
      type: ['attendee'],
      first_time: 'all',
    },
    filters: [
      [
        {
          id: 'year',
          name: 'Year',
          multi: true,
          options: ['2018', '2017', '2016', '2015', '2014'],
        },
        {
          id: 'type',
          multi: true,
          name: 'Attendee Type',
          options: [
            'Attendee',
            'Staff',
            'Ambassador',
            'Speaker',
            { label: 'Friends & Fam', value: 'friend' },
          ],
        },
      ],
      [
        {
          id: 'first_time',
          name: 'First Time Attendee',
          options: ['All', 'Yes', 'No'],
          defaultValue: 'all',
        },
        {
          id: 'intro',
          name: 'Intro Status',
          options: ['Any', 'Complete', 'Incomplete'],
          defaultValue: 'any',
        },
      ],
    ],
  },
  rsvps: {
    defaultParams: {
      event_id: null,
    },
    filters: [
      [
        {
          component: EventSelect,
          id: 'event_id',
          name: 'Events',
        },
      ],
    ],
  },
};

class ExportScreen extends React.Component {
  tabs = ['schedule', 'academies', 'activities', 'meetups', 'registration'];
  constructor() {
    super();
    this.state = {
      tab: 0,
      type: 'people',
      params: {},
    };
  }
  componentDidMount() {
    this.changeExport({ value: 'people' });
  }
  changeExport = ({ value }) => {
    const params = exps[value].defaultParams;
    this.setState({ type: value, params });
  };
  upd = (name, val) => {
    const { params } = this.state;
    params[name] = val;
    this.setState({ params });
  };
  export = e => {
    e.stopPropagation();
    e.preventDefault();
    const { params, type } = this.state;
    params.export = type;
    const url = `https://api.worlddominationsummit.com/api/admin/export${toQueryString(
      params,
    )}`;
    window.location.assign(url);
  };
  render() {
    const types = [
      { label: 'People', value: 'people' },
      { label: 'Tickets', value: 'tickets' },
      { label: 'Events', value: 'events' },
      { label: 'Event RSVPs', value: 'rsvps' },
      { label: 'Bookings', value: 'hotel' },
      { label: 'Transfers', value: 'transfers' },
    ];
    const exp = exps[this.state.type];
    return (
      <div>
        <h2>Exports</h2>
        <WideCol>
          <Form onSubmit={this.export}>
            <FormRow>
              <div>
                <h4 style={{ marginTop: '30px' }}>Choose an Export Type</h4>
                <Select
                  value={this.state.type}
                  name="type"
                  options={types}
                  clearable={false}
                  onChange={this.changeExport}
                />
              </div>
              <div />
            </FormRow>
            {exp.filters.length > 0 && (
              <h4 style={{ marginTop: '10px' }}>Filters</h4>
            )}
            {exp.filters.map(row => (
              <FormRow>
                {row.map(filter => (
                  <div>
                    <Filter
                      {...filter}
                      value={this.state.params[filter.id]}
                      onChange={k => (
                        console.log(k), this.upd(filter.id, k.value)
                      )}
                    />
                  </div>
                ))}
                {row.length === 1 && <div />}
              </FormRow>
            ))}
            <FormRow>
              <div>
                <SubmitButton msgs={{ ready: 'Run Export' }} />
              </div>
            </FormRow>
          </Form>
        </WideCol>
      </div>
    );
  }
}
export default ExportScreen;
