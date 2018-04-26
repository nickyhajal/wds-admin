import { gql } from 'react-apollo';

export default gql`
  mutation userUpdate(
    $email: String
    $user_id: String
    $type: String
    $facebook: String
    $site: String
    $instagram: String
    $first_name: String
    $last_name: String
    $address: String
    $address2: String
    $city: String
    $region: String
    $zip: String
    $country: String
  ) {
    userUpdate(
      email: $email
      user_id: $user_id
      type: $type
      facebook: $facebook
      site: $site
      instagram: $instagram
      first_name: $first_name
      last_name: $last_name
      address: $address
      address2: $address2
      city: $city
      region: $region
      zip: $zip
      country: $country
    ) {
      user_id
      first_name
      last_name
      email_hash
    }
  }
`;
