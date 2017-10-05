import React,{Component} from 'react';
import AppHeaderComponent from './app-header-component';
import PostItemElement from './post-item-element';
import '../css/main.css';
import '../css/profile-component.css';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Link,withRouter,Route} from 'react-router-dom';
import $ from 'jquery';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import RequestListComponent from './request-list-component';
import AllFollowersComponent from './all-follower-component';
import AllFollowingComponent from './all-following-component';
import UserSearchComponent from './user-search-component';

class ProfileComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            posts:[],
            gotData:false,
            myPosts:[],
            allFollowers:[],
            allFollowings:[],
            gotFollowers:false
        }
    }
    
    postList=()=>{
        const postItems = this.state.posts.map((post,index)=>{
            return <PostItemElement key={index} postId={post.pk} header={post.title} subheader={post.subheader} content={post.content}
                            authorProfilePic={post.owner.user_profile.profile_pic} 
                            author={`${post.owner.first_name} ${post.owner.last_name}`}
                            date={post.created_at} coverPic={post.cover_pic}
                            username={post.owner.username}/>;
        });
        return postItems;
    };
    postsMine = ()=>{
        $.ajax({
            type:"GET",
            url:"http://localhost:8000/connect/request/mine",
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            }
        }).done((response)=>{
            this.setState({myPosts:response});
        }).fail((error)=>{
            console.log(error);
        });
    };
    myPostList = ()=>{
        // this.postsMine();
        const postItems = this.state.myPosts.map((post,index)=>{
            return <PostItemElement key={index} postId={post.pk} header={post.title} subheader={post.subheader} content={post.content}
                            authorProfilePic={post.owner.user_profile.profile_pic} 
                            author={`${post.owner.first_name} ${post.owner.last_name}`}
                            date={post.created_at} coverPic={post.cover_pic}
                            username={post.owner.username}/>;
        });
        return postItems;
    };
    render(){
        return(
            <div className='profile-page-container vertical-row'>
                <AppHeaderComponent/>
                <NavigationContainer rootUrl = {this.props.match.url} currentLocation={this.props.location}/>
                    <Route exact={true} path={`${this.props.match.url}/requests`} component={RequestListComponent}/>
                    <Route exact={true} path={`${this.props.match.url}/search`} component={UserSearchComponent}/>
                    <Route exact={true} path={`${this.props.match.url}/followers`} component={AllFollowersComponent}/>
                    <Route exact={true} path={`${this.props.match.url}/followings`} component={AllFollowingComponent}/>
                    <Route exact={true} path={`${this.props.match.url}`} render={()=>{
                        return (
                            <div className='vertical-row posts-container'>
                                {this.state.posts.length > 0 ?this.postList():<h1 className='error-h1'>No Posts yet.Start Following users or add new posts.</h1>}
                            </div>
                        );
                    }}/>

                    <Route exact={true} path={`${this.props.match.url}/mine`} render={()=>{
                        return (
                            <div className='vertical-row posts-container'>
                                 {this.state.myPosts.length > 0 ?this.myPostList():<h1 className='error-h1'>You have not added any posts yet.</h1>} 
                                {/* {this.state.myPostList()} */}
                            </div>
                        );
                    }}/>
                <FabButton/>
                
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
        this.postsMine();
        let getAllPosts = checkNewUser.then((response)=>{
            if(response.new_user){
                console.log("New User");
                this.props.history.push('/userprofile');
            }else{
                return $.ajax({
                    type:"GET",
                    url:'http://localhost:8000/connect/request/followers/',
                    beforeSend:(request)=>{
                        request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
                    }
                });
            }
        });

        getAllPosts.done((response)=>{
            this.setState({posts:response,gotData:true});
        });
        getAllPosts.fail((error)=>{
            console.log(error);
        });
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

const PostList = (props)=>{
    return(
        <div className='posts-container vertical-row'>
            {props.posts.map((post,index)=>{
                
            })}
        </div>
    );
};

const NavigationContainer = (props)=>{
    console.log("Current Url ");
    console.log(props.currentLocation.pathname);
    return(
        <div className='navigation-container vertical-row' style={{zIndex:89}}>
            <h3 className='navigation-container-header'>Profile</h3>
            <NavigationLink active={props.currentLocation.pathname == props.rootUrl ? true:false} href={`${props.rootUrl}`} label={'All Posts'}/>
            <NavigationLink active={props.currentLocation.pathname == `${props.rootUrl}/mine` ? true:false} href={`${props.rootUrl}/mine`} label={'My Posts'}/>
            <NavigationLink href={'/userprofile'} label={'View Profile'}/>
            <NavigationLink active={props.currentLocation.pathname == `${props.rootUrl}/followings` ? true:false} href={`${props.rootUrl}/followings`} label={'Following'}/>
            <NavigationLink active={props.currentLocation.pathname == `${props.rootUrl}/followers` ? true:false} href={`${props.rootUrl}/followers`} label={'Followers'}/>
            <NavigationLink active={props.currentLocation.pathname == `${props.rootUrl}/search` ? true:false} href={`${props.rootUrl}/search`} label={'Explore People'}/>
        </div>
    );
};
const NavigationLink = (props)=>{
    const aClassName = props.active ? 'nav-link nav-link-active':'nav-link';
    const divClassName = props.active ? 'nav-sidebar nav-sidebar-active':'nav-sidebar nav-sidebar-inactive';
    return(
        <div className='nav-link-div horizontal-row'>
                <div className={divClassName}></div>
                 <Link to={props.href}>
                    <span className={aClassName}>{props.label}</span>
                </Link> 
      
        </div>
    );
}
function mapStateToProps(state){
    return {
        loginStatus:state.loginStatus
    }
}
export default withRouter(connect(mapStateToProps)(ProfileComponent));