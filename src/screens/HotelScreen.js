import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';

import moment from 'moment';

import query from '../util/query';
import Container from '../components/Container';
import Table from '../components/Table';

const Page = styled.div``;

class HotelScreen extends React.Component {
  rowProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, original) => {
        // this.props.history.push(`/person/${rowInfo.original.user_id}`);
      },
    };
  };
  render() {
    const columns = [
      {
        id: 'Type',
        Header: 'Type',
        accessor: d => d.type,
      },
      {
        id: 'name',
        Header: 'Customer Name',
        accessor: d => `${d.user.first_name} ${d.user.last_name}`,
      },
      {
        id: 'email',
        Header: 'E-mail Address',
        accessor: d => d.user.email,
      },
      {
        id: 'created_at',
        Header: 'Date Purchased',
        accessor: d => moment(d.created_at).format('MMMM Do, YYYY'),
      },
    ];
    const { bookings } = this.props.data;
    return (
      <div>
        <Table
          getTrProps={this.rowProps}
          loading={!(bookings !== undefined && bookings)}
          data={bookings || []}
          columns={columns}
          defaultSorted={[{ id: 'created_at', desc: true }]}
        />
      </div>
    );
  }
}
export default query('bookings', HotelScreen);
