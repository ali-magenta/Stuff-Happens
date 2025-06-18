import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import { getCardById, getGames } from "../API/API";
import dayjs from "dayjs";

function UserProfile(props) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (props.user.id) {
      const fetchGames = async () => {
        const gamesList = await getGames(props.user.id);
        gamesList.forEach((game) => {
          game.cardsCollected = game.rounds.filter(
            (card) => card.outcome === "won"
          ).length;
        });
        setGames(gamesList);
      };
      fetchGames();
    }
  }, [props.user.id]);

  return (
    <>
      <h3>Hello {props.user.email}</h3>
      <h2>History</h2>
      <Container fluid>
        {games
          .filter((game) => game.outcome !== "in progress")
          .map((game) => (
            <Container fluid key={game.id} className='mb-3'>
              <Row
                className={`border-bottom mb-3 ${
                  game.outcome === "won"
                    ? "bg-success-subtle"
                    : "bg-danger-subtle"
                }`}
              >
                <h4>
                  Game {game.outcome}, cards collected: {game.cardsCollected}
                </h4>
              </Row>
              <Row>
                <Col xs={1}>
                  {dayjs(game.gameDate).format("MMMM D, YYYY HH:mm")}
                </Col>
                <Col xs={11}>
                  <table className='table table-striped'>
                    <colgroup>
                      <col style={{ width: "60%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "20%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td>{game.card1}</td>
                        <td>Starting card</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>{game.card2}</td>
                        <td>Starting card</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>{game.card3}</td>
                        <td>Starting card</td>
                        <td></td>
                      </tr>
                      {game.rounds.map((round) => (
                        <tr key={round.id}>
                          <td style={{ display: "none" }}></td>
                          <td>{round.cardName}</td>
                          <td>{round.outcome}</td>
                          <td>Round {round.roundNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Col>
              </Row>
            </Container>
          ))}
      </Container>
    </>
  );
}

export default UserProfile;
