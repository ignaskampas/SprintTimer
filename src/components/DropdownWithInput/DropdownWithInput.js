import React, { Component } from 'react'
import styles from './dropdownWithInput.module'
import onClickOutside from "react-onclickoutside";
import ArrowDown from '../ArrowDown/ArrowDown';

class DropdownWithInput extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedOptionIdx: this.props.options.findIndex(element => props.value === element),
            isOpened: false,
            options: [""],
            value: props.value ? props.value : ""
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.options !== this.props.options){
            this.setState({
                options: this.props.options
            })
        }
        if (prevState.value !== this.props.value){
            this.setState({
                value: this.props.value
            })
        }
    }

    onSelect = (idx) => {
        this.setState({
            selectedOptionIdx: idx,
            isOpened: false
        })
        this.props.setSelectedCategory(this.state.options[idx]);
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

    handleWrittenCategoryChange = (event) => {
        this.props.setSelectedCategory(event.target.value);
        this.setState({
            value: event.target.value
        })
    }

    isZeroCategories = () => {
        return this.state.options.length === 0 || (this.state.options.length === 1 &&  this.state.options[0] === "")
    }
    
    render() {
        return (
            <div className={styles.customDropdown}>
                <div className={[styles.dropdownRow, styles.selectedOptionDisplay].join(' ')} onClick={this.toggleOpen}>
                    <input 
                        className={[styles.selectedOptionDisplayText, styles.input].join(" ")} 
                        id={this.props.id} 
                        type="text" 
                        value={this.state.value} 
                        onChange={this.handleWrittenCategoryChange} 
                        autoComplete="off"/>
                    <div className={styles.arrow}>
                        <ArrowDown />
                    </div>
                </div>
                <ol className={this.isZeroCategories() ? styles.isZeroCategories : this.state.isOpened ? styles.menu : styles.isClosed}>
                    {this.state.options.map((o, idx) => 
                        <li className={this.state.selectedOptionIdx === idx ? [styles.dropdownRow, styles.dropdownMenuRow, styles.selectedMenuRow].join(' ') : [styles.dropdownRow, styles.dropdownMenuRow].join(' ')} onClick={() => {this.onSelect(idx)}} key={idx} >{o}</li>
                    )}
                </ol>
            </div>
        )
    }
}

export default onClickOutside(DropdownWithInput);