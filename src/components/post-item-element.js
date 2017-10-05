import React,{Component} from 'react';

import '../css/main.css';
import '../css/post-item-element.css';

import postImg from '../img/Road2.jpeg';

import PostPicElement from '../components/post-pic-element';
import PostAuthorComponent from './post-author-component';
import profile_pic from '../img/profile_pic.jpg';
import {Link} from 'react-router-dom';

class PostItemElement extends Component{
    render(){
        return(
            <Link to={`/post/${this.props.postId}`}>
                <div className='item-container horizontal-row'>
                    <div className='left-container vertical-row'>
                        <h1 className='header-text'>{this.props.header}</h1>
                        <h2 className='sub-header-text'>{this.props.subheader}</h2>
                        <h2 className='post-text'>{this.props.content.substring(0,200) + ' ....'}</h2>
                        <PostAuthorComponent username={this.props.username} img={this.props.authorProfilePic} name={this.props.author} date={this.props.date}/>
                    </div>
                    <div className='right-container'>
                        <PostPicElement img={this.props.coverPic}/>
                    </div>
                </div>
            </Link>
        );
    }
}

export default PostItemElement;