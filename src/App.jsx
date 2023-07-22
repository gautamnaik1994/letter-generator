import React, { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Import from './pages/Import';
import Navbar from './common/Navbar';
import './styles/index.scss';

class App extends Component {
  render() {
    return (
      <>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/import" element={<Import />} />
          </Routes>
        </main>
      </>
    );
  }
}

export default App;
