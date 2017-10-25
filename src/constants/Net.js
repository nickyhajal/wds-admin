const host = window.location.host;
let url = 'http://wds.nky/api';
if (!host.includes('localhost') && !host.includes('.nky')) {
  if (host === 'staging.worlddomationsummit.com') {
    url = 'https://stagingapi.worlddomationsummit.com/api';
  } else {
    url = 'https://api.worlddomationsummit.com';
  }
}
const Net = {
  url,
  apiUrl: url,
  graphUrl: `${url}/graphql`,
};

export default Net;
