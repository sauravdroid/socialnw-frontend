import React, {Component} from 'react';
import '../css/main.css';
import '../css/user-profile-page-component.css';
import AppHeaderComponent from './app-header-component';
import UserDetailComponent from './user-detail-component';
import PostItemElement from './post-item-element';
import {Link,withRouter} from 'react-router-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {connect} from 'react-redux';
import $ from 'jquery';

class UserProfilePageComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            fullName:'',
            intro:'',
            profilePicUrl:'',
            gotData:false,
            posts:[],
            firstTime:false,
            followerCount:0,
            followingCount:0,
            postCount:0,
            username:''
        };
    }
    listItems=()=>{
        const numbers = [1, 2, 3, 4, 5];
    };
    allPosts=()=>{
        console.log(this.state.posts);
        const items = this.state.posts.map((post,index)=>{
            return <PostItemElement key={index} postId={post.pk} header={post.title} subheader={post.subheader} content={post.content}
                            authorProfilePic={this.state.profilePicUrl} author={this.state.fullName}
                            date={post.created_at} coverPic={post.cover_pic}
                            username={this.state.username}/>;
        });
        return items;
    };
    getUserData = ()=>{
        if(this.props.own){
            $.ajax({
                type:"GET",
                url:'http://localhost:8000/update/profile',
                beforeSend:(request)=>{
                    request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
                },
                success:(response)=>{
                    try{
                        console.log(response);
                        if(response.user_profile === null){
                            console.log("This is user's first time");
                            this.setState({firstTime:true});
                        }else{
                            this.setState({
                                fullName:response.first_name + ' ' +response.last_name,
                                intro:response.user_profile.intro,
                                profilePicUrl:response.user_profile.profile_pic,
                                gotData:true,
                                posts:response.posts,
                                firstTime:false,
                                followerCount:response.follower_count,
                                followingCount:response.following_count,
                                postCount:response.posts.length,
                                username:response.username
                            });
                        }
                    }catch(e){
                        console.log(e);
                    }
                    // console.log(this.state.posts);
                },
                error:(error)=>{
                    this.setState({gotData:false});
                    console.log(error);
                }
            });
        }else{
            const username = this.props.match.params.username;
            $.ajax({
                type:"GET",
                url:`http://localhost:8000/update/${username}/`,
                beforeSend:(request)=>{
                    request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
                },
                success:(response)=>{
                    try{
                        console.log(response);
                        this.setState({
                            fullName:response.first_name + ' ' +response.last_name,
                            intro:response.user_profile.intro,
                            profilePicUrl:response.user_profile.profile_pic,
                            gotData:true,
                            posts:response.posts,
                            followerCount:response.follower_count,
                            followingCount:response.following_count,
                            postCount:response.posts.length
                        });
                    // console.log(this.state.posts);
                    }catch(e){
                        console.log(e);
                    }
                },
                error:(error)=>{
                    this.setState({gotData:false});
                    console.log(error);
                }
            });
        }
    };
    
    render(){
        return(
            <div className='vertical-row user-profile-page-container'>
                <AppHeaderComponent/>
                <div className='vertical-row user-page-content'>
                    <UserDetailComponent
                    getUserData = {this.getUserData}
                    update={this.state.firstTime}
                    own={this.props.own || this.props.match.params.username === this.props.loginStatus.username } 
                    profilePicUrl={this.state.profilePicUrl} 
                    fullName={this.state.fullName}
                    intro = {this.state.intro}
                    followerCount={this.state.followerCount}
                    followingCount={this.state.followingCount}
                    postCount={this.state.postCount}/>
                    <div className='vertical-row all-post-container'>
                        {this.state.posts.length > 0?<h3 className='all-post-header'>All Posts</h3>:
                        <h3 className='all-post-header'>No Posts Yet</h3>}
                        {this.state.gotData?this.allPosts():null}
                    </div>
                    
                    {this.props.own || this.props.match.params.username === this.props.loginStatus.username?<FabButton/>:null}
                    
                </div>
            </div>
        );
    }
    componentDidMount(){
        this.getUserData();
    }
}
const FabButton = (props)=>{
    return (
        <div className='fab-container'>
            <Link to={'/create'}>
                <FloatingActionButton backgroundColor={'#43A1F8'} style={{transform:'scale(0.9,0.9)'}} zDepth={3}>
                    <ContentAdd/>
                </FloatingActionButton>
            </Link>
        </div>
    );
};
function mapStateToProps(state){
    return {
        loginStatus:state.loginStatus
    }
}
export default withRouter(connect(mapStateToProps)(UserProfilePageComponent));
