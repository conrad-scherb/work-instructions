import React from 'react';
import './App.css';
import "./styles/tailwind.output.css"
import MainContainer from './MainContainer'
import RoleSelector from './RoleSelector';

function App() {
  return (
    <div className="flex flex-col h-screen my-auto items-center bgimg bg-cover"> 
      <p className="text-5xl py-4">EM Work Instructions</p>
      <div className="App">
        <MainContainer/>
        <RoleSelector/>
      </div>
    </div>
  );
}

export default App;
