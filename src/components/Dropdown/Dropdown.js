import React from 'react'
import styles from './dropdown.module.scss'
import onClickOutside from "react-onclickoutside";
import ArrowDown from '../ArrowDown/ArrowDown';

class Dropdown extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            selectedOption: 0,
            isOpened: false,
            options: props.options
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.options !== this.props.options){
            this.setState({
                options: this.props.options
            })
        }
    }

    onSelect = (idx) => {
        this.setState({
            selectedOption: idx,
            isOpened: false
        })
        this.props.updateParentSelected(this.state.options[idx]);
    }

    toggleOpen = () => {
        this.setState({
            isOpened: !this.state.isOpened
        })
    }

    handleClickOutside = evt => {
        this.setState({
            isOpened: false
        })
    };

    render(){
        return (
            <div className={styles.dropdown}>
                <div className={[styles.dropdownRow, styles.selectedOptionDisplay].join(' ')} onClick={this.toggleOpen}>
                    <div className={styles.selectedOptionDisplayText}>{this.state.options[this.state.selectedOption]}</div>
                    <div className={styles.arrow}>
                        <ArrowDown />
                    </div>
                </div>
                <ol className={this.state.isOpened ? styles.menu : styles.isClosed}>
                    {this.state.options.map((o, idx) => 
                        <li className={this.state.selectedOption === idx ? [styles.dropdownRow, styles.dropdownMenuRow, styles.selectedMenuRow].join(' ') : [styles.dropdownRow, styles.dropdownMenuRow].join(' ')} onClick={() => {this.onSelect(idx)}} key={idx} >{o}</li>
                    )}
                </ol>
            </div>
        )
    }
}

export default onClickOutside(Dropdown);