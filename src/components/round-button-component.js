import React,{Component} from 'react';
import '../css/round-button-component.css';
class RoundedButtonComponent extends Component{
    render(){
        return(
            <button style={this.props.style} onClick={this.props.onTouchTap} className='rounded-btn'>{this.props.label}</button>
        );
    }
}
export default RoundedButtonComponent;