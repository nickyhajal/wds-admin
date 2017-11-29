import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import moment from 'moment';
import query from '../util/query';
import Container from '../components/Container';
import Form from '../components/Form';
import FormRow from '../components/FormRow';
import Input from '../components/Input';
import AddressForm from '../components/AddressForm';
import Colors from '../constants/Colors';
import Table from '../components/Table';
import TicketsTable from '../components/TicketsTable';
import TransactionsTable from '../components/TransactionsTable';
import Label from '../components/Label';
import apollo from '../util/apollo';
import mutateAddTicket from '../graph/mutateAddTicket';
import SubmitButton from '../components/SubmitButton';
import queryUser from '../graph/queryUser';
import mutateAddUser from '../graph/mutateAddUser';
import mutateGiveTicket from '../graph/mutateGiveTicket';

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

class AddPersonScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      giveTicket: 'y',
      status: 'ready',
      user: {
        type: 'attendee',
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        address2: '',
        region: '',
        city: '',
        country: '',
      },
    };
  }
  changeType = e => {
    this.setState({
      user: Object.assign({}, this.state.user, { type: e.value }),
    });
  };
  changeGiveTicket = e => {
    this.setState({
      giveTicket: e.value,
    });
  };
  change = e => {
    if (e.currentTarget.name !== undefined) {
      const { name, value } = e.currentTarget;
      this.setState({
        user: Object.assign({}, this.state.user, { [name]: value }),
      });
    }
  };
  rowProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, original) => {
        this.props.history.push(`/edit-deal/${rowInfo.original.deal_id}`);
      },
    };
  };
  componentWillReceiveProps(props) {
    this.setState({ user: Object.assign({}, props.data.user) });
  }
  startAdd = async e => {
    e.preventDefault();
    this.setState({ status: 'saving' });
    const res = await apollo.mutate({
      mutation: mutateAddUser,
      variables: this.state.user,
    });
    const user_id = res.data.userAdd.user_id;
    if (this.state.giveTicket === 'y') {
      const giveTicketRes = await apollo.mutate({
        mutation: mutateAddTicket,
        variables: { user_id, status: 'active' },
      });
    }
    this.setState({ status: 'success' });
    setTimeout(() => this.props.history.push(`/person/${user_id}`), 1000);
    setTimeout(() => window.scrollTo(0, 0), 1100);
  };
  render() {
    const types = [
      { label: 'Attendee', value: 'attendee' },
      { label: 'Staff', value: 'staff' },
      { label: 'Ambassador', value: 'ambassador' },
    ];
    const tickets = [
      { label: 'Give 2018 Ticket', value: 'y' },
      { label: "Don't Give Ticket", value: 'n' },
    ];
    return (
      <ColContent>
        <div>
          <h2>Add an Attendee</h2>
          <div className="react-tabs__tab-panel react-tabs__tab-panel--selected">
            <Form onSubmit={this.startAdd}>
              <h3>Attendee Info</h3>
              <FormRow>
                <div>
                  <label>Type</label>
                  <Select
                    value={this.state.user.type}
                    name="type"
                    options={types}
                    clearable={false}
                    onChange={this.changeType}
                  />
                </div>
                <div>
                  <label>Give Ticket</label>
                  <Select
                    value={this.state.giveTicket}
                    name="give"
                    options={tickets}
                    clearable={false}
                    onChange={this.changeGiveTicket}
                  />
                </div>
              </FormRow>
              <FormRow>
                <div>
                  <label>First Name</label>
                  <Input
                    type="text"
                    value={this.state.user.first_name}
                    placeholder="First Name"
                    name="first_name"
                    onChange={this.change}
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <Input
                    type="text"
                    value={this.state.user.last_name}
                    placeholder="Last Name"
                    name="last_name"
                    onChange={this.change}
                  />
                </div>
              </FormRow>
              <FormRow cols={1}>
                <div>
                  <label>E-Mail</label>
                  <Input
                    type="text"
                    value={this.state.user.email}
                    placeholder="E-Mail Address"
                    name="email"
                    onChange={this.change}
                  />
                </div>
                <div />
              </FormRow>
              <h3>Contact Info</h3>
              <AddressForm
                {...this.state.user}
                onChange={this.change}
                status={this.state.status}
                msgs={{
                  ready: 'Add Awesome Person',
                  saving: 'Adding...',
                  success: 'Success! Woohoo!',
                }}
              />
            </Form>
          </div>
        </div>
      </ColContent>
    );
  }
}
export default withRouter(AddPersonScreen);
