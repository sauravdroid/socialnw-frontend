import {combineReducers} from 'redux';
import ToggleWindowReducer from './toggleWindow';
import LoginLogoutReducer from './login-logout';

const allReducers = combineReducers({
    toggleWindow:ToggleWindowReducer,
    loginStatus:LoginLogoutReducer
});

export default allReducers;