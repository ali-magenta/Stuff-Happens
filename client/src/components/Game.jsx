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
  const [round, setRound] = useState(false);
  const [roundNum, setRoundNum] = useState(0);
  const [cards, setCards] = useState([]);
  const [cardRound, setCardRound] = useState({});
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState({ message: "", type: "" });
  const [gameResult, setGameResult] = useState("");
  const [lostCards, setLostCards] = useState(0);

  useEffect(() => {
    const initialCards = async () => {
      const c = await getCards();
      setCards(c);
    };
    initialCards();
  }, []);

  useEffect(() => {
    // check if game is over
    if (cards.length === 6) {
      setGameResult("won");
    } else if (lostCards === 3) {
      setGameResult("lost");
    }
  }, [cards, lostCards]);

  const handleCardRound = async () => {
    setRound(true);
    setRoundNum((round) => round + 1);
    const card = await getcardRound();
    setCardRound(card);
  };

  const handleChoice = async (i) => {
    setRound(false);

    const index = await getIndexSelected(cardRound.id);

    // check if round won or lost
    cardRound.index = index;
    const totCards = [...cards, cardRound];
    totCards.sort((a, b) => a.index - b.index);

    if (totCards.indexOf(cardRound) === i) {
      // right positioning
      setResult(true);
      setResultMessage({ message: "Round won!", type: "success" });
      // set cards adding new one for next match
      setCards(totCards);
    } else {
      setResult(false);
      setResultMessage({ message: "Round lost!", type: "danger" });
      setLostCards((lost) => lost + 1);
    }
  };

  return (
    <>
      <Container className=''>
        <Row className='d-flex justify-content-center'>
          {!round && !gameResult && (
            <Button variant='outline-success' onClick={handleCardRound}>
              Start Round {roundNum + 1}
            </Button>
          )}
          {gameResult === "won" && <Row>Game Over! You Won!</Row>}
          {gameResult === "lost" && <Row>Game Over! You Lost!</Row>}
        </Row>
        <Row className='mt-2 mb-3'>
          {roundNum !== 0 && (
            <Col className='d-flex justify-content-end'>Round {roundNum}</Col>
          )}
        </Row>
        <Row className='mb-4'>
          <Col xs={4}>
            {resultMessage && !round && (
              <div className={`alert alert-${resultMessage.type}`}>
                {resultMessage.message}
                {!gameResult && (
                  <div>Start a new round when you are ready.</div>
                )}
              </div>
            )}
          </Col>
          <Col xs={4}>
            {roundNum ? (
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
            {roundNum !== 0 && (
              <ButtonGroup vertical>
                <Button
                  key='0'
                  onClick={() => handleChoice(0)}
                  disabled={!round}
                >
                  <p>Before card 1</p>
                </Button>
                {cards.map((c, index) => (
                  <Button
                    key={c.id}
                    onClick={() => handleChoice(index + 1)}
                    disabled={!round}
                  >
                    {index === cards.length - 1 && (
                      <p>After card {index + 1}</p>
                    )}
                    {index !== cards.length - 1 && (
                      <p>
                        Between card {index + 1} and card {index + 2}
                      </p>
                    )}
                  </Button>
                ))}
              </ButtonGroup>
            )}
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
        <Row>
          cards won: {cards.length - 3} cards lost: {lostCards}
        </Row>
      </Container>
    </>
  );
}

export default Game;
