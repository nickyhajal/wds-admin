import provinces from 'provinces';

const out = {};
provinces.forEach(province => {
  if (out[province.country] === undefined) {
    out[province.country] = [];
  }
  out[province.country].push(province);
});

export default out;
