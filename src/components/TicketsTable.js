import { startCase } from 'lodash';
import React from 'react';
import moment from 'moment';
import { lighten } from 'polished';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import Table from './Table';
import Colors from '../constants/Colors';
import queryTickets from '../graph/queryTickets';
import apollo from '../util/apollo';
import ConfirmationModal from './ConfirmationModal';
import mutateUpdateTicket from '../graph/mutateUpdateTicket';

class TicketsTable extends React.Component {
  static defaultProps = {
    graph: false,
    onTicketChange: () => {},
  };
  constructor() {
    super();
    this.state = {
      data: [],
      pages: -1,
      loading: false,
      page: 0,
      per_page: 20,
      confirmation: {
        handleConfirm: () => {},
        open: false,
        content: null,
        title: 'Confirm this',
      },
    };
  }
  componentWillMount() {
    this.query = apollo.watchQuery({
      query: queryTickets,
      pollInterval: 10000,
      options: { fetchPolicy: 'network-only' },
      fetchPolicy: 'network-only',
      variables: {
        per_page: this.state.per_page,
        page: this.state.page,
      },
    });
    this.query.subscribe({
      next: ({ data }) => {
        this.setState({
          data:
            data !== undefined && data.tickets !== undefined
              ? data.tickets.tickets
              : [],
          pages:
            data !== undefined && data.tickets !== undefined
              ? data.tickets.pages
              : [],
          loading: false,
        });
      },
    });
  }
  openConfirm(title, content, handleConfirm) {
    this.setState({
      confirmation: {
        open: true,
        title,
        content,
        handleConfirm,
      },
    });
  }
  actionSelect = (e, elm, props) => {
    this.changeTicketStatus(props, e.value);
  };
  closeConfirm = () => {
    this.setState({
      confirmation: Object.assign({}, this.state.confirmation, {
        open: false,
        confirmText: null,
      }),
    });
  };
  changeTicketStatus = (ticket, status) => {
    const columns = [
      {
        id: 'type',
        Header: 'Type',
        width: 70,
        style: d => ({
          backgroundColor:
            +d.year === 2019 ? Colors.blueLightest : Colors.white,
          textAlign: 'center',
          verticalAlign: 'middle',
        }),
        accessor: d =>
          d.type !== undefined && d.type && d.type.length
            ? d.type === 'connect'
              ? 'CNCT'
              : d.type
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
          d.user.first_name !== undefined && d.user.first_name
            ? `${d.user.first_name} ${d.user.last_name}`
            : 'Owner',
      },
    ];
    const content = (
      <div>
        <Table
          {...this.props}
          data={[ticket]}
          manual
          footerStyle={{ display: 'none' }}
          tiny
          defaultPageSize={1}
          columns={columns}
        />
      </div>
    );
    this.openConfirm(
      `Are you sure you want to mark this ticket as ${status}?`,
      content,
      () => {
        this.doChangeTicketStatus(ticket, status);
      },
    );
  };
  confirmText(confirmText) {
    this.setState({
      confirmation: Object.assign({}, this.state.confirmation, { confirmText }),
    });
  }
  doChangeTicketStatus = async (props, status) => {
    this.confirmText('Processing...');
    const res = apollo.mutate({
      mutation: mutateUpdateTicket,
      variables: {
        ticket_id: props.ticket_id,
        status,
      },
    });
    this.confirmText('Success!');
    if (this.query) {
      this.query.setVariables({
        per_page: this.state.per_page,
        page: this.state.page,
      });
    }
    this.props.onTicketChange();

    setTimeout(() => {
      this.closeConfirm();
    }, 350);
  };
  modals() {
    return (
      <ConfirmationModal
        isOpen={this.state.confirmation.open}
        title={this.state.confirmation.title}
        handleConfirm={this.state.confirmation.handleConfirm}
        handleCancel={this.closeConfirm}
        confirmText={this.state.confirmation.confirmText}
      >
        {this.state.confirmation.content}
      </ConfirmationModal>
    );
  }
  rowProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, original) => {
        if (column.id !== 'stripe') {
          // this.cancelTicket();
        }
      },
    };
  };
  render() {
    const { transfers } = this.props;
    const columns = [
      {
        id: 'type',
        Header: 'Type',
        width: 70,
        style: d => ({
          backgroundColor:
            +d.year === 2019 ? Colors.blueLightest : Colors.white,
          textAlign: 'center',
          verticalAlign: 'middle',
        }),
        accessor: d =>
          d.type !== undefined && d.type && d.type.length
            ? d.type === 'connect'
              ? 'CNCT'
              : d.type
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
        accessor: d => ({
          email: d.purchaser.user_id,
          name:
            d.purchaser.first_name !== undefined && d.purchaser.first_name
              ? `${d.purchaser.first_name} ${d.purchaser.last_name}`
              : 'Owner',
        }),
        Cell: props => (
          <Link to={`/person/${props.value.email}`}>{props.value.name}</Link>
        ),
      },
      {
        id: 'assigned',
        Header: 'Assigned To',
        style: { textAlign: 'center' },
        accessor: d => ({
          email: d.user.user_id,
          name:
            d.user.first_name !== undefined && d.user.first_name
              ? `${d.user.first_name} ${d.user.last_name}`
              : 'Owner',
        }),
        Cell: props => (
          <Link to={`/person/${props.value.email}`}>{props.value.name}</Link>
        ),
      },
      {
        id: 'created',
        Header: 'Purchased On',
        accessor: d => moment(d.created_at).format('MMM Do, YYYY'),
      },
      {
        id: 'actions',
        Header: '',
        accessor: d => d,
        Cell: props => {
          const t = props.value;
          const actions = [];
          if (t.status !== 'canceled') {
            actions.push({ value: 'canceled', label: 'Cancel' });
          }
          if (t.status !== 'active') {
            actions.push({ value: 'active', label: 'Activate' });
          }
          if (t.status !== 'unclaimed') {
            actions.push({ value: 'unclaimed', label: 'Set Unclaimed' });
          }
          return (
            <Select
              options={actions}
              onChange={(e, elm) => this.actionSelect(e, elm, t)}
              placeholder="Actions"
              searchable={false}
            />
          );
        },
      },
    ];
    const transferCol = {
      id: 'transfer',
      style: { textAlign: 'center' },
      Header: 'Transferred',
      accessor: ({ year, updated_at }) => {
        const { from, to } = transfers;
        const f = from.find(
          t =>
            +t.year === +year &&
            Math.abs(+new Date(updated_at) - +new Date(t.created_at)) < 30000,
        );
        const t = to.find(t => (console.log(t), +t.year === +year));
        if (t) {
          return (
            <span>
              From:{' '}
              <Link to={`/person/${t.from.email}`}>{`${t.from.first_name} ${
                t.from.last_name
              }`}</Link>
            </span>
          );
        }
        if (f) {
          return (
            <span>
              To:{' '}
              <Link to={`/person/${f.to.email}`}>{`${f.to.first_name} ${
                f.to.last_name
              }`}</Link>
            </span>
          );
        }
        return 'No';
      },
    };
    if (transfers) {
      columns.splice(2, 0, transferCol);
    }
    if (this.props.graph) {
      return (
        <div>
          {this.modals()}
          <Table
            {...this.props}
            data={this.state.data}
            pages={this.state.pages}
            loading={this.state.loading}
            onPageChange={pageIndex => this.setState({ page: pageIndex })} // Called when the page index is changed by the user
            className="-striped"
            onPageSizeChange={(pageSize, pageIndex) =>
              this.setState({ per_page: pageSize })
            }
            manual
            page={this.state.page}
            per_page={this.state.per_page}
            columns={columns}
            getTdProps={this.rowProps}
            onFetchData={() => {
              setTimeout(() => {
                this.query.setVariables({
                  per_page: this.state.per_page,
                  page: this.state.page,
                });
              }, 40);
            }}
          />
        </div>
      );
    }
    return (
      <div>
        {this.modals()}
        <Table
          {...this.props}
          columns={columns}
          className="-striped"
          getTdProps={this.rowProps}
          getTrProps={(params, rowInfo) => {
            let style = {};
            if (
              rowInfo !== undefined &&
              rowInfo.original !== undefined &&
              +rowInfo.original.year === 2019
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
              +rowInfo.original.year === 2019
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
      </div>
    );
  }
}

export default TicketsTable;
