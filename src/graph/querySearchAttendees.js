import { gql } from 'react-apollo';

export default gql`
  query users($search: String!, $years: String, $types: String) {
    users(search: $search, years: $years, types: $types) {
      user_id
      attending18
      pre18
      first_name
      last_name
      email
      user_name
      password
    }
  }
`;
