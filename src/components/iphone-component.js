import React,{Component} from 'react';
import logo from '../svg/social-iphone.svg';
import '../css/iphone.css';
import Anime from 'react-anime';
class Iphone extends Component{
    render(){
        return(
                <Anime easing="easeOutElastic"
                    duration={400}
                    delay={500}
                    scale={!this.props.visible?[1,1]:[0,0]}>
                    <div key={1} className='logo-container iphone' >
                        <img src={logo} className='logo-iphone' alt='iphone'/>
                    </div>
                </Anime>
            );
    }
}

export default Iphone;