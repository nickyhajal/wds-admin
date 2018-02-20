import { gql } from 'react-apollo';

export default gql`
  mutation pageUpdate(
    $page_id: String
    $slug: String
    $content: String
    $title: String
    $status: String
  ) {
    pageUpdate(
      page_id: $page_id
      slug: $slug
      title: $title
      content: $content
      status: $status
    ) {
      page_id
      title
      slug
      content
      status
    }
  }
`;
