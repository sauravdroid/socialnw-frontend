import React,{Component} from 'react';
import '../css/main.css';
import '../css/request-list-component.css';
import RequestItemComponent from './request-item-component';
import profilePic from '../img/profile_pic.jpg';
import {connect} from 'react-redux';
import $ from 'jquery';
import {Link} from 'react-router-dom';


class RequestListComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            requestsList:[],
            gotData:false
        };
    }
    allRequests = ()=>{
        console.log(this.state.requestsList);
        const requestList = this.state.requestsList.map((request,index)=>{
            if(!request.request_status){
                return (
                    
                        <RequestItemComponent indexValue={index} key={index}
                            profilePic = {request.user.user_profile.profile_pic}
                            userFullName={`${request.user.first_name} ${request.user.last_name}`}
                            username={request.user.username}
                            acceptRequest={this.acceptRequest}
                            deleteRequest={this.deleteRequest}
                            followerCount={request.user.follower_count}
                            followingCount = {request.user.following_count}
                            postCount = {request.user.posts.length}/>
                );
            }
        });
        return requestList;
        
    };

    deleteRequest=(index,username)=>{
        $.ajax({
            type:'POST',
            url:'http://localhost:8000/connect/request/handle/',
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            },
            data:{
                username:username,
                approval_status:false
            },
            success:(response)=>{
                console.log(response);
                let requestList = this.state.requestsList;
                requestList.splice(index,1);
                this.setState({requestList:requestList});
            },
            error:(err)=>{
                console.log(err);
            }
        });
    };

    acceptRequest=(index,username)=>{
        $.ajax({
            type:'POST',
            url:'http://localhost:8000/connect/request/handle/',
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            },
            data:{
                approval_status:"accept",
                username:username
            },
            success:(response)=>{
                console.log(response);
                let requestList = this.state.requestsList;
                requestList.splice(index,1);
                this.setState({requestList:requestList});
            },
            error:(err)=>{
                console.log(err);
            }
        });
    };

    render(){
        const iconStyles = {
            marginRight: 24,
        };
        return(
            <div className='vertical-row request-list-main-container'>
                {this.state.requestsList.length>0?
                (this.state.gotData?this.allRequests():null):<h1 className='error-h1'>You don't have any pending requests</h1>}
            </div>
        );
    }
    componentDidMount(){
        $.ajax({
            url:'http://localhost:8000/connect/request/all/',
            type:'GET',
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            },
            success:(response)=>{
                this.setState({
                    gotData:true,
                    requestsList:response
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

export default connect(mapStateToProps)(RequestListComponent);