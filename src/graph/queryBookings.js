import { gql } from 'react-apollo';

export default gql`
  query bookings {
    bookings {
      booking_id
      type
      status
      notes
      extra
      user {
        user_id
        email
        first_name
        last_name
      }
    }
  }
`;
