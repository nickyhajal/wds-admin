import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import styled from 'styled-components';
import Home from '../screens/Home';
import Header from '../components/Header';
import Colors from '../constants/Colors';
import Sidebar from '../components/Sidebar';
import apollo from '../util/apollo';
import PersonScreen from '../screens/PersonScreen';
import Content from '../components/Content';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Body = styled.div`
  display: flex;
  height: 100%;
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={apollo}>
        <Router>
          <Main>
            <Header />
            <Body>
              <Sidebar />
              <Content>
                <Route path="/" exact component={Home} />
                <Route path="/person/:id" component={PersonScreen} />
              </Content>
            </Body>
          </Main>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
