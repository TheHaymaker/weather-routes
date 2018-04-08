import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import * as utils from "../../utils/helpers";

// import {
//   VictoryGroup,
//   VictoryChart,
//   VictoryBar,
//   VictoryAxis,
//   VictoryTheme
// } from "victory";

// import ForecastRow from "./ForecastRow";
// import ForecastCard from "./ForecastCard";
import ForecastCardHourlyWrapper from "./ForecastCardHourlyWrapper";
import InitialForecast from "./InitialForecast";
// import ForecastRowHourly from "./ForecastRowHourly";
// import ForecastCardHourly from "./ForecastCardHourly";

export default class ForecastContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forecast: [],
      hourlyFiveDay: [],
      location: {},
      located: false,
      displayHourly: false,
      hourlyForecastList: []
    };

    this.handleForecastSearch = this.handleForecastSearch.bind(this);
    this.handleGeoSearch = this.handleGeoSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleHourlyForecast = this.handleHourlyForecast.bind(this);
  }

  componentWillMount() {
    if ("geolocation" in navigator) {
      this.setState({ located: true });
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition(position => {
        this.setStateInterval = window.setInterval(() => {
          this.handleGeoSearch(position);
        });
      });
    } else {
      /* geolocation IS NOT available */
      this.setStateInterval = window.setInterval(() => {
        this.setState({ located: false });
      });
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.setStateInterval);
  }

  handleDailyTempChart = temp => {
    switch (temp) {
      case "high":
        let count = 0;
        const data = this.state.hourlyForecastList.map(time => {
          const high = Math.round(utils.kelvinToFahrenheit(time.main.temp_max));
          count++;
          return { x: count, y: high };
        });
        return data;

      case "low":
        let count2 = 0;
        const data2 = this.state.hourlyForecastList.map(time => {
          const low = Math.round(utils.kelvinToFahrenheit(time.main.temp_min));
          count2++;
          return { x: count2, y: low };
        });
        return data2;

      case "avg":
        let count3 = 0;
        const data3 = this.state.hourlyForecastList.map(time => {
          const high = Math.round(utils.kelvinToFahrenheit(time.main.temp_max));
          const low = Math.round(utils.kelvinToFahrenheit(time.main.temp_min));
          const avg = (high + low) / 2;
          // console.log(high, low, avg);
          count3++;
          return { x: count3, y: avg };
        });
        return data3;

      default:
        let count4 = 0;
        const data4 = this.state.hourlyForecastList.map(time => {
          const high = Math.round(utils.kelvinToFahrenheit(time.main.temp_max));
          const low = Math.round(utils.kelvinToFahrenheit(time.main.temp_min));
          const avg = (high + low) / 2;
          // console.log(high, low, avg);
          count4++;
          return { x: count4, y: avg };
        });
        return data4;
    }
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.handleForecastSearch();
    }
  };

  handleGeoSearch = pos => {
    const coords = pos.coords;
    const url = `//api.openweathermap.org/data/2.5/forecast?lat=${
      coords.latitude
    }&lon=${coords.longitude}&APPID=41208a14923fc26bae2f6ae307db826e`;
    axios
      .get(url)
      .then(res => {
        const data = res.data.list.filter(x => /12:00:00/.test(x.dt_txt));
        this.setState({
          forecast: data,
          hourlyFiveDay: res.data.list,
          location: res.data.city,
          located: false,
          displayHourly: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleHourlyForecast = day => {
    const id = day.dt;
    const newHourly = this.state.hourlyFiveDay.map(x => {
      if (x.dt === id) {
        x.active = true;
      }
      return x;
    });
    const newForecast = this.state.forecast.map(x => {
      if (x.dt === id) {
        x.active = true;
      } else {
        x.active = false;
      }
      return x;
    });
    const date = day.dt_txt.split(" ").shift();
    // console.log(date);
    const testDate = RegExp(date);
    const hourlyForecast = newHourly.filter(x => testDate.test(x.dt_txt));
    this.setState({
      displayHourly: true,
      hourlyForecastList: hourlyForecast,
      forecast: newForecast
    });
  };

  handleForecastSearch = () => {
    const zip = this.zipCode.value;
    if (zip && zip.length === 5) {
      const url = `//api.openweathermap.org/data/2.5/forecast?zip=${zip},us&APPID=41208a14923fc26bae2f6ae307db826e`;
      axios
        .get(url)
        .then(res => {
          const newState = res.data.list.map(x => {
            x.active = false;
            return x;
          });
          console.log(newState);
          const data = newState.filter(x => /12:00:00/.test(x.dt_txt));
          this.setState({
            forecast: data,
            hourlyFiveDay: newState,
            location: res.data.city,
            displayHourly: false
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({
        forecast: [],
        location: {},
        displayHourly: false
      });
    }
  };

  render() {
    // const style = {
    //   maxWidth: "70%",
    //   margin: "0 auto"
    // };
    return (
      <div>
        {this.state.located ? (
          <p>Generating your forecast...</p>
        ) : (
          <div>
            <label htmlFor="zipcode">zipcode:</label>
            <input
              id="zipcode"
              ref={zipCode => (this.zipCode = zipCode)}
              type="text"
              placeholder="e.g. 60618"
              onKeyPress={this.handleKeyPress}
            />
            <button onClick={this.handleForecastSearch}>Search</button>
          </div>
        )}
        <div>
          {this.state.location && <h2>{this.state.location.name}</h2>}
          {this.state.forecast.length ? (
            <InitialForecast
              forecast={this.state.forecast}
              handleOnClick={d => {
                this.handleHourlyForecast(d);
              }}
            />
          ) : (
            <div>
              {this.state.located ? null : <p>Get your 5-day forecast!</p>}
            </div>
          )}
        </div>
        {this.state.hourlyForecastList.length && this.state.displayHourly ? (
          <ForecastCardHourlyWrapper
            data={this.state.hourlyForecastList}
            gethigh={() => this.handleDailyTempChart("high")}
            getlow={() => this.handleDailyTempChart("low")}
            getavg={() => this.handleDailyTempChart("avg")}
          />
        ) : (
          <div>
            {this.state.hourlyForecastList.length === 0 ? (
              <p>Click on a day to see the hourly forecast.</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  // build component for search / input

  // Validation for input to dynamically search the API depending on the query
  // e.g. zipcode vs. city name vs lat/long

  // For added practice, here are a few ways you could expand on the app:

  // Add the ability to click on a day, and see its hourly forecast.
  // You can just maintain the current view in the top-level App state.

  // Add React Router to the project (npm install react-router) and
  // follow the quick start guide here to add routes, such
  // that / shows the 5-day forecast, and /[name-of-day] shows the hourly
  // forecast for a particular day.

  // Want to get really fancy? Add a graphics library like vx
  // and follow the examples here to add a graph of the temperature
  // over the course of a week or day.
}
