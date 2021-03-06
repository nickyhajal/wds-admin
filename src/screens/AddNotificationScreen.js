import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { pick, kebabCase } from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import moment from 'moment';
import AceEditor from 'react-ace';
import axios from 'axios';
import query from '../util/query';
import Container from '../components/Container';
import Form from '../components/Form';
import FormRow from '../components/FormRow';
import Input from '../components/Input';
import Colors from '../constants/Colors';
import Label from '../components/Label';
import apollo from '../util/apollo';
import mutateAddTicket from '../graph/mutateAddTicket';
import SubmitButton from '../components/SubmitButton';
import queryUser from '../graph/queryUser';
import mutateAddUser from '../graph/mutateAddUser';
import UserAdminNoteContainer from '../containers/UserAdminNoteContainer';
import 'brace/mode/jsx';
import 'brace/mode/markdown';
import 'brace/snippets/markdown';
import 'brace/theme/tomorrow';
import mutateAddNotification from '../graph/mutateAddNotification';
import NotificationForm from '../containers/NotificationForm';
import api from '../util/api';

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

class AddNotificationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      submitStatus: 'ready',
      status: 'draft',
      title: '',
      content: '',
    };
  }
  changeStatus = e => {
    this.setState({
      status: e.value,
    });
  };
  changeContent = content => {
    this.setState({ content });
  };
  change = e => {
    if (e.currentTarget.name !== undefined) {
      const { name, value } = e.currentTarget;
      this.setState({
        [name]: value,
      });
    }
  };
  startAdd = async e => {
    e.preventDefault();
    this.setState({ submitStatus: 'saving' });
    const variables = pick(this.state, ['status', 'content', 'title']);
    const res = await apollo.mutate({
      mutation: mutateAddNotification,
      variables,
    });
    const page_id = res.data.pageAdd.page_id;
    this.setState({ submitStatus: 'success' });
    setTimeout(() => this.props.history.push(`/page/${page_id}`), 1000);
    setTimeout(() => window.scrollTo(0, 0), 1100);
  };
  render() {
    const types = [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ];
    return (
      <ColContent>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Add a Notification</h2>
          <div style={{ display: 'flex', width: '100%', marginTop: '-18px' }}>
            <div
              className="react-tabs__tab-panel react-tabs__tab-panel--selected"
              style={{
                flex: '1',
                marginRight: '20px',
              }}
            >
              <NotificationForm mode="add" />
            </div>
          </div>
        </div>
      </ColContent>
    );
  }
}
export default withRouter(AddNotificationScreen);
