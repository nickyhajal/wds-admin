import { gql } from 'react-apollo';

export default gql`
  query tickets($page: Int, $per_page: Int, $order: String, $order_by: String) {
    tickets(
      page: $page
      per_page: $per_page
      order: $order
      order_by: $order_by
    ) {
      count
      pages
      tickets {
        type
        ticket_id
        created_at
        status
        year
        user {
          first_name
          last_name
        }
        purchaser {
          first_name
          last_name
        }
      }
    }
  }
`;
