import { gql } from 'react-apollo';

export default gql`
  query pages {
    pages {
      page_id
      title
      slug
      content
      status
    }
  }
`;
