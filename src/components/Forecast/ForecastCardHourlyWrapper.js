import React from "react";

import {
  VictoryGroup,
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme
} from "victory";

import ForecastRowHourly from "./ForecastRowHourly";
import ForecastCardHourly from "./ForecastCardHourly";

const ForecastCardHourlyWrapper = ({ data, gethigh, getlow, getavg }) => {
  const style = {
    maxWidth: "70%",
    margin: "0 auto"
  };
  return (
    <div>
      <ForecastRowHourly>
        {data.map(day => {
          return <ForecastCardHourly key={day.dt} day={day} />;
        })}
      </ForecastRowHourly>
      <div style={style}>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={{ x: 20 }}
          height={200}
          style={{
            data: { opacity: 0.7 },
            text: {
              fontFamily: "'Open Sans', Arial, sans-serif !important",
              fontSize: "8px !important"
            }
          }}
        >
          <VictoryAxis
            crossAxis
            theme={VictoryTheme.material}
            standalone={false}
            label="Time"
            style={{
              axis: { stroke: "#f5f5f5" },
              axisLabel: { fontSize: 8, padding: 30 },
              tickLabels: { fontSize: 6, padding: 5 }
            }}
          />
          <VictoryAxis
            dependentAxis
            crossAxis
            theme={VictoryTheme.material}
            standalone={false}
            label="Temp (Fahrenheit)"
            style={{
              axis: { stroke: "#f5f5f5" },
              axisLabel: { fontSize: 8, padding: 30 },
              tickLabels: { fontSize: 6, padding: 5 }
            }}
          />
          <VictoryGroup
            animate={{
              duration: 250,
              onLoad: { duration: 250 }
            }}
            offset={7}
            colorScale={[
              "rgb(24, 100, 156)",
              "rgb(68, 176, 227)",
              "rgb(144, 209, 240)"
            ]}
          >
            <VictoryBar alignment="start" barRatio={0.2} data={gethigh()} />
            <VictoryBar alignment="start" barRatio={0.2} data={getavg()} />
            <VictoryBar alignment="start" barRatio={0.2} data={getlow()} />
          </VictoryGroup>
        </VictoryChart>
        <p>Daily Temperatures</p>
      </div>
    </div>
  );
};

export default ForecastCardHourlyWrapper;
