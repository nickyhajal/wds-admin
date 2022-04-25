import {gql} from 'react-apollo'

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
      attending19
      attending20
      pre18
      pre20
      type
      email_hash
      ticket_type
      facebook
      site
      twitter
      instagram
      location
      merged
      merge_user {
        user_id
        email
        first_name
        last_name
      }
      merged_users {
        user_id
        email
        first_name
        last_name
      }
      merge_log
      address
      address2
      city
      region
      country
      transfers_from {
        year
        new_attendee
        created_at
        user_id
        ticket {
          created_at
        }
        to {
          user_id
          first_name
          last_name
          email
          created_at
        }
      }
      transfers_to {
        year
        new_attendee
        created_at
        user_id
        from {
          user_id
          first_name
          last_name
          email
          created_at
        }
      }
      zip
      calling_code
      phone
      lat
      lon
      emails {
        email_id
        promo
        subject
        data
        resent_from
        created_at
      }
      accomodation
      intro
      academy
      size
      rsvps {
        event_id
        what
        type
        start
      }
      tickets {
        type
        ticket_id
        created_at
        updated_at
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
`
