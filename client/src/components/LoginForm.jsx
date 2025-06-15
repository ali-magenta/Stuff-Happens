import { useActionState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
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
    <Row className='align-items-center' style={{ minHeight: "60vh" }}>
      <Col xs={3} />
      <Col xs={6} className='justify-content-center'>
        <Form action={formAction}>
          <Form.Group controlId='email' className='mb-4'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' name='email' required />
          </Form.Group>

          <Form.Group controlId='password' className='mb-4'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              required
            ></Form.Control>
          </Form.Group>
          {state.error && <p className='text-danger'>{state.error}</p>}
          <Link className='btn btn-secondary' to={"/"}>
            Cancel
          </Link>
          <Button className='ms-3' type='submit'>
            Login
          </Button>
        </Form>
      </Col>
      <Col xs={3} />
    </Row>
  );
}

export default LoginForm;
