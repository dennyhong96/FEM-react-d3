import React, { Component, Fragment, useEffect, useState } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

const Chart = ({ data }) => {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    if (!data) return;

    const dateExtent = d3.extent(data, (d) => d.date);
    const xScale = d3.scaleTime().domain(dateExtent).range([0, width]);

    const [tempMin, tempMax] = d3.extent(data, (d) => d.high);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(tempMin, 0), tempMax])
      .range([height, 0]);

    const colorExtent = d3.extent(data, (d) => d.avg).reverse();
    const colorScale = d3.scaleSequential().domain(colorExtent).interpolator(d3.interpolateRdYlBu);

    setBars(
      data.map((d) => ({
        x: xScale(d.date),
        y: yScale(d.high),
        height: yScale(d.low) - yScale(d.high),
        fill: colorScale(d.avg),
      }))
    );
  }, [data]);

  return (
    <Fragment>
      <svg width={width} height={height}>
        {bars.map((bar, idx) => (
          <rect key={idx} x={bar.x} y={bar.y} width="2" height={bar.height} fill={bar.fill} />
        ))}
      </svg>
    </Fragment>
  );
};

export default Chart;
