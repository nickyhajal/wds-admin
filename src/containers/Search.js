import React from 'react';
import { debounce } from 'lodash';
import { withRouter } from 'react-router-dom';
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
    margin-top: -1px;
    border-top: 7px solid #6abec7;
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
      selected: 0,
      results: [],
    };
    this.searchTimo = 0;
  }
  select = selected => {
    this.setState({ selected });
  };
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
    this.setState({ open: false });
  };
  setResults = results => {
    let { selected } = this.state;
    if (selected > results.length) {
      selected = results.length - 1;
    }
    this.setState({ results, selected });
  };
  key = e => {
    const key = e.keyCode;
    let selected = -1;
    if (key === 40) {
      selected = this.state.selected + 1;
    } else if (key === 38) {
      selected = this.state.selected - 1;
    }
    if (key === 13) {
      if (this.state.results.length) {
        const user = this.state.results[this.state.selected];
        if (user !== undefined && user) {
          this.props.history.push(`/person/${user.email}`);
          this.setState({ open: false });
        }
      }
    }
    if (key === 27) {
      this.setState({ open: false });
    }
    if (selected > -1 && selected < this.state.results.length) {
      this.setState({ selected });
    }
  };
  render() {
    return (
      <SearchShell>
        <Bar
          placeholder="Search Attendees..."
          onChange={this.search}
          value={this.state.search}
          onKeyUp={this.key}
        />
        {this.state.open ? (
          <SearchResults
            search={this.state.activeSearch}
            close={this.close}
            selected={this.state.selected}
            onSelect={this.select}
            setResults={this.setResults}
          />
        ) : (
          ''
        )}
      </SearchShell>
    );
  }
}

export default withRouter(Search);
