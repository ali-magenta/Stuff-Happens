import { Row, Alert, Container } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";

function DefaultLayout(props) {
  return (
    <>
      <NavHeader
        handleLogout={props.handleLogout}
        loggedIn={props.loggedIn}
        checkProfile={props.checkProfile}
        setCheckProfile={props.setCheckProfile}
      />
      <Container fluid className='mt-3 px-4 '>
        {!props.loggedIn && (
          <Row
            className='py-3 px-3 mb-4 rounded'
            style={{ backgroundColor: "#00CCFF" }}
          >
            <p className='mb-0 text-white fw-semibold'>
              Log in to play the full version!
            </p>
          </Row>
        )}
        {props.message && (
          <Container className='mt-3'>
            <Alert
              variant={props.message.type}
              onClose={() => props.setMessage("")}
              dismissible
            >
              {props.message.msg}
            </Alert>
          </Container>
        )}
        <Outlet />
      </Container>
    </>
  );
}

export default DefaultLayout;
