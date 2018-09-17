import React from 'react';
import { TextInput, Text, View, Button } from 'react-native';

import { styles, theme } from './Styles.js';
import { minutesOfWorkLeft, shortBreaksLeft } from './AppStatus.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            minutesOfWorkLeft: minutesOfWorkLeft,
            secondsOfWorkLeft: '00',
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

    componentDidMount() {

    }

    hasRemainingTime() {
        const minutes = this.state.minutesOfWorkLeft;
        const seconds = this.state.secondsOfWorkLeft;

        return Number(minutes) >= 0 || Number(seconds) >= 0;
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

    decrementWorkMinutes() {
        const secondsLeft = Number(this.state.secondsOfWorkLeft);
        const minutesLeft = Number(this.state.minutesOfWorkLeft);

        if ((secondsLeft - 1 ) <= 0) {
            this.setState({
                minutesOfWorkLeft: minutesLeft - 1,
            });
        }
    }

    decrementWorkSeconds() {
        const secondsLeft = Number(this.state.secondsOfWorkLeft) - 1;

        if (secondsLeft <= 0) {
            this.setState({
                secondsOfWorkLeft: '59'
            });
        } else if (secondsLeft < 10) {
            this.setState({
                secondsOfWorkLeft: '0' + String(secondsLeft),
            })
        } else {
            this.setState({
                secondsOfWorkLeft: String(secondsLeft),
            });
        }
    }

    startWork() {
        if (this.state.isWorking) {
            return;
        }

        const id  = setInterval(() => {
            this.decrementWorkSeconds();
            this.decrementWorkMinutes();
        }, 1000);

        this.setState({
            timerId: id,
            isWorking: true,
        });
    }

    cancelWork() {
        clearInterval(this.state.timerId);

        this.setState({
            minutesOfWorkLeft: minutesOfWorkLeft,
            secondsOfWorkLeft: '59',
            isWorking: false,
        });
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
                        onPress={this.cancelWork.bind(this)}
                        title='Cancel'
                        accessibilityLabel="Press to cancel timer."/>
                </View>
            </View>
        );
    }
}
