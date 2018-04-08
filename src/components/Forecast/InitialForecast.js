import React from "react";
import ForecastRow from "./ForecastRow";
import ForecastCard from "./ForecastCard";

const InitialForecast = ({ forecast, handleOnClick }) => {
  return (
    <ForecastRow>
      {forecast.map(day => {
        return (
          <ForecastCard
            key={day.dt}
            day={day}
            active={day.active}
            handleOnClick={d => {
              handleOnClick(d);
            }}
          />
        );
      })}
    </ForecastRow>
  );
};

export default InitialForecast;
