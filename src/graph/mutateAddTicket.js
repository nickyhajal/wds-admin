import { gql } from 'react-apollo';

export default gql`
  mutation ticketAdd($user_id: Int!, $status: String, $type: String) {
    ticketAdd(user_id: $user_id, status: $status, type: $type) {
      ticket_id
    }
  }
`;
