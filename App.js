import React from 'react';
import { Alert } from "react-native";
import axios from "axios";
import Loading from "./Loading";
import Weather from "./Weather";
import Convert from "./CoordConvert";
import * as Location from "expo-location";
import {ServiceKey} from './Config';

const weatherList = {
  0 : {
    1 : 'Clear',
    3 : 'Clouds',
    4 : 'Clouds' //구름 많음
  },
  1 : 'Rain',
  2 : 'Hail', 
  3 : 'Snow',
  4 : 'Pouring',
}

export default class App extends React.Component {
  state = {
    isLoading : true,
    condition : null,
    POP : null,
    REH : null,
    T3H : null,
  }
  getUrl = (nx, ny) => {
    let today = new Date();

    let year = today.getFullYear().toString();
    let month = today.getMonth() + 1;
    let strMonth = ((month < 10) ? '0' + month.toString() : month.toString());
    let date = today.getDate();
    let strDate = ((date < 10) ? '0' + date.toString() : date.toString());
    let day = year + strMonth + strDate;

    let time = today.getHours();
    if(time >= 3 && time <6) time = "0200";
    else if(time >= 6 && time < 9) time = "0500";
    else if(time >= 9 && time < 12) time = "0800";
    else if(time >= 12 && time < 15) time = "1100";
    else if(time >= 15 && time < 18) time = "1400";
    else if(time >= 18 && time < 21) time = '1700';
    else if(time >= 21 && time < 24) time = "2000";
    else time = "0200";
    
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + serviceKey; /* Service Key*/
    queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent('-'); /* */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(`${day}`); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(`${time}`); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(`${nx}`); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(`${ny}`); /* */
    return url + queryParams;
  }
  getWeather = async(nx, ny) => {
    let PTY, SKY;
    const url = this.getUrl(nx, ny);
    const {data : { response : { body : { items : {item}}}}} = await axios.get(url);
    
    let items = item.filter((i) => (i.category != 'R06' && i.category != 'S06'))
    PTY = items[1].fcstValue;
    SKY = items[3].fcstValue;
    console.log(PTY, SKY);
    this.setState({
      isLoading : false,
      condition : ((PTY != 0) ? weatherList[PTY] : weatherList[PTY][SKY]),
      POP : parseInt(items[0].fcstValue),
      REH : parseInt(items[2].fcstValue),
      T3H : parseInt(items[4].fcstValue),
    })
  }
  getLocation = async () => {
    let rs;
    try{
      await Location.requestPermissionsAsync();
      const {coords : { latitude, longitude } } = await Location.getCurrentPositionAsync();
      rs = Convert("toXY", latitude, longitude);
      this.getWeather(rs.x, rs.y);
    }catch(error){
      Alert.alert("Error", error.message);
    }
  }
  componentDidMount(){
    this.getLocation();
  }
  render(){
    const { isLoading, condition, POP, REH, T3H } = this.state;
    return isLoading ? <Loading/> : <Weather condition={condition} POP={POP} REH={REH} T3H={T3H} />};
}

