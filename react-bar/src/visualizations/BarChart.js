import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

const BarChart = ({ data }) => {
  const [bars, setBars] = useState([]);
  const xAxisRef = useRef();
  const yAxisRef = useRef();
  const barsGroupRef = useRef();

  useEffect(() => {
    if (!(data && data.length)) return;
    // Think what do you need for the svg - x, y, height, fill, etc...
    // How to get there from raw data?

    // date scale on x axis
    // 'extent' returns a tuple with min and max
    const dateExtent = d3.extent(data, (d) => d.date);

    // scaleTime takes in JavaScript date objects specifically (linear), outputs numbers
    const xScale = d3
      .scaleTime()
      .domain(dateExtent) // Tell the scale min and max
      .range([margin.left, width - margin.right]); // Map min to 0 position, map max to full width

    // high temporature scale on y axis
    const [tempMin, tempMax] = d3.extent(data, (d) => d.high);

    // scaleLinear takes in numbers, outputs numbers
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(tempMin, 0), tempMax]) // to keep every bar inside svg viewport
      .range([height - margin.bottom, margin.top]); // lowest temp 400px, highest temp 0px

    // avg temporature scale as bar color
    const colorExtent = d3.extent(data, (d) => d.avg).reverse(); // interpolateRdYlBu takes min for red, max for blue
    const colorScale = d3.scaleSequential().domain(colorExtent).interpolator(d3.interpolateRdYlBu);

    const newBars = data.map((d) => ({
      x: xScale(d.date),
      y: yScale(d.high),
      height: yScale(d.low) - yScale(d.high), // the lower, the larger the y is
      fill: colorScale(d.avg),
    }));

    // Update state
    setBars(newBars);

    // Insert Axis to svg dom
    const xAxis = d3.axisBottom();
    const yAxis = d3.axisLeft();
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    d3.select(xAxisRef.current).call(xAxis);
    d3.select(yAxisRef.current).call(yAxis);
  }, [data]);

  useEffect(() => {
    if (!bars.length) return;

    // use transition to managing certain attributes
    // don't use react to manage the same attributes
    d3.select(barsGroupRef.current)
      .selectAll("rect")
      .data(bars)
      .transition()
      .attr("y", (d) => d.y)
      .attr("height", (d) => d.height)
      .attr("fill", (d) => d.fill);
  }, [bars]);

  return (
    <svg width={width} height={height}>
      {/* Bars */}
      <g ref={barsGroupRef}>
        {bars.map((bar) => (
          <rect
            key={`${bar.x}-${bar.y}-${bar.height}-${bar.fill}`}
            x={bar.x}
            width="2"
            // d3 transition is managing following attributes
            // y={bar.y}
            // height={bar.height}
            // fill={bar.fill}
          />
        ))}
      </g>

      {/* Axis */}
      <g ref={xAxisRef} transform={`translate(0,${height - margin.bottom})`} />
      <g ref={yAxisRef} transform={`translate(${margin.left},0)`} />
    </svg>
  );
};

export default BarChart;
