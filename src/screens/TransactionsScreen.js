import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment';
import query from '../util/query';
import Container from '../components/Container';
import Colors from '../constants/Colors';
import TicketsTable from '../components/TicketsTable';
import TransactionsTable from '../components/TransactionsTable';
import WideCol from '../components/WideCol';

const Page = styled.div``;

class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {};
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
        if (column.id !== 'stripe') {
          this.props.history.push(`/person/${rowInfo.original.user.user_id}`);
        }
      },
    };
  };
  render() {
    const { transactions } = Object.assign(
      { transactions: [] },
      this.props.data,
    );
    return (
      <div>
        <h2>Transactions</h2>
        <WideCol>
          <TransactionsTable
            graph="transactions"
            data={transactions}
            getTdProps={this.rowProps}
          />
        </WideCol>
      </div>
    );
  }
}
export default TransactionScreen;
