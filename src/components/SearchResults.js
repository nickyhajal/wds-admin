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
  &:hover {
    cursor: pointer;
    background: ${Colors.searchHover};
  }
`;

const Row = ({ user, close }) => {
  const { first_name, last_name, email } = user;
  return (
    <RowShell to={`/person/${email}`} onClick={close}>
      {first_name} {last_name}
    </RowShell>
  );
};

const Results = ({ data, close }) => (
  <ResultsShell className="resultsShell">
    <div className="results">
      {data !== undefined && data.users !== undefined
        ? data.users.map(u => <Row user={u} key={u.user_id} close={close} />)
        : ''}
    </div>
  </ResultsShell>
);
export default query('searchAttendees', Results, ({ search, year, types }) => ({
  variables: { search, year, types },
}));
