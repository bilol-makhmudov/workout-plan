import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md" sticky="top" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">Workout Planner</Navbar.Brand>
          <Navbar.Toggle aria-controls="nav-collapse" />
          <Navbar.Collapse id="nav-collapse">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="create">Create</Nav.Link>
              <Nav.Link as={Link} to="logs">Logs</Nav.Link>
              <Nav.Link as={Link} to="stats">Stats</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default App;
