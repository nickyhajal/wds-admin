import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import { omit } from 'lodash';
import mutateAddEvent from '../graph/mutateAddEvent';
import query from '../util/query';
import Container from '../components/Container';
import Form from '../components/Form';
import FormRow from '../components/FormRow';
import Input from '../components/Input';
import Colors from '../constants/Colors';
import Table from '../components/Table';
import Label from '../components/Label';
import apollo from '../util/apollo';
import mutateAddTicket from '../graph/mutateAddTicket';
import SubmitButton from '../components/SubmitButton';
import queryUser from '../graph/queryUser';
import mutateAddUser from '../graph/mutateAddUser';
import UserAdminNoteContainer from '../containers/UserAdminNoteContainer';
import Textarea from '../components/Textarea';
import TimeSelect from '../components/TimeSelect';
import RemoveButton from '../components/RemoveButton';
import mutateAddNotification from '../graph/mutateAddNotification';
import api from '../util/api';
import 'react-datepicker/dist/react-datepicker.css';
import mutateUpdateNotification from '../graph/mutateUpdateNotification';
import mutateAddPlace from '../graph/mutateAddPlace';
import mutateUpdatePlace from '../graph/mutateUpdatePlace';

const Page = styled.div``;
const B = styled.span`
  padding: 0 6px;
  color: ${Colors.blue};
`;
const ConfirmationBox = styled.div`
  padding: 60px;
  background: ${Colors.blueLightest};
  margin-top: 60px;
  margin-bottom: 40px;
`;

class PlaceForm extends React.Component {
  constructor() {
    super();
    this.state = {
      placeReady: false,
      status: 'ready',
      place: {
        place_id: false,
        place_type: '1',
        descr: '',
        name: '',
        address: '',
      },
    };
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(props) {
    if (!this.state.placeReady) {
      if (props.mode === 'add') {
        this.setState({
          placeReady: true,
          place: Object.assign(this.state.place, props.place),
        });
      } else if (props.place && props.place.place_id) {
        let e = Object.assign({}, props.place);
        this.orig = e;
        this.setState({
          placeReady: true,
          place: Object.assign({}, e),
        });
      }
    }
  }
  change = e => {
    if (e.currentTarget.name !== undefined) {
      const { name, value } = e.currentTarget;
      this.upd(name, value);
    }
  };
  upd = (name, value, cb) => {
    this.setState(
      {
        place: Object.assign({}, this.state.place, {
          [name]: value,
        }),
      },
      cb,
    );
  };
  save = async (e, statusType = 'status', cb = false) => {
    e.preventDefault();
    const { mode } = this.props;
    const place = Object.assign({}, this.state.place);
    this.setState({ status: 'saving' });
    const omits = [];
    const res = await apollo.mutate({
      mutation: mode === 'add' ? mutateAddPlace : mutateUpdatePlace,
      variables: place,
    });
    this.setState({ status: 'success' });
    setTimeout(() => this.props.history.push(`/places`), 1000);
    setTimeout(() => window.scrollTo(0, 0), 1100);
  };

  render() {
    const { mode, loading } = this.props;
    const place = Object.assign({}, this.state.place);
    const { place_type } = place;
    const title = mode === 'add' ? `Add Place` : `Edit Place`;
    const ready = mode === 'add' || place.place_id;
    const types = [
      { label: 'WDS Venues', value: '1' },
      // { label: 'WDS Consulates', value: '2' },
      { label: 'Spots for Food', value: '3' },
      { label: 'Bars & Hangouts', value: '4' },
      { label: 'Portland Classics', value: '5' },
    ];
    return (
      <div style={{ flex: '0.8', width: '100%' }}>
        {!ready ? (
          'Loading...'
        ) : (
          <div>
            <Form onSubmit={this.startAdd}>
              <FormRow>
                <div>
                  <label>Type</label>
                  <Select
                    value={this.state.place.place_type}
                    name="place_type"
                    options={types}
                    clearable={false}
                    onChange={({ value }) => this.upd('place_type', value)}
                  />
                </div>
                <div />
              </FormRow>
              <FormRow>
                <div>
                  <label>Name</label>
                  <Input
                    type="text"
                    value={this.state.place.name}
                    name="name"
                    onChange={this.change}
                  />
                </div>
                <div>
                  <label>Address</label>
                  <Input
                    type="text"
                    value={this.state.place.address}
                    name="address"
                    onChange={this.change}
                  />
                </div>
              </FormRow>
              <FormRow>
                <div>
                  <label>Description</label>
                  <Textarea
                    type="text"
                    value={this.state.place.descr}
                    name="descr"
                    onChange={this.change}
                  />
                </div>
                <div />
              </FormRow>
              <FormRow>
                <div>
                  <label>WDS Team Member Pick (Name, Role)</label>
                  <Input
                    type="text"
                    value={this.state.place.pick}
                    name="pick"
                    onChange={this.change}
                  />
                </div>
                <div />
              </FormRow>
              <FormRow>
                <div style={{ display: 'flex ' }}>
                  <SubmitButton
                    onClick={this.save}
                    status={this.state.status}
                    msgs={{
                      ready: mode === 'add' ? 'Add Place' : 'Update Place',
                      saving: 'Saving',
                      success: 'Saved!',
                    }}
                  />
                </div>
              </FormRow>
            </Form>
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(PlaceForm);
