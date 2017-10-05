import React, {Component} from 'react';

import Avatar from 'material-ui/Avatar';

import '../css/main.css';
import '../css/post-author-component.css';
import {Link} from 'react-router-dom';
class PostAuthorComponent extends Component{
    render(){
        const bigStyle={
            fontSize:16
        };
        return(
            <div className='author-container horizontal-row'>
                <Link to={`/userprofile/${this.props.username}`}>
                    <Avatar size={this.props.imageSize} src={this.props.img} />
                </Link>
                {this.props.big?
                <h5 style={this.props.bigStyle} className='authorNameDate'>written by <span className='authorName'>{this.props.name}</span>
                <br/>{this.props.date}</h5>
                :<h5 style={this.props.bigStyle} className='authorNameDate'><span className='authorName'>{this.props.name}</span>
                <br/>{this.props.date}</h5>}
                
            </div>
        );
    }
}

export default PostAuthorComponent;