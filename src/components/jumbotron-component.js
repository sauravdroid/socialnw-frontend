import React, {Component} from 'react';
import Macbook from './macbook-component';
import Iphone from './iphone-component';
import '../css/jumbotron.css';
import TextField from 'material-ui/TextField';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FlatButton from 'material-ui/FlatButton';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleWindowAction} from '../actions/action-toggleWindow';
import anime from 'animejs';
import $ from 'jquery';
import Snackbar from 'material-ui/Snackbar';
import {userLoginAction,userLogoutAction} from '../actions/action-user-checkin';


class Jumbotron extends Component{
    constructor(props){
        super(props);
        this.state = {
            snackBarOpen:false,
            snackBarMessage:""
        };
        this.loginScreen = this.loginScreen.bind(this);
        this.registerScreen = this.registerScreen.bind(this);
        this.getClassName = this.getClassName.bind(this);
        this.closeWindow = this.closeWindow.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }
    handlSnackBarOpen = (message)=>{
        this.setState({
            snackBarOpen:true,
            snackBarMessage:message});
    };
    handleSnackBarClose = (messsage)=>{
        this.setState({
            snackBarOpen:false,
            snackBarMessage:messsage});
    };
    handleLogin(){
        
        const type = 'POST';
        let string = `${this.textUsernameLogin.getValue()}:${this.textPasswordLogin.getValue()}`;
        let basicAuthHeader = `Basic ${window.btoa(string)}`;
        $.ajax({
            type:type,
            url:'http://localhost:8000/user/login/',
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",basicAuthHeader);
            },
            success:(response)=>{
                this.props.userLoginAction(response.user_token,response.username);
                console.log(response);
            },
            error:(err)=>{
                console.log(err.status);
                this.handlSnackBarOpen("Wrong username or password");
            }
        });
    }
    handleRegister(){
        const type = 'POST';
        let username = this.textUsername.getValue();
        let email = this.textEmail.getValue();
        let password = this.textPassword.getValue();
        let passwordCharacter = password.split('');
        let numericCount = 0;
        let pattern = new RegExp(/[~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
        passwordCharacter.map((char,index)=>{
            if(Number.isInteger(parseInt(char))){
                numericCount++;
            } 
        });
        if(username.length > 0 && email.length > 0 && password.length > 0 && pattern.test(password) &&  numericCount > 0){
            let data = {
                username:username,
                email:email,
                password:password
            }
            $.ajax({
                url:'http://localhost:8000/user/register/',
                data:data,
                type:type,
                success:(response)=>{
                    this.handlSnackBarOpen("Successfully Registered User");
                    this.props.handleLogin();
                },
                error:(error)=>{
                    this.handlSnackBarOpen("Error occured! Please enter valid data");
                }
            });
        }else{
            this.handlSnackBarOpen("All fields are necessary");
        }
    }
    loginScreen(){
        return(
        <ReactCSSTransitionGroup
            transitionName="login"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={400}>
                {   
                    this.props.toggleWindow.toggleWindowStatus &&
                                <div className='login-container'>
                                    <h2 className='login-header'>Login</h2>
                                    <TextField ref={(input)=>{this.textUsernameLogin=input}} inputStyle={{color:'#E3F461',labelColor:'#e91e63'}}  floatingLabelText="Enter your username"/><br />
                                    <TextField type='password' ref={(input)=>{this.textPasswordLogin=input}} inputStyle={{color:'#E3F461'}} floatingLabelText="Enter your password"/><br />
                                    <div className='inside-login-container'>
                                        <FlatButton style={{marginLeft:'-20px'}} className='cancel-btn' secondary={true} label="Cancel" onTouchTap={this.closeWindow}/>
                                        <FlatButton style={{marginRight:'-20px'}} className='accept-btn' primary={true} label="Take Me In" onTouchTap={this.handleLogin}/>
                                    </div>
                                    
                                </div>
                        
                    }
        </ReactCSSTransitionGroup>
        );
    }
    registerScreen(){
        return(
        <ReactCSSTransitionGroup
            transitionName="login"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={400}>
                {   
                    this.props.toggleWindow.toggleWindowStatus &&
                                <div className='register-container'>
                                    <h2 className='login-header'>Register</h2>
                                    <TextField ref={(input) => { this.textUsername = input; }} inputStyle={{color:'#E3F461',labelColor:'#e91e63'}}  floatingLabelText="Enter your username"/><br />
                                    <TextField type='email' ref={(input) => { this.textEmail = input; }} inputStyle={{color:'#E3F461'}} floatingLabelText="Enter your email"/><br />
                                    <TextField ref={(input) => { this.textPassword = input; }} inputStyle={{color:'#E3F461'}} floatingLabelText="Enter your password"/><br />
                                    <div className='inside-login-container'>
                                        <FlatButton style={{marginLeft:'-20px'}} className='cancel-btn' secondary={true} label="Cancel" onTouchTap={this.closeWindow}/>
                                        <FlatButton style={{marginRight:'-20px'}} className='accept-btn' primary={true} label="Take Me In" onTouchTap={this.handleRegister}/>
                                    </div>
                                    
                                </div>
                        
                    }
        </ReactCSSTransitionGroup>
        );
    }
    closeWindow(){
        let windowStatus = !this.props.toggleWindow.toggleWindowStatus;
        let windowState = {
            windowStatus:windowStatus,
            windowType:this.props.toggleWindow.toggleWindowType
        };
        this.props.toggleWindowAction(windowState);
    }
    getClassName(){
        let scale = this.props.toggleWindow.toggleWindowStatus?(1.4,1.4):(0.9,0.9);
        let translateX = this.props.toggleWindow.toggleWindowStatus?50:0;
        let translateY = this.props.toggleWindow.toggleWindowStatus?30:0;
        // console.log(this.props.toggleWindow.toggleWindowStatus);
        anime({
            targets:'.main-container',
            scale:scale,
            duration:150,
            translateX:translateX,
            translateY:translateY,
            easing: 'easeInOutQuart'
        });
    }
    render(){
        return(
                <div>
                    {this.getClassName()}
                    {this.props.toggleWindow.toggleWindowType==='login'?this.loginScreen():this.registerScreen()}
                    <div className='jumbotron main-container'>
                        <Macbook visible={this.props.toggleWindow.toggleWindowStatus}/>
                        <Iphone visible={this.props.toggleWindow.toggleWindowStatus}/>
                    </div>
                    <Snackbar
                        open={this.state.snackBarOpen}
                        message={this.state.snackBarMessage}
                        autoHideDuration={4000}
                        onRequestClose={this.handleSnackBarClose}/>
                </div>
            );
    }
    componentDidMount(){
        this.getClassName();
    }

}
function mapStateToProps(state){
    return {
        toggleWindow:state.toggleWindow
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({toggleWindowAction:toggleWindowAction,userLoginAction:userLoginAction},dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(Jumbotron);