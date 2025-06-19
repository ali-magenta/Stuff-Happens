import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Row,
  Card,
} from "react-bootstrap";
import {
  getcardRound,
  getIndexSelected,
  addRound,
  saveResult,
} from "../API/API";
import { useParams } from "react-router";

const URLImage = "http://localhost:3001/";

function Game(props) {
  const [round, setRound] = useState(false);
  const [roundNum, setRoundNum] = useState(0);
  const [cardRound, setCardRound] = useState({});
  //const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState({ message: "", type: "" });
  const [gameResult, setGameResult] = useState("");
  const [lostCards, setLostCards] = useState(0);
  const [wonCards, setWonCards] = useState([]);

  // handle timer
  const [timeLeft, setTimeLeft] = useState(30);

  const { gameId } = useParams();

  // check if game is over
  useEffect(() => {
    if (props.loggedIn) {
      if (props.cards.length === 6) {
        setGameResult("won");
        props.setGame(false);
      } else if (lostCards === 3) {
        setGameResult("lost");
        props.setGame(false);
      }
    } else {
      if (props.cards.length === 4) {
        setGameResult("won");
        props.setGame(false);
      } else if (lostCards === 1) {
        setGameResult("lost");
        props.setGame(false);
      }
    }
  }, [props.cards, lostCards]);

  // manage timer
  useEffect(() => {
    if (!round) return;

    if (timeLeft === 0) {
      handleChoice(-1);
    }

    const timer = setTimeout(
      () => setTimeLeft((timeLeft) => timeLeft - 1),
      1000
    );
    return () => clearTimeout(timer);
  }, [timeLeft, round]);

  // set beginning of round (for restart)
  useEffect(() => {
    if (props.game) {
      setRound(false);
      setRoundNum(0);
      //setResult(false);
      setGameResult("");
      setLostCards(0);
      setResultMessage({ message: "", type: "" });
      setCardRound({});
      setWonCards([]);
    }
  }, [props.game]);

  // save game result when game ends
  useEffect(() => {
    if (gameResult && props.loggedIn && !props.game) {
      const saveGameResult = async () => {
        const outcome = gameResult;
        await saveResult(gameId, outcome);
      };
      saveGameResult();
    }
  }, [gameResult, props.game]);

  // handle beginning of a round
  const handleCardRound = async () => {
    setTimeLeft(30);
    setRound(true);
    setRoundNum((round) => round + 1);
    const card = await getcardRound();
    setCardRound(card);
  };

  // get index of this round, check if round won or lost, update cards won and lost
  const handleChoice = async (i) => {
    let outcome;
    setRound(false);

    const index = await getIndexSelected(cardRound.id);

    // check if round won or lost
    const newCard = cardRound;
    newCard.index = index;
    const totCards = [...props.cards, newCard];
    totCards.sort((a, b) => a.index - b.index);

    if (totCards.indexOf(newCard) === i) {
      // right positioning
      outcome = "won";
      setResultMessage({ message: "Round won!", type: "success" });
      // set cards adding new one for next match
      props.setCards(totCards);
      setWonCards((won) => [...won, newCard]);
    } else {
      outcome = "lost";
      setResultMessage({ message: "Round lost!", type: "danger" });
      setLostCards((lost) => lost + 1);
    }

    const saveRound = async () => {
      const currRound = {
        outcome: outcome,
        roundNumber: roundNum,
        cardId: cardRound.id,
      };
      const r = addRound(currRound, gameId);
    };
    if (props.loggedIn) await saveRound();
  };

  return (
    <>
      <Container className='py-4'>
        <Row className='d-flex justify-content-center mb-2'>
          {!round && !gameResult && (
            <Button variant='dark' size='lg' onClick={handleCardRound}>
              Start Round {roundNum + 1}
            </Button>
          )}
          {gameResult === "won" && (
            <h4 className='text-center my-3'>Game Over! You Won!</h4>
          )}
          {gameResult === "lost" && (
            <h4 className='text-center my-3'>Game Over! You Lost!</h4>
          )}
          {gameResult && (
            <Button variant='dark' size='lg' onClick={props.handleRestart}>
              Start a new game
            </Button>
          )}
        </Row>
        <Row className='mt-1 mb-3'>
          {roundNum !== 0 && (
            <>
              <Col xs={6} className='d-flex justify-content-start'>
                Time left: {timeLeft}
              </Col>
              <Col xs={6} className='d-flex justify-content-end'>
                Round {roundNum}
              </Col>
            </>
          )}
        </Row>
        <Row>
          <Col xs={4}>
            {resultMessage && !round && (
              <div className={`alert alert-${resultMessage.type}`}>
                {resultMessage.message}
                {!gameResult && <> Start a new round when you are ready.</>}
              </div>
            )}
          </Col>
        </Row>
        <Row className='mb-4'>
          <Col xs={4}>
            <Container>
              <Row className='mb-4'>
                <Col className='d-flex justify-content-start'>
                  {roundNum ? (
                    <Card style={{ width: "16rem", height: "20rem" }}>
                      {cardRound.image && (
                        <Card.Img
                          variant='top'
                          src={URLImage + cardRound.image}
                          style={{
                            height: "12rem",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Card.Body>
                        <Card.Text>{cardRound.name}</Card.Text>
                      </Card.Body>
                    </Card>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  {roundNum !== 0 && (
                    <ButtonGroup vertical>
                      <Button
                        key='0'
                        onClick={() => handleChoice(0)}
                        disabled={!round}
                        variant='dark'
                      >
                        <p>Before card 1</p>
                      </Button>
                      {props.cards.map((c, index) => (
                        <Button
                          key={c.id}
                          onClick={() => handleChoice(index + 1)}
                          variant='dark'
                          disabled={!round}
                        >
                          {index === props.cards.length - 1 && (
                            <p>After card {index + 1}</p>
                          )}
                          {index !== props.cards.length - 1 && (
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
            </Container>
          </Col>
          <Col xs={8}>
            {!props.game && gameResult ? (
              <>
                <Row className='mb-3'>
                  <strong>Here are the cards you won during the game:</strong>
                </Row>
                <Row>
                  {wonCards.map((c) => (
                    <Col key={c.id} className='mb-3'>
                      <Card style={{ width: "16rem", height: "20rem" }}>
                        <Card.Img
                          variant='top'
                          src={URLImage + c.image}
                          style={{ height: "12rem", objectFit: "cover" }}
                        />
                        <Card.Title className='mt-3 mb-2 d-flex justify-content-center'>
                          {c.index}
                        </Card.Title>
                        <Card.Body className='pt-0'>
                          <Card.Text>{c.name}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <Row>
                {props.cards.map((c) => (
                  <Col key={c.id} className='mb-3'>
                    <Card style={{ width: "16rem", height: "20rem" }}>
                      <Card.Img
                        variant='top'
                        src={URLImage + c.image}
                        style={{ height: "12rem", objectFit: "cover" }}
                      />
                      <Card.Title className='mt-3 mb-2 d-flex justify-content-center'>
                        {c.index}
                      </Card.Title>
                      <Card.Body className='pt-0'>
                        <Card.Text>{c.name}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
        <Row className='text-center text-muted mt-3'>
          <p>
            Cards won: <strong>{props.cards.length - 3}</strong> | Cards lost:{" "}
            <strong>{lostCards}</strong>
          </p>
        </Row>
      </Container>
    </>
  );
}

export default Game;
