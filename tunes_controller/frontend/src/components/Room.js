import React, { Component } from 'react';
import {Grid, Button, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom';
import CreateRoomPage from './CreateRoomPage';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
        };
        this.roomCode = this.props.match.params.roomCode;        
        this.leaveRoomPressed = this.leaveRoomPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.getRoomDetails();
    }

    getRoomDetails() {
        fetch('/api/get-room' + '?code=' + this.roomCode).then((response)=> {
            if (!response.ok){
                this.props.leaveRoomCallback();
                this.props.history.push('/');
            }
            return response.json();
        })
        .then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
        });
    }

    leaveRoomPressed() {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        }
        fetch('/api/leave-room', requestOptions).then((_response)=> {
            // this is what redirects us  to the home page
            this.props.leaveRoomCallback();
            this.props.history.push('/');
        })
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value,
        });
    }

    renderSettings() {
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <CreateRoomPage 
                    update={true} 
                    votesToSkip={this.state.votesToSkip} 
                    guestCanPause={this.state.guestCanPause} 
                    roomCode={this.roomCode}
                    updateCallback={this.getRoomDetails}
                    >

                    </CreateRoomPage>
                </Grid>

                <Grid item xs={12} align='center'>
                    <Button variant='contained' color='secondary' onClick={() => this.updateShowSettings(false)}>
                        Close Settings
                    </Button>                
                </Grid>
            </Grid>
        )
    }

    renderSettingsButton() {
        return (
            <Grid item xs={12} align='center'>
                <Button variant='contained' color='secondary' onClick={() => this.updateShowSettings(true)}>
                    Show Settings
                </Button>
            </Grid>

        )
    }

    render() {
        if(this.state.showSettings){
            return this.renderSettings()
        }
        
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Guest Can Pause: {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        isHost: {this.state.isHost.toString()} 
                    </Typography>
                </Grid>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.leaveRoomPressed}>
                        Leave Room
                    </Button>
                </Grid>

            </Grid>
        );
    }
}