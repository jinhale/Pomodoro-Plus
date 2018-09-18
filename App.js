import React from 'react';
import { TextInput, Text, View, Button } from 'react-native';

import { styles, theme } from './Styles.js';
import { minutesOfWorkLeft,
         shortBreaksLeft,
         shortBreakMinutesLeft,
         longBreakMinutesLeft,
} from './AppStatus.js';

const interval = __DEV__ ? 10 : 1000;

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            minutesOfWorkLeft: minutesOfWorkLeft,
            secondsOfWorkLeft: '00',
            secondsOfShortBreakTime: shortBreakMinutesLeft,
            secondsOfLongBreakTime: longBreakMinutesLeft,
            minutesOfShortBreakTime: '5',
            minutesOfLongBreakTime: '15',
            minutesOfPlanningTime: '2',
            minutesOfReviewTime: '3',
            shortBreaksLeft: shortBreaksLeft,
            shortWorkDescription: 'Work!',
            timerId: 0,
            isWorking: false,
        }
    }

    resetAllTimers() {
        clearInterval(this.state.timerId);

        this.setState({
            minutesOfShortBreakTime: shortBreakMinutesLeft,
            secondsOfShortBreakTime: '00',
            minutesOfLongBreakTime: longBreakMinutesLeft,
            secondsOfLongBreakTime: '00',
            minutesOfWorkLeft: minutesOfWorkLeft,
            secondsOfWorkLeft: '00',
            isWorking: false,
        });
    }

    startLongBreak() {
        this.setState({
            shortBreaksLeft: shortBreaksLeft,
            longBreakMinutesLeft: longBreakMinutesLeft,
        });
    }

    startShortBreak() {
        this.setState({
            shortBreaksLeft: this.shortBreaksLeft - 1,
        });
    }

    startBreak() {
        if (Number(this.state.shortBreaksLeft) <= 0) {
            this.startLongBreak();
        } else {
            this.startShortBreak();
        }
    }

    finishWork() {
        if (this.state.autoBreak) {
            this.startBreak();
        }

        this.setState({
            minutesOfWorkLeft: minutesOfWorkLeft,
        });

        clearInterval(this.state.timerId);
    }

    decrementMinutes(seconds, minutes) {
        const secondsLeft = Number(this.state[seconds]) - 1;
        const minutesLeft = Number(this.state[minutes]) - 1;

        if (secondsLeft <= 0) {
            let minutesState = {};

            minutesState[minutes] = String(minutesLeft);

            this.setState(minutesState);
        }
    }

    decrementSeconds(seconds) {
        const secondsLeft = Number(this.state[seconds]) - 1;

        let secondsState = {};

        if (secondsLeft <= 0) {
            secondsState[seconds] = '59';
        } else if (secondsLeft < 10) {
            secondsState[seconds] = '0' + String(secondsLeft);
        } else {
            secondsState[seconds] = String(secondsLeft);
        }

        this.setState(secondsState);
    }

    decrementWorkMinutes() {
        if (Number(this.state.minutesOfWorkLeft) < 0) {
            this.resetAllTimers();

            return;
        }

        this.decrementMinutes('secondsOfWorkLeft', 'minutesOfWorkLeft');
    }

    decrementWorkSeconds() {
        this.decrementSeconds('secondsOfWorkLeft');
    }

    decrementLongBreakMinues() {
        this.decrementMinutes('secondsOfLongBreakTime', 'minutesOfLongBreakTime');
    }

    decrementLongBreakSeconds() {
        this.decrementSeconds('secondsOfLongBreakTime');
    }

    decrementShortBreakMinues() {
        this.decrementMinutes('secondsOfShortBreakTime', 'minutesOfShortBreakTime');
    }

    decrementShortBreakSeconds() {
        this.decrementSeconds('secondsOfShortBreakTime');
    }

    startWork() {
        if (this.state.isWorking) {
            return;
        }

        const id  = setInterval(() => {
            this.decrementWorkMinutes();
            this.decrementWorkSeconds();
        }, interval);

        this.setState({
            timerId: id,
            isWorking: true,
        });
    }

    decrementShortBreak() {
        if (Number(this.state.minutesOfShortBreakTime) < 0) {
            this.resetAllTimers();

            return;
        }

        this.decrementShortBreakMinues();
        this.decrementShortBreakSeconds();
    }

    decrementLongBreak() {
        if (Number(this.state.minutesOfLongBreakTime) < 0) {
            this.resetAllTimers();

            return;
        }

        this.decrementLongBreakMinues();
        this.decrementLongBreakSeconds();
    }

    startBreak() {
        if (!this.state.isWorking) {
            return;
        }

        let decrementer = null;

        if (this.state.shortBreaksLeft > 0) {
            decrementer = this.decrementShortBreak.bind(this);
        } else {
            decrementer = this.decrementLongBreak.bind(this);
        }

        const id = setInterval(() => {
            decrementer();
        }, interval);

        if (this.state.timerId) {
            clearInterval(this.state.timerId);
        }

        this.setState({
            isWorking: false,
            timerId: id,
        });
    }

    skipWork() {
        this.resetAllTimers();
        this.startBreak();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.ticker, theme.ticker]}>
                    <Text
                        style={[styles.text, styles.tickerText]}>
                        {this.state.minutesOfWorkLeft}:{this.state.secondsOfWorkLeft}</Text>
                </View>

                <TextInput
                    style={[styles.text, styles.narrowSettings, ]}
                    value={this.state.minutesOfShortBreakTime} />
                <TextInput
                    style={[styles.text, styles.narrowSettings, ]}
                    value={this.state.minutesOfLongBreakTime} />
                <TextInput
                    style={[styles.text, styles.narrowSettings, ]}
                    value={this.state.minutesOfPlanningTime} />
                <TextInput
                    style={[styles.text, styles.narrowSettings, ]}
                    value={this.state.minutesOfReviewTime} />

                <View style={[styles.buttonContainer, ]}>
                    <Button
                        disabled={this.state.isWorking}
                        onPress={this.startWork.bind(this)}
                        title={this.state.shortWorkDescription}
                        accessibilityLabel="Press to start work timer."/>
                </View>

                <View style={[styles.buttonContainer, ]}>
                    <Button
                        disabled={!this.state.isWorking}
                        style={{width: '100%', }}
                        onPress={this.resetAllTimers.bind(this)}
                        title='Cancel'
                        accessibilityLabel="Press to cancel timer."/>
                </View>

                <View style={[styles.buttonContainer, ]}>
                    <Button
                        disabled={!this.state.isWorking}
                        style={{width: '100%', }}
                        onPress={this.skipWork.bind(this)}
                        title='Skip'
                        accessibilityLabel="Press to skip timer."/>
                </View>

            </View>
        );
    }
}
