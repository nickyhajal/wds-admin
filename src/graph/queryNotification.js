import { gql } from 'react-apollo';

export default gql`
  query notification($admin_notification_id: String) {
    notification(admin_notification_id: $admin_notification_id) {
      admin_notification_id
      msg
      registered
      attendee_type
      test
      device
      title
      content
      channel_type
      channel_id
      type
      link
      send_on
      sent_on
      created_at
      updated_at
    }
  }
`;
