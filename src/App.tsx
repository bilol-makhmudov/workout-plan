import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">Workout Planner</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="create">Create</Nav.Link>
            <Nav.Link as={Link} to="logs">Logs</Nav.Link>
            <Nav.Link as={Link} to="stats">Stats</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default App;
