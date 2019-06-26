import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import { omit } from 'lodash';
import mutateAddEvent from '../graph/mutateAddEvent';
import query from '../util/query';
import Container from '../components/Container';
import Form from '../components/Form';
import FormRow from '../components/FormRow';
import Input from '../components/Input';
import Colors from '../constants/Colors';
import Table from '../components/Table';
import Label from '../components/Label';
import apollo from '../util/apollo';
import mutateAddTicket from '../graph/mutateAddTicket';
import SubmitButton from '../components/SubmitButton';
import queryUser from '../graph/queryUser';
import mutateAddUser from '../graph/mutateAddUser';
import UserAdminNoteContainer from '../containers/UserAdminNoteContainer';
import Textarea from '../components/Textarea';
import TimeSelect from '../components/TimeSelect';
import RemoveButton from '../components/RemoveButton';
import mutateAddNotification from '../graph/mutateAddNotification';
import api from '../util/api';
import 'react-datepicker/dist/react-datepicker.css';
import mutateUpdateNotification from '../graph/mutateUpdateNotification';
import mutateAddRaceTask from '../graph/mutateAddRaceTask';
import mutateUpdateRaceTask from '../graph/mutateUpdateRaceTask';

const Page = styled.div``;
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

const Error = styled.div`
  padding: 1rem;
  background: #e3421f;
  color: #fff;
  margin-top: 3.2rem;
`;

class ChallengeForm extends React.Component {
  constructor() {
    super();
    this.state = {
      challengeReady: false,
      status: 'ready',
      error: '',
      challenge: {
        racetask_id: false,
        type: '1',
        descr: '',
        note: '',
        task: '',
        address: '',
      },
    };
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(props) {
    if (!this.state.challengeReady) {
      if (props.mode === 'add') {
        this.setState({
          challengeReady: true,
          challenge: Object.assign(this.state.challenge, props.challenge),
        });
      } else if (props.challenge && props.challenge.racetask_id) {
        let e = Object.assign({}, props.challenge);
        this.orig = e;
        this.setState({
          challengeReady: true,
          challenge: Object.assign({}, e),
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
  upd = (name, value, cb) => {
    this.setState(
      {
        challenge: Object.assign({}, this.state.challenge, {
          [name]: value,
        }),
      },
      cb,
    );
  };
  save = async (e, statusType = 'status', cb = false) => {
    e.preventDefault();
    const { mode } = this.props;
    const challenge = Object.assign({}, this.state.challenge);
    this.setState({ status: 'saving' });
    const omits = [];
    try {
      const res = await apollo.mutate({
        mutation: mode === 'add' ? mutateAddRaceTask : mutateUpdateRaceTask,
        variables: challenge,
      });
      this.setState({ status: 'success' });
      setTimeout(() => this.props.history.push(`/race`), 1000);
      setTimeout(() => window.scrollTo(0, 0), 1100);
    } catch (e) {
      const error = e.message
        .replace(/GraphQL error: Field \"racetaskAdd\" argument/, '')
        .replace(/GraphQL error: Variable/, '')
        .replace(/of (.+?)type (.+?) /, '')
        .replace(/\"\$/, '"');
      this.setState({ error });
    }
  };

  render() {
    const { mode, loading } = this.props;
    const challenge = Object.assign({}, this.state.challenge);
    const { type } = challenge;
    const title = mode === 'add' ? `Add Challenge` : `Edit Challenge`;
    const ready = mode === 'add' || challenge.racetask_id;
    const types = [
      { label: 'Photo', value: 'photo' },
      { label: 'Video', value: 'video' },
      { label: 'Auto', value: 'auto' },
    ];
    const sections = [
      { label: 'Before Arriving', value: 'before-arriving' },
      { label: 'Community', value: 'community' },
      { label: 'Adventure', value: 'adventure' },
      { label: 'Service', value: 'service' },
      { label: 'Bonus', value: 'bonus' },
    ];
    const status = [
      { label: 'Active', value: '1' },
      { label: 'Inactive', value: '0' },
    ];
    return (
      <div style={{ flex: '0.8', width: '100%' }}>
        {!ready ? (
          'Loading...'
        ) : (
          <div>
            <Form onSubmit={this.startAdd}>
              <FormRow>
                <div>
                  <label>Challenge</label>
                  <Input
                    type="text"
                    value={this.state.challenge.task}
                    name="task"
                    onChange={this.change}
                  />
                </div>
                <div />
              </FormRow>
              <FormRow>
                <div>
                  <label>Points</label>
                  <Input
                    type="number"
                    value={this.state.challenge.points}
                    name="points"
                    onChange={this.change}
                  />
                </div>
                <div />
              </FormRow>
              <FormRow>
                <div>
                  <label>Section</label>
                  <Select
                    value={this.state.challenge.section}
                    name="section"
                    options={sections}
                    clearable={false}
                    onChange={({ value }) => this.upd('section', value)}
                  />
                </div>
                <div>
                  <label>Type</label>
                  <Select
                    value={this.state.challenge.type}
                    name="type"
                    options={types}
                    clearable={false}
                    onChange={({ value }) => this.upd('type', value)}
                  />
                </div>
              </FormRow>
              <FormRow>
                <div>
                  <label>Description</label>
                  <Textarea
                    type="text"
                    value={this.state.challenge.note}
                    name="note"
                    onChange={this.change}
                  />
                </div>
                <div />
              </FormRow>
              <FormRow>
                <div style={{ display: 'flex ' }}>
                  <SubmitButton
                    onClick={this.save}
                    status={this.state.status}
                    msgs={{
                      ready:
                        mode === 'add' ? 'Add Challenge' : 'Update Challenge',
                      saving: 'Saving',
                      success: 'Saved!',
                    }}
                  />
                </div>
              </FormRow>
              {this.state.error && <Error>{this.state.error}</Error>}
            </Form>
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(ChallengeForm);
