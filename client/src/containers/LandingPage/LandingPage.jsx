import React, { Component } from 'react';
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
