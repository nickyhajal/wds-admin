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
import EventForm from './EventForm';

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

const AddEventScreen = ({ match }) => (
  <ColContent>
    <EventForm mode="add" addType={match.params.type} />
  </ColContent>
);
export default withRouter(AddEventScreen);
