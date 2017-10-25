import React from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import styled from 'styled-components';
import Colors from '../constants/Colors';
import query from '../util/query';

const ResultsShell = styled.div``;
const RowShell = styled(Link)`
  padding: 18px 28px;
  font-weight: 600;
  cursor: pointer;
  color: ${Colors.searchResultText};
  transition: 200ms all;
  display: block;
  text-decoration: none;
  background: ${Colors.white};
  &.row-selected {
    cursor: pointer;
    background: ${Colors.searchHover};
  }
`;
const Message = styled.div`
  padding: 30px;
  padding-left: 40px;
  font-size: 20px;
  font-weight: 600;
  font-style: italic;
  color: ${Colors.blueDarker};
`;

const Row = ({ user, close, onSelect, inx, selected }) => {
  const { first_name, last_name, email } = user;
  const className = selected ? 'row-selected' : '';
  return (
    <RowShell
      to={`/person/${email}`}
      className={className}
      onClick={close}
      onMouseOver={() => onSelect(inx)}
    >
      {first_name} {last_name}
    </RowShell>
  );
};

const Results = ({ data, close, selected, onSelect, setResults }) => {
  if (data !== undefined && data.users !== undefined && data.users.length) {
    setResults(data.users);
  }
  return (
    <ResultsShell className="resultsShell">
      <div className="results">
        {data !== undefined && data.users !== undefined && data.users.length ? (
          data.users.map((u, inx) => (
            <Row
              selected={inx === selected}
              onSelect={onSelect}
              inx={inx}
              user={u}
              key={u.user_id}
              close={close}
            />
          ))
        ) : (
          <Message>{data.loading ? 'Loading...' : 'No results'}</Message>
        )}
      </div>
    </ResultsShell>
  );
};
export default query('searchAttendees', Results, ({ search, year, types }) => ({
  variables: { search, year, types },
}));
