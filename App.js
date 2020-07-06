import React from 'react';
import { Alert } from "react-native";
import axios from "axios";
import Loading from "./Loading";
import Weather from "./Weather";
import Convert from "./CoordConvert";
import * as Location from "expo-location";

const API_KEY = "40a01aabcc694e1dacde3ce940ab96a0";

export default class App extends React.Component {
  state = {
    isLoading : true,
    condition : null,
    POP : null,
    REH : null,
    T3H : null,
  }
  getWeather = async(nx, ny) => {
    let PTY, SKY;
    const PtyObj = {
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
    const servicesKey = '=OCR%2BQp8x726v73%2FFhqmfrsPBzILqu4VruxM%2FUMb5%2FbS4h1KBZ%2BuKTwgZlgmL0exU75LVCmkpxOuozWg9jdnwYw%3D%3D'
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + servicesKey; /* Service Key*/
    queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent('-'); /* */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent('20200706'); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('1700'); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(`${nx}`); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(`${ny}`); /* */
    const {data : { response : { body : { items : {item}}}}} = await axios.get(url + queryParams);
    PTY = item[1].fcstValue;
    SKY = item[3].fcstValue;
    this.setState({
      isLoading : false,
      condition : (PTY ? PtyObj[PTY] : PtyObj[PTY][SKY]),
      POP : item[0].fcstValue,
      REH : item[2].fcstValue,
      T3H : item[4].fcstValue,
    })
    /*const {data : {main : {temp}, weather}} = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
      );
      this.setState({
        isLoading : false,
        temp : temp,
        condition : weather[0].main,
      })*/
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

