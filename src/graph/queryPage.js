import { gql } from 'react-apollo';

export default gql`
  query page($page_id: String, $slug: String) {
    page(page_id: $page_id, slug: $slug) {
      page_id
      title
      slug
      content
      status
    }
  }
`;
