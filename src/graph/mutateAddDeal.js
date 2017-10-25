import { gql } from 'react-apollo';

export default gql`
  mutation addDeal(
    $title: String!
    $type: String!
    $from_id: String!
    $to_id: String!
    $price: Int!
    $estimated_value: Int
  ) {
    dealAdd(
      title: $title
      type: $type
      from_id: $from_id
      to_id: $to_id
      price: $price
      estimated_value: $estimated_value
    ) {
      deal_id
      from {
        iata
      }
      to {
        iata
        city {
          location
          photo
          photoSource
        }
      }
    }
  }
`;
