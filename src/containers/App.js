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
import TransactionsScreen from '../screens/TransactionsScreen';
import TicketsScreen from '../screens/TicketsScreen';

const Main = styled.div`height: 100%;`;
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
                <Route path="/transactions" component={TransactionsScreen} />
                <Route path="/tickets" component={TicketsScreen} />
              </Content>
            </Body>
          </Main>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;