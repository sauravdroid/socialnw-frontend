import React , {Component} from 'react';
import logo from '../svg/social-macbook-nologo.svg';
import '../css/macbook.css';
class Macbook extends Component{

    getSocialBugText(){
        if(!this.props.visible){
            return(
                <h1 className='macbook-header appear'>Social Bug</h1>
            );
        }else{
            return(
                <h1 className='macbook-header disappear'>Social Bug</h1>
            );
        }
    }
    render(){
        return(
            <div className='logo-container macbook'>
                {this.getSocialBugText()}
                <img src={logo} className='logo-macbook' alt='macbook'/>
            </div>
        );
    }
}

export default Macbook;