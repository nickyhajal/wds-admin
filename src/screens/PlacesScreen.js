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

class PlacesScreen extends React.Component {
  rowProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, original) => {
        this.props.history.push(`/place/${rowInfo.original.place_id}`);
      },
    };
  };
  render() {
    const columns = [
      {
        id: 'name',
        Header: 'Venue Name',
        accessor: ({ name }) => name,
      },
      {
        id: 'address',
        width: 180,
        Header: 'Address',
        accessor: ({ address }) => truncate(address, { length: 20 }),
      },
      {
        id: 'type',
        width: 180,
        Header: 'Type',
        accessor: ({ type }) => type,
      },
      {
        id: 'pick',
        width: 180,
        Header: 'Team Pick',
        accessor: ({ pick }) => truncate(pick, { length: 20 }),
      },
    ];
    const { places } = this.props.data;
    return (
      <div>
        <h2>
          Places <Link to="/add-place">Add Place</Link>
        </h2>
        <WideCol>
          <Table
            getTrProps={this.rowProps}
            loading={!(places !== undefined && places)}
            data={places || []}
            columns={columns}
            defaultSorted={[{ id: 'place_id', desc: true }]}
          />
        </WideCol>
      </div>
    );
  }
}
export default query('places', PlacesScreen, {
  fetchPolicy: 'network-only',
});
