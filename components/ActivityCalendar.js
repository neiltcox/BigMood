import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Dimensions} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { callApi } from '../libs/apihelper.js';
const config = require('../config');

const happy = '#B3DEA9'
const ok = '#EE9B67'
const sad = '#F7CF6D'

export default class ActivityCalendar extends Component {
  constructor(props){
    super(props)
    this.state = {calendarHighlights : {}}
  }
  componentDidMount(){
    this.calendarHighlights()
  }

  calendarHighlights(){
    // retrieve calendar highlights from server
    callApi(`/days`, 'GET', {}, {email: config.email})
    .then((res) => {
      calendarHighlights = {}
      days = res.days

      console.log(days)
      
      for(i = 0; i < days.length; i++){
        color = ''
        switch(days[i].mood){
          case 'HAPPY':
            color = '#B3DEA9';
            break;
          case 'NEUTRAL':
            color = '#EE9B67';
            break;
          case 'SAD':
            color = '#F7CF6D';
            break;
          default:
            color = '#FFFFFF';
            break;
        }

        startingDay = true
        endingDay = true
        if(i === 0){
          if(days[i].mood === days[i+1].mood){
            endingDay = false
          }
        }else if(i === days.length-1){
          if(days[days.length-1].mood === days[days.length-2].mood){
            startingDay = false
          }
        }else{
          if(days[i].mood === days[i-1].mood){
            startingDay = false
          }
          if(days[i].mood === days[i+1].mood){
            endingDay = false
          }
        }

        calendarHighlights[days[i].date.slice(0, 10)] = {color, startingDay, endingDay}
      }
      this.setState({calendarHighlights : calendarHighlights});
    });
    // dummy data
    // calendarHighlights = {
    //   '2019-02-15': {startingDay: true, color: happy},
    //   '2019-02-16': {color: happy},
    //   '2019-02-17': {endingDay: true, color: happy,},
    //   '2019-02-18': {startingDay: true, endingDay: true, color: ok},
    //   '2019-02-19': {startingDay: true, color: sad},
    //   '2019-02-20': {endingDay: true, color: sad,},
  }

  displayDate(day){
    console.log("day selected:", day)
    callApi('/days/log', 'GET', {}, {email: config.email, date: day.dateString})
    .then(function(res){
      year = day.year;
      month = day.month;
      date = day.day;
      mood = res.mood;
      events = res.events;
      sleep = res.log.info.sleep;
      steps = res.log.info.steps;


      console.log(year);
      console.log(month);
      console.log(date);
      console.log(mood);
      console.log(sleep);
      console.log(steps);
    });
  }

  render() {
    return (
      <View>
        <CalendarList style={styles.calendarlist}
          // Enable horizontal scrolling, default = false
          horizontal={true}
          // Enable paging on horizontal, default = false
          pagingEnabled={true}
          // Set custom calendarWidth.
          calendarWidth={Dimensions.get('window').width}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => this.displayDate(day)}


          markedDates = {
            this.state.calendarHighlights
          }

          markingType = {'period'}
        />
        <View>
          <Text>
            Day:{"\n"}
            1309u309u9u
          </Text>
          <Text>
            Mood:{"\n"}
            happy boi
          </Text>
          <Text>
            Activity list:{"\n"}
            running, class, party
          </Text>
          <Text>
            Sleep Amount:{"\n"}
            7 Hours
          </Text>
          <Text>
            Step Count:{"\n"}
            10000 steps!
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  calendarlist: {
    marginTop: 22,
  },
});

AppRegistry.registerComponent('ActivityCalendar', () => ActivityCalendar);
