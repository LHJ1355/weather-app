import React from 'react';
import { Alert } from "react-native";
import axios from "axios";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from "expo-location";

const API_KEY = "40a01aabcc694e1dacde3ce940ab96a0";

export default class App extends React.Component {
  state = {
    isLoading : true,
    temp : null,
    condition : null,
  }
  getWeather = async(latitude, longitude) => {
    const {data : {main : {temp}, weather}} = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
      );
      this.setState({
        isLoading : false,
        temp : temp,
        condition : weather[0].main,
      })
  }
  getLocation = async () => {
    try{
      await Location.requestPermissionsAsync();
      const {coords : { latitude, longitude } } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    }catch(error){
      Alert.alert("Error", error.message);
    }
  }
  componentDidMount(){
    this.getLocation();
  }
  render(){
    const { isLoading, temp, condition } = this.state;
    return isLoading ? <Loading/> : <Weather condition={condition} temp={temp}/>};
}

