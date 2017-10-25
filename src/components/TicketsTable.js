import { startCase } from 'lodash';
import React from 'react';
import moment from 'moment';
import { lighten } from 'polished';
import Table from './Table';
import Colors from '../constants/Colors';
import queryTickets from '../graph/queryTickets';
import apollo from '../util/apollo';

class TicketsTable extends React.Component {
  static defaultProps = {
    graph: false,
  };
  constructor() {
    super();
    this.state = {
      data: [],
      pages: -1,
      loading: false,
      page: 0,
      per_page: 20,
    };
  }
  render() {
    console.log(this.props);
    const columns = [
      {
        id: 'type',
        Header: 'Type',
        width: 70,
        style: d => ({
          backgroundColor:
            +d.year === 2018 ? Colors.blueLightest : Colors.white,
          textAlign: 'center',
        }),
        accessor: d =>
          d.type !== undefined && d.type && d.type.length
            ? d.type === 'connect' ? 'CNCT' : d.type
            : '360',
      },
      {
        id: 'year',
        Header: 'Year',
        width: 90,
        style: { textAlign: 'center' },
        accessor: d => d.year,
      },
      {
        id: 'status',
        Header: 'Status',
        style: { textAlign: 'center' },
        accessor: d => startCase(d.status),
      },
      {
        id: 'purchaser',
        style: { textAlign: 'center' },
        Header: 'Purchased By',
        accessor: d =>
          d.purchaser.first_name !== undefined && d.purchaser.first_name
            ? `${d.purchaser.first_name} ${d.purchaser.last_name}`
            : 'Owner',
      },
      {
        id: 'assigned',
        Header: 'Assigned To',
        style: { textAlign: 'center' },
        accessor: d =>
          d.user.first_name !== undefined
            ? `${d.user.first_name} ${d.user.last_name}`
            : 'Owner',
      },
      {
        id: 'created',
        Header: 'Purchased On',
        accessor: d => moment(d.created_at).format('MMM Do, YYYY'),
      },
    ];
    if (this.props.graph) {
      return (
        <Table
          data={this.state.data}
          pages={this.state.pages}
          loading={this.state.loading}
          onPageChange={pageIndex => this.setState({ page: pageIndex })} // Called when the page index is changed by the user
          onPageSizeChange={(pageSize, pageIndex) =>
            this.setState({ per_page: pageSize })}
          manual
          page={this.state.page}
          per_page={this.state.per_page}
          columns={columns}
          onFetchData={(state, instance) => {
            setTimeout(() => {
              this.setState({ loading: true });
              apollo
                .query({
                  query: queryTickets,
                  variables: {
                    per_page: this.state.per_page,
                    page: this.state.page,
                  },
                })
                .then(result => {
                  this.setState({
                    data: result.data.tickets.tickets,
                    pages: result.data.tickets.pages,
                    loading: false,
                  });
                });
            }, 10);
          }}
        />
      );
    }
    return (
      <Table
        {...this.props}
        columns={columns}
        className="-striped"
        getTrProps={(params, rowInfo) => {
          let style = {};
          if (
            rowInfo !== undefined &&
            rowInfo.original !== undefined &&
            +rowInfo.original.year === 2018
          ) {
            style = { backgroundColor: lighten(0.3, Colors.blue) };
          }
          return {
            style,
            onClick: () => {
              this.setState({ highlightedIndex: rowInfo.row._index });
            },
          };
        }}
        getTrGroupProps={(params, rowInfo) => {
          let style = {};
          if (
            rowInfo !== undefined &&
            rowInfo.original !== undefined &&
            +rowInfo.original.year === 2018
          ) {
            style = { borderBottom: '1px solid rgb(203, 223, 224)' };
          }
          return {
            style,
            onClick: () => {
              this.setState({ highlightedIndex: rowInfo.row._index });
            },
          };
        }}
        defaultSorted={[{ id: 'created_at', desc: true }]}
      />
    );
  }
}

export default TicketsTable;
