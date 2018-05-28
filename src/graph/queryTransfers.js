import { gql } from 'react-apollo';

export default gql`
  query {
    transfers {
      created_at
      from {
        user_id
        first_name
        last_name
        email
      }
      to {
        user_id
        first_name
        last_name
        email
      }
    }
  }
`;
