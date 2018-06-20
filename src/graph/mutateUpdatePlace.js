import { gql } from 'react-apollo';

export default gql`
  mutation placeUpdate(
    $place_id: String!
    $place_type: String!
    $name: String!
    $address: String!
    $pick: String
    $descr: String
  ) {
    placeUpdate(
      place_id: $place_id
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
