import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

const LineChart = ({ data, dateRange }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!(data && data.length)) return;

    // date scale on x axis
    const dateExtent = d3.extent(data, (d) => d.date);
    const xScale = de
      .scaleTime()
      .domain(dateExtent)
      .range([margin.left, width - margin.right]);

    // temporature on y axis
    const tempMin = d3.min(data, (d) => d.low);
    const tempHigh = d3.max(data, (d) => d.high);
    const yScale = d3
      .scaleLinear()
      .domain([tempMin, tempHigh])
      .range([height - margin.bottom, margin.top]);

    // line generator
    // chainable function
    const generateLine = d3.line().x((d) => xScale(d.date));

    setLines([
      { path: generateLine.y((d) => yScale(d.low))(data), color: "blue" }, // line for low temp
      { path: generateLine.y((d) => yScale(d.high))(data), color: "red" }, // line for high temp
    ]);
  }, [data, dateRange]);

  return (
    <svg width={width} height={height}>
      {lines.map((line, idx) => (
        <path key={idx} d={line.path} strokeWidth={2} stroke={line.color} fill="none" />
      ))}
    </svg>
  );
};

export default LineChart;
