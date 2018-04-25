import React from 'react';
import { debounce } from 'lodash';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Colors from '../constants/Colors';
import query from '../util/query';
import AttendeeSearchResults from '../components/AttendeeSearchResults';

const SearchShell = styled.div`
  height: 100%;
  .resultsShell {
    width: 100%;
    z-index: 2000;
    position: relative;
    cursor: pointer;
    margin-top: -1px;
    border-top: 1px solid #6abec7;
    .results {
      position: absolute;
      background: #fff;
      width: 100%;
      box-shadow: 2px 2px 53px rgba(0, 0, 0, 0.11);
    }
  }
`;
const Bar = styled.input`
  border: 1px solid #ccc;
  background: ${Colors.white};
  padding: 12px 0;
  height: 100%;
  color: ${Colors.grayDark};
  &::placeholder {
    color: ${Colors.grayDark};
  }
  font-size: 17px;
  font-style: italic;
  text-indent: 18px;
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
          <div style={{ height: '200px', overflowY: 'auto' }}>
            <AttendeeSearchResults
              search={this.state.activeSearch}
              close={this.close}
              selected={this.state.selected}
              onSelect={this.select}
              onClick={selected => this.props.onSelect(selected)}
              setResults={this.setResults}
            />
          </div>
        ) : (
          ''
        )}
      </SearchShell>
    );
  }
}

export default withRouter(Search);
