import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Row,
  Card,
} from "react-bootstrap";
import { getCards } from "../API/API";

function Game(props) {
  const [round, setRound] = useState(1);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const initialCards = async () => {
      const c = await getCards();
      setCards(c);
    };
    initialCards();
  }, []);

  return (
    <>
      <Container className=''>
        <Row>
          <Col className='d-flex justify-content-end'>Round {round}</Col>
        </Row>
        <Row>
          <Col xs={7}>card for round</Col>
          <Col xs={5}>
            <ButtonGroup vertical>
              <Button>1</Button>
              <Button>2</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          {cards.map((c) => (
            <Col key={c.id}>
              <Card style={{ width: "18rem" }}>
                <Card.Img variant='top' src={c.image} />
                <Card.Title>{c.index}</Card.Title>
                <Card.Body>
                  <Card.Text>{c.name}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className='justify-content-center'>
          <Col xs={2}>
            <Button
              variant='outline-danger'
              onClick={() => props.setGame(false)}
            >
              Close
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Game;
