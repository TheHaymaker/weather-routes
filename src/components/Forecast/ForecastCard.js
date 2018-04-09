import React from "react";
import { Route, Link } from "react-router-dom";
import moment from "moment";
// import Moment from "react-moment";
import ForeCastCardHourlyWrapper from "./ForecastCardHourlyWrapper";
import * as utils from "../../utils/helpers";
import "./ForecastCard.css";

const ForecastCard = ({ day, handleOnClick, active }) => {
  const dayName = moment(day.dt_txt).format("ddd");

  return (
    <div
      onClick={() => handleOnClick(day)}
      className={`forecast-card ${active ? "forecast-card__active" : ""}`}
    >
      <p className="day">{dayName.toLowerCase()}</p>
      <div className="weather-icon">
        <i className={utils.buildIcon(day)} />
      </div>
      <div className="temps">
        <div className="temp-high">
          {Math.round(utils.kelvinToFahrenheit(day.main.temp_max))}
          <i className="degree-symbol" />
        </div>
        <div className="temp-low">
          {Math.round(utils.kelvinToFahrenheit(day.main.temp_min))}
          <i className="degree-symbol" />
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
