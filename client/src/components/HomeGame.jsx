import { useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Game from "./Game";
import { Link } from "react-router";

function HomeGame(props) {
  return (
    <>
      <Container fluid>
        <Row className='d-flex justify-content-center'>
          <Col xs={10} className='bg-info-subtle'>
            Remember that after clicking on "Start the game!" the first round
            will start. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aliquam diam turpis, porta euismod maximus eu, malesuada quis
            libero. Nunc suscipit malesuada ligula, vel fermentum nunc feugiat
            vitae. In eros felis, condimentum ultricies eros at, fermentum
            luctus enim. Mauris volutpat, nisl vel vehicula laoreet, leo augue
            iaculis enim, porta volutpat augue nisi sed sem. Integer vulputate
            urna vitae diam elementum, sed tempus risus faucibus. Nullam tempus
            massa a ligula iaculis, non rhoncus mi pharetra. Cras auctor
            ultrices arcu, id commodo augue fringilla vitae. Donec at vulputate
            turpis, vel efficitur augue. Praesent laoreet arcu nisi, accumsan
            aliquam odio faucibus ut. Aliquam viverra sem ut velit tincidunt, a
            hendrerit nisi molestie. Vestibulum efficitur porta tortor, sed
            laoreet lacus hendrerit at. Cras consequat, quam eget tempor congue,
            erat nunc accumsan sem, a lacinia tellus leo et lectus. Vivamus
            vitae est ac mauris varius volutpat. Praesent iaculis vel diam sed
            interdum. Suspendisse potenti. Nunc rhoncus sit amet dui ut viverra.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Praesent vel justo a ligula facilisis
            euismod. Curabitur eget mattis nulla. In sit amet dui a ante rutrum
            maximus. Praesent nisi sapien, egestas consequat lorem id, bibendum
            convallis arcu. Integer quam odio, placerat vitae aliquam
            ullamcorper, sagittis et ante. Pellentesque sodales aliquam enim
            elementum blandit. Nunc sit amet semper purus, non ultricies nibh.
            Ut id mollis felis, id condimentum quam. Vivamus tempus tristique
            nunc, nec luctus est vulputate ultricies. Vivamus porta mollis
            mauris a dictum. Nunc eu fermentum quam. Nulla sit amet egestas
            orci. Morbi ut eros egestas, lacinia dui sed, hendrerit turpis. Duis
            rutrum laoreet ligula. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Proin quis est vel orci aliquam dapibus id id
            massa.
          </Col>
        </Row>
        <Row>
          <Col className='mt-5 d-flex justify-content-center'>
            <Link to={"/game"}>
              <Button
                variant='outline-success'
                onClick={() => props.setGame(true)}
              >
                Start a new game!
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomeGame;
