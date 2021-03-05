import React from 'react';
import logo from './logo.svg';
import './App.css';
import "./styles/tailwind.output.css"
import LoginContainer from './LoginContainer'

function App() {
  return (
    <div className="flex flex-col h-screen my-auto items-center bgimg bg-cover"> 
      <p className="text-5xl py-4">EM Work Instructions</p>
      <div className="App">
        <LoginContainer/>
      </div>
    </div>
  );
}

export default App;
