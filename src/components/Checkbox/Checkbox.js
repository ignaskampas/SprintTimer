import React, { Component } from 'react'
import styles from './checkbox.module'

export default class Checkbox extends Component {

    constructor(props){
        super(props);
        this.state = ({
            isChecked: props.isChecked,
        })
    }

    handleChange = (event) => {
        this.setState({
            isChecked: event.target.checked
        })
        this.props.setIsChecked(event.target.checked);
    }

    render() {
        return (
            <label className={styles.container}>
                <div className={styles.text}>{this.props.text}</div>
                &nbsp;
                <div className={styles.boxContainer}>
                    <input className={styles.input} type="checkbox" checked={this.state.isChecked} onChange={this.handleChange} />
                    <span className={styles.checkmark}></span>
                </div>
            </label>
        )
    }
}
