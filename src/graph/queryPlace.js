import { gql } from 'react-apollo';

export default gql`
  query place($place_id: String) {
    place(place_id: $place_id) {
      place_id
      type
      place_type
      address
      pick
      name
    }
  }
`;
