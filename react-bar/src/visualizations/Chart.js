import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

const Chart = ({ data }) => {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    if (!data) return;
    // Think what do you need for the svg - x, y, height, fill, etc...
    // How to get there from raw data?

    // date scale on x axis
    // 'extent' returns a tuple with min and max
    const dateExtent = d3.extent(data, (d) => d.date);

    // scaleTime takes in JavaScript date objects specifically (linear), outputs numbers
    const xScale = d3
      .scaleTime()
      .domain(dateExtent) // Tell the scale min and max
      .range([0, width]); // Map min to 0 position, map max to full width

    // high temporature scale on y axis
    const [tempMin, tempMax] = d3.extent(data, (d) => d.high);

    // scaleLinear takes in numbers, outputs numbers
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(tempMin, 0), tempMax]) // to keep every bar inside svg viewport
      .range([height, 0]); // lowest temp 400px, highest temp 0px

    // avg temporature scale as bar color
    const colorExtent = d3.extent(data, (d) => d.avg).reverse(); // interpolateRdYlBu takes min for red, max for blue
    const colorScale = d3.scaleSequential().domain(colorExtent).interpolator(d3.interpolateRdYlBu);

    setBars(
      data.map((d) => ({
        x: xScale(d.date),
        y: yScale(d.high),
        height: yScale(d.low) - yScale(d.high), // the lower, the larger the y is
        fill: colorScale(d.avg),
      }))
    );
  }, [data]);

  return (
    <svg width={width} height={height}>
      {bars.map((bar) => (
        <rect
          key={`${bar.x}-${bar.y}-${bar.height}-${bar.fill}`}
          x={bar.x}
          y={bar.y}
          width="2"
          height={bar.height}
          fill={bar.fill}
        />
      ))}
    </svg>
  );
};

export default Chart;
