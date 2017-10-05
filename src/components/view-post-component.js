import React,{Component} from 'react';
import PostPicElement from './post-pic-element';
import '../css/main.css';
import '../css/view-post-component.css';
import postImage from '../img/Road2.jpeg';
import profilePic from '../img/profile_pic.jpg';
import {Icon} from 'react-fa'
import PostAuthorComponent from './post-author-component';
import PostCommentComponent from './post-comment-component';
import AppHeaderComponent from './app-header-component';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FavoriteIconBorder from 'material-ui/svg-icons/action/favorite-border';
import FavoriteIcon from 'material-ui/svg-icons/action/favorite';
import Snackbar from 'material-ui/Snackbar';
import $ from 'jquery';
class ViewPostComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            subHeaderColor:'#363E45',
            comment:'',
            commentHeaderVisible:true,
            title:'',
            subheader:'',
            content:'',
            imageUrl:'',
            postNotFound:'false',
            isFollowing:true,
            fullName:'',
            date:'',
            profilePic:'',
            comments:[],
            likeCount:0,
            currentUserLiked:false,
            snackBarOpen:false,
            snackBarMessage:"",
            username:""
        };
        this.headerClicked = this.headerClicked.bind(this);
    }
    headerClicked(){

    }
    handlSnackBarOpen = (message)=>{
        this.setState({
            snackBarOpen:true,
            snackBarMessage:message});
    };
    handleSnackBarClose = (messsage)=>{
        this.setState({
            snackBarOpen:false,
            snackBarMessage:messsage});
    };
    getPostData = ()=>{
        const pk = this.props.match.params.pk;
        let getPost = $.ajax({
            type:"GET",
            url:`http://localhost:8000/post/${pk}/`,
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            }
        });

        let checkUserFollower = getPost.then((response)=>{
            console.log(response);
            console.log(response.owner.username);
            this.setState({
                postNotFound:false,
                title:response.title,
                subheader:response.subheader,
                content:response.content,
                imageUrl:response.cover_pic,
                fullName:response.owner.first_name +' ' +response.owner.last_name,
                profilePic:response.owner.user_profile.profile_pic,
                date:response.created_at,
                comments:response.post_comments,
                likeCount:response.like_count,
                currentUserLiked:response.current_user_liked,
                username:response.owner.username

            });
            if(response.owner.username === this.props.loginStatus.username){
                console.log("Same User");
            }else{
                return(
                    $.ajax({
                        type:"POST",
                        url:"http://localhost:8000/connect/request/check/",
                        data:{
                            username:response.owner.username
                        },
                        beforeSend:(request)=>{
                            request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
                        },
                    })
                );
            }
        });

        checkUserFollower.done((response)=>{
            console.log(response);
            if(response != undefined){
                this.setState({isFollowing:response.isFollowing});
            }
        });

        checkUserFollower.fail((err)=>{
            console.log(err);
        });
    };

    commentList = ()=>{
        const commentsItems = this.state.comments.map((comment,index)=>{
            return <PostCommentComponent 
                    key={index}
                    img={comment.owner.user_profile.profile_pic}
                    name={`${comment.owner.first_name} ${comment.owner.last_name}`} 
                    date={comment.commented_at}
                    comment={comment.comment}
                    username={comment.owner.username}/>
        });
        return commentsItems;
    };
    uploadComment = ()=>{
        let commentText = this.textInput.value;
        $.ajax({
            url:"http://localhost:8000/comment/",
            type:"POST",
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            },
            data:{
                post_id:this.props.match.params.pk,
                comment:commentText
            }
        }).done((response)=>{
            console.log(response);
            this.getPostData();
            this.textInput.value = "";
            this.handlSnackBarOpen("Comment Successfully added");
        }).fail((err)=>{
            console.log(err);
            this.handlSnackBarOpen("Error occurred while uploading comment");
        });
    };
    likePost = ()=>{
        $.ajax({
            type:"PUT",
            url:"http://localhost:8000/post/like/",
            data:{
                post_id:this.props.match.params.pk,
                like_status:true
            },
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            },
        }).done((response)=>{
            console.log(response);
            this.getPostData();
        }).fail((error)=>{
            console.log(error);
        });
    };
    render(){
        const postImageStyle={
            width:800,
            height:400,
            boxShadow:'0 15px 35px rgba(0,0,0,0.3)'
        };
        const subHeaderStyle = {
            color:this.state.subHeaderColor
        };
        const iconStyles = {
            marginRight: 24,
        };
        const likeButtonnColor = this.state.currentUserLiked?'#FF5757':'#000';
        return(
            <div className='viewpost-display-container'>
            <AppHeaderComponent/>
            {!this.state.postNotFound?
            <div className='viewpost-container vertical-row'>
                <h1 className='viewpost-header-text'>{this.state.title}</h1>
                <PostPicElement style={postImageStyle} img={this.state.imageUrl}/>
                <h3 style={subHeaderStyle} className='viewpost-subheader'>{this.state.subheader}</h3>
                <h5 className='viewpost-content'>{this.state.content}</h5>
                <div className='viewpost-author-container horizontal-row'>
                     <PostAuthorComponent username={this.state.username} big={true} bigStyle={{fontSize:14}} imageSize={50} img={this.state.profilePic} name={this.state.fullName} date={this.state.date}/>
                     {this.state.isFollowing?
                        <div className='horizontal-row social-icons-container'>
                            <div className='horizontal-row icon-counter' style={{marginTop:-7}}>
                                {this.state.currentUserLiked?
                                <IconButton tooltip="Dislike Post" onTouchTap={this.likePost}
                                    iconStyle={{color:likeButtonnColor}}>
                                    <FavoriteIcon/>
                                </IconButton>:
                                <IconButton tooltip="Like Post" onTouchTap={this.likePost}>
                                    <FavoriteIconBorder/>
                                </IconButton>}
                                
                                <h5 className='social-counter-text' style={{marginLeft:-8}}>{this.state.likeCount}</h5>
                            </div>
                            <div className='horizontal-row icon-counter'>
                                <Icon className='social-icon' name="comment-o" size={'2x'}/>
                                <h5 className='social-counter-text'>{this.state.comments.length}</h5>
                            </div>
                        </div>:null}
                </div>
                
                {this.state.isFollowing?
                <div onClick={this.headerClicked} className='vertical-row viewpost-create-comment'>
                    <textarea placeholder="Write something about the post …" className='comment-textarea' ref={(input) => { this.textInput = input;}}></textarea>
                    <div className='horizontal-row viewpost-create-comment-lower-container'>
                        <FlatButton label="Done" onTouchTap={this.uploadComment}/>
                    </div>
                </div>:null}

                {this.state.isFollowing?
                <div className='viewpost-comment-container vertical-row'>
                    {this.commentList()}
                </div>:null}
            </div>:<h1 style={{marginTop:200}}>Post Not Found</h1>}
            <Snackbar
                        open={this.state.snackBarOpen}
                        message={this.state.snackBarMessage}
                        autoHideDuration={4000}
                        onRequestClose={this.handleSnackBarClose}/>
            </div>
        );
    }
    componentDidMount(){
        this.getPostData();
    }

}
function mapStateToProps(state){
    return {
        loginStatus:state.loginStatus
    }
}


export default withRouter(connect(mapStateToProps)(ViewPostComponent));