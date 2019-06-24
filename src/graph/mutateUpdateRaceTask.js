import { gql } from 'react-apollo';

export default gql`
  mutation racetaskUpdate(
    $racetask_id: String!
    $section: String!
    $type: String!
    $task: String!
    $descr: String
    $points: String!
    $note: String
    $active: String
    $address: String
    $attendee_max: String
    $global_max: String
  ) {
    racetaskUpdate(
      racetask_id: $racetask_id
      section: $section
      type: $type
      task: $task
      descr: $descr
      points: $points
      note: $note
      active: $active
      address: $address
      attendee_max: $attendee_max
      global_max: $global_max
    ) {
      racetask_id
      section
      type
      task
      slug
      descr
      points
      note
      active
      address
      geopoint
      attendee_max
      global_max
      submissions
      year
    }
  }
`;
