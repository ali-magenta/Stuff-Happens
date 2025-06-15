import { Row, Alert, Container } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";

function DefaultLayout(props) {
  return (
    <>
      <NavHeader handleLogout={props.handleLogout} loggedIn={props.loggedIn} />
      {props.message && (
        <Row>
          <Alert
            variant={props.message.type}
            onClose={() => props.setMessage("")}
            dismissible
          >
            {props.message.msg}
          </Alert>
        </Row>
      )}
      <Container fluid className='mt-3'>
        <Outlet />
      </Container>
    </>
  );
}

export default DefaultLayout;
