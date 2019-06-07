import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';

import moment from 'moment';
import { truncate } from 'lodash';

import query from '../util/query';
import Container from '../components/Container';
import Table from '../components/Table';
import WideCol from '../components/WideCol';

const Page = styled.div``;

class RaceScreen extends React.Component {
  rowProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, original) => {
        this.props.history.push(`/challenge/${rowInfo.original.racetask_id}`);
      },
    };
  };
  render() {
    const columns = [
      {
        id: 'racetask_id',
        Header: 'ID',
        width: 40,
        accessor: ({ racetask_id }) => racetask_id,
      },
      {
        id: 'section',
        width: 120,
        Header: 'Section',
        accessor: ({ section }) => section,
      },
      {
        id: 'task',
        Header: 'Challenge',
        accessor: ({ task }) => task,
        width: 550,
        style: {
          textAlign: 'left',
          justifyContent: 'left',
          fontSize: '1rem',
          fontWeight: 'bold',
        },
      },
      {
        id: 'type',
        width: 180,
        Header: 'Type',
        accessor: ({ type }) => type,
      },
      {
        id: 'points',
        width: 180,
        Header: 'Points',
        accessor: ({ points }) => points,
      },
    ];
    const { racetasks } = this.props.data;
    return (
      <div>
        <h2>
          Challenges <Link to="/add-challenge">Add Challenge</Link>
        </h2>
        <WideCol>
          <Table
            getTrProps={this.rowProps}
            loading={!(racetasks !== undefined && racetasks)}
            data={racetasks || []}
            columns={columns}
            defaultSorted={[{ id: 'racetask_id', desc: true }]}
          />
        </WideCol>
      </div>
    );
  }
}
export default query('raceTasks', RaceScreen, {
  fetchPolicy: 'network-only',
});
