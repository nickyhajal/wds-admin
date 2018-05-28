import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';

import moment from 'moment';

import query from '../util/query';
import Container from '../components/Container';
import Table from '../components/Table';
import WideCol from '../components/WideCol';

const Page = styled.div``;

class TransfersScreen extends React.Component {
  rowProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, original) => {
        this.props.history.push(`/person/${rowInfo.original.user_id}`);
      },
    };
  };
  render() {
    const columns = [
      {
        id: 'from',
        Header: 'From',
        accessor: ({ from }) => from,
        style: { textAlign: 'center' },
        Cell: ({ value: { first_name, last_name, email } }) => (
          <Link to={`/person/${email}`}>{`${first_name} ${last_name}`}</Link>
        ),
      },
      {
        id: 'to',
        Header: 'To',
        style: { textAlign: 'center' },
        accessor: ({ to }) => to,
        Cell: ({ value: { first_name, last_name, email } }) => (
          <Link to={`/person/${email}`}>{`${first_name} ${last_name}`}</Link>
        ),
      },
      {
        id: 'created_at',
        Header: 'Date Transferred',
        accessor: d => moment(d.created_at).format('MMMM Do, YYYY'),
      },
    ];
    const { transfers } = this.props.data;
    return (
      <div>
        <h2>Transfers</h2>
        <WideCol>
          <Table
            getTrProps={this.rowProps}
            loading={!(transfers !== undefined && transfers)}
            data={transfers || []}
            columns={columns}
            defaultSorted={[{ id: 'created_at', desc: true }]}
          />
        </WideCol>
      </div>
    );
  }
}
export default query('transfers', TransfersScreen, {});
