import { gql } from 'react-apollo';

export default gql`
  mutation eventAdd(
    $type: String!
    $what: String!
    $who: String
    $place: String
    $descr: String
    $address: String
    $hour: String
    $date: String
    $minute: String
    $ampm: String
    $end_hour: String
    $end_minute: String
    $end_ampm: String
    $max: Int
    $free_max: Int
    $for_type: String
    $bios: String
    $hosts: String
    $price: Int
  ) {
    eventAdd(
      type: $type
      what: $what
      who: $who
      place: $place
      descr: $descr
      date: $date
      minute: $minute
      address: $address
      hour: $hour
      ampm: $ampm
      end_hour: $end_hour
      end_minute: $end_minute
      end_ampm: $end_ampm
      max: $max
      free_max: $free_max
      for_type: $for_type
      bios: $bios
      hosts: $hosts
      price: $price
    ) {
      event_id
      slug
    }
  }
`;
