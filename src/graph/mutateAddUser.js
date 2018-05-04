import { gql } from 'react-apollo';

export default gql`
  mutation userAdd(
    $email: String!
    $type: String!
    $ticket_type: String
    $first_name: String!
    $last_name: String!
    $address: String!
    $address2: String!
    $city: String!
    $region: String
    $zip: String
    $country: String
  ) {
    userAdd(
      email: $email
      type: $type
      ticket_type: $ticket_type
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
