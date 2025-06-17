import { Container, Navbar, Button, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router";

function NavHeader(props) {
  const navigate = useNavigate();

  const onLogoutClick = async () => {
    await props.handleLogout();
    // redirect if on user profile page
    if (props.checkProfile) {
      navigate("/");
      props.setCheckProfile(false);
    }
  };

  return (
    <>
      <Navbar bg='primary' expand='lg'>
        <Container fluid>
          <Link to='/' className='navbar-brand'>
            <h2 style={{ color: "white" }}>Stuff Happens!</h2>
          </Link>
          <Nav>
            {props.loggedIn && (
              <Nav.Link
                href='/profile'
                style={{ color: "white" }}
                className='me-4'
              >
                Profile
              </Nav.Link>
            )}
            {props.loggedIn ? (
              <Button
                className='me-4'
                variant='outline-light'
                onClick={onLogoutClick}
              >
                Logout
              </Button>
            ) : (
              <Link to='/login' className='btn btn-outline-light me-4'>
                Login
              </Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavHeader;
