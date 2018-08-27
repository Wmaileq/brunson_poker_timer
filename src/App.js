import React, { Component } from 'react';
import {holdemCup, knockout, youngGuns} from './data';
import './App.css';

class App extends Component {
    constructor(){
        super();
        this.state = {
            settings: true,
            name: "Brunson Hold'em Cup",
            level: 0,
            time: 0,
            timer: false,
            breakAfter: undefined,
            break: false,
            breakDuration: 0,
            SB: 0,
            BB: 0,
            ante: 0,
            nextSB: 0,
            nextBB: 0,
            nextAnte: 0,
            schedule: [],
            fee:[],
            price: 0,
            currency: 'BYN'
        }
    }
    componentDidMount(){
        switch (new Date().toLocaleString('ru', {weekday: 'short'})) {
            case ('Вт'):
                this.setDefaultState(youngGuns);
                break;
            case ('Пт'):
                this.setDefaultState(knockout);
                break;
            default:
                this.setDefaultState(holdemCup);
        }
    };
    componentWillUpdate(nextProps, nextState){
        if (this.state.level !== nextState.level ) {
            if (this.state.level === this.state.breakAfter && !this.state.break) {
                this.setState({
                    name: 'Перерыв',
                    break: true,
                    time: nextState.breakDuration*60,
                })
            } else if (this.state.level === this.state.breakAfter + 1 && this.state.break){
                this.setState({
                    name: "Brunson Hold'em Cup",
                    level: this.state.breakAfter+1,
                    break: false,
                    time: nextState.schedule[nextState.level - 1].duration * 60,
                    SB: nextState.schedule[nextState.level - 1].smallBlind,
                    BB: nextState.schedule[nextState.level - 1].bigBlind,
                    nextSB: nextState.schedule[nextState.level].smallBlind,
                    nextBB: nextState.schedule[nextState.level].bigBlind,
                    ante: nextState.schedule[nextState.level].ante || '-',
                })
            } else {
                this.setState({
                    name: "Brunson Hold'em Cup",
                    time: nextState.schedule[nextState.level - 1].duration * 60,
                    SB: nextState.schedule[nextState.level - 1].smallBlind,
                    BB: nextState.schedule[nextState.level - 1].bigBlind,
                    nextSB: nextState.schedule[nextState.level].smallBlind,
                    nextBB: nextState.schedule[nextState.level].bigBlind,
                    ante: nextState.schedule[nextState.level].ante || '-',
                })
            }

        }
        if (this.state.time === 0) {
            this.setState({
                level: this.state.level+1,
            })
        }
    }

    setDefaultState(data){
        this.setState({
            level: 1,
            name: data.name,
            time: data.schedule[0].duration*60,
            breakAfter: data.breakAfter,
            breakDuration: data.breakDuration,
            SB: data.schedule[0].smallBlind,
            BB: data.schedule[0].bigBlind,
            ante: data.schedule[0].ante || '-',
            nextSB: data.schedule[1].smallBlind,
            nextBB: data.schedule[1].bigBlind,
            nextAnte: data.schedule[1].ante || '-',
            schedule: data.schedule,
            fee: data.fee,
            price: data.prize,
            currency: data.currency,
        })
    }
    toggleSettings = () =>{
        this.setState({
            settings: !this.state.settings
        })
    };
    startTimer = () =>{
        this.timer = setInterval(()=>{
            this.setState({
                time: this.state.time - 1
            })
        }, 1000);
        this.setState({
            timer: true
        })
    };
    stopTimer = () => {
        clearInterval(this.timer);
        this.setState({
            timer: false
        })
    };
    resetTimer = () => {
        clearInterval(this.timer);
        this.setState({
            timer: false,
            time: this.state.schedule[this.state.level - 1].duration*60
        })
    };
    render() {
        return (
            <div className="app">
                <div className="top">
                    <div className="left">
                        <div className="blinds-label">Now</div>
                        <div className="small-blind-wrapper">
                            <div className="small-blind-text">Small Blind</div>
                            <div className="small-blind-value" id="smallBlind">{this.state.SB}</div>
                        </div>
                        <div className="big-blind-wrapper">
                            <div className="big-blind-text">Big Blind</div>
                            <div id="bigBlind" className="big-blind-value">{this.state.BB}</div>
                        </div>
                        <div className="big-blind-wrapper">
                            <div className="big-blind-text">Ante</div>
                            <div id="bigBlind" className="big-blind-value">{this.state.ante}</div>
                        </div>
                    </div>
                    <div className="center">
                        <div className="name">{this.state.name}</div>
                        <div className="level">{this.state.level} Уровень</div>
                        <div className="timer">
                            {`${('0' +(this.state.time/3600).toFixed(0).slice(-2))}:${('0' + Math.floor((this.state.time/60))%60).slice(-2)}:${('0' +this.state.time % 60).slice(-2)}`}
                        </div>
                    </div>
                    <div className="right">
                        <div className="blinds-label">Next</div>
                        <div className="small-blind-wrapper">
                            <div className="small-blind-text">Small Blind</div>
                            <div className="small-blind-value" id="smallBlind">{this.state.nextSB}</div>
                        </div>
                        <div className="big-blind-wrapper">
                            <div className="big-blind-text">Big Blind</div>
                            <div id="bigBlind" className="big-blind-value">{this.state.nextBB}</div>
                        </div>
                        <div className="big-blind-wrapper">
                            <div className="big-blind-text">Ante</div>
                            <div className="big-blind-value">{this.state.nextAnte}</div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    {this.state.fee.map((item, index) => (
                        <div key={index} className="wrapper">
                            <div className="key">{item.name}</div>
                            <div className="value">{item.cost} {this.state.currency}</div>
                            <div className="value">{item.chips} Chips</div>
                        </div>
                    ))}
                </div>
                <button className="seettings-toggler" onClick={this.toggleSettings}>Toggle settings</button>
                {
                    this.state.settings &&
                    <div className="settings">
                        {
                            this.state.timer ?
                            <button onClick={this.stopTimer}>Остановить таймер</button> :
                            <button onClick={this.startTimer}>Запустить таймер</button>
                        }
                        {
                            <button onClick={this.resetTimer}>Обнулить таймер</button>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default App;
