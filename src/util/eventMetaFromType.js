const eventNameFromEventType = type => {
  const event = {
    article: 'a',
    showWho: true,
    showPrice: false,
    showMaxFree: false,
    showMaxAttendees: false,
    showForType: true,
    showHosts: true,
  };
  switch (type) {
    case 'academy':
      event.typeStr = 'Academy';
      event.showMaxFree = false;
      event.article = 'an';
      event.showMaxAttendees = true;
      event.showMaxFree = true;
      event.showForType = false;
      break;
    case 'meetup':
      event.typeStr = 'Meetup';
      event.showMaxAttendees = true;
      break;
    case 'program':
      event.typeStr = 'Program Event';
      event.showWho = false;
      event.showHosts = false;
      break;
    case 'activity':
      event.typeStr = 'Activity';
      event.article = 'an';
      event.showMaxAttendees = true;
      event.showPrice = true;
      break;
    case 'expedition':
      event.typeStr = 'Expedition';
      event.article = 'an';
      event.showMaxAttendees = true;
      event.showPrice = true;
      break;
    case 'registration':
      event.typeStr = 'Registration Session';
      event.showWho = false;
      event.showHosts = false;
      break;
    case 'excursion':
      event.typeStr = 'Excursion';
      event.article = 'an';
      event.showMaxAttendees = true;
      event.showPrice = true;
      break;
    default:
      event.typeStr = 'Event';
      event.article = 'an';
      break;
  }
  return event;
};

export default eventNameFromEventType;
