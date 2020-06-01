import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { pick, kebabCase } from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import moment from 'moment';
import query from '../util/query';
import Container from '../components/Container';
import Colors from '../constants/Colors';
import Label from '../components/Label';
import apollo from '../util/apollo';
import mutateAddTicket from '../graph/mutateAddTicket';
import SubmitButton from '../components/SubmitButton';
import queryUser from '../graph/queryUser';
import api from '../util/api';
import WideCol from '../components/WideCol';
import PlaceForm from '../containers/PlaceForm';
import ChallengeForm from '../containers/ChallengeForm';

const Page = styled.div``;

const ColContent = styled.div`
  display: flex;
  align-items: flex-start;
`;
const ContentSide = styled.div`
  background: ${Colors.white};
  padding: 32px;
  margin-left: 24px;
  border-radius: 4px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.08);
  flex: 1;
  margin-top: 110px;
`;

class ChallengeScreen extends React.Component {
  render() {
    return (
      <ColContent>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Edit Challenge</h2>
          <div style={{ display: 'flex', width: '100%', marginTop: '-18px' }}>
            <div
              className="react-tabs__tab-panel react-tabs__tab-panel--selected"
              style={{
                flex: '1',
                marginRight: '20px',
              }}
            >
              <ChallengeForm
                mode="update"
                challenge={this.props.data.racetask}
              />
            </div>
          </div>
        </div>
      </ColContent>
    );
  }
}
export default query(
  'raceTask',
  ChallengeScreen,
  ({ match }) => ({
    variables: { racetask_id: match.params.id },
    fetchPolicy: 'network-only',
  }),
  {
    fetchPolicy: 'network-only',
  },
);
