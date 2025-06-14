import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Row,
  Card,
} from "react-bootstrap";
import { getcardRound, getCards, getIndexSelected } from "../API/API";

const URLImage = "http://localhost:3001/";

function Game(props) {
  const [round, setRound] = useState(0);
  const [cards, setCards] = useState([]);
  const [cardRound, setCardRound] = useState({});
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState({ message: "", type: "" });

  useEffect(() => {
    const initialCards = async () => {
      const c = await getCards();
      setCards(c);
    };
    initialCards();
  }, []);

  const handleCardRound = async () => {
    setRound((round) => round + 1);
    const card = await getcardRound();
    setCardRound(card);
  };

  const handleChoice = async (i) => {
    const index = await getIndexSelected(cardRound.id);

    // check if round won or lost
    cardRound.index = index;
    const totCards = [...cards, cardRound];
    totCards.sort((a, b) => a.index - b.index);

    if (totCards.indexOf(cardRound) === i) {
      // right positioning
      setResult(true);
      setResultMessage({ message: "Round won!", type: "success" });
      setCards((cards) => [...cards, cardRound]);
    } else {
      setResult(false);
      setResultMessage({ message: "Round lost!", type: "danger" });
    }
  };

  return (
    <>
      <Container className=''>
        <Row className='d-flex justify-content-center'>
          <Button variant='outline-success' onClick={handleCardRound}>
            Start Round {round + 1}
          </Button>
        </Row>
        <Row className='mt-2'>
          <Col className='d-flex justify-content-end'>Round {round}</Col>
        </Row>
        <Row className='mb-4'>
          <Col xs={1}>
            {resultMessage && (
              <div className={`alert alert-${resultMessage.type}`}>
                {resultMessage.message}
              </div>
            )}
          </Col>
          <Col xs={7}>
            {round ? (
              <Card style={{ width: "18rem", height: "20rem" }}>
                <Card.Img
                  variant='top'
                  src={URLImage + cardRound.image}
                  style={{ height: "12rem" }}
                />
                <Card.Body>
                  <Card.Text>{cardRound.name}</Card.Text>
                </Card.Body>
              </Card>
            ) : (
              <></>
            )}
          </Col>
          <Col xs={4}>
            <ButtonGroup vertical>
              <Button key='0' onClick={() => handleChoice(0)}>
                <p>Before card 1</p>
              </Button>
              {cards.map((c, index) => (
                <Button key={c.id} onClick={() => handleChoice(index + 1)}>
                  {index === cards.length - 1 && <p>After card {index + 1}</p>}
                  {index !== cards.length - 1 && (
                    <p>
                      Between card {index + 1} and card {index + 2}
                    </p>
                  )}
                </Button>
              ))}
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          {cards.map((c) => (
            <Col key={c.id} className='mb-3'>
              <Card style={{ width: "18rem", height: "20rem" }}>
                <Card.Img
                  variant='top'
                  src={URLImage + c.image}
                  style={{ height: "12rem" }}
                />
                <Card.Title className='mt-3 d-flex justify-content-center'>
                  {c.index}
                </Card.Title>
                <Card.Body>
                  <Card.Text>{c.name}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className='justify-content-center mt-5'>
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
