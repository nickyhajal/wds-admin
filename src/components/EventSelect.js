import React from 'react';
import Select from 'react-select';
import moment from 'moment';
import query from '../util/query';

const EventSelect = ({ data, name, onChange, value }) => {
  return data.loading ? (
    <div>Loading...</div>
  ) : (
    <Select
      name={name}
      value={value}
      onChange={onChange}
      options={data.events.filter(e => e.max > 0).map(e => ({
        value: e.event_id,
        label: `[${e.type}] ${e.what}`,
      }))}
    />
  );
};

export default query('bareEvents', EventSelect, ({ match }) => ({
  variables: { year: moment().format('YY'), orderBy: 'type ASC, start ASC' },
}));
