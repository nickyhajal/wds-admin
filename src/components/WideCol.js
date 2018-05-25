import React from 'react';
export default ({ children }) => (
  <div
    className="react-tabs__tab-panel react-tabs__tab-panel--selected"
    style={{ width: '100%', paddingTop: '13px' }}
  >
    {children}
  </div>
);
