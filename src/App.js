import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import LandingPage from './components/landing-page';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ProfileComponent from './components/profile-component';
import ViewPostComponent from './components/view-post-component';
import UserProfilePageComponent from './components/user-profile-page-component';
import CreatePostComponent from './components/create-post-component';
import RequestListComponent from './components/request-list-component';
import {BrowserRouter as Router, Route,Redirect,Switch} from 'react-router-dom';
import {userLoginAction,userLogoutAction} from './actions/action-user-checkin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import './App.css';
import Error404 from './img/404.svg';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {   
    canvasColor: '#E3F461',
    borderColor: '#E3F461',
    disabledColor: '#E3F461',
    primary1Color: '#E3F461',
  },
  appBar: {
    height: 50,
  },
});

class App extends Component {
  constructor(props){
    super(props);
    this.requireAuth = this.requireAuth.bind(this);
  }
  requireAuth(nextState, replace){
    console.log(this.props.loginStatus.isLoggedIn);
    return (
      this.props.loginStatus.isLoggedIn?(<Redirect push to='/profile'/>):(<LandingPage/>)
    );
  }


  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router>
          <div className="App">
                <Switch>
                <Route exact={true} path='/' render={this.requireAuth}/>
                <Route path='/profile' render={()=>(
                  this.props.loginStatus.isLoggedIn?(<ProfileComponent/>):(<Redirect push to='/'/>)
                )}/>
                <Route path='/post/:pk' render={()=>(
                  this.props.loginStatus.isLoggedIn?(<ViewPostComponent/>):(<Redirect push to='/'/>)
                )}/>
                <Route exact={true} path='/userprofile' render={()=>(
                  this.props.loginStatus.isLoggedIn?(<UserProfilePageComponent own={true}/>):(<Redirect push to='/'/>)
                )}/>
                <Route path='/userprofile/:username' render={()=>(
                  this.props.loginStatus.isLoggedIn?(<UserProfilePageComponent own={false}/>):(<Redirect push to='/'/>)
                )}/>
                <Route path='/create' render={()=>(
                  this.props.loginStatus.isLoggedIn?(<CreatePostComponent/>):(<Redirect push to='/'/>)
                )}/>
                <Route path='/requests' component={RequestListComponent}/>
                <Route component={HTTP404Component}/>
                </Switch>
            
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
  // componentDidMount(){
  //   this.props.userLogoutAction('ad');
  // }
 
}
const HTTP404Component = (props)=>{
  return(
    <div className='error-container vertical-row'>
      <img src={Error404}/>
      <h1 className='error-404'>Error 404. Page not Found.</h1>

    </div>
  );
};
function mapStateToProps(state){
    return {
        loginStatus:state.loginStatus
    }
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({userLoginAction:userLoginAction,userLogoutAction:userLogoutAction},dispatch);
}

export default connect(mapStateToProps,matchDispatchToProps)(App);
