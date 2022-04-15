import React from 'react'
import styled from 'styled-components'
import {withRouter} from 'react-router-dom'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import {Base64} from 'js-base64'
import Select from 'react-select'
import moment from 'moment'
import query from '../util/query'
import Container from '../components/Container'
import Form from '../components/Form'
import FormRow from '../components/FormRow'
import Input from '../components/Input'
import AddressForm from '../components/AddressForm'
import Colors from '../constants/Colors'
import Table from '../components/Table'
import TicketsTable from '../components/TicketsTable'
import TransactionsTable from '../components/TransactionsTable'
import Label from '../components/Label'
import apollo from '../util/apollo'
import mutateAddTicket from '../graph/mutateAddTicket'
import SubmitButton from '../components/SubmitButton'
import queryUser from '../graph/queryUser'
import UserAdminNoteContainer from '../containers/UserAdminNoteContainer'
import Textarea from '../components/Textarea'
import TimeSelect from '../components/TimeSelect'
import DateSelect from '../components/DateSelect'
import Search from '../containers/Search'
import AttendeeSearch from '../containers/AttendeeSearch'
import mutateUpdateEvent from '../graph/mutateUpdateEvent'

const Page = styled.div``

const ColContent = styled.div`
  display: flex;
  align-items: flex-start;
`
const ContentSide = styled.div`
  background: ${Colors.white};
  padding: 32px;
  margin-left: 24px;
  border-radius: 4px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.08);
  flex: 1;
  margin-top: 110px;
`

const RemoveButton = styled.button`
  margin-left: 7px;
  left: 2px;
  position: relative;
  top: -2px;
  border: 1px solid #ccc;
  cursor: pointer;
  padding: 2px 15px;
  color: #444;
  border-radius: 3px;
`

class AcademyScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      giveTicket: 'y',
      status: 'ready',
      bios: {},
      event: {
        active: false,
        ignored: false,
        year: '2019',
        type: 'academy',
        format: '',
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
        free_max: '',
        max: '',
        price: null,
        hosts: [],
      },
    }
  }
  changeType = (e) => {
    this.setState({
      user: Object.assign({}, this.state.user, {type: e.value}),
    })
  }
  change = (e) => {
    if (e.currentTarget.name !== undefined) {
      const {name, value} = e.currentTarget
      this.upd(name, value)
    }
  }
  upd = (name, value) => {
    this.setState({
      event: Object.assign({}, this.state.event, {[name]: value}),
    })
  }
  componentWillReceiveProps(props) {
    let e = Object.assign({}, props.data.event)
    const start = moment(e.start)
    const end = moment(e.end)
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
      bios,
      event: Object.assign({}, e),
    })
  }
  save = async (e) => {
    e.preventDefault()
    const event = Object.assign({}, this.state.event)
    event.bios = Base64.encode(JSON.stringify(this.state.bios))
    event.hosts = event.hosts.map((v) => v.user_id).join(',')
    this.setState({status: 'saving'})
    const res = await apollo.mutate({
      mutation: mutateUpdateEvent,
      variables: event,
    })
    this.setState({status: 'success'})
    setTimeout(() => {
      this.setState({status: 'ready'})
    }, 2000)
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
    const hosts = [...this.state.event.hosts]
    if (hosts.findIndex(({user_id}) => user_id === host.user_id) === -1) {
      hosts.push(host)
    }
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
    const hosts = [...this.state.event.hosts]
    this.upd(
      'hosts',
      hosts.filter(({user_id}) => user_id !== filter_id)
    )
  }
  render() {
    const dates = [
      {label: 'June 22nd', value: '22'},
      {label: 'June 23rd', value: '23'},
      {label: 'June 24th', value: '24'},
      {label: 'June 25th', value: '25'},
      {label: 'June 26th', value: '26'},
      {label: 'June 27th', value: '27'},
    ]
    return (
      <div>
        {this.props.data.loading ? (
          <div>Loading</div>
        ) : (
          <ColContent style={{marginBottom: '200px'}}>
            <div>
              <h2>{this.state.event.what}</h2>
              <div className="react-tabs__tab-panel react-tabs__tab-panel--selected">
                <Form onSubmit={this.save}>
                  <h3>Academy Info</h3>
                  <FormRow>
                    <div>
                      <label>Academy Name</label>
                      <Input
                        type="text"
                        value={this.state.event.what}
                        name="what"
                        onChange={this.change}
                      />
                    </div>
                    <div />
                  </FormRow>
                  <FormRow>
                    <div>
                      <label>Attendees will learn...</label>
                      <Textarea
                        type="text"
                        value={this.state.event.who}
                        name="who"
                        onChange={this.change}
                      />
                    </div>
                    <div>
                      <label>Description</label>
                      <Textarea
                        type="text"
                        value={this.state.event.descr}
                        name="descr"
                        onChange={this.change}
                      />
                    </div>
                  </FormRow>
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
                    <div>
                      <label>Max Free Attendees</label>
                      <Input
                        type="number"
                        value={this.state.event.free_max}
                        name="free_max"
                        onChange={this.change}
                      />
                    </div>
                  </FormRow>
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
                  <h3>Academy Timing</h3>
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
                  <h3>Hosts</h3>
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
                        {this.state.event.hosts.map(
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
                                <div style={{display: 'flex'}}>
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
                                    onChange={(e) => this.updateBio(user_id, e)}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </FormRow>
                  <FormRow>
                    <SubmitButton
                      status={this.state.status}
                      msgs={{
                        ready: 'Save Academy',
                        saving: 'Saving Academy...',
                        success: 'Saved!',
                      }}
                    />
                  </FormRow>
                </Form>
              </div>
            </div>
          </ColContent>
        )}
      </div>
    )
  }
}

export default withRouter(
  query('event', AcademyScreen, ({match}) => ({
    variables: {event_id: match.params.id},
  }))
)
