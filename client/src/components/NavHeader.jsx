import { Container, Navbar, Button, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router";

function NavHeader(props) {
  const navigate = useNavigate();

  const onLogoutClick = async () => {
    await props.handleLogout();
    navigate("/");
  };

  return (
    <>
      <Navbar
        style={{ backgroundColor: "#00CCFF" }}
        className='shadow-sm'
        expand='lg'
      >
        <Container fluid>
          <Navbar.Brand as={Link} to='/' className='text-white'>
            <h2 className='mb-0'>Stuff Happens!</h2>
          </Navbar.Brand>
          <Nav>
            {props.loggedIn && (
              <Nav.Link
                as={Link}
                to='/user/profile'
                className='text-white me-4 fw-bold'
              >
                Profile
              </Nav.Link>
            )}
            {props.loggedIn ? (
              <Button
                className='me-4 fw-bold'
                variant='light'
                onClick={onLogoutClick}
              >
                Logout
              </Button>
            ) : (
              <Link to='/login' className='btn btn-light me-4 fw-bold'>
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
