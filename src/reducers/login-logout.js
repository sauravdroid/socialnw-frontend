const initialState = {
    isLoggedIn:true,
    user_token:null,
    username:null
};

export default function(state=initialState,action){
    switch(action.type){
        case "USER_LOGIN":
            return Object.assign({},state,{
                isLoggedIn:true,
                user_token:action.token,
                username:action.username
            });
        case "USER_LOGOUT":
            return Object.assign({},state,{
                isLoggedIn:false,
                user_token:action.token,
                username:null
            });
        default:
            return state;
    }
}