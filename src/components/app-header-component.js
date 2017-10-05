import React,{Component} from 'react';
import '../css/main.css';
import '../css/app-header-component.css';
import Avatar from 'material-ui/Avatar';
import profile_pic from '../img/profile_pic.jpg';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {userLoginAction,userLogoutAction} from '../actions/action-user-checkin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import $ from 'jquery';

class AppHeaderComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            menuOpen:false,
            profilePic:profile_pic
        };

    }
    handleTouchTap=(event)=>{
        event.preventDefault();
        this.setState({
            menuOpen:true,
            anchorEl:event.currentTarget
        });
    }
    handleRequestClose = ()=>{
        this.setState({menuOpen:false});
    }
    userLogout=()=>{
        this.props.userLogoutAction(null);
    }
    render(){
        return(
            <div className='app-header-container horizontal-row'>
                <Link to='/profile'>
                    <h1 className='app-header-text'>Social Bug</h1>
                </Link>
                <div className='horizontal-row header-right-part'>
                    <NotificationBadge/>
                    <IconButton style={{marginTop:-5}} tooltip='actions' onTouchTap={this.handleTouchTap}>
                        <Avatar size={30} src={this.state.profilePic}/>
                    </IconButton>
                    <Popover
                    style={{backgroundColor:'#fff'}}
                    open={this.state.menuOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}>
                        <Menu>
                            <Link to='/profile'>
                                <MenuItem primaryText="Home" />
                            </Link>
                            <Link to='/userprofile'>
                                <MenuItem primaryText="Profile" />
                            </Link>
                            <MenuItem onTouchTap={this.userLogout} primaryText="Sign out" />
                        </Menu>
                </Popover>
                </div>
            </div>
        );
    }
    componentDidMount(){
        let checkNewUser = $.ajax({
            type:"GET",
            url:"http://localhost:8000/update/check",
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            }
        });
        let getUserData = checkNewUser.then((response)=>{
            if(response.new_user){
                console.log("New User");
                this.setState({profilePic:profile_pic})
            }else{
                return $.ajax({
                    type:"GET",
                    url:'http://localhost:8000/update/profile',
                    beforeSend:(request)=>{
                        request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
                    }
                });
            }
        });

        getUserData.done((response)=>{
            this.setState({profilePic:response.user_profile.profile_pic});
        });
        getUserData.fail((error)=>{
            console.log(error);
        });

    }
}
const NotificationBadge = (props) => (
  <div>
    <Link to='/profile/requests'>
        
        <IconButton tooltip="Notifications">
            <NotificationsIcon color={'#fff'}/>
        </IconButton>
        
    </Link>
  </div>
);
function mapStateToProps(state){
    return {
        loginStatus:state.loginStatus
    }
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({userLoginAction:userLoginAction,userLogoutAction:userLogoutAction},dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(AppHeaderComponent);