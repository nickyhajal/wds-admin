import { gql } from 'react-apollo';

export default gql`
  mutation rsvpAdd($user_id: String!, $event_id: String!) {
    rsvpAdd(user_id: $user_id, event_id: $event_id) {
      user_id
    }
  }
`;
