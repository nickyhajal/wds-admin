import { upperFirst } from 'lodash';
import { graphql } from 'react-apollo';
import queries from '../graph/queries';

export default (queryName, component, options) => {
  const queryId = `query${upperFirst(queryName)}`;
  console.log(queries);
  console.log(queryId);
  const query = queries[queryId];
  return graphql(query, { options })(component);
};
