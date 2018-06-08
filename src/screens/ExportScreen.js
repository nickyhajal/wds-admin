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
  transfers: { filters: [] },
  hotel: { filters: [] },
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
    console.log(params);
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
                <label>Choose an Export Type</label>
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
