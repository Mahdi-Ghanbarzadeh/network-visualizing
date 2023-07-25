import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./Graph.module.css";

const GraphVisualization = ({ data }) => {
  console.log(data);
  const graphRef = useRef();

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 0, bottom: 10, left: 10 },
    width = 1100 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // const width = 1100;
  // const height = 700; // Adjusted height to fit the graph inside the SVG element
  const edgeWidth = 2;
  const nodeRadius = 25;
  const nodeLabelVisibility = false;
  const edgeLabelVisibility = false;

  const getIcon = (device_type) => {
    switch (device_type) {
      case "computer":
        return "icons/computer.svg";
      case "laptop":
        return "icons/laptop.svg";
      case "phone":
        return "icons/phone.svg";
      case "printer":
        return "icons/printer.svg";
      case "server":
        return "icons/server.svg";
      case "switch":
        return "icons/switch.svg";
      case "modem":
        return "icons/modem.svg";
      case "router":
        return "icons/router.svg";
      case "firewall":
        return "icons/firewall.svg";
      case "internet":
        return "icons/internet.svg";
      default:
        return "icons/coding.svg"; // set a better default icon
    }
  };

  useEffect(() => {
    // D3 code to create the graph visualization
    const svg = d3.select(graphRef.current);

    // doesn't work
    // svg
    //   .append("svg")
    //   .attr("width", width + margin.left + margin.right)
    //   .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // const simulation = d3
    //   .forceSimulation(data.nodes)
    //   .force(
    //     "link",
    //     d3
    //       .forceLink(data.edges)
    //       .id((d) => d.id)
    //       .distance(80)
    //   )
    //   .force("charge", d3.forceManyBody().strength(-300))
    //   .force("center", d3.forceCenter(width / 2, height / 2));

    // added to handle collision of a text with other nodes and texts
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.edges)
          .id((d) => d.id)
          .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3
          .forceCollide(nodeRadius + 5)
          .strength(0.7)
          .iterations(5)
      ); // Add forceCollide for collision detection

    const link = svg
      .selectAll("line")
      .data(data.edges)
      .enter()
      .append("line")
      .style("stroke", "#ccc")
      .style("stroke-width", edgeWidth)
      .style("opacity", 0.6); // Add some opacity to the edges

    // Conditionally show or hide edge labels base on edgeLabelVisibility variable
    const linkLabels = svg
      .selectAll(".link-label")
      .data(data.edges)
      .enter()
      .append("text")
      .attr("class", "link-label")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("fill", "#fff")
      .style("font-size", "12px")
      .style("background-color", "#fff")
      .text((d) => (edgeLabelVisibility ? d.label : ""));

    const node = svg
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // node.append("circle").attr("r", nodeRadius).style("fill", "steelblue");

    // Append an outer circle to add a border to the node
    node
      .append("circle")
      .attr("r", nodeRadius)
      .style("fill", "steelblue")
      .style("stroke", "#bbb")
      .style("stroke-width", 1);
    // .style("pointer-events", "none"); // Disable pointer events on the border

    // Append the SVG icon image to each node's g element
    node
      .append("image")
      .attr("x", -15) // Adjust the positioning of the image within the node
      .attr("y", -15)
      .attr("width", 30) // Set the width of the image
      .attr("height", 30) // Set the height of the image
      .attr("href", (d) => getIcon(d.device_type));

    // Display the node IP above it if nodeLabelVisibility is true
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -nodeRadius - 8) // Position the text above the node
      .style("font-size", "12px")
      .style("fill", "#fff")
      .text((d) => (nodeLabelVisibility ? d.ip_address : ""));

    // node.append("title").text((d) => d.id);

    // Create the tooltip element
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", styles.tooltip)
      .style("opacity", 0);

    node
      .on("mouseover", (event, d) => {
        // Show the tooltip on hover
        tooltip.transition().duration(200).style("opacity", 0.9);
        // Position the tooltip
        tooltip
          .html(
            `<strong>Device Type:</strong> ${d.device_type}<br/><strong>Model:</strong> ${d.model}<br/><strong>Manufacturer:</strong> ${d.manufacturer}<br/><strong>Serial Number:</strong> ${d.serial_number}<br/><strong>IP:</strong> ${d.ip_address}<br/><strong>MAC:</strong> ${d.mac_address}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        // Hide the tooltip when mouse leaves the node
        tooltip.transition().duration(500).style("opacity", 0);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      // Position the link labels at the midpoint between the source and target nodes
      linkLabels
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

      node.attr("transform", (d) => {
        // Ensure nodes stay within SVG bounds
        d.x = Math.max(20, Math.min(width - (nodeRadius + 10), d.x));
        d.y = Math.max(20, Math.min(height - (nodeRadius + 10), d.y));
        return `translate(${d.x},${d.y})`;
      });
    });
  }, [data]);

  return (
    <div className={styles.graph}>
      <svg ref={graphRef} width={width} height={height}>
        {/* Graph will be drawn here */}
      </svg>
    </div>
  );
};

export default GraphVisualization;
