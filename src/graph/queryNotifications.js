import { gql } from 'react-apollo';

export default gql`
  query notifications {
    notifications {
      admin_notification_id
      msg
      title
      content
      channel_type
      event_id
      event {
        event_id
        what
      }
      type
      link
      send_on
      sent_on
      sent_devices
      sent_users
      created_at
      updated_at
    }
  }
`;
