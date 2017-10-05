import React,{Component} from 'react';
import '../css/main.css';
import '../css/user-detail-component.css';

import Avatar from 'material-ui/Avatar';
import profilePic from '../img/profile_pic.jpg';
import {connect} from 'react-redux';
import RoundedButtonComponent from './round-button-component';
import TextField from 'material-ui/TextField';
import {withRouter} from 'react-router-dom';
import $ from 'jquery';

class UserDetailComponent extends Component{
    constructor(props){
        super(props);
        this.state= {
            update:false,
            fullName:'',
            intro:'',
            profilePicurl:'',
            isFollower:false,
            isFollowing:false,
            hasRequested:false,
            sentRequest:false
        };
        this.getRootClass = this.getRootClass.bind(this);
        this.updateUserData = this.updateUserData.bind(this);
        this.nameContainer = this.nameContainer.bind(this);
        this.introContainer = this.introContainer.bind(this);
    };
    getRootClass(){
        const style = this.state.update?'user-detail-container horizontal-row container-big':'user-detail-container horizontal-row';
        return style;
    }
    updateUserData(){
        let intro = this.intro.getValue();
        let file = this.fileUpload.files[0];
        let firstName = this.firstName.getValue();
        let lastName = this.lastName.getValue();
        let formData = new FormData();
        if(intro.length > 0 && file!= undefined && firstName.length>0 && lastName.length>0){
            formData.append('intro',intro);
            formData.append('profile_pic',file);
            formData.append('first_name',firstName);
            formData.append('last_name',lastName);
            $.ajax({
                url:'http://localhost:8000/update/',
                type:'PUT',
                processData: false,
                contentType:false,
                cache: false,
                data:formData,
                beforeSend:(request)=>{
                    request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
                },
                success:(response)=>{
                    console.log(response);
                    this.setState({update:false});
                    this.props.getUserData();
                },
                error:(error)=>{
                    console.log(error);
                }
            });
        }else{
            alert("All fields must be filled up to update");
        }
    }
    nameContainer(){
        const style = {
            borderColor:'#3E3E3E'
        };
        const rootStyle= {
            marginRight:20,
            width:150,
            marginTop:-30
        };
        const inputStyle = {
            color:'#3E3E3E'
        };
        return(
            <div className='user-name-container-input horizontal-row'>
                <TextField
                    ref={(input)=>{this.firstName = input}}
                    style={rootStyle}
                    inputStyle={inputStyle}
                    floatingLabelStyle={inputStyle}
                    hintStyle={inputStyle}
                    underlineStyle={style}
                    underlineFocusStyle={style}
                    floatingLabelText="First Name"/>
                <TextField
                    ref = {(input)=>{this.lastName=input}}
                    style={rootStyle}
                    inputStyle={inputStyle}
                    floatingLabelStyle={inputStyle}
                    hintStyle={inputStyle}
                    underlineStyle={style}
                    underlineFocusStyle={style}
                    floatingLabelText="Last Name"/>
            </div>
        );
    }
    introContainer(){
        const style = {
            borderColor:'#3E3E3E'
        };
        const inputStyle = {
            color:'#716F6F'
        };
        const textAreaStyle = {
            maxHeight:200,
            resize:'none'
        };
        const rootStyle={
            width:'80%'
        };  
        return (
            <TextField
                ref = {(input)=>{this.intro=input}}
                rowsMax={2}
                style={rootStyle}
                textareaStyle={textAreaStyle}
                inputStyle={inputStyle}
                floatingLabelStyle={inputStyle}
                hintStyle={inputStyle}
                underlineStyle={style}
                underlineFocusStyle={style}
                hintText="Intro"
                multiLine={true}
                rows={2}/>
        );
    }
    setUpdate=()=>{
        this.setState({update:!this.state.update});
    };
    sendFollowRequest=()=>{
        let data = {
            username:this.props.match.params.username
        };
        $.ajax({
            url:'http://localhost:8000/connect/request/',
            type:'POST',
            data:data,
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            },
            success:(response)=>{
                console.log(response);
                this.setState({
                    following:false,
                    alreadySent:true
                });
                this.checkUserData();
            },
            error:(error)=>{
                console.log(error);
            }
        });
    };
     deleteRequest=()=>{
        $.ajax({
            type:'POST',
            url:'http://localhost:8000/connect/request/handle/',
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            },
            data:{
                username:this.props.match.params.username,
                approval_status:false
            },
            success:(response)=>{
                console.log(response);
                this.setState({
                    requested:false,
                    following:false
                });
                this.checkUserData();
            },
            error:(err)=>{
                console.log(err);
            }
        });
    };

    acceptRequest=()=>{
        $.ajax({
            type:'POST',
            url:'http://localhost:8000/connect/request/handle/',
            beforeSend:(request)=>{
                request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
            },
            data:{
                approval_status:"accept",
                username:this.props.match.params.username
            },
            success:(response)=>{
                console.log(response);
                this.setState({
                    requested:false,
                    following:true
                });
                this.checkUserData();
            },
            error:(err)=>{
                console.log(err);
            }
        });
    };
    checkUserData=()=>{
        $.ajax({
                type:"POST",
                data:{
                    username:this.props.match.params.username
                },
                url:`http://localhost:8000/connect/request/check/`,
                beforeSend:(request)=>{
                    request.setRequestHeader("Authorization",this.props.loginStatus.user_token);
                }
            }).done((response)=>{
                console.log(response);
                this.setState({
                    isFollower:response.isFollower,
                    isFollowing:response.isFollowing,
                    hasRequested:response.hasRequested,
                    sentRequest:response.sentRequest,
                    // update:false
                });
            }).fail((err)=>{
                // this.setState({update:true});
            });
    };
    followUserButton = ()=>{
        //Case 3
        if(this.state.isFollower && this.state.isFollowing){
            return <RoundedButtonComponent label="Connected"/>;
        }
        //Case 4
        else if(this.state.sentRequest && this.state.hasRequested){
            return(
                <div>
                    <RoundedButtonComponent style={{marginRight:200}} label="Requested"/>
                    <RoundedButtonComponent  style={{marginRight:100}} onTouchTap={this.deleteRequest} label="Delete"/>
                    <RoundedButtonComponent onTouchTap={this.acceptRequest}  label="Approve"/>
                </div>
            );
        }
        //Case 6
        else if(this.state.isFollowing && this.state.hasRequested){
            return(
                <div>
                    <RoundedButtonComponent style={{marginRight:200}} label="Following"/>
                    <RoundedButtonComponent  style={{marginRight:100}} onTouchTap={this.deleteRequest} label="Delete"/>
                    <RoundedButtonComponent onTouchTap={this.acceptRequest}  label="Approve"/>
                </div>
            );
        }

        //Case 2
        else if(!this.state.isFollowing && !this.state.hasRequested && !this.state.sentRequest){
            return <RoundedButtonComponent onTouchTap={this.sendFollowRequest} label="Follow"/>
        }
        //Case 1
        else if(!this.state.isFollower && !this.state.isFollowing 
            && this.state.hasRequested && !this.state.sentRequest){
                return(
                    <div>
                        <RoundedButtonComponent style={{marginRight:200}} onTouchTap={this.sendFollowRequest} label="Follow"/>
                        <RoundedButtonComponent  style={{marginRight:100}} onTouchTap={this.deleteRequest} label="Delete"/>
                        <RoundedButtonComponent onTouchTap={this.acceptRequest}  label="Approve"/>
                    </div>
                );
        }
        //Case 5
        else if(!this.state.isFollowing && !this.state.hasRequested && this.state.sentRequest){
            return(
                <RoundedButtonComponent label="Sent"/>
            );
        }
        //Case 7
        else if(!this.state.isFollower && this.state.isFollowing && !this.state.hasRequested){
            return(
                <RoundedButtonComponent label="Following"/>
            );
        }
    }
    updateUserButton = ()=>{
        if(this.state.update){
            return (
                <div>
                    <RoundedButtonComponent onTouchTap={this.setUpdate} style={{marginRight:100}} label="Cancel"/>
                    <RoundedButtonComponent onTouchTap={this.updateUserData} label="Done"/>
                </div>);
        }else{
            return <RoundedButtonComponent onTouchTap={this.setUpdate} label="Update"/>
        }
    }

    componentDidMount(){
        this.checkUserData();
    }

    render(){
        // this.setState({update:this.props.firstTime});
        console.log(this.state.update);
        const style = {
            borderColor:'#3E3E3E'
        };
        const rootStyle= {
            marginRight:20,
            width:150,
            marginTop:-30
        };
        const inputStyle = {
            color:'#3E3E3E'
        };
        return(
            
            <div className={this.getRootClass()}>
                <div>
                    <Avatar ref={(input) => { this.avatar = input; }} src={this.props.profilePicUrl} size={80}/>
                    {this.state.update?(<input ref={(input)=>{this.fileUpload=input}} type='file' label='Update Profile Pic' />):null}
                </div>
                <div className='vertical-row user-detail-content'>
                    {this.state.update?this.nameContainer():<h1 className='username-text'>{this.props.fullName}</h1>}
                    {this.props.update && !this.state.update ?<h1 className='username-text'>Please complete your profile details</h1>:null}
                    <SocialItemContainer followingCount={this.props.followingCount}
                        followerCount={this.props.followerCount}
                        postCount={this.props.postCount}/>
                    {
                        this.state.update?this.introContainer():
                        <h3 className='user-intro-text'>
                            {this.props.intro}
                        </h3>
                    }
                    {this.props.own?this.updateUserButton():this.followUserButton()}
                </div>
            </div>
        );
    }
}
const SocialItemContainer = (props)=>{
    return(
        <div className='horizontal-row social-metrics-container'>
            <div className='social-metric-item horizontal-row'>
                <h3 className='metric-count'>{props.followerCount}</h3>
                <h3 className='metric-name'>Followers</h3>
            </div>
            <div className='social-metric-item horizontal-row'>
                <h3 className='metric-count'>{props.followingCount}</h3>
                <h3 className='metric-name'>Following</h3>
            </div>
            <div className='social-metric-item horizontal-row'>
                <h3 className='metric-count'>{props.postCount}</h3>
                <h3 className='metric-name'>Posts</h3>
            </div>
        </div>
    );
};

function mapStateToProps(state){
    return {
        loginStatus:state.loginStatus
    }
}
export default withRouter(connect(mapStateToProps)(UserDetailComponent));