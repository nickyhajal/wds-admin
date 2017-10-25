import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import moment from 'moment';

import query from '../util/query';
import Container from '../components/Container';
import Table from '../components/Table';

const Page = styled.div``;

class Home extends React.Component {
  rowProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, original) => {
        this.props.history.push(`/edit-deal/${rowInfo.original.deal_id}`);
      },
    };
  };
  render() {
    const columns = [
      {
        id: 'title',
        Header: 'Title',
        accessor: d => (d.title && d.title.length ? d.title : 'No title'),
      },
      {
        id: 'flight',
        Header: 'Flight',
        accessor: d => `${d.from.iata} > ${d.to.iata}`,
      },
      {
        id: 'price',
        Header: 'Price',
        accessor: d => `$${d.price / 100}`,
      },
      {
        id: 'created_at',
        Header: 'Date Added',
        accessor: d => moment(d.created_at).format('MMMM Do, YYYY'),
      },
    ];
    const { deals } = this.props.data;
    return (
      <Container>
        <h2>Deals</h2>
        {this.pr}
        {deals !== undefined && deals ? (
          <Table
            getTrProps={this.rowProps}
            data={deals}
            columns={columns}
            defaultSorted={[{ id: 'created_at', desc: true }]}
          />
        ) : (
          <div>Preparing for take-off...</div>
        )}
      </Container>
    );
  }
}
export default withRouter(query('deals', Home));
