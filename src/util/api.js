import axios from 'axios';

const api = (url, data) => {
  const bits = url.split(' ');
  const req = {
    method: bits[0],
    url: `https://api.worlddominationsummit.com/api/${bits[1]}`,
    withCredentials: true,
  };
  if (req.method === 'post') {
    req.data = data;
  } else {
    req.params = data;
  }
  return axios(req);
};

export default api;
