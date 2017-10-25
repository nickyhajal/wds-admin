import { ApolloClient, createNetworkInterface } from 'react-apollo';

import Net from '../constants/Net';

const apollo = new ApolloClient({
  networkInterface: createNetworkInterface({
    opts: {
      credentials: 'include',
    },
    uri: Net.graphUrl,
  }),
});

export default apollo;
