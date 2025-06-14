import { useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Game from "./Game";

function HomeGame(props) {
  const [game, setGame] = useState(false);

  return (
    <>
      <Container fluid>
        <Row className='bg-warning-subtle'>
          <p>Log in to play the full version!</p>
        </Row>
        <Row className='mt-5'>
          <Col xs={9} className='d-flex justify-content-center'>
            {!game && (
              <Button variant='outline-success' onClick={() => setGame(true)}>
                Start a new game!
              </Button>
            )}
            {game && <Game setGame={setGame}></Game>}
          </Col>
          <Col xs={3} className='bg-info-subtle'>
            game rules
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomeGame;
