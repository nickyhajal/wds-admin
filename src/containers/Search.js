import React from 'react';
import { debounce } from 'lodash';
import styled from 'styled-components';
import Colors from '../constants/Colors';
import query from '../util/query';
import SearchResults from '../components/SearchResults';

const SearchShell = styled.div`
  height: 100%;
  .resultsShell {
    width: 100%;
    z-index: 2000;
    position: relative;
    cursor: pointer;
    .results {
      position: absolute;
      background: #fff;
      width: 100%;
      box-shadow: 2px 2px 53px rgba(0, 0, 0, 0.11);
    }
  }
`;
const Bar = styled.input`
  border: 0;
  background: ${Colors.headerSearchBg};
  height: 100%;
  color: ${Colors.searchText};
  &::placeholder {
    color: ${Colors.searchText};
  }
  font-size: 22px;
  font-style: italic;
  text-indent: 16px;
  font-weight: 600;
  width: 100%;
  border-radius: 3px;
`;

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      search: '',
      activeSearch: '',
    };
    this.searchTimo = 0;
  }
  search = e => {
    clearTimeout(this.searchTimo);
    const search = e.currentTarget.value;
    if (search.length) {
      this.open();
    } else {
      this.close();
    }
    this.setState({ search });
    this.searchTimo = setTimeout(() => {
      this.setState({ activeSearch: search });
    });
  };
  open = () => {
    this.setState({ open: true });
  };
  close = () => {
    console.log('close');
    this.setState({ open: false });
  };
  render() {
    return (
      <SearchShell>
        <Bar
          placeholder="Search Attendees..."
          onChange={this.search}
          value={this.state.search}
        />
        {this.state.open ? (
          <SearchResults search={this.state.activeSearch} close={this.close} />
        ) : (
          ''
        )}
      </SearchShell>
    );
  }
}

export default Search;
