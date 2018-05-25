import { gql } from 'react-apollo';

export default gql`
  mutation resendEmail($email_id: String!) {
    resendEmail(email_id: $email_id) {
      user_id
    }
  }
`;
