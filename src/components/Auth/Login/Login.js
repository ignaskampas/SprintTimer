import React from 'react'
import {firebase} from '../../../firebase/index.js';
import styles from './login.module.scss'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export default function Login(props) {

    // Configure FirebaseUI.
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        credentialHelper: 'none'
    };
    
    return (
        <div>
            <div className={styles.loginCenter}>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
            </div>
        </div>
    )
}
