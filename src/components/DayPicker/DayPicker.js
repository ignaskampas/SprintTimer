import React from 'react';
import styles from './dayPicker.module';

export default class DayPicker extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedDay: props.selectedDay,
            monthDisplayedIdx: props.selectedDay.getMonth(),
            yearDisplayed: props.selectedDay.getFullYear(),
            inputValue: this.dateToString(props.selectedDay),
            calendarIsOpened: false
        }
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount(){
        window.addEventListener('click', this.handleClickOutside, false);
    }

    componentWillUnmount(){
        window.removeEventListener('click', this.handleClickOutside, false);
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.selectedDay !== this.props.selectedDay){
            this.setState({
                selectedDay: this.props.selectedDay,
                inputValue: this.dateToString(this.props.selectedDay),
                monthDisplayedIdx: this.props.selectedDay.getMonth(),
                yearDisplayed: this.props.selectedDay.getFullYear()
            })
        }
    }

    handleClickOutside = e => {
        if (!document.getElementById('input').contains(e.target) && !document.getElementById('calendar').contains(e.target)){
            this.setState({
                calendarIsOpened: false
            })
        }
    }

    getMonthName = (monthIdx) => {
        switch(monthIdx){
            case 0: 
                return "January";
            case 1: 
                return "February";
            case 2: 
                return "March";
            case 3: 
                return "April";
            case 4: 
                return "May";
            case 5: 
                return "June";
            case 6: 
                return "July";
            case 7: 
                return "August";
            case 8: 
                return "September";
            case 9: 
                return "October";
            case 10: 
                return "November";
            case 11: 
                return "December";
        }
    }

    getNrDaysInMonth = (monthNr, year) => {
        return new Date(year, monthNr, 0).getDate();
    }

    onPrevMonthClick = () => {
        this.setState({
            monthDisplayedIdx: this.state.monthDisplayedIdx - 1 < 0 ? 11 : this.state.monthDisplayedIdx - 1,
            yearDisplayed: this.state.monthDisplayedIdx - 1 < 0 ? this.state.yearDisplayed - 1 : this.state.yearDisplayed
        })
    }

    onNextMonthClick = () => {
        this.setState({
            monthDisplayedIdx: this.state.monthDisplayedIdx + 1 < 12 ? this.state.monthDisplayedIdx + 1 : 0,
            yearDisplayed: this.state.monthDisplayedIdx + 1 < 12 ? this.state.yearDisplayed : this.state.yearDisplayed + 1
        })
    }

    isDaySelected = (day) => {
        return day === this.state.selectedDay.getDate() &&
        this.state.monthDisplayedIdx === this.state.selectedDay.getMonth() &&
        this.state.yearDisplayed === this.state.selectedDay.getFullYear()
    }

    isDayToday = (day, monthIdx, year) => {
        var today = new Date();
        return day === today.getDate() && monthIdx === today.getMonth() && year === today.getFullYear()
    }

    onDaySelected = function(day) {
        this.props.setSelectedDay(new Date(`${this.state.monthDisplayedIdx + 1}/${day}/${this.state.yearDisplayed}`));
        this.setState({
            calendarIsOpened: false
        })
    }

    changeToTwoDigitsFormat = (num) => {
        return `${num < 10 ? `0${num}` : num}`
    }

    dateToString = (date) => {
        return `${  this.changeToTwoDigitsFormat(date.getDate())}/${this.changeToTwoDigitsFormat(date.getMonth() + 1)}/${date.getFullYear()}`;
    }

    dateIsValid = (dateStr) => {
        var reg = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/g;
        return (dateStr.match(reg) ? true : false);
    }

    changeDateFormat = (dateStr) => {
        return `${dateStr.substring(3,5)}/${dateStr.substring(0,2)}/${dateStr.substring(6)}`
    }

    dayIsDisabled = (day, month, year) => {
        return (new Date(`${month}/${day}/${year}`) > new Date() ? true : false);
    }

    handleInputChange = (event) => {
        var newInput = event.target.value;
        this.setState({
            inputValue: newInput
        })
        if(this.dateIsValid(newInput) && !this.dayIsDisabled(newInput.substring(0,2), newInput.substring(3,5), newInput.substring(6))){
            this.props.setSelectedDay(new Date(this.changeDateFormat(newInput)));
        }
    }

    getDayCell = (day, monthIdx, year, key) => {
        return (
            <td className={
                this.dayIsDisabled(day, monthIdx + 1, year) ?    
                    [styles.tCell, styles.dayIsDisabled].join(" ")    
                    :   this.isDaySelected(day) && this.isDayToday(day, monthIdx, year) ? 
                        [styles.tCell, styles.dayIsSelected, styles.todayDay].join(" ")
                        :
                        this.isDaySelected(day) ?
                        [styles.tCell, styles.dayIsSelected].join(" ") 
                        : this.isDayToday(day, monthIdx, year) ?
                            [styles.tCell, styles.todayDay].join(" ")
                            : styles.tCell 
                } key={key}
                onClick={this.dayIsDisabled(day, monthIdx + 1, year) ? function(){} : this.onDaySelected.bind(this, day)}
                >
                <div className={
                    this.dayIsDisabled(day, monthIdx + 1, year) ?
                        ""
                        :
                        styles.dayIsEnabled
                }>
                    {day}
                </div>
            </td>
        );
    }
    
    getDayTableRows = (daysInMonth) => {
        var content = [];
        var firstOfMonthDate = new Date(`${this.state.monthDisplayedIdx + 1}/01/${this.state.yearDisplayed}`);
        var firstOfMonthDayOfWeek = firstOfMonthDate.getDay();
        firstOfMonthDayOfWeek = firstOfMonthDayOfWeek - 1 < 0 ? firstOfMonthDayOfWeek = 6 : firstOfMonthDayOfWeek - 1;
        var currentDayToAdd = 1;
        var weekDayCells = [];
        var i = 0;

        for (i; i < firstOfMonthDayOfWeek; i++){
            weekDayCells.push(
                <td key={i + 50}></td>
            )
        }

        for (i; i < 7; i++){
            weekDayCells.push(this.getDayCell(currentDayToAdd, this.state.monthDisplayedIdx , this.state.yearDisplayed, i))
            currentDayToAdd++;
        }

        var tableRow = (
            <tr key="0">
                {weekDayCells}
            </tr>
        )

        content.push(tableRow);

        for (i; i < daysInMonth + firstOfMonthDayOfWeek; i += 7){
            weekDayCells = [];
            var firstDayOfWeek = currentDayToAdd;
            for (currentDayToAdd; currentDayToAdd < daysInMonth + 1 && currentDayToAdd < firstDayOfWeek + 7; currentDayToAdd++  ){
                weekDayCells.push(this.getDayCell(currentDayToAdd, this.state.monthDisplayedIdx , this.state.yearDisplayed, currentDayToAdd))
            }
            tableRow = (
                <tr key={i}>
                    {weekDayCells}
                </tr>
            )
            content.push(tableRow);
        }
        return content
    }

    toggleCalendar = () => {
        this.setState({
            calendarIsOpened: !this.state.calendarIsOpened
        })
    }

    render(){
        return (
            <div className={styles.dayPicker}>
                <input id="input" className={styles.input} type="text" value={this.state.inputValue} onChange={this.handleInputChange} onClick={this.toggleCalendar}/>
                <br/>
                <div id="calendar" className={this.state.calendarIsOpened ? styles.calendar : styles.calendarIsClosed}>
                    <div className={styles.navbar}>
                        <div className={styles.monthName}>{this.getMonthName(this.state.monthDisplayedIdx)} {this.state.yearDisplayed}</div>
                        <div className={styles.changeMonthBtns}>
                            <div className={[styles.arrow, styles.arrowLeft].join(" ")} onClick={this.onPrevMonthClick}></div>
                            <div className={[styles.arrow, styles.arrowRight].join(" ")} onClick={this.onNextMonthClick}></div>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Mo</th>
                                <th>Tu</th>
                                <th>We</th>
                                <th>Th</th>
                                <th>Fr</th>
                                <th>Sa</th>
                                <th>Su</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.getDayTableRows(this.getNrDaysInMonth(this.state.monthDisplayedIdx + 1, this.state.yearDisplayed))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        )
    }
}
