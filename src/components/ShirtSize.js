// @flow
import React, { PropTypes } from 'react';
import { defaults } from 'lodash';
import Select from 'react-select';
import FormRow from './FormRow';

type Props = {
  onChange: (string, SyntheticEvent) => void,
  values: { [string]: string },
};
class ShirtSize extends React.Component<any, Props> {
  constructor() {
    super();
  }
  changeSelect = (name, e) => {
    this.props.onChange({ target: defaults({ name }, e) });
  };
  render() {
    const sizes = [
      { value: 'wxs', label: "Women's XS" },
      { value: 'ws', label: "Women's S" },
      { value: 'wm', label: "Women's M" },
      { value: 'wl', label: "Women's L" },
      { value: 'wxl', label: "Women's XL" },
      { value: 'w2xl', label: "Women's 2XL" },
      { value: 'ms', label: "Men's S" },
      { value: 'mm', label: "Men's M" },
      { value: 'ml', label: "Men's L" },
      { value: 'mxl', label: "Men's XL" },
      { value: 'm2xl', label: "Men's 2XL" },
      { value: 'm3xl', label: "Men's 3XL" },
    ];
    return (
      <div>
        <label>TShirt Size</label>
        <Select
          value={this.props.size}
          name="size"
          options={sizes}
          clearable={false}
          onChange={e => {
            this.changeSelect('size', e);
          }}
        />
      </div>
    );
  }
}

export default ShirtSize;
