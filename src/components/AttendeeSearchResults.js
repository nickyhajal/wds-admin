import React from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import styled from 'styled-components';
import Colors from '../constants/Colors';
import query from '../util/query';

const ResultsShell = styled.div``;
const RowShell = styled.div`
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
const Badge = styled.div`
  background: ${({ type, attending18, pre18, ticket_type }) => {
    let color = Colors.grayDark;
    if (type === 'staff') {
      color = Colors.blueDarker;
    } else if (+attending18 === 1) {
      if (+ticket_type === 360) {
        color = Colors.orange;
      } else if (ticket_type === 'connect') {
        color = Colors.green;
      }
    }
    return color;
  }};
  border-radius: 50%;
  display: inline-block;
  margin-right: 17px;
  position: relative;
  top: 1px;
  width: 12px;
  height: 12px;
  margin-left: -9px;
`;

const Row = ({ user, close, onSelect, inx, selected, onClick }) => {
  const { first_name, last_name, email, attending18, pre18, type } = user;
  const className = selected ? 'row-selected' : '';
  return (
    <RowShell
      className={className}
      onClick={() => {
        close();
        onClick(user);
      }}
      onMouseOver={() => onSelect(inx)}
    >
      <Badge {...user} />
      {first_name} {last_name}
    </RowShell>
  );
};

const Results = ({ data, close, selected, onSelect, setResults, onClick }) => {
  // if (data !== undefined && data.users !== undefined && data.users.length) {
  //   setResults(data.users);
  // }
  return (
    <ResultsShell className="resultsShell">
      <div className="results">
        {data !== undefined && data.users !== undefined && data.users.length ? (
          data.users
            .slice(0, 16)
            .map((u, inx) => (
              <Row
                selected={inx === selected}
                onSelect={onSelect}
                onClick={onClick}
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
