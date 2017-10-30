import { gql } from 'react-apollo';

export default gql`
  mutation ticketUpdate(
    $ticket_id: Int!
    $status: String
    $type: String
    $user_id: Int
  ) {
    ticketUpdate(
      ticket_id: $ticket_id
      status: $status
      type: $type
      user_id: $user_id
    ) {
      ticket_id
    }
  }
`;
