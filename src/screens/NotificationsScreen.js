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

class NotificationsScreen extends React.Component {
  rowProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, original) => {
        this.props.history.push(
          `/notification/${rowInfo.original.admin_notification_id}`,
        );
      },
    };
  };
  render() {
    const columns = [
      {
        id: 'notification',
        Header: 'Notification',
        accessor: ({ msg, title }) => ({
          msg: truncate(msg, 30),
          title,
        }),
        Cell: ({ value: { msg, title } }) => (
          <div>
            <b>{title}</b>
            <div>{msg}</div>
          </div>
        ),
      },
      {
        id: 'content',
        Header: 'Dispatch Content',
        accessor: ({ content }) => truncate(content, 40),
      },
      {
        id: 'status',
        Header: 'Status',
        width: 320,
        accessor: ({ send_on, sent_on }) =>
          sent_on
            ? `Sent on: ${moment(sent_on)
                .subtract(8, 'h')
                .format('MMMM Do, YYYY [at] h:mm a')}`
            : `Scheduled: ${moment(send_on)
                .subtract(8, 'h')
                .format('MMMM Do, YYYY [at] h:mm a')}`,
      },
      {
        width: 170,
        id: 'created_at',
        Header: 'Date Added',
        accessor: d => moment(d.created_at).format('MMMM Do, YYYY'),
      },
    ];
    const { notifications } = this.props.data;
    return (
      <div>
        <h2>
          Notifications <Link to="/add-notification">Add Notification</Link>
        </h2>
        <WideCol>
          <Table
            getTrProps={this.rowProps}
            loading={!(notifications !== undefined && notifications)}
            data={notifications || []}
            columns={columns}
            defaultSorted={[{ id: 'created_at', desc: true }]}
          />
        </WideCol>
      </div>
    );
  }
}
export default query('notifications', NotificationsScreen, {});
