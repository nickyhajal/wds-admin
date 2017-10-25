import { gql } from 'react-apollo';

export default gql`
  mutation dealUpdate(
    $deal_id: String!
    $type: String
    $from_id: String
    $to_id: String
    $price: Int
    $estimated_value: Int
    $ranges: [DealRange]
    $badge: String
    $descr: String
    $minimum_stay: Int
  ) {
    dealUpdate(
      deal_id: $deal_id
      type: $type
      from_id: $from_id
      to_id: $to_id
      price: $price
      estimated_value: $estimated_value
      ranges: $ranges
      badge: $badge
      descr: $descr
      minimum_stay: $minimum_stay
    ) {
      deal_id
    }
  }
`;
