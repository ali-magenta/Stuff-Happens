import { Container, Navbar, Button } from "react-bootstrap";
import { Link } from "react-router";

function NavHeader(props) {
  return (
    <>
      <Navbar bg='primary' expand='lg'>
        <Container fluid>
          <Link to='/' className='navbar-brand'>
            <h2 style={{ color: "white" }}>Stuff Happens!</h2>
          </Link>
          {props.loggedIn ? (
            <Button variant='outline-light' onClick={props.handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to='/login' className='btn btn-outline-light'>
              Login
            </Link>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default NavHeader;
