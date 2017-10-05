import React,{Component} from 'react';
import '../css/main.css';
import '../css/user-search-component.css';
import $ from 'jquery';
import {connect} from 'react-redux';
import RequestItemComponent from './request-item-component';

class UserSearchComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchResult:[]
        };
    }
    checkKeyUp = (event)=>{
        // if(event.key == 'Enter'){
            this.getSearchResult();
        // }
    }
    getSearchResult=()=>{
        $.ajax({
            url:'http://localhost:8000/update/search',
            type:'POST',
            data:{username:this.searchInput.value},
            
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            }
        }).done((response)=>{
            console.log(response);
            this.setState({searchResult:response})
        }).fail((error)=>{
            console.log(error);
        });
    };
    allUsers = ()=>{
        const userList = this.state.searchResult.map((user,index)=>{
            
                return (
                    
                        <RequestItemComponent indexValue={index} key={index}
                            profilePic = {user.user_profile.profile_pic}
                            userFullName={`${user.first_name} ${user.last_name}`}
                            username={user.username}
                            view_only={true}
                            followerCount={user.follower_count}
                            followingCount = {user.following_count}
                            postCount = {user.posts.length}/>
                );
            
        });
        return userList;
    }

    render(){
        return(
            <div className='vertical-row search-component-container'>
                <input onKeyUp={this.checkKeyUp} type='text' ref={(input)=>{this.searchInput = input}}
                 className='search-input' placeholder='Search users by username'/>
                <div className='vertical-row search-result-container'>
                    
                    {this.state.searchResult.length > 0 ?this.allUsers():<h1 className='error-h1'>No Users Found</h1>}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return ({
        loginStatus:state.loginStatus
    });
}

export default connect(mapStateToProps)(UserSearchComponent);