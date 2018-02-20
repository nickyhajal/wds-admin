import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';

import moment from 'moment';

import query from '../util/query';
import Container from '../components/Container';
import Table from '../components/Table';

const Page = styled.div``;

class PagesScreen extends React.Component {
  rowProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, original) => {
        this.props.history.push(`/page/${rowInfo.original.page_id}`);
      },
    };
  };
  render() {
    const columns = [
      {
        id: 'status',
        Header: 'Status',
        accessor: d => d.status,
      },
      {
        id: 'title',
        Header: 'Title',
        accessor: d => d.title,
      },
      {
        id: 'created_at',
        Header: 'Created',
        accessor: d => moment(d.created_at).format('MMMM Do, YYYY'),
      },
    ];
    const { pages } = this.props.data;
    return (
      <div>
        <h2>
          Pages <Link to="/add-page">Add Page</Link>
        </h2>
        <Table
          getTrProps={this.rowProps}
          loading={!(pages !== undefined && pages)}
          data={pages || []}
          columns={columns}
          defaultSorted={[{ id: 'created_at', desc: true }]}
        />
      </div>
    );
  }
}
export default query('pages', PagesScreen);
