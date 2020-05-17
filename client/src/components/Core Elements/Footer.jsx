import React from 'react';
import {
  Col,
  Row,
  Container
 } from 'reactstrap';

const Footer = (props) => {

  return (
    <div>
      <footer className="page-footer font-small blue pt-4">
        <Container fluid className="text-center text-md-left">
            <Row>
                <Col className="col-md-6 mt-md-0 mt-3">
                    <h5 className="text-uppercase">Footer Content</h5>
                    <p>Here you can use rows and columns to organize your footer content.</p>
                </Col>
                <hr className="clearfix w-100 d-md-none pb-3"></hr>
                <Col className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">Links</h5>
                    <ul className="list-unstyled">
                    <li>
                        <a href="#!">Link 1</a>
                    </li>
                    <li>
                        <a href="#!">Link 2</a>
                    </li>
                    <li>
                        <a href="#!">Link 3</a>
                    </li>
                    <li>
                        <a href="#!">Link 4</a>
                    </li>
                    </ul>
                </Col>
                <Col className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">Links</h5>
                    <ul className="list-unstyled">
                    <li>
                        <a href="#!">Link 1</a>
                    </li>
                    <li>
                        <a href="#!">Link 2</a>
                    </li>
                    <li>
                        <a href="#!">Link 3</a>
                    </li>
                    <li>
                        <a href="#!">Link 4</a>
                    </li>
                    </ul>
                </Col>
            </Row>
        </Container>
        <div className="footer-copyright text-center py-3">© {new Date().getFullYear()} Copyright:
            <a href="/"> BattleBots.com</a>
        </div>
    </footer>
    </div>
  );
}

export default Footer;