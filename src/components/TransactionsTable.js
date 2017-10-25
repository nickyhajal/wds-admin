import { startCase } from 'lodash';
import React from 'react';
import moment from 'moment';
import Table from './Table';
const TransactionsTable = props => {
  const viaMap = {
    and: 'Android',
    web: 'Web',
    ios: 'iOS',
  };
  const columns = [
    {
      id: 'product',
      Header: 'Product',
      style: { fontWeight: 800 },
      accessor: d => d.product.name,
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
  return (
    <Table
      {...props}
      className="-striped"
      columns={columns}
      defaultSorted={[{ id: 'created_at', desc: true }]}
    />
  );
};

export default TransactionsTable;
