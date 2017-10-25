import { gql } from 'react-apollo';

export default gql`
  query transactions(
    $page: Int
    $per_page: Int
    $order: String
    $order_by: String
  ) {
    transactions(
      page: $page
      per_page: $per_page
      order: $order
      order_by: $order_by
    ) {
      count
      pages
      transactions {
        transaction_id
        paid_amount
        stripe_id
        via
        status
        quantity
        created_at
        product {
          name
          code
        }
        user {
          user_id
          email
          first_name
          last_name
        }
      }
    }
  }
`;
