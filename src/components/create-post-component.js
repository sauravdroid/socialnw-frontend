import React,{Component} from 'react';
import '../css/main.css';
import '../css/create-post-component.css';
import AppHeaderComponent from './app-header-component';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import $ from 'jquery';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

class CreatePostComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            snackBarOpen: false,
            snackBarMessage:''
        };
    }
    handleSnackBarOpen = ()=>{
        this.setState({
            snackBarOpen:true
        });
    };
    handleSnackBarClose = ()=>{
        this.setState({
            snackBarOpen:false
        });
    };

    handleClick = ()=>{
        this.fileInput.click();
    };
    sharePost = ()=>{
        let file = this.fileInput.files[0];
        let title = this.title.value;
        let subheader = this.subheader.value;
        let content = this.content.value;
        if(file != undefined && title.length>1 && subheader.length>1 && content.length>1){
            if(subheader.length > 200){
                this.setState({
                snackBarMessage:'Max subheader length should be 200 characters',
                snackBarOpen:true
            });
            this.handleSnackBarOpen();
            }
            let formData = new FormData();
            formData.append('title',title);
            formData.append('subheader',subheader);
            formData.append('content',content);
            formData.append('cover_pic',file);
            $.ajax({
                url:'http://localhost:8000/post/create/',
                type:'POST',
                processData: false,
                contentType:false,
                cache: false,
                data:formData,
                beforeSend:(request)=>{
                    request.setRequestHeader('Authorization',this.props.loginStatus.user_token);
                },
                success:(response)=>{
                    this.setState({
                        snackBarMessage: "Successfully Added a new post",
                        snackBarOpen:true
                    });
                    this.handleSnackBarOpen();
                    this.props.history.push('/userprofile');
                },
                error:(error)=>{
                    this.setState({
                        snackBarMessage: "Error Occurred",
                        snackBarOpen:true
                    });
                    this.handleSnackBarOpen();
                }
            });
        }else{
            this.setState({
                snackBarMessage:'You must fill out all the fields and upload a cover pic for the post',
                snackBarOpen:true
            });
            this.handleSnackBarOpen();
        }
    };
    render(){
        const btnStyle = {
            marginLeft:10
        };
        const shareBtnStyle = {
            color:'#CC8223',
            fontSize:14,
            font:'Lato'
        }
        return(
            <div className='create-post-page-container vertical-row'>
                <AppHeaderComponent/>
                <div className='create-post-page-content vertical-row'>
                    <div className='create-post-header-container horizontal-row'>
                        <h1 className='create-post-header-text'>Create your story</h1>
                        <div className='create-post-btn-container horizontal-row'>
                            <FlatButton onTouchTap={this.handleClick} labelStyle={shareBtnStyle}  style={btnStyle} label="Upload Cover Pic">
                                <input ref={(input)=>{this.fileInput = input}} type='file' style={{display:'none'}}/>
                            </FlatButton>
                            <FlatButton onTouchTap={this.sharePost} labelStyle={shareBtnStyle} style={btnStyle} label="Share Post" />
                        </div>
                    </div>
                    <input ref={(input)=>{this.title = input}} type='text' className='create-post-input create-post-title' placeholder='Title'/>
                    <input ref = {(input)=>{this.subheader = input}} type='text' className='create-post-input create-post-subheader' placeholder='Subheader'/>
                    <textarea  ref = {(input)=>{this.content = input}} type='text' className='create-post-input create-post-content' placeholder='Write your post. Happy Writing :)'/>
                    <Snackbar
                        open={this.state.snackBarOpen}
                        message={this.state.snackBarMessage}
                        autoHideDuration={4000}
                        onRequestClose={this.handleSnackBarClose}
                        />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        loginStatus:state.loginStatus
    }
}
export default withRouter(connect(mapStateToProps)(CreatePostComponent));