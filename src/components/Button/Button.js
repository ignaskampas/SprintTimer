import React from 'react'
import styles from './button.module';

export default function Button(props) {
    return (
        <div className={styles.button} onClick={props.onClick}>
            {props.text}
        </div>
    )
}
