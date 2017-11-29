import { gql } from 'react-apollo';

export default gql`
  query user($id: String!) {
    user(id: $id) {
      admin_notes {
        user_id
        about_id
        note
        created_at
        updated_at
      }
    }
  }
`;
