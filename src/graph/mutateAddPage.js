import { gql } from 'react-apollo';

export default gql`
  mutation pageAdd($content: String, $title: String, $status: String) {
    pageAdd(title: $title, content: $content, status: $status) {
      page_id
      title
      slug
      content
      status
    }
  }
`;
