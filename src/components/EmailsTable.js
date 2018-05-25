import { startCase } from 'lodash';
import React from 'react';
import moment from 'moment';
import apolloClient from 'apollo-client';
import Table from './Table';
import apollo from '../util/apollo';
import ConfirmButton from '../containers/ConfirmButton';
import mutateResendEmail from '../graph/mutateResendEmail';
import NullMsg from './NullMsg';

class EmailsTable extends React.Component {
  static defaultProps = {
    graph: false,
  };
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
    const { emails } = this.props;
    let columns = [
      {
        id: 'promo',
        Header: 'Promo',
        width: 270,
        style: { fontWeight: 800 },
        accessor: ({ promo }) => promo,
      },
      {
        id: 'subject',
        Header: 'Subject',
        accessor: ({ subject }) => subject,
        style: { textAlign: 'left' },
      },
      {
        id: 'data',
        Header: 'Filler Data',
        accessor: ({ data }) => data,
        style: { textAlign: 'left', fontFamily: 'Courier New' },
        width: 200,
        Cell: props => (
          console.log(props),
          (
            <textarea
              readonly
              style={{
                border: '#ddd',
                padding: '10px',
                fontFamily: 'courier new',
              }}
            >
              {props.value}
            </textarea>
          )
        ),
      },
      {
        id: 'created',
        Header: 'Sent On',
        style: { textAlign: 'center' },
        width: 130,
        accessor: ({ created_at }) => moment(created_at).format('MMM Do, YYYY'),
      },
      {
        id: 'resend',
        Header: 'Resend',
        accessor: ({ data }) => data,
        width: 140,
        Cell: props => (
          <ConfirmButton
            readyMsg="Resend"
            confirmMsg="Again to Confirm"
            action={async () => {
              await apollo.mutate({
                mutation: mutateResendEmail,
                variables: { email_id: props.original.email_id },
              });
              this.props.refetch();
            }}
          />
        ),
      },
    ];
    return emails && emails.length ? (
      <Table
        data={this.props.emails}
        className="-striped -highlight"
        manual
        columns={columns}
        defaultSorted={[{ id: 'created_at', desc: true }]}
        per_page={10}
      />
    ) : (
      <NullMsg style={{ marginTop: '16px' }}>No emails yet!</NullMsg>
    );
  }
}

export default EmailsTable;
