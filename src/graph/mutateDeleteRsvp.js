import { gql } from 'react-apollo';

export default gql`
  mutation rsvpDelete($user_id: String!, $event_id: String!) {
    rsvpDelete(user_id: $user_id, event_id: $event_id) {
      user_id
    }
  }
`;
