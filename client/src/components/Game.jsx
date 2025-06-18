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
  getCards,
  getIndexSelected,
  addRound,
  saveResult,
  createGame,
} from "../API/API";
import { Link, useParams } from "react-router";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

const URLImage = "http://localhost:3001/";

function Game(props) {
  const [round, setRound] = useState(false);
  const [roundNum, setRoundNum] = useState(0);
  const [cardRound, setCardRound] = useState({});
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState({ message: "", type: "" });
  const [gameResult, setGameResult] = useState("");
  const [lostCards, setLostCards] = useState(0);

  // handle timer
  const [timeLeft, setTimeLeft] = useState(30);

  const { gameId } = useParams();
  const navigate = useNavigate();

  // check if game is over (logged user)
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
      setResult(false);
      setGameResult("");
      setLostCards(0);
      setResultMessage({ message: "", type: "" });
      setCardRound({});
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
    setRound(true);
    setRoundNum((round) => round + 1);
    const card = await getcardRound();
    setCardRound(card);
    setTimeLeft(30);
  };

  // get index of this round, check if round won or lost, update cards won and lost
  const handleChoice = async (i) => {
    let outcome;
    setRound(false);

    const index = await getIndexSelected(cardRound.id);

    // check if round won or lost
    cardRound.index = index;
    const totCards = [...props.cards, cardRound];
    totCards.sort((a, b) => a.index - b.index);

    if (totCards.indexOf(cardRound) === i) {
      // right positioning
      outcome = "won";
      setResultMessage({ message: "Round won!", type: "success" });
      // set cards adding new one for next match
      props.setCards(totCards);
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

  const handleRestart = async () => {
    props.setGame(true);
    const c = await getCards();
    props.setCards(c);

    let newGameId = -1;

    if (props.loggedIn) {
      const [card1, card2, card3] = [...c];
      const currGame = {
        outcome: "N/A",
        card1: card1?.id,
        card2: card2?.id,
        card3: card3?.id,
        gameDate: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      };
      const game = await createGame(currGame, props.user.id);
      newGameId = game.gameId;
    }

    navigate("/game/" + newGameId);
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
          {gameResult && (
            <Button variant='outline-success' onClick={handleRestart}>
              Start a new game!
            </Button>
          )}
        </Row>
        <Row className='mt-2 mb-3'>
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
                      <Card.Img
                        variant='top'
                        src={URLImage + cardRound.image}
                        style={{
                          height: "12rem",
                          objectFit: "cover",
                        }}
                      />
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
                      >
                        <p>Before card 1</p>
                      </Button>
                      {props.cards.map((c, index) => (
                        <Button
                          key={c.id}
                          onClick={() => handleChoice(index + 1)}
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
          </Col>
        </Row>
        <Row>
          cards won: {props.cards.length - 3} cards lost: {lostCards}
        </Row>
      </Container>
    </>
  );
}

export default Game;
