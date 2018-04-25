import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const Shell = styled.div`
  display: flex;
`;

const defaultMonths = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const DateSelect = ({ month, months, day, days, onChange }) => {
  return (
    <Shell>
      <Select
        value={month}
        name="month"
        options={months}
        clearable={false}
        onChange={onChange}
      />
    </Shell>
  );
};

DateSelect.defaultProps = {
  month: '07',
  day: '27',
};

export default DateSelect;
