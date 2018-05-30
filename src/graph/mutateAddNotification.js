import { gql } from 'react-apollo';

export default gql`
  mutation notificationAdd(
    $test: String!
    $device: String!
    $registered: String!
    $attendee_type: String!
    $msg: String!
    $title: String!
    $content: String!
    $channel_type: String!
    $channel_id: String!
    $send_on: String
  ) {
    notificationAdd(
      test: $test
      device: $device
      registered: $registered
      attendee_type: $attendee_type
      msg: $msg
      title: $title
      content: $content
      channel_type: $channel_type
      channel_id: $channel_id
      send_on: $send_on
    ) {
      admin_notification_id
      msg
      title
      content
      channel_type
      channel_id
      link
      send_on
    }
  }
`;
