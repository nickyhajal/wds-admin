import React from 'react'
import styled from 'styled-components'
import {withRouter} from 'react-router-dom'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import {Base64} from 'js-base64'
import Select from 'react-select'
import moment from 'moment'
import {lighten} from 'polished'
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
import mutateUpdateEvent from '../graph/mutateUpdateEvent'
import AttendeeSearch from '../containers/AttendeeSearch'
import EventForm from './EventForm'
import eventMetaFromType from '../util/eventMetaFromType'
import mutateAddRsvp from '../graph/mutateAddRsvp'
import ConfirmButton from '../containers/ConfirmButton'
import mutateDeleteRsvp from '../graph/mutateDeleteRsvp'

const Page = styled.div``

const ColContent = styled.div`
	display: flex;
	align-items: flex-start;
	.react-tabs__tab-panel {
		width: 100% !important;
	}
`
const ContentSide = styled.div`
	background: ${Colors.white};
	padding: 32px;
	margin-left: 24px;
	border-radius: 4px;
	box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.08);
	flex: 0.3;
	margin-top: 54px;
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
const Rsvps = styled.div`
	max-height: 400px;
	overflow-y: auto;
	margin-top: 12px;
`
const RsvpRow = styled.div`
	padding: 10px;
	display: flex;
	justify-content: space-between;
	background: ${lighten(0.05, Colors.blueBright)};
	&:nth-of-type(2n) {
		background: ${lighten(0.065, Colors.blueBright)};
	}
`

const EventScreen = (props) => {
	const {data} = props
	const {event} = data
	if (event) {
		const {
			event_id,
			showMaxAttendees,
			slug,
			num_rsvps,
			url,
			rsvps
		} = Object.assign({}, event, eventMetaFromType(event.type))
		const showRsvpCount = showMaxAttendees || num_rsvps > 0
		const showUrl = url

		const addRsvp = async ({user_id}) => {
			await apollo.mutate({
				mutation: mutateAddRsvp,
				variables: {
					event_id: event_id.toString(),
					user_id
				}
			})
			data.refetch()
		}
		const delRsvp = async ({user_id}) => {
			await apollo.mutate({
				mutation: mutateDeleteRsvp,
				variables: {
					event_id: event_id.toString(),
					user_id
				}
			})
			data.refetch()
		}

		return (
			<ColContent>
				<EventForm mode="update" event={event} />
				<ContentSide>
					{showUrl && (
						<FormRow cols={2}>
							<div>
								<Label>Event URL</Label>
								<Input
									type="text"
									value={`https://worlddominationsummit.com/${url}/${slug}`}
								/>
							</div>
						</FormRow>
					)}
					{showRsvpCount && (
						<FormRow cols={2}>
							<div>
								<h3
									style={{marginTop: '30px'}}
								>{`${rsvps.length} Attending`}</h3>
								<Rsvps>
									{rsvps.map(
										({
											first_name,
											email,
											last_name,
											user_id
										}) => (
											<RsvpRow>
												<span>{`${first_name} ${last_name}`}</span>
												<ConfirmButton
													readyMsg="unRSVP"
													confirmMsg="Confirm?"
													action={() =>
														delRsvp({user_id})
													}
													style={{width: '120px'}}
												/>
											</RsvpRow>
										)
									)}
								</Rsvps>
							</div>
						</FormRow>
					)}
					<h4>Add Attendee</h4>
					<AttendeeSearch onSelect={addRsvp} />
				</ContentSide>
			</ColContent>
		)
	}
	return <ColContent>Loading...</ColContent>
}
export default query('event', EventScreen, ({match}) => ({
	variables: {event_id: match.params.id}
}))
