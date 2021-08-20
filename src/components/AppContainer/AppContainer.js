import React from "react";
import style from './appContainer.module';
import {Provider} from 'react-redux';
import App from '../App/App';
import store from '../../redux/store';
import {BrowserRouter as Router} from 'react-router-dom';

function AppContainer() {
    return (
        <Provider store={store}>
            <div className={style.appContainer}>
                <Router>
                    <App />
                </Router>
            </div>
        </Provider>
    );
}

export default AppContainer;