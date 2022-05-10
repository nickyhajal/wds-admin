import React from 'react'
import styled from 'styled-components'
import {withRouter} from 'react-router-dom'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import Select from 'react-select'
import moment from 'moment'
import {Base64} from 'js-base64'
import {omit} from 'lodash'
import mutateAddEvent from '../graph/mutateAddEvent'
import query from '../util/query'
import Container from '../components/Container'
import Form from '../components/Form'
import FormRow from '../components/FormRow'
import Input from '../components/Input'
import AddressForm from '../components/AddressForm'
import Colors from '../constants/Colors'
import Table from '../components/Table'
import TransactionsTable from '../components/TransactionsTable'
import Label from '../components/Label'
import apollo from '../util/apollo'
import mutateAddTicket from '../graph/mutateAddTicket'
import SubmitButton from '../components/SubmitButton'
import queryUser from '../graph/queryUser'
import mutateAddUser from '../graph/mutateAddUser'
import UserAdminNoteContainer from '../containers/UserAdminNoteContainer'
import Textarea from '../components/Textarea'
import TimeSelect from '../components/TimeSelect'
import AttendeeSearch from '../containers/AttendeeSearch'
import RemoveButton from '../components/RemoveButton'
import eventMetaFromType from '../util/eventMetaFromType'
import mutateUpdateEvent from '../graph/mutateUpdateEvent'

const Page = styled.div``

class AddEventScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      status: 'ready',
      bios: {},
      eventReady: false,
      event: {
        active: false,
        ignored: false,
        year: '2022',
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
    }
  }
  componentDidMount() {
    const {mode, addType} = this.props
    if (mode === 'add' && addType) {
      this.upd('type', addType)
    }
    this.componentWillReceiveProps(this.props)
  }
  componentWillReceiveProps(props) {
    if (!this.state.eventReady) {
      if (props.mode === 'add') {
        this.setState({
          eventReady: true,
          // event: Object.assign({}, props.event),
        })
      } else if (props.event && props.event.event_id) {
        let e = Object.assign({}, props.event)
        this.orig = e
        const start = moment.utc(e.start)
        const end = moment.utc(e.end)
        const date = start.format('DD')
        let hour = +start.format('HH')
        let end_hour = +end.format('HH')
        let pm = '0'
        let end_pm = '0'
        if (+hour >= 12) {
          if (+hour > 12) hour -= 12
          pm = '12'
        }
        if (+hour < 10) hour = '0' + hour
        if (hour === '00') hour = '12'
        if (+end_hour >= 12) {
          if (+end_hour > 12) {
            end_hour -= 12
          }
          end_pm = '12'
        }
        if (+end_hour < 10) end_hour = '0' + end_hour
        if (end_hour === '00') end_hour = '12'
        e.date = date
        e.hour = hour.toString()
        e.end_hour = end_hour.toString()
        e.minute = start.format('mm')
        e.ampm = pm
        e.end_minute = end.format('mm')
        e.end_ampm = end_pm
        const bios = e.bios
          ? JSON.parse(e.bios.includes('{') ? e.bios : Base64.decode(e.bios))
          : {}
        this.setState({
          eventReady: true,
          bios,
          event: Object.assign({}, e),
        })
      }
    }
  }
  change = (e) => {
    if (e.currentTarget.name !== undefined) {
      const {name, value} = e.currentTarget
      this.upd(name, value)
    }
  }
  updateStatus(value) {
    if (value === 'rejected') {
      this.upd('ignored', '1')
    } else {
      this.upd('ignored', '0')
      setTimeout(() => {
        this.upd('active', value === 'active' ? '1' : '0')
      }, 4)
    }
  }
  upd = (name, value, cb) => {
    if (name === 'price' && +value > 0) {
      value *= 100
    }
    this.setState(
      {
        event: Object.assign({}, this.state.event, {[name]: value}),
      },
      cb
    )
  }
  startAdd = async (e, statusType = 'status', cb = false) => {
    e.preventDefault()
    const {mode} = this.props
    const event = Object.assign(
      {},
      this.state.event,
      eventMetaFromType(this.state.event.type)
    )
    event.bios = Base64.encode(JSON.stringify(this.state.bios))
    event.hosts = event.hosts.map((v) => v.user_id).join(',')
    this.setState({[statusType]: 'saving'})
    const omits = []
    if (!event.showMaxFree) omits.push('free_max')
    if (!event.showPrice) omits.push('price')
    if (!event.showHosts) {
      omits.push('hosts')
      omits.push('bios')
    }
    const res = await apollo.mutate({
      mutation: mode === 'add' ? mutateAddEvent : mutateUpdateEvent,
      variables: omit(event, omits),
    })
    this.setState({[statusType]: 'success'})
    if (mode === 'add') {
      const {event_id} = res.data.eventAdd
      setTimeout(() => this.props.history.push(`/event/${event_id}`), 1000)
      setTimeout(() => window.scrollTo(0, 0), 1100)
    } else {
      setTimeout(() => {
        this.setState({[statusType]: 'ready'})
        if (cb) {
          cb()
        }
      }, 2000)
    }
  }
  changeStart = (part, value) => {
    this.setState({
      event: Object.assign({}, this.state.event, {[part]: value}),
    })
  }
  changeEnd = (part, value) => {
    this.changeStart(`end_${part}`, value)
  }
  addHost = (host) => {
    const hosts = this.state.event.hosts
    hosts.push(host)
    this.upd('hosts', hosts)
  }
  updateBio = (user_id, e) => {
    if (e.currentTarget.name !== undefined) {
      const {name, value} = e.currentTarget
      const bios = this.state.bios
      bios[user_id] = value
      this.setState({bios})
    }
  }
  removeHost = (filter_id) => {
    const hosts = this.state.event.hosts
    this.upd(
      'hosts',
      hosts.filter(({user_id}) => user_id !== filter_id)
    )
  }
  reject = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.upd('ignored', '1', () => {
      this.startAdd(e, 'rejectStatus', () => {
        setTimeout(() => window.scrollTo(0, 0), 2)
        setTimeout(() => window.location.reload(), 2)
      })
    })
  }
  approve = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.upd('active', '1', () => {
      this.startAdd(e, 'approveStatus', () => {
        setTimeout(() => window.scrollTo(0, 0), 2)
        setTimeout(() => window.location.reload(), 2)
      })
    })
  }
  render() {
    const {mode, loading} = this.props
    const dates = [
      // { label: 'Monday, June 24th', value: '24' },
      // { label: 'Tuesday, June 25th', value: '25' },
      {label: 'Tuesday, June 21st', value: '21'},
      {label: 'Wednesday, June 22nd', value: '22'},
      {label: 'Thursday, June 23rd', value: '23'},
      {label: 'Friday, June 24th', value: '24'},
      {label: 'Saturday, June 25th', value: '25'},
      {label: 'Sunday, June 26th', value: '26'},
      {label: 'Monday, June 27th', value: '27'},
      // { label: 'Saturday, June 29th', value: '29' },
      // { label: 'Sunday, June 30th', value: '30' },
      // { label: 'Monday, July 1st', value: '1' },
      // { label: 'Tuesday, July 2nd', value: '2' },
    ]
    const types = [
      {label: 'Program Event', value: 'program'},
      {label: 'Academy', value: 'academy'},
      {label: 'Activity', value: 'activity'},
      {label: 'Registration Session', value: 'registration'},
      {label: 'Meetup', value: 'meetup'},
      {label: 'Ambassador Event', value: 'ambassador'},
    ]
    const statusTypes = [
      {label: 'Active', value: 'active'},
      {label: 'Not Active', value: 'not-active'},
    ]
    const forTypes = [
      {label: 'All', value: 'all'},
      {label: '360', value: '360'},
      {label: 'Connect', value: 'connect'},
    ]
    const event = Object.assign(
      {},
      this.state.event,
      eventMetaFromType(this.state.event.type)
    )
    const {type} = event
    const title =
      mode === 'add' ? `Add ${event.article} ${event.typeStr}` : `${event.what}`
    const ready = mode === 'add' || event.event_id
    const showRsvpCount = event.showMaxAttendees || event.num_rsvps > 0
    const showUrl = event.url
    const showSidebar = showRsvpCount || showUrl
    if (event.type === 'meetup') {
      statusTypes.push({label: 'Rejected', value: 'rejected'})
    }
    const status = +event.ignored
      ? 'rejected'
      : +event.active
      ? 'active'
      : 'not-active'
    return (
      <div style={{flex: '0.8', width: '100%'}}>
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
                        onChange={({value}) => this.upd('type', value)}
                      />
                    </div>
                    <div />
                  </FormRow>
                )}
                <FormRow>
                  <div>
                    <label>Status</label>
                    <Select
                      value={status}
                      name="status"
                      options={statusTypes}
                      clearable={false}
                      onChange={({value}) => this.updateStatus(value)}
                    />
                  </div>
                  <div />
                </FormRow>
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
                  {event.showForType ? (
                    <div>
                      <label>For Ticket Type</label>
                      <Select
                        value={this.state.event.for_type}
                        name="for_type"
                        options={forTypes}
                        clearable={false}
                        onChange={({value}) => this.upd('for_type', value)}
                      />
                    </div>
                  ) : (
                    <div />
                  )}
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
                {this.state.event.outline && (
                  <FormRow>
                    <div>
                      <label>Outline</label>
                      <Textarea
                        type="text"
                        value={this.state.event.outline}
                        name="outline"
                        onChange={this.change}
                      />
                    </div>
                  </FormRow>
                )}
                {event.showMaxAttendees && (
                  <FormRow>
                    <div>
                      <label>Max Attendees (0 is unlimited)</label>
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
                {event.showPrice && (
                  <FormRow>
                    <div>
                      <label>Price (Empty if Free)</label>
                      <Input
                        type="number"
                        value={
                          this.state.event.price
                            ? this.state.event.price / 100
                            : ''
                        }
                        name="price"
                        placeholder="Price in Dollars"
                        onChange={this.change}
                      />
                    </div>
                    <div />
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
                <FormRow>
                  <div>
                    <label>Venue Note</label>
                    <Textarea
                      type="text"
                      value={this.state.event.venue_note}
                      name="venue_note"
                      onChange={this.change}
                    />
                    <div />
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
                      onChange={(e) => this.changeStart('date', e.value)}
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
                    <div style={{flex: 1}}>
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
                        {this.state.event.hosts &&
                          this.state.event.hosts.map(
                            ({first_name, last_name, user_id}) => (
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
                                  <div
                                    style={{
                                      display: 'flex',
                                    }}
                                  >
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
                                      onChange={(e) =>
                                        this.updateBio(user_id, e)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )
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
                  {type === 'meetup' &&
                    mode !== 'add' &&
                    !+this.orig.active &&
                    !+this.orig.ignored && (
                      <React.Fragment>
                        <span
                          style={{
                            height: '30px',
                            display: 'block',
                            width: '3px',
                            borderRadius: '4px',
                            position: 'relative',
                            top: '28px',
                            background: 'rgb(184, 210, 213)',
                            margin: '0 40px 0 30px',
                            opacity: '0.8',
                          }}
                        />
                        <SubmitButton
                          tier="2"
                          status={this.state.approveStatus}
                          onClick={this.approve}
                          msgs={{
                            ready: `Approve Meetup`,
                            saving: `Approving...`,
                            success: 'Approved!',
                          }}
                        />
                        <SubmitButton
                          tier="3"
                          status={this.state.rejectStatus}
                          onClick={this.reject}
                          msgs={{
                            ready: `Reject Meetup`,
                            saving: `Rejecting...`,
                            success: 'Rejected!',
                          }}
                        />
                      </React.Fragment>
                    )}
                </FormRow>
              </Form>
            </div>
          </div>
        )}
      </div>
    )
  }
}
export default withRouter(AddEventScreen)
