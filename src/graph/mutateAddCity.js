import { gql } from 'react-apollo';

export default gql`
  mutation cityAdd($location: String!) {
    cityAdd(location: $location) {
      city_id
      name
      region
      photo
      location
    }
  }
`;
