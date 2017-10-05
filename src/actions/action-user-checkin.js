export const userLoginAction = (token,username)=>{
    return{
        type:"USER_LOGIN",
        token:token,
        username:username
    };
};

export const userLogoutAction = (token)=>{
    return{
        type:"USER_LOGOUT",
        token:token
    };
};