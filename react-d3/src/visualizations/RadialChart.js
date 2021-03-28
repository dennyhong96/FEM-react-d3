import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const width = 650;
const height = 650;

const RadialChart = ({ data, dateRange }) => {
  const [slices, setSlices] = useState([]);
  const [tempAnnotations, setTempAnnotations] = useState([]);

  useEffect(() => {
    if (!data) return;

    const tempMax = d3.max(data, (d) => d.high);
    const radiusScale = d3
      .scaleLinear()
      .domain([0, tempMax])
      .range([0, width / 2]);

    const colorExtent = d3.extent(data, (d) => d.avg).reverse(); // reverse, otherwise low temp is in red fill
    const colorScale = d3.scaleSequential().domain(colorExtent).interpolator(d3.interpolateRdYlBu);

    // 2PI radians is 360deg, data.length is 365
    const perSliceAngle = (2 * Math.PI) / data.length;

    const genArc = d3.arc();

    setSlices(
      data.map((dataPoint, idx) => {
        const isInRange =
          (dateRange.length && dataPoint.date < dateRange[1] && dataPoint.date > dateRange[0]) ||
          !dateRange.length;

        return {
          path: genArc({
            innerRadius: radiusScale(dataPoint.low),
            outerRadius: radiusScale(dataPoint.high),
            startAngle: idx * perSliceAngle,
            endAngle: (idx + 1) * perSliceAngle,
          }),
          fill: isInRange ? colorScale(dataPoint.avg) : "#ddd",
        };
      })
    );

    // Add annotations
    setTempAnnotations(
      [5, 20, 40, 60, 80].map((temp) => ({
        r: radiusScale(temp),
        temp,
      }))
    );
  }, [data, dateRange]);

  return (
    <svg width={width} height={height}>
      {/* 'g' is for grouping, the only svg element that takes children */}
      <g transform={`translate(${width / 2},${height / 2})`}>
        {slices.map((slice, idx) => (
          <path key={idx} d={slice.path} fill={slice.fill} />
        ))}
      </g>

      {/* Annotations */}
      {tempAnnotations.map(({ r, temp }, idx) => (
        <g transform={`translate(${width / 2},${height / 2})`} key={idx}>
          <circle r={r} fill="none" stroke="#aaa" />
          <text y={-r - 5} textAnchor="middle" fill="#333">
            {temp}℉
          </text>
        </g>
      ))}
    </svg>
  );
};

export default RadialChart;
