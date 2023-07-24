import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./Graph.module.css";

const GraphVisualization = ({ data }) => {
  console.log(data);
  const graphRef = useRef();

  useEffect(() => {
    // D3 code to create the graph visualization
    const svg = d3.select(graphRef.current);
    const width = 1100;
    const height = 600;

    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.edges)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .selectAll("line")
      .data(data.edges)
      .enter()
      .append("line")
      .style("stroke", "#ccc")
      .style("stroke-width", (d) => Math.sqrt(d.flow));

    const node = svg
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .style("fill", (d) => {
        switch (d.device_type) {
          case "computer":
            return "blue";
          case "laptop":
            return "green";
          case "phone":
            return "orange";
          case "printer":
            return "purple";
          case "server":
            return "red";
          case "switch":
            return "pink";
          case "modem":
            return "brown";
          case "router":
            return "teal";
          case "firewall":
            return "magenta";
          case "internet":
            return "gray";
          case "coding":
            return "cyan";
          default:
            return "black";
        }
      });

    node.append("title").text((d) => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }, [data]);

  return (
    <div className={styles.graph}>
      <svg ref={graphRef} width="1100" height="700">
        {/* Graph will be drawn here */}
      </svg>
    </div>
  );
};

export default GraphVisualization;
