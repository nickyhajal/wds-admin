import { startCase } from 'lodash';
import React from 'react';
import moment from 'moment';
import Table from './Table';
import queryTransactions from '../graph/queryTransactions';
import apollo from '../util/apollo';

class TransactionsTable extends React.Component {
  static defaultProps = {
    graph: false,
  };
  componentWillMount() {
    this.query = apollo.watchQuery({
      query: queryTransactions,
      pollInterval: 10000,
      fetchPolicy: 'network-only',
      variables: {
        per_page: this.state.per_page,
        page: this.state.page,
      },
    });
    this.query.subscribe({
      next: ({ data }) => {
        this.setState({
          data: data.transactions.transactions,
          pages: data.transactions.pages,
          loading: false,
        });
      },
    });
  }
  constructor() {
    super();
    this.state = {
      data: [],
      pages: -1,
      loading: true,
      page: 0,
      per_page: 20,
    };
    this.query = false;
  }
  render() {
    const viaMap = {
      and: 'Android',
      web: 'Web',
      ios: 'iOS',
    };
    let columns = [
      {
        id: 'product',
        Header: 'Product',
        style: { fontWeight: 800 },
        accessor: d => d.product.name,
      },
      {
        id: 'name',
        Header: 'Purchaser',
        accessor: d => `${d.user.first_name} ${d.user.last_name}`,
        style: { textAlign: 'center' },
      },
      {
        id: 'via',
        Header: 'Via',
        width: 90,
        style: { textAlign: 'center' },
        accessor: d => viaMap[d.via],
      },
      {
        id: 'status',
        Header: 'Status',
        style: { textAlign: 'center' },
        width: 100,
        accessor: d => startCase(d.status),
      },
      {
        id: 'quantity',
        Header: 'Quantity',
        style: { textAlign: 'center' },
        accessor: d => d.quantity,
        width: 100,
      },
      {
        id: 'paid',
        Header: 'Amount Paid',
        style: { textAlign: 'center' },
        width: 105,
        accessor: d => `$${d.paid_amount / 100}`,
      },
      {
        id: 'created',
        Header: 'Purchased On',
        style: { textAlign: 'center' },
        width: 140,
        accessor: d => moment(d.created_at).format('MMM Do, YYYY'),
      },
    ];
    const p = Object.assign({}, this.props);
    if (
      p.data !== undefined &&
      p.data[0] !== undefined &&
      p.data[0].user === undefined
    ) {
      columns = columns.filter(v => v.id !== 'name');
    }
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
          onFetchData={() => {
            setTimeout(() => {
              this.query.setVariables({
                per_page: this.state.per_page,
                page: this.state.page,
              });
            }, 40);
          }}
        />
      );
    }
    return (
      <Table
        {...p}
        className="-striped"
        columns={columns}
        defaultSorted={[{ id: 'created_at', desc: true }]}
      />
    );
  }
}

export default TransactionsTable;
