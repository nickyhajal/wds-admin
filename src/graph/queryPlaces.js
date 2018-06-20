import { gql } from 'react-apollo';

export default gql`
  query places {
    places {
      place_id
      type
      place_type
      address
      pick
      name
    }
  }
`;
