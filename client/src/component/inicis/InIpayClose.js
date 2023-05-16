import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InIpayClose = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (window.parent.INIStdPay.vIframeName) {
      window.parent.INIStdPay.viewOff();
    }
    navigate("/inipay")
  }, [])

  return (
    <div>
      closeUrl
    </div>
  );
};

export default InIpayClose;