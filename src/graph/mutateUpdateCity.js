import { gql } from 'react-apollo';

export default gql`
  mutation cityUpdate(
    $city_id: String!
    $name: String
    $region: String
    $photo_url: String
    $location: String
  ) {
    cityUpdate(
      city_id: $city_id
      region: $region
      photo_url: $photo_url
      location: $location
      name: $name
    ) {
      city_id
      location
      photoSource
      photo
      name
      region
    }
  }
`;
