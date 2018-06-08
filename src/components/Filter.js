import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const Filter = ({
  name,
  id,
  options,
  defaultValue,
  value,
  onChange,
  multi,
  component,
}) => {
  const val = value || defaultValue;
  const opts = options.map(
    o => (typeof o === 'object' ? o : { value: o.toLowerCase(), label: o }),
  );
  const Component = component ? component : false;
  return (
    <div>
      <label>{name}</label>
      {Component ? (
        <Component onChange={onChange} name={id} value={val} />
      ) : (
        <Select
          value={val}
          name={id}
          options={opts}
          clearable={false}
          onChange={pkg => {
            let value;
            if (pkg.length) {
              value = pkg.map(item => item.value);
            } else {
              value = pkg.value;
            }
            onChange ? onChange({ id, value, multi }) : null;
          }}
          multi={multi}
        />
      )}
    </div>
  );
};

Filter.defaultProps = {
  options: [],
};
export default Filter;
