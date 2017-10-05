import React,{Component} from 'react';
import RequestItemComponent from './request-item-component';
import '../css/main.css';
import '../css/request-list-component.css';
import {connect} from 'react-redux';
import $ from 'jquery';
import {Link} from 'react-router-dom';


class AllFollowingComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            allFollowers:[],
            gotData:false
        }
    }
    allFollowers = ()=>{
        console.log(this.state.allFollowers);
        const items = this.state.allFollowers.map((item,index)=>{
            return (
                <RequestItemComponent indexValue={index} key={index}
                    view_only={true}
                    profilePic = {item.following_user.user_profile.profile_pic}
                    userFullName={`${item.following_user.first_name} ${item.following_user.last_name}`}
                    username={item.following_user.username}
                    followerCount={item.following_user.follower_count}
                    followingCount = {item.following_user.following_count}
                    postCount = {item.following_user.posts.length}/>
            );
        });
        return items;
    }
    render(){
        return(
            <div className='vertical-row request-list-main-container'>
                {this.state.gotData?this.allFollowers():
                <h1 style={{textAlign:'center'}} className='error-h1'>You are not following anyone.<br/><Link to='/profile/search'>Start Exploring users</Link></h1>}
                
            </div>
        );
    }
    componentDidMount(){
        $.ajax({
            url:'http://localhost:8000/connect/request/allfollowings/',
            type:'GET',
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            },
            success:(response)=>{
                this.setState({
                    gotData:response.length>0 ? true:false,
                    allFollowers:response
                });
            },
            error:(error)=>{
                console.log(error);
            }
        });
    }
}

function mapStateToProps(state){
    return{
        loginStatus:state.loginStatus
    }
}

export default connect(mapStateToProps)(AllFollowingComponent);