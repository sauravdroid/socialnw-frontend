import React,{Component} from 'react';
import '../css/post-pic-element.css';
class PostPicElement extends Component{
    render(){
        return(
            <div style={this.props.style} className='pic-container'>
                <img src={this.props.img}/>
            </div>
        );
    }
}
export default PostPicElement;