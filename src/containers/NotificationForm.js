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
import DatePicker from 'react-datepicker';
import mutateUpdateEvent from '../graph/mutateUpdateEvent';
import mutateAddNotification from '../graph/mutateAddNotification';
import api from '../util/api';
import 'react-datepicker/dist/react-datepicker.css';
import mutateUpdateNotification from '../graph/mutateUpdateNotification';
import EventSearch from './EventSearch';
import EventSelect from '../components/EventSelect';

const Page = styled.div``;
const SendCount = styled.div`
  width: 180px;
  margin-top: 24px;
  line-height: 115%;
  margin-bottom: -30px;
`;
const B = styled.span`
  padding: 0 6px;
  color: ${Colors.blue};
`;
const ConfirmationBox = styled.div`
  padding: 60px;
  background: ${Colors.blueLightest};
  margin-top: 60px;
  margin-bottom: 40px;
`;

class AddEventScreen extends React.Component {
  constructor() {
    super();
    this.lastNotn = '';
    this.state = {
      admin_notification_id: null,
      confirmMode: false,
      status: 'ready',
      userCount: false,
      deviceCount: false,
      notnReady: false,
      sendNow: true,
      sent: false,
      lastEvent: false,
      notification: {
        test: 'yes',
        device: 'all',
        registered: 'all',
        attendee_type: 'all',
        msg: '',
        title: '',
        event_id: 'all',
        content: '',
        send_on: moment().utc(),
        channel_type: 'global',
        event_id: 0,
      },
    };
  }
  componentDidMount() {
    const { mode, addType } = this.props;
    if (mode === 'add' && addType) {
      this.upd('type', addType);
    }
    this.componentWillReceiveProps(this.props);
  }
  componentDidUpdate() {
    this.getCount();
  }
  componentWillReceiveProps(props) {
    if (!this.state.eventReady) {
      if (props.mode === 'add') {
        this.setState({
          notnReady: true,
          notification: Object.assign(
            this.state.notification,
            props.notification,
          ),
        });
      } else if (
        props.notification &&
        props.notification.admin_notification_id
      ) {
        let e = Object.assign({}, props.notification);
        let sendNow = true;
        let sent = false;
        let confirmMode = false;
        if (moment(e.send_on).isAfter(moment())) {
          sendNow = false;
          e.send_on = moment(e.send_on).utc();
        } else {
          sent = true;
          confirmMode = true;
        }
        this.orig = e;
        this.setState({
          notnReady: true,
          sent,
          confirmMode,
          sendNow,
          notification: Object.assign({}, e),
        });
      }
    }
  }
  sendOnChange = async e => {
    this.upd('send_on', e.add(7, 'h'));
  };
  async getCount() {
    const notn = this.state.notification;
    notn.type = notn.attendee_type;
    if (!notn.event_id) notn.event_id = 'all';
    if (JSON.stringify(notn) !== this.lastNotn) {
      this.lastNotn = JSON.stringify(notn);
      const count = await api('get admin/notification', notn);
      this.setState({
        userCount: count.data.user_count,
        deviceCount: count.data.device_count,
      });
    }
  }
  change = e => {
    if (e.currentTarget.name !== undefined) {
      const { name, value } = e.currentTarget;
      this.upd(name, value);
    }
  };
  upd = (name, value, cb) => {
    this.setState(
      {
        notification: Object.assign({}, this.state.notification, {
          [name]: value,
        }),
      },
      cb,
    );
  };
  save = async (e, statusType = 'status', cb = false) => {
    e.preventDefault();
    const { mode } = this.props;
    const notification = Object.assign({}, this.state.notification);
    notification.send_on = moment(notification.send_on).format(
      'YYYY-MM-DD HH:mm:ss',
    );

    this.setState({ [statusType]: 'saving' });
    const omits = [];
    const res = await apollo.mutate({
      mutation:
        mode === 'add' ? mutateAddNotification : mutateUpdateNotification,
      variables: notification,
    });
    this.setState({ [statusType]: 'success' });
    setTimeout(() => this.props.history.push(`/notifications`), 1000);
    setTimeout(() => window.scrollTo(0, 0), 1100);
  };

