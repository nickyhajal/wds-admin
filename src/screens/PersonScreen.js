import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment';
import query from '../util/query';
import Container from '../components/Container';
import Form from '../components/Form';
import FormRow from '../components/FormRow';
import Input from '../components/Input';
import AddressForm from '../components/AddressForm';
import ShirtSize from '../components/ShirtSize';
import Colors from '../constants/Colors';
import Table from '../components/Table';
import TicketsTable from '../components/TicketsTable';
import TransactionsTable from '../components/TransactionsTable';
import Label from '../components/Label';
import apollo from '../util/apollo';
import mutateAddTicket from '../graph/mutateAddTicket';
import UserAdminNoteContainer from '../containers/UserAdminNoteContainer';

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
const Badge = styled.div`
  background: ${({ type, attending18, pre18, ticket_type }) => {
    let color = Colors.grayDark;
    if (type === 'staff') {
      color = Colors.blueDarker;
    } else if (+attending18 === 1) {
      if (+ticket_type === 360) {
        color = Colors.orange;
      } else if (ticket_type === 'connect') {
        color = Colors.green;
      }
    }
    return color;
  }};
  border-radius: 3px;
  padding: 0px 12px;
  text-transform: uppercase;
  color: ${Colors.white};
  font-size: 15px;
  display: inline-block;
  margin-left: 16px;
  position: relative;
  top: -7px;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 24px;
`;

class PersonScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      giveTicketText: 'Give Ticket',
      user: {
        first_name: '',
        last_name: '',
        user_name: '',
        hash: '',
        address: '',
        address2: '',
        region: '',
        city: '',
        country: '',
        site: '',
        instagram: '',
        twitter: '',
        facebook: '',
      },
    };
  }
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
  giveTicket = async () => {
    this.setState({ giveTicketText: 'Giving Ticket...' });
    const result = await apollo.mutate({
      mutation: mutateAddTicket,
      variables: {
        user_id: this.state.user.user_id,
      },
    });
    this.setState({ giveTicketText: 'Success!' });
    this.props.data.refetch();
    setTimeout(() => {
      this.setState({ giveTicketText: 'Give Ticket' });
    });
  };
  render() {
    const {
      first_name,
      last_name,
      attending18,
      pre18,
      ticket_type,
      type,
    } = this.state.user;
    let badgeText = 'Not Attending';
    if (type === 'staff') {
      badgeText = 'Staff';
    } else if (attending18 === 1) {
      if (ticket_type === '360') {
        badgeText = '360 Attendee';
      } else if (ticket_type === 'connect') {
        badgeText = 'Connect Attendee';
      }
    } else if (pre18 === 1) {
      badgeText = 'Unclaimed Pre-Order';
    }

    return (
      <ColContent>
        <div>
          <h2>
            {first_name}&nbsp;{last_name}
            <Badge {...this.state.user}>{badgeText}</Badge>
          </h2>
          <Tabs>
            <TabList>
              <Tab>The Basics</Tab>
              <Tab>Notes</Tab>
              <Tab>Tickets</Tab>
              <Tab>Transactions</Tab>
              <Tab>RSVPs</Tab>
            </TabList>
            <TabPanel>
              <Form>
                <h3>Attendee Info</h3>
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
                <FormRow>
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
                  <div>
                    <label>User Name</label>
                    <Input
                      type="text"
                      value={this.state.user.user_name}
                      placeholder="User Name"
                      name="user_name"
                      onChange={this.change}
                    />
                  </div>
                </FormRow>
                <FormRow>
                  <div>
                    <ShirtSize
                      onChange={this.change}
                      size={this.state.user.size}
                    />
                  </div>
                  <div />
                </FormRow>
                <h3>Social Media</h3>
                <FormRow>
                  <div>
                    <label>Site</label>
                    <Input
                      type="text"
                      value={this.state.user.site}
                      placeholder="site"
                      name="site"
                      onChange={this.change}
                    />
                  </div>
                  <div>
                    <label>Facebook</label>
                    <Input
                      type="text"
                      value={this.state.user.facebook}
                      placeholder="Facebook"
                      name="facebook"
                      onChange={this.change}
                    />
                  </div>
                </FormRow>
                <FormRow>
                  <div>
                    <label>Instagram</label>
                    <Input
                      type="text"
                      value={this.state.user.instagram}
                      placeholder="Instagram"
                      name="instagram"
                      onChange={this.change}
                    />
                  </div>
                  <div>
                    <label>Twitter</label>
                    <Input
                      type="text"
                      value={`@${this.state.user.twitter}`}
                      placeholder="Twitter"
                      name="twitter"
                      disabled={true}
                      onChange={this.change}
                    />
                  </div>
                </FormRow>
                <h3>Contact Info</h3>
                <AddressForm {...this.state.user} onChange={this.change} />
              </Form>
            </TabPanel>
            <TabPanel>
              <h3>Attendee Notes</h3>
              <UserAdminNoteContainer user={this.state.user} />
            </TabPanel>
            <TabPanel>
              <h3>
                Tickets{' '}
                <button onClick={this.giveTicket}>
                  {this.state.giveTicketText}
                </button>
              </h3>
              <TicketsTable
                data={this.state.user.tickets}
                onTicketChange={() =>
                  setTimeout(() => this.props.data.refetch(), 300)
                }
              />
              n
            </TabPanel>
            <TabPanel>
              <h3>Transactions</h3>
              <TransactionsTable data={this.state.user.transactions} />
            </TabPanel>
            <TabPanel>
              <h2>RSVPs</h2>
              <p>Coming once we launch events!</p>
            </TabPanel>
          </Tabs>
        </div>
        <ContentSide>
          <FormRow cols={2}>
            <div>
              <Label>Login URL</Label>
              <Input
                type="text"
                value={`https://wds.fm/${this.state.user.hash}`}
              />
            </div>
          </FormRow>
          <FormRow cols={2}>
            <div>
              <Label>Profile URL</Label>
              <Input
                type="text"
                value={
                  this.state.user.user_name
                    ? `https://wds.fm/~${this.state.user.user_name}`
                    : '< Not Setup >'
                }
              />
            </div>
          </FormRow>
          <FormRow cols={2}>
            <div>
              <Label>User ID</Label>
              <Input type="text" value={this.state.user.user_id} />
            </div>
          </FormRow>
        </ContentSide>
      </ColContent>
    );
  }
}
export default withRouter(
  query('user', PersonScreen, ({ match }) => ({
    variables: { id: match.params.id },
  })),
);
