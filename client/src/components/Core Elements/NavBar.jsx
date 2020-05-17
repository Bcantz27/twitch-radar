import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem
 } from 'reactstrap';
import { NavLink } from 'react-router-dom';

const NavBar = (props) => {

  /*
  const logoStyle = {
    width: "100px",
  };*/
  //<NavbarBrand href="/"><NavLink to="/" exact><img style={logoStyle} src="./images/logo.png"></img></NavLink></NavbarBrand>
  return (
    <div>
      <Navbar color="dark" dark expand="md">
        
        <NavbarToggler />
        <Collapse navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink to="/app">Play</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;