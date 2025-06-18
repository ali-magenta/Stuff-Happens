import { use, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Game from "./Game";
import { Link } from "react-router";
import { useEffect } from "react";
import dayjs from "dayjs";
import { createGame, getCards } from "../API/API";
import { useNavigate } from "react-router";

function HomeGame(props) {
  const navigate = useNavigate();

  const handleButton = async () => {
    const c = await getCards();
    props.setCards(c);

    let gameId = -1;

    // save game if logged
    if (props.loggedIn) {
      const [card1, card2, card3] = [...c];
      const currGame = {
        outcome: "in progress",
        card1: card1?.id,
        card2: card2?.id,
        card3: card3?.id,
        gameDate: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      };
      const game = await createGame(currGame, props.user.id);
      gameId = game.gameId;
    }
    // if not logged, set gameId to -1
    if (!props.loggedIn) {
      gameId = -1;
    }

    props.setGameId(gameId);
    props.setGame(true);
    navigate("/game/" + gameId);
  };

  return (
    <>
      <Container fluid>
        <Row className='d-flex justify-content-center mt-5'>
          <Col xs={10} className='bg-info-subtle'>
            <p></p>
            <p>
              Welcome to Stuff Happens (Music Edition), the game where bad luck
              is just a card away!
            </p>
            <p>Who Can Play?</p>
            <p>
              - Registered Users: Play full games with a maximum of 6 rounds and
              track your game history.
            </p>
            <p>
              - Guests: Play a quick 1-round demo with 3 starting cards, no
              login required.{" "}
            </p>
            <p>
              Try to collect a total of 6 cards by correctly guessing the bad
              luck index order of new horrible situations. But beware: 3 wrong
              guesses and the game is over! Each card represents a horrible
              situation and has:
            </p>
            <p>- A name </p>
            <p>- A representative image</p>
            <p>- A bad luck index from 1 to 100 (unique per card)</p>
            <p>
              1. You begin with 3 random cards, already sorted by their bad luck
              index. You can see each card’s image, name, and bad luck index.
            </p>
            <p>
              2. Each Round a new card is shown — you’ll see the image and name,
              but not the bad luck index. You must guess where this new card
              fits among your existing cards.
            </p>
            <p>
              3. You have 30 seconds to make your guess. No answer in time =
              automatic loss for the round.
            </p>
            <p>
              4. ✅ Correct Guess: You win the card, and it’s added to your
              collection (now visible with its index).
            </p>
            <p>
              ❌ Wrong Guess: You lose the round. The card is discarded and
              never shown again in this game.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className='mt-4 d-flex justify-content-center'>
            <Button variant='outline-success' onClick={handleButton}>
              Start a new game!
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomeGame;
