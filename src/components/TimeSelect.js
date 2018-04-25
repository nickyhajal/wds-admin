import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const Shell = styled.div`
  display: flex;
`;
const Part = styled.div`
  flex: 1;
  margin-right: 4px;
  &:last-of-type {
    margin-right: 0;
  }
`;

const defaultHours = [
  { label: '1', value: '01' },
  { label: '2', value: '02' },
  { label: '3', value: '03' },
  { label: '4', value: '04' },
  { label: '5', value: '05' },
  { label: '6', value: '06' },
  { label: '7', value: '07' },
  { label: '8', value: '08' },
  { label: '9', value: '09' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
];

const defaultAmPm = [{ label: 'am', value: '0' }, { label: 'pm', value: '12' }];

const defaultMinutes = [
  { label: '00', value: '00' },
  { label: '15', value: '15' },
  { label: '30', value: '30' },
  { label: '45', value: '45' },
];

const TimeSelect = ({ hour, minute, ampm, onChange }) => {
  return (
    <Shell>
      <Part>
        <Select
          value={hour}
          options={defaultHours}
          clearable={false}
          onChange={e => onChange('hour', e.value)}
        />
      </Part>
      <Part>
        <Select
          value={minute}
          options={defaultMinutes}
          clearable={false}
          onChange={e => onChange('minute', e.value)}
        />
      </Part>
      <Part>
        <Select
          value={ampm}
          options={defaultAmPm}
          clearable={false}
          onChange={e => onChange('ampm', e.value)}
        />
      </Part>
    </Shell>
  );
};

TimeSelect.defaultProps = {
  hour: '00',
  minute: '00',
  ampm: 'pm',
};

export default TimeSelect;
