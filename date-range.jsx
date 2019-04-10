/* В этом компоненте в календаре выбирается дата и по ней отображается список периодов. 
Периоды это недельные промежутки с понедельника по воскресенье, входящие в годовой отрезок времени, 
начинающийся с выбранного числа.
 */

import React, { Component } from 'react';

const InputDate = (props) => {
    return <input type="date"
                onFocus={(event) => event.target.style.backgroundColor = '#900'}
                onBlur={(event) => event.target.style.backgroundColor = '#fff'}
                onChange={(event) => { props.onChange(event.target.value) }} />
}

class Periods extends Component {

    createPeriod() {

        let newDate = new Date(this.props.date);
        newDate.setFullYear(newDate.getFullYear() + 1);

        return {
            start: this.props.date,
            end: newDate
        }
    }

    calcPeriod(date, hours) {
        return `${new Date(new Date(date).setHours(hours)).toLocaleDateString()} - ${new Date(new Date(date).setHours(144 + hours)).toLocaleDateString()}`;
    }

    createItems(period) {
        let periods = [];
        for (let i = +period.start; i < +period.end; i += 3600000 * 168) {
            let date = new Date(i);
            if (date.getDay() === 1) periods.push(this.calcPeriod(date, 0));
            else if (date.getDay() === 2) periods.push(this.calcPeriod(date, -24));
            else if (date.getDay() === 3) periods.push(this.calcPeriod(date, -48));
            else if (date.getDay() === 4) periods.push(this.calcPeriod(date, -72));
            else if (date.getDay() === 5) periods.push(this.calcPeriod(date, -96));
            else if (date.getDay() === 6) periods.push(this.calcPeriod(date, -120));
            else if (date.getDay() === 0) periods.push(this.calcPeriod(date, -144));
        }

        return periods;
    }

    renderItems(items) {
        return <div>{items.map((value, index) => <div key={index}>{value}</div>)}</div>
    }

    render() {
        let { updateTime, date } = this.props;
        return (
            <div>
                <div>{`Последнее изменение: ${updateTime.getDate() + '.' + (updateTime.getMonth() > 9 ? ('0' + updateTime.getMonth()) : updateTime.getMonth())}`}</div>
                <div>
                    {
                        this.renderItems(this.createItems(this.createPeriod(date)))
                    }
                </div>
            </div>
        );
    }
}

class DateRange extends Component {
    state = {
        date: null,
        updateTime: null
    }

    onChange(value) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'https://cors-anywhere.herokuapp.com/https://yandex.com/time/sync.json?geo=213');
        xmlHttp.send(null);

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status !== 200) {
                    throw Error('Could not receive data');
                } else {
                    this.setState({
                        date: new Date(value),
                        updateTime: new Date(JSON.parse(xmlHttp.responseText).time)
                    });
                }
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <InputDate onChange={this.onChange.bind(this)} />
                {this.state.date ?
                    <Periods
                        updateTime={this.state.updateTime}
                        date={this.state.date} />
                    : null}
            </React.Fragment>
        );
    }
}

export default DateRange;