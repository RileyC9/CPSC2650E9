import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  render() {
    return (
      <>
      <nav>
        <Link to="/" className='navLinks'>Home</Link>
        <Link to="/about" className='navLinks'>About</Link>
        <hr />
      </nav>
      </>
    )
  }
}

export default Navbar;