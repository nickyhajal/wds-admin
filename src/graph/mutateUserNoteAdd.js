import { gql } from 'react-apollo';

export default gql`
  mutation userNoteAdd(
    $about_id: String!
    $note: String!
    $user_id: String
    $admin: String
  ) {
    userNoteAdd(
      about_id: $about_id
      user_id: $user_id
      admin: $admin
      note: $note
    ) {
      about_id
    }
  }
`;
