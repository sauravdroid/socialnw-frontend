import React,{Component} from 'react';
import '../css/main.css';
import '../css/request-item-component.css';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class RequestItemComponent extends Component{

    acceptRequest=()=>{
        this.props.acceptRequest(this.props.indexValue,this.props.username);
    }

    deleteRequest=()=>{
        this.props.deleteRequest(this.props.indexValue,this.props.username);
    }

    render(){
        const iconStyles = {
            marginRight: 10,
        };
        return(
            <div className='horizontal-row request-item-main-container'>
                    <Link to={`/userprofile/${this.props.username}`}>
                        <Avatar src={this.props.profilePic}/>
                    </Link>
                    <div className='vertical-row detail-container'>
                        <Link to={`/userprofile/${this.props.username}`}>
                        <h1 className='username'>{this.props.userFullName}</h1>
                        
                        <SocialItemContainer followers={this.props.followerCount}
                        followings={this.props.followingCount} posts={this.props.postCount}/>
                        </Link>
                    </div>
                {!this.props.view_only?
                <div className='horizontal-row action-btn-container'>
                    <IconButton
                        onTouchTap={this.acceptRequest}
                        iconStyle={{color:'#FF5757'}}
                        style={iconStyles}>
                        <PersonAdd />
                    </IconButton>
                    <IconButton
                        onTouchTap={this.deleteRequest}
                        iconStyle={{color:'#22B367'}}
                        style={iconStyles}>
                        <Delete />
                    </IconButton>
                </div>:null
                }
            </div>
        );
    }
    componentDidMount(){
        console.log(this.props.loginStatus.username);
    }
}

const SocialItemContainer = (props)=>{
    return(
        <div className='horizontal-row social-metrics-container'>
            <div className='social-metric-item horizontal-row'>
                <h3 className='metric-count'>{props.followers}</h3>
                <h3 className='metric-name'>Followers</h3>
            </div>
            <div className='social-metric-item horizontal-row'>
                <h3 className='metric-count'>{props.followings}</h3>
                <h3 className='metric-name'>Following</h3>
            </div>
            <div className='social-metric-item horizontal-row'>
                <h3 className='metric-count'>{props.posts}</h3>
                <h3 className='metric-name'>Posts</h3>
            </div>
        </div>
    );
};
function mapStateToProps(state){
    return({
        loginStatus:state.loginStatus
    });
}
export default connect(mapStateToProps)(RequestItemComponent);