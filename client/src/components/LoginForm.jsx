import { useActionState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router";

function LoginForm(props) {
  const [state, formAction] = useActionState(submitCredentials, {
    email: "",
    password: "",
  });

  async function submitCredentials(prevData, formData) {
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      await props.handleLogin(credentials);
      return { success: true };
    } catch (error) {
      return { error: "Invalid credentials" };
    }
  }

  return (
    <Row
      className='align-items-center justify-content-center'
      style={{ minHeight: "60vh" }}
    >
      <Col xs={12} md={6}>
        <Form action={formAction}>
          <h3 className='mb-4 text-center'>Login</h3>
          <Form.Group controlId='email' className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' name='email' required />
          </Form.Group>

          <Form.Group controlId='password' className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              required
            ></Form.Control>
          </Form.Group>
          {state.error && <div className='text-danger mb-3'>{state.error}</div>}
          <Link className='btn btn-secondary' to='/'>
            Cancel
          </Link>
          <Button className='ms-3' type='submit'>
            Login
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default LoginForm;
