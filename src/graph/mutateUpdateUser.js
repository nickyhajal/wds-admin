import {gql} from 'react-apollo'

export default gql`
  mutation userUpdate(
    $email: String
    $user_id: String
    $type: String
    $ticket_type: String
    $facebook: String
    $site: String
    $instagram: String
    $first_name: String
    $last_name: String
    $title: String
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
      ticket_type: $ticket_type
      facebook: $facebook
      site: $site
      instagram: $instagram
      first_name: $first_name
      title: $title
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
      title
      email_hash
    }
  }
`
