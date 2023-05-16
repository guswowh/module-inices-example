import logo from './logo.svg';
import './App.css';
import React from 'react';
import InIpay from './component/inicis/InIpay';

function App() {

  return (
    <div className="App">
      <InIpay routerPath={'inicis'} />
    </div>
  );
}

export default App;