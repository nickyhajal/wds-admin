import React from 'react';
import styled from 'styled-components';
import AttendeeSearch from './AttendeeSearch';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import SubmitButton from '../components/SubmitButton';
import ConfirmButton from './ConfirmButton';
import api from '../util/api';
import delay from '../util/delay';

const Shell = styled.div`
  margin-top: 20px;
`;
const Cols = styled.div`
  display: flex;
`;
const Log = styled.pre`
  padding: 24px 40px;
  background: #f9f6f6;
  border: 1px solid #e6e3e3;
`;
const User = styled.a`
  color: #4f686b;
`;
const Prev = styled.div`
  margin-top: 28px;
  padding: 18px;
  background: #f9f6f6;
  h4 {
    font-size: 22px !important;
  }
`;
const Col = styled.div`
  width: 50%;
  padding: 18px;
  background: #f7fafb;
  margin-right: 16px;
  &:last-of-type {
    margin-right: 0;
  }
  h5 {
    font-size: 20px;
    margin-top: 4px !important;
    margin-bottom: 12px;
  }
  span {
    display: block;
    font-size: 14px;
    background: #e8eef1;
    padding: 8px;
    margin-bottom: 14px;
    height: 71px;
    overflow-y: auto;
  }
`;
class MergeAttendee extends React.PureComponent {
  state = {
    user: false,
    confirmed: false,
    mergeStatus: 'ready',
    log: false,
  };
  confirmMerge = user => {
    this.setState({ user });
  };
  renderCol(user, title, into) {
    const inputClass = into ? 'success' : 'alert';
    return (
      <Col>
        <h5>{title}</h5>
        <span>
          {into
            ? `This account's user info will take precedent.`
            : `RSVPs, hosts, connections, bookings, tickets, etc. will be appropriately transferred
          to the other account, but the other account's user info will take
          precedent.`}
        </span>
        <Cols style={{ marginBottom: '8px' }}>
          <Avatar
            user_id={user.user_id}
            width="54"
            style={{ marginRight: '10px', marginTop: '4px' }}
          />
          <div style={{ flex: '1' }}>
            <label>Name</label>
            <Input
              className={inputClass}
              disabled
              value={`${user.first_name} ${user.last_name}`}
            />
          </div>
        </Cols>
        <div>
          <label>Email</label>
          <Input className={inputClass} disabled value={user.email} />
        </div>
        <div>
          <label>Type</label>
          <Input className={inputClass} disabled value={user.type} />
        </div>
        <div>
          <label>Username</label>
          <Input className={inputClass} disabled value={user.user_name} />
        </div>
        <div>
          <label>Twitter</label>
          <Input className={inputClass} disabled value={user.twitter} />
        </div>
        <div>
          <label>Location</label>
          <Input className={inputClass} disabled value={user.location} />
        </div>
        <div>
          <label>Stripe Account</label>
          <Input className={inputClass} disabled value={user.stripe} />
        </div>
      </Col>
    );
  }
  merge = async () => {
    const { into } = this.props;
    const { user } = this.state;
    this.setState({ mergeStatus: 'saving' });
    const rsp = await api('post admin/merge', {
      from: user.user_id,
      to: into.user_id,
    });
    this.setState({ mergeStatus: 'success', log: rsp.data.output });
    if (this.props.onMerge) {
      this.props.onMerge();
    }
    window.scrollTo(0, 0);
  };
  render() {
    const { into } = this.props;
    const { user, confirmed, mergeStatus, log } = this.state;
    const userUnconfirmed = user && !log;
    const mergedPreviously =
      into.merged_users && into.merged_users.length ? into.merged_users : false;
    return (
      <Shell>
        {!user && (
          <div>
            <AttendeeSearch
              onSelect={this.confirmMerge}
              placeholder="Search for an attendee to merge into this account..."
              filter={u => u.user_id != into.user_id && !u.merged}
            />
            {mergedPreviously && (
              <Prev>
                <h4>Previously Merged into this account:</h4>
                {mergedPreviously.map(
                  ({ user_id, first_name, last_name, email }) => (
                    <div
                      key={user_id}
                      style={{ display: 'flex', padding: '6px' }}
                    >
                      <User href={`/person/${email}`}>
                        <Avatar user_id={user_id} width="28" />
                        <span
                          style={{
                            position: 'relative',
                            left: '14px',
                            top: '-9px',
                          }}
                        >{`${first_name} ${last_name}`}</span>
                      </User>
                    </div>
                  ),
                )}
              </Prev>
            )}
          </div>
        )}
        {userUnconfirmed && (
          <div>
            <h4>Are you absolutely sure you want to perform this merge?</h4>
            <Cols>
              {this.renderCol(user, 'This User', false)}
              {this.renderCol(into, 'Will merge into this one', true)}
            </Cols>
            <SubmitButton
              msgs={{ ready: 'Cancel', saving: 'Cancel', success: 'Cancel' }}
              onClick={() => {
                window.scrollTo(0, 0);
                this.setState({ user: false });
              }}
              tier="2"
            />
            <ConfirmButton
              readyMsg="Yes, merge accounts"
              action={this.merge}
              saving="Merging..."
              success="Merged!"
              mainButton
              status={mergeStatus}
            />
          </div>
        )}
        {log && (
          <div>
            <h4>Success! Here's a log of what happened:</h4>
            <div>This was also saved on the old account</div>
            <Log>{log}</Log>
            <SubmitButton
              msgs={{ ready: 'Done', saving: 'Done', success: 'Done' }}
              onClick={() => {
                window.scrollTo(0, 0);
                this.setState({ user: false, log: false, status: 'ready' });
              }}
              tier="2"
            />
          </div>
        )}
      </Shell>
    );
  }
}

export default MergeAttendee;
