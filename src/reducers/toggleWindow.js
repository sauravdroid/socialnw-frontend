const initialState = {
    toggleWindowStatus:false,
    toggleWindowType:'login'
};
export default function(state = initialState , action){
    switch(action.type){
        case "TOGGLE_WINDOW":
            return Object.assign({},state,{
                toggleWindowStatus: action.payload.windowStatus,
                toggleWindowType: action.payload.windowType
            });
        default:
            return state;
    }
}