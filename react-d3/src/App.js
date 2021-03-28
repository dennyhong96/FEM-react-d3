import React, { useEffect, useState } from "react";

import BarChart from "./visualizations/BarChart";
import RadialChart from "./visualizations/RadialChart";
import LineChart from "./visualizations/LineChart";
import "./App.css";

const App = () => {
  const [temps, setTemps] = useState({});
  const [city, setCity] = useState("sf");
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.PUBLIC_URL || ""}/sf.json`),
      fetch(`${process.env.PUBLIC_URL || ""}/ny.json`),
    ])
      .then((responses) => Promise.all(responses.map((resp) => resp.json())))
      .then(([sf, ny]) => {
        sf.forEach((day) => (day.date = new Date(day.date)));
        ny.forEach((day) => (day.date = new Date(day.date)));
        setTemps({ sf, ny });
      });
  }, []);

  const updateCity = (evt) => {
    setCity(evt.target.value);
  };

  const data = temps[city];

  return (
    <div className="App">
      <h1>
        2017 Temperatures for
        <select name="city" onChange={updateCity}>
          {[
            { label: "San Francisco", value: "sf" },
            { label: "New York", value: "ny" },
            // {label: 'Amsterdam', value: 'am'},
          ].map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </h1>
      <p>
        *warning: these are <em>not</em> meant to be good examples of data visualizations,
        <br />
        but just to show the possibility of using D3 and React*
      </p>

      {/* Charts */}
      <BarChart
        data={data}
        dateRange={dateRange}
        updateDateRange={(range) => setDateRange(range)}
      />
      <RadialChart data={data} dateRange={dateRange} />
      <LineChart data={data} dateRange={dateRange} />
      {/* End Charts */}

      <p>
        (Weather data from{" "}
        <a href="wunderground.com" target="_new">
          wunderground.com
        </a>
        )
      </p>
    </div>
  );
};

export default App;
