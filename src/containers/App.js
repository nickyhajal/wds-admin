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
import PeopleScreen from '../screens/PeopleScreen';
import AddPersonScreen from '../screens/AddPersonScreen';
import HotelScreen from '../screens/HotelScreen';
import PagesScreen from '../screens/PagesScreen';
import AddPageScreen from '../screens/AddPageScreen';
import UpdatePageScreen from '../screens/UpdatePageScreen';
import EventsScreen from '../screens/EventsScreen';
import AddAcademyScreen from '../screens/AddAcademyScreen';
import AcademyScreen from '../screens/AcademyScreen';
import AddEventScreen from '../screens/AddEventScreen';
import EventScreen from '../screens/EventScreen';

const Main = styled.div`
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
                <Route path="/page/:id" component={UpdatePageScreen} />
                <Route path="/transactions" component={TransactionsScreen} />
                <Route path="/tickets" component={TicketsScreen} />
                <Route path="/people" component={PeopleScreen} />
                <Route path="/hotel" component={HotelScreen} />
                <Route path="/pages" component={PagesScreen} />
                <Route path="/events" exact component={EventsScreen} />
                <Route path="/events/:tab" component={EventsScreen} />
                <Route path="/add-event" exact component={AddEventScreen} />
                <Route path="/add-event/:type" component={AddEventScreen} />
                <Route path="/academy/:id" component={EventScreen} />
                <Route path="/event/:id" component={EventScreen} />
                <Route path="/add-page" component={AddPageScreen} />
                <Route path="/add-person" component={AddPersonScreen} />
              </Content>
            </Body>
          </Main>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
