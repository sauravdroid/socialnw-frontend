import React,{Component} from 'react';
import RequestItemComponent from './request-item-component';
import '../css/main.css';
import '../css/request-list-component.css';
import {connect} from 'react-redux';
import $ from 'jquery';
import {Link} from 'react-router-dom';


class AllFollowersComponent extends Component{
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
                    profilePic = {item.follower.user_profile.profile_pic}
                    userFullName={`${item.follower.first_name} ${item.follower.last_name}`}
                    username={item.follower.username}
                    followerCount={item.follower.follower_count}
                    followingCount = {item.follower.following_count}
                    postCount = {item.follower.posts.length}/>
            );
        });
        return items;
    }
    render(){
        return(
            <div className='vertical-row request-list-main-container'>
                {this.state.gotData?this.allFollowers():<h1 className='error-h1'>You Don't have any folloers</h1>}
                
            
            </div>
        );
    }
    componentDidMount(){
        $.ajax({
            url:'http://localhost:8000/connect/request/allfollowers/',
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

export default connect(mapStateToProps)(AllFollowersComponent);