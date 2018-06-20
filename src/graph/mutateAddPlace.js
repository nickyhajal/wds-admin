import { gql } from 'react-apollo';

export default gql`
  mutation placeAdd(
    $place_type: String!
    $name: String!
    $address: String!
    $pick: String
    $descr: String
  ) {
    placeAdd(
      place_type: $place_type
      name: $name
      address: $address
      pick: $pick
      descr: $descr
    ) {
      place_id
      address
      pick
      descr
      name
      place_type
      type
    }
  }
`;
