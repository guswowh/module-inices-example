const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const { JSDOM } = require('jsdom');
const { time } = require('console');
const axios = require('axios');

// sha256으로 암호화하는 함수
function makeHash(msg) {
  const hash = crypto.createHash('sha256');
  hash.update(msg);

  const md = hash.digest();
  const mdStr = md.toString('hex');

  return mdStr;
}

// express-session 사용이유 -
/*
  보안상의 이유로 쿼리스트링 방식이 아닌 세션 방식으로
  컴포넌트에 인증결과 데이터를 전달하기 위하여 express-session을 사용
*/
router.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
// -

// 컴포넌트에서 INIStdPay.pay()로 요청되는 API
router.post('/', (req, res) => {

  // inicis 인증결과 -
  const { authUrl, mid, authToken, charset } = req.body;
  const timestamp = new Date().valueOf();
  const signatureMsg = `authToken=${authToken}&timestamp=${timestamp}`;
  const signature = makeHash(signatureMsg);
  const format = { format: "JSON" };
  // -

  const contentType = 'application/x-www-form-urlencoded';

  const data = {
    mid,
    authToken,
    timestamp,
    signature,
    charset,
    ...format
  };

  const config = {
    headers: {
      'Content-Type': contentType
    }
  };

  // PG사 인증요청 -
  axios.post(authUrl, data, config)
    .then(PGRes => {
      // PG사 인증결과를 세션에 저장후 해당 url로 리다이렉트
      console.log('성공', PGRes.data);
      req.session.inicisMessage = { data: PGRes.data };
      res.redirect('/inicis');
    })
    .catch(error => {
      // inicis 인증결과를 세션에 저장후 해당 url로 리다이렉트
      console.error('에러', error);
      req.session.inicisMessage = { data: req.body };
      res.redirect('/inicis');
    });
  // -
});

// 결제 인증결과를 세션에서 찾아 응답하는 API
router.get('/session-data', (req, res) => {
  let sessionData = ""
  if (req.session.inicisMessage) {
    sessionData = req.session.inicisMessage;
  }

  res.json(sessionData);
});

// 컴포넌트에서 inicis 결제요청 요청에 필요한 키를 암호화 하여 전달하는 API
router.post('/encryptedKeys', (req, res) => {
  const { oid, price, timestamp, mKey } = req.body
  let signatureMsg = `oid=${oid}&price=${price}&timestamp=${timestamp}`;

  const signatureHash = makeHash(signatureMsg)
  const mKeyHash = makeHash(mKey)

  return res.status(200).json({
    myMessage: 'signature key',
    signatureHash,
    mKeyHash
  })
})

module.exports = router;