import React, { Component } from 'react';
import './ClipStream.css';
import "../../../node_modules/video-react/dist/video-react.css"; // import css
import { Player } from 'video-react';

class ClipStream extends Component {
  constructor() {
    super();
    this.state = {
      clips: [],
      currentIndex: 0,
      currentClip: {},
      isLoaded: false,
      hideLeftBtn: true,
      hideRightBtn: false
    };
  }

  componentDidMount() {
    
    this.fetchMoreClips('secretbryan', 10, 0);
    this.setState({isLoaded: true});
  }

  fetchMoreClips = (user, amount, offset = 0) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({twitchName: user, clipAmount: amount, clipOffset: offset})
    };

    fetch('http://localhost:5000/api/twitch/clips/GetClipsByUserInterest', requestOptions)
    .then(res => res.json())
    .then(newClips => {
      let newClipsCopy = this.state.clips;
      newClipsCopy.push.apply(newClipsCopy, newClips);
      console.log('New Clips ', newClipsCopy);
      this.setState({clips: newClipsCopy}, () => {
        console.log('Fetched ' + amount + ' more clips', newClips);
        this.setCurrentClip();
      });
    });
  }

  setCurrentClip = () => {
    this.setState({currentClip: this.state.clips[this.state.currentIndex]}, () => {
      console.log('Set current clip', this.state.currentClip);
    });
  }

  NextClip = () => {
    if(this.state.currentIndex == this.state.clips.length - 2)
    {
      //Load more clips
      this.fetchMoreClips('secretbryan', 10, this.state.currentIndex + 2);
    }

    if(this.state.currentIndex == this.state.clips.length - 1)
    {
      this.setState(state => ({
        hideRightBtn: true
      }));
      return;
    }
    else
    {
      this.setState(state => ({
        hideRightBtn: false,
        hideLeftBtn: false
      }));
    }

    this.setState(state => ({
      currentClip: state.clips[state.currentIndex + 1],
      currentIndex: state.currentIndex + 1
    }), () => console.log('Index: ' + this.state.currentIndex));
  }

  PrevClip = () => {
    if(this.state.currentIndex == 0)
    {
      this.setState(state => ({
        hideLeftBtn: true
      }));
      return;
    }
    else
    {
      this.setState(state => ({
        hideLeftBtn: false,
        hideRightBtn: false
      }));
    }

    this.setState(state => ({
      currentClip: state.clips[state.currentIndex - 1],
      currentIndex: state.currentIndex - 1
    }), () => console.log('Index: ' + this.state.currentIndex));
  }

  GetIFrame() {
    const rightBtnStyle = this.state.hideRightBtn ? {display: 'none'} : {};
    const leftBtnStyle = this.state.hideLeftBtn ? {display: 'none'} : {};
    let mediaSource;
    if(this.state.isLoaded){
      mediaSource = this.state.currentClip.mediaUrl;
    }
    if (mediaSource) 
    {
      return (
      <div style={{height: '100%'}}>
        <Player
          playsInline
          autoPlay
          loop
          muted
          poster={this.state.currentClip.thumbnailUrl}
          src={mediaSource}
        />
        <button className="btn right-btn" onClick={this.NextClip} style={rightBtnStyle} ><i className="fa fa-chevron-right"></i></button>
        <button className="btn left-btn" onClick={this.PrevClip} style={leftBtnStyle}><i className="fa fa-chevron-left"></i></button>
      </div>
      );
    }
  }

  render() {
    
    const containterStyle = {
      height: '100%',
      display: 'flex',
      flexDirection: 'row'
    }

    return ( 
      <div style={containterStyle}>
        <div className='left-panel'>
          {this.GetIFrame()}
        </div>
        <div className='right-panel'>

        </div>
      </div>
    );
  }

}

export default ClipStream;
