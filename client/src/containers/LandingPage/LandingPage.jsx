import React, { Component } from 'react';
import { Jumbotron, Container, Button, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Row, Col } from 'reactstrap';
import ClipStream from "../../components/ClipStream/ClipStream";

class LandingPage extends Component {

    render() {
        const containterStyle = {
            width: '100%',
            height: '95%'
        };

        return (
            
            <div style={containterStyle}>
                <ClipStream></ClipStream>
            </div>
        );
    }

}

export default LandingPage;
