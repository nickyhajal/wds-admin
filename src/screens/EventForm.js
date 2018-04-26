import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import moment from 'moment';
import { Base64 } from 'js-base64';
import { omit } from 'lodash';
import mutateAddEvent from '../graph/mutateAddEvent';
import query from '../util/query';
import Container from '../components/Container';
import Form from '../components/Form';
import FormRow from '../components/FormRow';
import Input from '../components/Input';
import AddressForm from '../components/AddressForm';
import Colors from '../constants/Colors';
import Table from '../components/Table';
import TransactionsTable from '../components/TransactionsTable';
import Label from '../components/Label';
import apollo from '../util/apollo';
import mutateAddTicket from '../graph/mutateAddTicket';
import SubmitButton from '../components/SubmitButton';
import queryUser from '../graph/queryUser';
import mutateAddUser from '../graph/mutateAddUser';
import UserAdminNoteContainer from '../containers/UserAdminNoteContainer';
import Textarea from '../components/Textarea';
import TimeSelect from '../components/TimeSelect';
import AttendeeSearch from '../containers/AttendeeSearch';
import RemoveButton from '../components/RemoveButton';
import eventMetaFromType from '../util/eventMetaFromType';
import mutateUpdateEvent from '../graph/mutateUpdateEvent';

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

class AddEventScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      status: 'ready',
      bios: {},
      eventReady: false,
      event: {
        active: false,
        ignored: false,
        year: '2018',
        type: null,
        format: '',
        for_type: 'all',
        outline: '',
        what: '',
        slug: '',
        address: '',
        date: '27',
        minute: '00',
        hour: '12',
        ampm: '12',
        end_hour: '12',
        end_ampm: '12',
        end_minute: '00',
        descr: '',
        who: '',
        start: '',
        end: '',
        place: '',
        free_max: null,
        max: 0,
        price: null,
        hosts: [],
      },
    };
  }
  componentWillReceiveProps(props) {
    if (!this.state.eventReady) {
      if (props.mode === 'add') {
        this.setState({
          eventReady: true,
          event: Object.assign({}, props.event),
        });
      } else {
        let e = Object.assign({}, props.event);
        const start = moment(e.start);
        const end = moment(e.end);
        const date = start.format('DD');
        let hour = +start.format('HH');
        let end_hour = +end.format('HH');
        let pm = '0';
        let end_pm = '0';
        if (+hour >= 12) {
          if (+hour > 12) hour -= 12;
          pm = '12';
        }
        if (+hour < 10) hour = '0' + hour;
        if (hour === '00') hour = '12';
        if (+end_hour >= 12) {
          if (+end_hour > 12) {
            end_hour -= 12;
          }
          end_pm = '12';
        }
        if (+end_hour < 10) end_hour = '0' + end_hour;
        if (end_hour === '00') end_hour = '12';
        e.date = date;
        e.hour = hour.toString();
        e.end_hour = end_hour.toString();
        e.minute = start.format('mm');
        e.ampm = pm;
        e.end_minute = end.format('mm');
        e.end_ampm = end_pm;
        const bios = e.bios
          ? JSON.parse(e.bios.includes('{') ? e.bios : Base64.decode(e.bios))
          : {};
        this.setState({
          eventReady: true,
          bios,
          event: Object.assign({}, e),
        });
      }
    }
  }
  change = e => {
    if (e.currentTarget.name !== undefined) {
      const { name, value } = e.currentTarget;
      this.upd(name, value);
    }
  };
  upd = (name, value) => {
    this.setState({
      event: Object.assign({}, this.state.event, { [name]: value }),
    });
  };
  startAdd = async e => {
    e.preventDefault();
    const { mode } = this.props;
    const event = Object.assign(
      {},
      this.state.event,
      eventMetaFromType(this.state.event.type),
    );
    event.bios = Base64.encode(JSON.stringify(this.state.bios));
    event.hosts = event.hosts.map(v => v.user_id).join(',');
    this.setState({ status: 'saving' });
    const omits = [];
    if (!event.showMaxFree) omits.push('free_max');
    if (!event.showPrice) omits.push('price');
    if (!event.showHosts) {
      omits.push('hosts');
      omits.push('bios');
    }
    const res = await apollo.mutate({
      mutation: mode === 'add' ? mutateAddEvent : mutateUpdateEvent,
      variables: omit(event, omits),
    });
    this.setState({ status: 'success' });
    if (mode === 'add') {
      const { event_id } = res.data.eventAdd;
      const url = event.type === 'academy' ? 'academy' : 'event';
      setTimeout(() => this.props.history.push(`/${url}/${event_id}`), 1000);
      setTimeout(() => window.scrollTo(0, 0), 1100);
    } else {
      setTimeout(() => {
        this.setState({ status: 'ready' });
      }, 2000);
    }
  };
  changeStart = (part, value) => {
    this.setState({
      event: Object.assign({}, this.state.event, { [part]: value }),
    });
  };
  changeEnd = (part, value) => {
    this.changeStart(`end_${part}`, value);
  };
  addHost = host => {
    const hosts = this.state.event.hosts;
    hosts.push(host);
    this.upd('hosts', hosts);
  };
  updateBio = (user_id, e) => {
    if (e.currentTarget.name !== undefined) {
      const { name, value } = e.currentTarget;
      const bios = this.state.bios;
      bios[user_id] = value;
      this.setState({ bios });
    }
  };
  removeHost = filter_id => {
    const hosts = this.state.event.hosts;
    this.upd('hosts', hosts.filter(({ user_id }) => user_id !== filter_id));
  };
  render() {
    const { mode, loading } = this.props;
    const dates = [
      { label: 'Monday, June 25th', value: '25' },
      { label: 'Tuesday, June 26th', value: '26' },
      { label: 'Wedsneday, June 27th', value: '27' },
      { label: 'Thursday, June 28th', value: '28' },
      { label: 'Friday, June 29th', value: '29' },
      { label: 'Saturday, June 30th', value: '30' },
      { label: 'Sunday, July 1st', value: '1' },
      { label: 'Monday, July 2nd', value: '2' },
      { label: 'Tuesday, July 3rd', value: '3' },
    ];
    const types = [
      { label: 'Program Event', value: 'program' },
      { label: 'Activity', value: 'activity' },
      { label: 'Registration Session', value: 'registration' },
      { label: 'Meetup', value: 'meetup' },
    ];
    const forTypes = [
      { label: 'All', value: 'all' },
      { label: '360', value: '360' },
      { label: 'Connect', value: 'connect' },
    ];
    const event = Object.assign(
      {},
      this.state.event,
      eventMetaFromType(this.state.event.type),
    );
    const title =
      mode === 'add'
        ? `Add ${event.article} ${event.typeStr}`
        : `${event.what}`;
    const ready = mode === 'add' || event.event_id;
    return (
      <ColContent>
        {ready && (
          <div>
            <h2>{title}</h2>
            <div className="react-tabs__tab-panel react-tabs__tab-panel--selected">
              <Form onSubmit={this.startAdd}>
                <h3>{`${event.typeStr} Info`}</h3>
                {mode === 'add' && (
                  <FormRow>
                    <div>
                      <label>Type</label>
                      <Select
                        value={this.state.event.type}
                        name="type"
                        options={types}
                        clearable={false}
                        onChange={({ value }) => this.upd('type', value)}
                      />
                    </div>
                    <div />
                  </FormRow>
                )}
                <FormRow>
                  <div>
                    <label>{`${event.typeStr} Name`}</label>
                    <Input
                      type="text"
                      value={this.state.event.what}
                      name="what"
                      onChange={this.change}
                    />
                  </div>
                  <div>
                    <label>For Ticket Type</label>
                    <Select
                      value={this.state.event.for_type}
                      name="for_type"
                      options={forTypes}
                      clearable={false}
                      onChange={({ value }) => this.upd('for_type', value)}
                    />
                  </div>
                </FormRow>
                <FormRow>
                  <div>
                    <label>Description</label>
                    <Textarea
                      type="text"
                      value={this.state.event.descr}
                      name="descr"
                      onChange={this.change}
                    />
                  </div>
                  {event.showWho ? (
                    <div>
                      <label>{`This ${
                        event.article
                      } ${event.typeStr.toLowerCase()} for...`}</label>
                      <Textarea
                        type="text"
                        value={this.state.event.who}
                        name="who"
                        onChange={this.change}
                      />
                    </div>
                  ) : (
                    <div />
                  )}
                </FormRow>
                {event.showMaxAttendees && (
                  <FormRow>
                    <div>
                      <label>Max Attendees</label>
                      <Input
                        type="number"
                        value={this.state.event.max}
                        name="max"
                        onChange={this.change}
                      />
                    </div>
                    {event.showMaxFree ? (
                      <div>
                        <label>Max Free Attendees</label>
                        <Input
                          type="number"
                          value={this.state.event.free_max}
                          name="free_max"
                          onChange={this.change}
                        />
                      </div>
                    ) : (
                      <div />
                    )}
                  </FormRow>
                )}
                <h3>Venue Info</h3>
                <FormRow>
                  <div>
                    <label>Venue Name</label>
                    <Input
                      type="text"
                      value={this.state.event.place}
                      name="place"
                      onChange={this.change}
                    />
                  </div>
                  <div>
                    <label>Venue Address</label>
                    <Input
                      type="text"
                      value={this.state.event.address}
                      name="address"
                      onChange={this.change}
                    />
                  </div>
                </FormRow>
                <h3>{`${event.typeStr} Timing`}</h3>
                <FormRow>
                  <div>
                    <label>Start Date</label>
                    <Select
                      value={this.state.event.date}
                      options={dates}
                      clearable={false}
                      onChange={e => this.changeStart('date', e.value)}
                    />
                  </div>
                  <div>
                    <label>Start Time</label>
                    <TimeSelect
                      hour={this.state.event.hour}
                      minute={this.state.event.minute}
                      ampm={this.state.event.ampm}
                      onChange={this.changeStart}
                    />
                  </div>
                </FormRow>
                <FormRow>
                  <div>
                    <label>End Time</label>
                    <TimeSelect
                      hour={this.state.event.end_hour}
                      minute={this.state.event.end_minute}
                      ampm={this.state.event.end_ampm}
                      onChange={this.changeEnd}
                    />
                  </div>
                </FormRow>
                {event.showHosts && <h3>Hosts</h3>}
                {event.showHosts && (
                  <FormRow col={1}>
                    <div style={{ flex: 1 }}>
                      <div>
                        <AttendeeSearch onSelect={this.addHost} />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          marginTop: '20px',
                          width: '100%',
                          flexDirection: 'column',
                        }}
                      >
                        {this.state.event.hosts.map(
                          ({ first_name, last_name, user_id }) => (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                padding: '20px',
                                width: '100%',
                                backgroundColor: 'rgb(249, 249, 249)',
                                marginBottom: '4px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: 'bold',
                                    marginBottom: '4px',
                                  }}
                                >
                                  {`${first_name} ${last_name}`}
                                  <RemoveButton
                                    onClick={() => this.removeHost(user_id)}
                                    style={{
                                      marginLeft: '4px',
                                      marginTop: '-3px',
                                    }}
                                  >
                                    Remove
                                  </RemoveButton>
                                </div>
                                <div style={{ display: 'flex' }}>
                                  <div
                                    style={{
                                      width: '48px',
                                      height: '48px',
                                      marginRight: '4px',
                                      marginTop: '1px',
                                      backgroundImage: `url(http://avatar.wds.fm/${user_id}?width=96)`,
                                      backgroundSize: 'contain',
                                    }}
                                  />
                                  <Textarea
                                    placeholder={`${first_name}'s Bio...`}
                                    style={{
                                      flex: 1,
                                      borderTopLeftRadius: '0',
                                    }}
                                    value={this.state.bios[user_id]}
                                    onChange={e => this.updateBio(user_id, e)}
                                  />
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </FormRow>
                )}
                <FormRow>
                  <SubmitButton
                    status={this.state.status}
                    msgs={{
                      ready: `Save ${event.typeStr}`,
                      saving: `Saving ${event.typeStr}...`,
                      success: 'Saved!',
                    }}
                  />
                </FormRow>
              </Form>
            </div>
          </div>
        )}
      </ColContent>
    );
  }
}
export default withRouter(AddEventScreen);
