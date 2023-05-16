import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://stgstdpay.inicis.com/stdjs/INIStdPay.js'; // INIStdPay 라이브러리 로드
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // 컴포넌트가 언마운트될 때, 라이브러리 스크립트를 제거합니다.
    };

  }, []);

  const pay = () => {
    window.INIStdPay.pay('payForm'); // INIStdPay.pay 함수 실행
  };

  return (
    <div className="App">
      <iframe title="INIpay" id="INIpay" name="INIpay" scrolling="no" frameborder="0" width="100%" height="600" />
      <form name="payForm" id="payForm" className="mt-5" target="INIpay">
        <div className="row g-3 justify-content-between">
          <input type="hidden" name="version" value="1.0" />

          <select name="gopaymethod">
            {/* <option value="" inicistranslate="true" inicistranslateindex="75">-- 지불수단 --</option> */}
            <option value="Card" inicistranslate="true" inicistranslateindex="76">신용카드</option>
            <option value="DirectBank" inicistranslate="true" inicistranslateindex="77">계좌이체</option>
            <option value="VBank" inicistranslate="true" inicistranslateindex="78">가상계좌</option>
          </select>
          <input type="text" name="mid" value="INIpayTest" readonly="" />
          <input type="text" name="oid" value="DemoTest_1684044692543" readonly="" />
          <input type="text" name="price" value="1000" readonly="" />
          <input type="text" name="timestamp" value="1684044619847" readonly="" />
          <input type="hidden" name="signature" value="c1274e7d78830cf80d9f213e1998171c9fa0920eb4bcb7c83045c0d78a60cc68" />
          <input type="hidden" name="mKey" value="3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33" />
          <input type="hidden" name="currency" value="WON" />
          <input type="text" name="goodname" value="테스트상품" />
          <input type="text" name="buyername" value="테스터" />
          <input type="text" name="buyertel" value="01012345678" />
          <input type="text" name="buyeremail" value="test@test.com" />
          <input type="hidden" name="returnUrl" value="http://localhost:3000/api/payment" />
          <input type="hidden" name="closeUrl" value="http://localhost:3000/inicis/close.html" />
          <input type="text" name="acceptmethod" value="HPP(1):below1000:va_receipt" />
          <button onClick={pay} className="btn_solid_pri col-6 mx-auto btn_lg">결제 요청</button>
        </div >
      </form >
    </div >
  );
}

// export default App