import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import allReducers from './reducers';
import {loadState,saveState} from './localstorage';

const persistedState = loadState();
const store = createStore(allReducers,persistedState);
store.subscribe(()=>{
    saveState(store.getState());
});
ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
registerServiceWorker();
