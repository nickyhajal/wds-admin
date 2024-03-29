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
import mutateAddUser from '../graph/mutateAddUser'
import UserAdminNoteContainer from '../containers/UserAdminNoteContainer'
import Textarea from '../components/Textarea'
import TimeSelect from '../components/TimeSelect'
import DateSelect from '../components/DateSelect'
import Search from '../containers/Search'
import AttendeeSearch from '../containers/AttendeeSearch'
import mutateAddEvent from '../graph/mutateAddEvent'
import RemoveButton from '../components/RemoveButton'

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

class AddEventScreen extends React.Component {
  constructor() {
    super()
    this.state = {
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
    this.setState({event: Object.assign({}, props.data.event)})
  }
  startAdd = async (e) => {
    e.preventDefault()
    const event = Object.assign({}, this.state.event)
    event.bios = Base64.encode(JSON.stringify(this.state.bios))
    event.hosts = event.hosts.map((v) => v.user_id).join(',')
    this.setState({status: 'saving'})
    const res = await apollo.mutate({
      mutation: mutateAddEvent,
      variables: event,
    })
    const {event_id} = res.data.eventAdd
    this.setState({status: 'success'})
    setTimeout(() => this.props.history.push(`/academy/${event_id}`), 1000)
    setTimeout(() => window.scrollTo(0, 0), 1100)
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
      <ColContent style={{marginBottom: '200px'}}>
        <div>
          <h2>Add an Academy</h2>
          <div className="react-tabs__tab-panel react-tabs__tab-panel--selected">
            <Form onSubmit={this.startAdd}>
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
                                style={{marginLeft: '4px', marginTop: '-3px'}}
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
                                style={{flex: 1, borderTopLeftRadius: '0'}}
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
    )
  }
}

export default withRouter(AddEventScreen)
