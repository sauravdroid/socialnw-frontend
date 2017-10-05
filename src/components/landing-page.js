import React from 'react';
import Jumbotron from './jumbotron-component';
import '../css/landing-page.css';
import RaisedButton from 'material-ui/RaisedButton';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleWindowAction} from '../actions/action-toggleWindow';
import Anime from 'react-anime';


class LandingPage extends React.Component{

    constructor(props){
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.state = {
            loginRegister:true,
            payload:'login'
        }
    }
    handleLogin(){
        let windowStatus = !this.props.toggleWindow.toggleWindowStatus;
        let windowType = 'login';
        let windowState = {
            windowStatus:windowStatus,
            windowType:windowType
        };
        this.props.toggleWindowAction(windowState);
    }
    handleRegister(){
        let windowStatus = !this.props.toggleWindow.toggleWindowStatus;
        let windowType = 'register';
        let windowState = {
            windowStatus:windowStatus,
            windowType:windowType
        };
        this.props.toggleWindowAction(windowState);
    }
  
    render(){
        let bottomContainer = <BottomElement 
            visible={this.props.toggleWindow.toggleWindowStatus}
            handleLogin={this.handleLogin}
            handleRegister={this.handleRegister}/>;
        let quoteElment = <QuoteElement/>
        return(
            <div className='landing-container'>
                <div className='upper-container'>
                    <h3 className='header-text-landing'>Connect with people that matters</h3>
                </div>
                <div className='horizontal-row'>
                    <div className='jumbotron-container'>
                        <Jumbotron handleLogin={this.handleLogin} loginRegister = {this.props.toggleWindow.toggleWindowStatus} 
                        selection={this.props.toggleWindow.toggleWindowType}/>
                    </div>
                    {quoteElment}
                </div>
                {bottomContainer}
                
            </div>
        );
    }
    
}


function BottomElement(props){
    const style = {
            margin: 12,
            background:'#323131'
        };
        // console.log(props.visible); 
        return(
                <Anime easing="easeInOutQuart"
                    duration={1000}
                    scale={props.visible?[0,0]:[1,1]}>
                        <div className="btn-container">
                                <RaisedButton backgroundColor='#3FE385'
                                    style={style} className='btn' labelColor='#32131'
                                    label="Login"
                                    onTouchTap={props.handleLogin}/>
                                <RaisedButton
                                    className='btn' 
                                    backgroundColor='#3FE385' 
                                    label="Register" labelColor='#32131' style={style}
                                    onTouchTap={props.handleRegister} />
                        </div>
                </Anime>
        );
}
function QuoteElement(props){
    return(
        <div className='quote-container'>
            <h3 className='quote-text'>
                “You've gotta dance like there's 
                nobody watching,Love like you'll 
                never be hurt,Sing like there's nobody 
                listening,And live like it's heaven on 
                earth.” 
            </h3>
        </div>
    );
}

function mapStateToProps(state){
    return {
        toggleWindow:state.toggleWindow
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({toggleWindowAction:toggleWindowAction},dispatch);
}

export default connect(mapStateToProps,matchDispatchToProps)(LandingPage);