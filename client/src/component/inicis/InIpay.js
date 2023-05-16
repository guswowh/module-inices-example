import React from 'react';
import {
  Route,
  Routes,
} from "react-router-dom";
import InIpayClose from './InIpayClose';
import InIpayOpen from './InIpayOpen';

const InIpay = ({ routerPath }) => {
  return (
    <Routes>
      <Route path={routerPath}>
        <Route index element={<InIpayOpen />} />
        <Route path="close" element={<InIpayClose />} />
      </Route>
    </Routes>
  );
};

export default InIpay;