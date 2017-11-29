// @flow
import React from 'react';
import { defaults, sortBy, omit } from 'lodash';
import Select from 'react-select';
import countryData from 'country-data';
import styled from 'styled-components';
import FormRow from './FormRow';
import provinces from '../util/provinces';
import Input from './Input';
import SubmitButton from './SubmitButton';

const FormWrap = styled.div``;

class Address extends React.Component {
  constructor() {
    super();
    this.state = {
      address: '',
      address2: '',
      zip: '',
      region: '',
      country: 'US',
    };
    this.countries = false;
  }
  componentDidMount() {
    this.turnOffAutoComplete();
  }
  componentDidUpdate() {
    this.turnOffAutoComplete();
  }
  componentWillReceiveProps(props) {
    this.setState(props);
  }
  getCountries() {
    if (!this.countries) {
      const countries = [];
      const byId = {};
      countryData.countries.all.forEach(c => {
        const country = {
          value: c.alpha2,
          label: c.name,
        };
        if (c.alpha2 !== 'US') {
          countries.push(country);
        }
        byId[c.alpha2] = country;
      });
      const sortedCountries = [{ value: 'US', label: 'United States' }].concat(
        sortBy(countries, 'label'),
      );
      this.countries = {
        byId,
        list: sortedCountries,
      };
    }
    return this.countries;
  }
  changeCountry = e => {
    this.setState({ country: e.value });
    this.changeSelect('country', e);
  };
  changeSelect = (name, e) => {
    this.props.onChange({ currentTarget: defaults({ name }, e) });
  };
  turnOffAutoComplete() {
    if (this.shell) {
      // $('select', $(this.shell)).attr('autocomplete', 'off');
    }
  }
  renderRegionRow() {
    let label = false;
    let data = false;
    const regions = [];
    const byId = {};
    const map = {
      US: ['State', 'short', 'name'],
      GB: ['Region', 'region', 'region'],
      CA: ['Province', 'name', 'name'],
      CN: ['Province', 'name', 'name'],
      AU: ['Province', 'name', 'name'],
      DE: ['Region', 'name', 'name'],
      MX: ['Region', 'name', 'name'],
    };
    if (map[this.state.country] !== undefined) {
      label = map[this.state.country][0];
      provinces[this.state.country].forEach((province, i) => {
        const p = {
          value: province[map[this.state.country][1]],
          label: province[map[this.state.country][2]],
        };
        byId[province[map[this.state.country][1]]] = p;
        regions.push(p);
      });
    }
    if (label) {
      const region = this.state.region;
      return (
        <div>
          <label>{label}</label>
          <Select
            ref={elm => {
              this.countrySelect = elm;
            }}
            name="region"
            onChange={e => {
              this.changeSelect('region', e);
            }}
            clearable={false}
            value={region}
            options={regions}
          />
        </div>
      );
    }
    return '';
  }
  setShell(shell) {
    this.shell = shell;
  }
  render() {
    const pushProps = omit(this.props, ['className']);
    const countries = this.getCountries();
    const vals = Object.assign({}, this.props, this.state);
    let country = 'US';
    if (vals !== undefined && vals.country !== undefined) {
      country = vals.country;
    }
    return (
      <div>
        <FormRow cols={1}>
          <div>
            <label>Country</label>
            <Select
              value={country}
              name="country"
              options={countries.list}
              clearable={false}
              onChange={this.changeCountry}
            />
          </div>
        </FormRow>
        <FormRow>
          <div>
            <label>Address Line 1</label>
            <Input
              id="address"
              name="address"
              value={vals.address}
              onChange={this.props.onChange}
            />
          </div>
          <div>
            <label>Address Line 2</label>
            <Input
              id="address2"
              name="address2"
              value={vals.address2}
              onChange={this.props.onChange}
            />
          </div>
        </FormRow>
        <FormRow>
          <div>
            <label>City</label>
            <Input
              id="city"
              name="city"
              value={vals.city}
              onChange={this.props.onChange}
            />
          </div>
          <div>{this.renderRegionRow()}</div>
        </FormRow>
        <FormRow>
          <div>
            <label>Postal Code</label>
            <Input
              id="zip"
              name="zip"
              value={vals.zip}
              onChange={this.props.onChange}
            />
          </div>
        </FormRow>
        <FormRow>
          <SubmitButton {...this.props} />
        </FormRow>
      </div>
    );
  }
}

// Address.propTypes = {
//   onChange: PropTypes.func,
//   children: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.node),
//     PropTypes.node,
//   ]),
//   values: PropTypes.objectOf(PropTypes.string),
//   key: PropTypes.string,
// };

export default Address;
