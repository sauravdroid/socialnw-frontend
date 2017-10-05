import React,{Component} from 'react';
import '../css/main.css';
import '../css/post-comment-component.css';
import PostAuthorComponent from './post-author-component';
class PostCommentComponent extends Component{
    render(){
        return(
            <div className='vertical-div comment-container'>
                <PostAuthorComponent img={this.props.img} name={this.props.name} date={this.props.date} username={this.props.username}/>
                <h3 className='comment-text'>
                    {this.props.comment}
                </h3>
            </div>
        );
    }
}
export default PostCommentComponent;