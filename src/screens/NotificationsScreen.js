import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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
                .subtract(7, 'h')
                .format('MMMM Do, YYYY [at] h:mm a')}`,
      },
      {
        id: 'users',
        Header: 'Users',
        width: 90,
        accessor: ({ sent_users }) => sent_users || '-',
      },
      {
        id: 'devices',
        Header: 'Devices',
        width: 90,
        accessor: ({ sent_devices }) => sent_devices || '-',
      },
      {
        width: 170,
        id: 'created_at',
        Header: 'Date Added',
        sortMethod: (a, b) => {
          return +a > +b ? -1 : 1;
        },
        accessor: d => d.created_at,
        Cell: ({ value }) => <div>{moment(value).format('MMMM Do, YYYY')}</div>,
      },
    ];
    const { notifications } = this.props.data;
    return (
      <div>
        <h2>
          Notifications <Link to="/add-notification">Add Notification</Link>
        </h2>
        <Tabs className="wide">
          <TabList>
            <Tab>All</Tab>
            <Tab>Scheduled</Tab>
            <Tab>Sent</Tab>
          </TabList>
          <TabPanel>
            <h3>All Notifications</h3>
            <Table
              getTrProps={this.rowProps}
              loading={!(notifications !== undefined && notifications)}
              data={notifications || []}
              columns={columns}
              defaultSorted={[{ id: 'created_at', desc: true }]}
            />
          </TabPanel>
          <TabPanel>
            <h3>Scheduled Notifications</h3>
            <Table
              getTrProps={this.rowProps}
              loading={!(notifications !== undefined && notifications)}
              data={
                notifications
                  ? notifications.filter(({ send_on, sent_on }) => !sent_on)
                  : []
              }
              columns={columns}
              defaultSorted={[{ id: 'created_at', desc: true }]}
            />
          </TabPanel>
          <TabPanel>
            <h3>Sent Notifications</h3>
            <Table
              getTrProps={this.rowProps}
              loading={!(notifications !== undefined && notifications)}
              data={
                notifications
                  ? notifications.filter(({ sent_on }) => sent_on)
                  : []
              }
              columns={columns}
              defaultSorted={[{ id: 'created_at', desc: true }]}
            />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
export default query('notifications', NotificationsScreen, {
  fetchPolicy: 'network-only',
});