  render() {
    const { mode, loading } = this.props;
    const { confirmMode, userCount, deviceCount, sent } = this.state;
    const notn = Object.assign({}, this.state.notification);
    const { type, event_id, event } = notn;
    const title = mode === 'add' ? `Add Notification` : `Edit Notification`;
    const ready = mode === 'add' || notn.admin_notification_id;
    const test = [
      { label: 'Test', value: 'yes' },
      { label: 'No, do it live!', value: 'no' },
    ];
    const device = [
      { label: 'All', value: 'all' },
      { label: 'iOS', value: 'ios' },
      { label: 'Android', value: 'android' },
    ];
    const registered = [
      { label: 'All', value: 'all' },
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ];
    const types = [
      { label: 'All', value: 'all' },
      { label: '360', value: '360' },
      { label: 'Connect', value: 'connect' },
      { label: 'Staff', value: 'staff' },
      { label: 'Ambassador', value: 'ambassador' },
      { label: 'Staff & Ambassador', value: 'staff,ambassador' },
    ];
    const sendNow = [
      { label: 'Send Now', value: true },
      { label: 'Schedule for Later', value: false },
    ];
    return (
      <div style={{ flex: '0.8', width: '100%' }}>
        {confirmMode && (
          <div>
            <h3
              style={{
                paddingTop: '40px',
                fontSize: '42px',
                lineHeight: '48px',
                width: '780px',
              }}
            >
              {sent ? (
                'This notification has been sent!'
              ) : (
                <div>
                  <div>Are you sure you want to send this</div>
                  <span>to </span>
                  <B>{`${userCount} people`}</B>
                  <span> across </span>
                  <B>{`${deviceCount} devices?`}</B>
                </div>
              )}
            </h3>
            <Form>
              <ConfirmationBox style={{}}>
                {event_id &&
                  event_id > 0 && (
                    <FormRow>
                      <div>
                        <label>Event</label>
                        <div>
                          {this.state.lastEvent
                            ? this.state.lastEvent
                            : event.what}
                        </div>
                      </div>
                    </FormRow>
                  )}
                <FormRow>
                  <div>
                    <label>Title</label>
                    <div>{this.state.notification.title}</div>
                  </div>
                </FormRow>
                <FormRow>
                  <div>
                    <label>Message</label>
                    <div>{this.state.notification.msg}</div>
                  </div>
                </FormRow>
                <FormRow>
                  <div>
                    <label>Dispatch Content</label>
                    <div>{this.state.notification.content}</div>
                  </div>
                </FormRow>
                <FormRow>
                  <div>
                    <label>Will Send</label>
                    <div>
                      {sent
                        ? 'Sent'
                        : this.state.sendNow
                          ? 'Now'
                          : `On ${moment(this.state.notification.send_on)
                              .subtract(7, 'h')
                              .format('MMMM Do YYYY, h:mm:ss a')}`}
                    </div>
                  </div>
                </FormRow>
              </ConfirmationBox>
              <FormRow>
                <SubmitButton
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    sent
                      ? this.props.history.push(`/notifications`)
                      : this.setState({ confirmMode: false });
                  }}
                  tier="2"
                  msgs={{
                    ready: 'Back',
                    saving: 'Sending...',
                    success: 'Sent!',
                  }}
                />
                {!sent && (
                  <React.Fragment>
                    <SubmitButton
                      onClick={this.save}
                      status={this.state.status}
                      msgs={{
                        ready:
                          mode == 'add'
                            ? this.state.sendNow
                              ? 'Send Notification'
                              : 'Schedule Notification'
                            : 'Update Notification',
                        saving: this.state.sendNow
                          ? 'Sending...'
                          : 'Scheduling...',
                        success: this.state.sendNow ? 'Sent!' : 'Scheduled!',
                      }}
                    />
                    {this.state.userCount !== false && (
                      <SendCount>{`Will be sent to ${
                        this.state.userCount
                      } users across ${
                        this.state.deviceCount
                      } devices`}</SendCount>
                    )}
                  </React.Fragment>
                )}
              </FormRow>
            </Form>
          </div>
        )}
        {!confirmMode &&
          (!ready ? (
            'Loading...'
          ) : (
            <div>
              <Form onSubmit={this.startAdd}>
                <h3>Who should receive this?</h3>
                <FormRow>
                  <div>
                    <label>Test</label>
                    <Select
                      value={this.state.notification.test}
                      name="test"
                      options={test}
                      clearable={false}
                      onChange={({ value }) => this.upd('test', value)}
                    />
                  </div>
                  <div />
                </FormRow>
                <FormRow>
                  <div>
                    <label>Device Type</label>
                    <Select
                      value={this.state.notification.device}
                      name="device"
                      options={device}
                      clearable={false}
                      onChange={({ value }) => this.upd('device', value)}
                    />
                  </div>
                  <div>
                    <label>Registered</label>
                    <Select
                      value={this.state.notification.registered}
                      name="registered"
                      options={registered}
                      clearable={false}
                      onChange={({ value }) => this.upd('registered', value)}
                    />
                  </div>
                  <div>
                    <label>Attendee Type</label>
                    <Select
                      value={this.state.notification.attendee_type}
                      name="attendee_type"
                      options={types}
                      clearable={false}
                      onChange={({ value }) => this.upd('attendee_type', value)}
                    />
                  </div>
                </FormRow>
                <FormRow>
                  <div>
                    <label>
                      Send to Event (Leave blank to send to all attendees)
                    </label>
                    <EventSelect
                      value={this.state.notification.event_id}
                      name="event_id"
                      clearable={true}
                      onChange={props => {
                        this.setState({ lastEvent: props.label });
                        this.upd(
                          'event_id',
                          props && props.value ? props.value : null,
                        );
                      }}
                    />
                  </div>
                  <div />
                </FormRow>
                <h3>Message</h3>
                <FormRow>
                  <div>
                    <label>Title (Optional, Keep it short)</label>
                    <Input
                      type="text"
                      value={this.state.notification.title}
                      name="title"
                      onChange={this.change}
                    />
                  </div>
                  <div>
                    <label>
                      Notification Message (Required, Keep it short)
                    </label>
                    <Input
                      type="text"
                      value={this.state.notification.msg}
                      name="msg"
                      onChange={this.change}
                    />
                  </div>
                </FormRow>
                <FormRow>
                  <div>
                    <label>
                      Linked Dispatch Content (Appears on Notification Tap)
                    </label>
                    <Textarea
                      type="text"
                      value={this.state.notification.content}
                      name="content"
                      onChange={this.change}
                    />
                  </div>
                  <div />
                </FormRow>
                <h3>Schedule</h3>
                <FormRow>
                  <div>
                    <label>When should this go out?</label>
                    <Select
                      value={this.state.sendNow}
                      name="sendNow"
                      options={sendNow}
                      clearable={false}
                      onChange={({ value }) => {
                        this.setState({ sendNow: value });
                      }}
                    />
                  </div>
                  <div />
                </FormRow>
                {!this.state.sendNow && (
                  <FormRow>
                    <div>
                      <label>Send time:</label>
                      <DatePicker
                        selected={moment(
                          this.state.notification.send_on,
                        ).subtract(7, 'h')}
                        onChange={this.sendOnChange}
                        onChangeRaw={e =>
                          this.sendOnChange(moment(e.target.value))
                        }
                        showTimeSelect
                        timeIntervaln={15}
                        dateFormat="LLL"
                        timeCaption="time"
                      />
                    </div>
                  </FormRow>
                )}
                <FormRow>
                  <div style={{ display: 'flex ' }}>
                    <SubmitButton
                      onClick={() => this.setState({ confirmMode: true })}
                      msgs={{
                        ready:
                          mode === 'add'
                            ? 'Review Notification'
                            : 'Review Updates',
                        saving: 'Sending...',
                        success: 'Sent!',
                      }}
                    />
                    {this.state.userCount !== false && (
                      <SendCount>{`Will be sent to ${
                        this.state.userCount
                      } users across ${
                        this.state.deviceCount
                      } devices`}</SendCount>
                    )}
                  </div>
                </FormRow>
              </Form>
            </div>
          ))}
      </div>
    );
  }
}
export default withRouter(AddEventScreen);
