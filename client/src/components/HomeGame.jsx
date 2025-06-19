import { Col, Container, Row, Button, Card } from "react-bootstrap";

function HomeGame(props) {
  return (
    <>
      <Container className='py-2'>
        <Row className='justify-content-center'>
          <Col xs={12} md={10}>
            <Card
              className='p-2'
              style={{ backgroundColor: "#E5F9FF", borderRadius: "12px" }}
            >
              <Card.Body>
                <Card.Title
                  as='h3'
                  className='text-center mb-2 text-black fw-semibold'
                >
                  🎵 Welcome to Stuff Happens – Music Edition 🎵
                </Card.Title>
                <Card.Text className='fs-6'>
                  <strong>Who Can Play?</strong>
                </Card.Text>
                <ul>
                  <li>
                    <strong>Registered Users:</strong> Play full games with a
                    maximum of 5 rounds and track your game history.
                  </li>
                  <li>
                    <strong>Guests:</strong> Play a quick 1-round demo with 3
                    starting cards, no login required.
                  </li>
                </ul>
                <strong>Goal:</strong> Collect 6 cards by guessing where each
                new horrible situation fits among your cards, based on the
                secret <em>bad luck index</em> (1-100). But beware: 3 wrong
                guesses and the game is over!
                <hr />
                <p>
                  1. You begin with 3 random cards: you can see each card’s
                  image, name, and bad luck index.
                </p>
                <p>
                  2. Each round a new card is shown: you’ll see the image and
                  name, but not the bad luck index. You must guess where this
                  new card fits.
                </p>
                <p>3. You have 30 seconds to make your guess.</p>
                <p>
                  <span className='text-success fw-semibold'>✅ Correct </span>
                  You win the card, and it’s added to your collection (now
                  visible with its index).
                </p>
                <span className='text-danger fw-semibold'>
                  ❌ Wrong or timeout
                </span>
                : You lose the round and the card is discarded.
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className='mt-3 d-flex justify-content-center'>
            <Button
              size='lg'
              style={{
                backgroundColor: "#FFF04C",
                color: "#000",
                border: "none",
                fontWeight: "bold",
              }}
              onClick={props.handleStart}
            >
              Start a new game!
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomeGame;
