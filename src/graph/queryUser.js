import { gql } from 'react-apollo';

export default gql`
  query user($id: String!) {
    user(id: $id) {
      user_id
      first_name
      last_name
      email
      user_name
      hash
      attending17
      attending18
      pre18
      type
      email_hash
      ticket_type
      facebook
      site
      twitter
      instagram
      location
      address
      address2
      city
      region
      country
      zip
      calling_code
      phone
      lat
      lon
      accomodation
      intro
      academy
      size
      tickets {
        type
        ticket_id
        created_at
        status
        year
        user {
          user_id
          first_name
          last_name
        }
        purchaser {
          user_id
          first_name
          last_name
        }
      }
      transactions {
        transaction_id
        paid_amount
        stripe_id
        via
        status
        quantity
        created_at
        product {
          name
          code
        }
      }
    }
  }
`;
