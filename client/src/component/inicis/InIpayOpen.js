import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";

const InIpayOpen = () => {

  const INIpayIframe = useRef()
  // const timestamp = 1684044619847;
  const timestamp = new Date().valueOf();
  const price = '1000'
  const mKey = 'SU5JTElURV9UUklQTEVERVNfS0VZU1RS'

  const payFormList = {
    version: '1.0',
    gopaymethod: 'Card',
    mid: 'INIpayTest',
    oid: `DemoTest_${timestamp}`,
    price: price,
    timestamp: timestamp,
    signature: '',
    mKey: '',
    currency: 'WON',
    goodname: '테스트상품',
    buyername: '테스터',
    buyertel: '01012345678',
    buyeremail: 'test@test.com',
    returnUrl: 'http://localhost:3000/inicis',
    closeUrl: 'http://localhost:3000/inicis/close',
    acceptmethod: 'HPP(1):below1000:va_receipt',
  }

  useEffect(() => {
    // INIStdPay 라이브러리를 로드하기 위해 스크립트 엘리먼트를 생성합니다.
    const script = document.createElement('script');
    const iframe = INIpayIframe.current
    // INIStdPay 라이브러리를 로드합니다.
    script.src = 'https://stgstdpay.inicis.com/stdjs/INIStdPay.js';
    script.async = true;
    iframe.appendChild(script);
  }, []);

  const [paymentInfo, setPaymentInfo] = useState(null);

  // 결제 인증결과를 요청 -
  useEffect(() => {
    axios.get('http://localhost:3000/inicis/session-data')
      .then(response => {
        setPaymentInfo(response.data);
      })
      .catch(error => {
        console.error('Error retrieving session data:', error);
      });
  }, []);

  if (paymentInfo) {
    // 인증결과가 존재하는 경우 원하는 동작을 수행합니다.
    console.log('Session data:', paymentInfo);
  }
  // -

  const userPayHandler = async () => {
    const iframe = INIpayIframe.current

    // 서버에서 함호화된 키 데이터를 가져옵니다.
    const keyData = await axios.post('/inicis/encryptedKeys', {
      oid: `DemoTest_${timestamp}`,
      price: price,
      timestamp: timestamp,
      mKey: mKey
    })

    // payFormList 객체에 암호화된 키 할당
    payFormList.signature = keyData.data.signatureHash
    payFormList.mKey = keyData.data.mKeyHash
    console.log(keyData.data)

    // 동적으로 폼을 생성합니다.
    const form = document.createElement('form')
    form.id = 'payForm'
    form.name = 'payForm'
    form.target = 'InIpay'

    // 폼에 입력 필드를 추가합니다.
    Object.entries(payFormList).forEach(([key, value]) => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = key
      input.value = value
      form.appendChild(input)
    })

    iframe.appendChild(form)

    window.INIStdPay.pay('payForm'); // INIStdPay.pay 함수를 실행합니다.
  }

  return (
    <div>
      {/*
        INIpay를 로드하기 위한 iframe 엘리먼트.
        iframe 엘리먼트의 id와 form 엘리먼트의 id가 동일하여야 동작합니다.
      */}
      <iframe title="INIpay" id="INIpay" name="INIpay" ref={INIpayIframe} style={{ display: "none" }} />
      <button onClick={userPayHandler} > 결제 요청</ button>
    </div>
  );
};

export default InIpayOpen;