import React from 'react';
import './styles/App.css';
import "./styles/tailwind.output.css"
import MainContainer from './containers/MainContainer'

function App() {
  return (
    <div className="flex flex-col h-screen my-auto items-center bgimg bg-cover"> 
      <p className="text-5xl py-4">EM Work Instructions</p>
      <div className="App">
        <MainContainer/>
      </div>
    </div>
  );
}

export default App;
