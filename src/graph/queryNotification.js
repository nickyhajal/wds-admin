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
      event_id
      event {
        event_id
        what
      }
      type
      sent_devices
      sent_users
      link
      send_on
      sent_on
      created_at
      updated_at
    }
  }
`;
