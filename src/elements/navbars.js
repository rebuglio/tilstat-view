import {Col, Container, Nav, Navbar, NavDropdown, Row} from 'react-bootstrap';
import {Link} from "react-router-dom";
import React from "react";
import stat_icon from '../img/stat_icon.png'

export const TopNavbar = () => {
  return <Navbar bg="light" expand="lg"  sticky="top">
    <Container>
      <Navbar.Brand href="#home">TilStat - <small><i>Unofficial PoliTo stats</i></small></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Link className="nav-link" to="/tilstat">TIL - Test in Laib</Link>
          <Link className="nav-link" to="/tilstat/hof">Hall of Fame</Link>
          {/*<Nav.Link href="#link">Bandi</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>*/}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
}

export const TitleBox = ({title, subtitle}) => {
  return <Row className="little-space">
    <Col xs={4} md={1}>
      <img style={{width:'100px'}} src={stat_icon} />
    </Col>
    <Col style={{alignItems:'center', display:'flex'}}>
      <div style={{paddingLeft: '10px'}}>
        {subtitle ? <>
          <h1 style={{marginBottom:'-1px'}}>{title}</h1>
          <i>{subtitle}</i>
        </> :
        <h1>{title}</h1>}
      </div>
    </Col>

  </Row>
}
