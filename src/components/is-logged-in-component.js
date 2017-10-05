import React,{Component} from 'react';
import {userLoginAction,userLogoutAction} from '../actions/action-user-checkin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { browserHistory }  from 'react-router-dom';


class IsLoggedInComponent extends Component{
    constructor(props){
        super(props);
        this.redirectToHomePage = this.redirectToHomePage.bind(this);
    }

    redirectToHomePage(){
        this.props.history.push('/');
    }
    
    render(){
        if(this.props.loginStatus.isLoggedIn){
            console.log(this.props.children);
            return <h1>Hello World</h1>;
        }else{
            return null;
        }
    }
    componentDidMount(){
        console.log("IS Logged In"+this.props.loginStatus.isLoggedIn);
        this.props.userLogoutAction('abcd');
        if(!this.props.loginStatus.isLoggedIn){
            this.redirectToHomePage();
        }
    }
}

function mapStateToProps(state){
    return {
        loginStatus:state.loginStatus
    }
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({userLoginAction:userLoginAction,userLogoutAction:userLogoutAction},dispatch);
}

export default connect(mapStateToProps,matchDispatchToProps)(IsLoggedInComponent);