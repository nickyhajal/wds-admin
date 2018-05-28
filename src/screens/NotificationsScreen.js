import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';

import moment from 'moment';

import query from '../util/query';
import Container from '../components/Container';
import Table from '../components/Table';
import WideCol from '../components/WideCol';

const Page = styled.div``;

class PeopleScreen extends React.Component {
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
        id: 'name',
        Header: 'Name',
        accessor: d => `${d.first_name} ${d.last_name}`,
      },
      {
        id: 'email',
        Header: 'E-mail Address',
        accessor: d => d.email,
      },
      {
        id: 'created_at',
        Header: 'Date Added',
        accessor: d => moment(d.created_at).format('MMMM Do, YYYY'),
      },
    ];
    const { users } = this.props.data;
    return (
      <div>
        <h2>
          People <Link to="/add-person">Add Person</Link>
        </h2>
        <WideCol>
          <Table
            getTrProps={this.rowProps}
            loading={!(users !== undefined && users)}
            data={users || []}
            columns={columns}
            defaultSorted={[{ id: 'created_at', desc: true }]}
          />
        </WideCol>
      </div>
    );
  }
}
export default query('searchAttendees', PeopleScreen, {
  variables: { search: '' },
});
