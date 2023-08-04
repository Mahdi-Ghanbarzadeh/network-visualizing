import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import styles from "./Graph.module.css";

const GraphVisualization = ({ data }) => {
  console.log(data);
  const graphRef = useRef();

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 0, bottom: 10, left: 10 },
    width = 1100 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // variable to keep track of clicked nodes in order to reset styles
  let setClickedNode = null;

  // const width = 1100;
  // const height = 700; // Adjusted height to fit the graph inside the SVG element
  const edgeWidth = 2;
  const nodeRadius = 25;
  const nodeLabelVisibility = true;
  const edgeLabelVisibility = true;
  const zoomScale = [1, 5];

  const forceProperties = {
    center: {
      x: 0.5, // min: 0, max: 1
      y: 0.5, // min: 0, max: 1
      strength: 1, // min: 0.1 max: 2
    },
    charge: {
      enabled: true,
      strength: -300, // min: -1000, max: -100
      distanceMin: 1, // min: 1, max: 1
      distanceMax: 2000, // min: 1000, max: 5000
      theta: 0, // min: -1, max: 1
    },
    collide: {
      enabled: true,
      radius: nodeRadius + 10,
      strength: 0.7,
      iterations: 5,
    },
    forceX: {
      enabled: false,
      strength: 0.05,
      x: 0.5,
    },
    forceY: {
      enabled: false,
      strength: 0.05,
      y: 0.5,
    },
    link: {
      enabled: true,
      distance: 80,
      iterations: 1,
      strength: 1, // set
    },
    radial: {
      enabled: false, // set
      strength: 0, // if set, the
      radius: 30, // set
      x: width / 2, // had set
      y: height / 2, // had set
    },
  };

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
        return "icons/coding.svg";
    }
  };

  useEffect(() => {
    // D3 code to create the graph visualization
    const zoom = d3
      .zoom()
      .scaleExtent([zoomScale[0], zoomScale[1]])
      .on("zoom", zoomed);

    const svg = d3
      .select(graphRef.current)
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

    const g = svg.select("g");
    if (g.empty()) {
      // Create the 'g' element only if it doesn't exist yet
      // if it doesn't check, the graph will be shown twice
      svg.append("g");
    }

    // Add the Zoom behavior to the SVG container
    // const zoom = d3.zoom().on("zoom", (event) => {
    //   svg.attr("transform", event.transform);
    // });

    // svg.call(zoom);

    // added to handle collision of a text with other nodes and texts
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "center",
        d3
          .forceCenter()
          .x(width * forceProperties.center.x)
          .y(height * forceProperties.center.y)
          .strength(forceProperties.center.strength)
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(forceProperties.charge.strength)
          .distanceMin(forceProperties.charge.distanceMin)
          .distanceMax(forceProperties.charge.distanceMax)
          .theta(forceProperties.charge.theta)
      )
      .force(
        "collide",
        d3
          .forceCollide()
          .radius(forceProperties.collide.radius)
          .strength(forceProperties.collide.strength)
          .iterations(forceProperties.collide.iterations)
      )
      .force(
        "forceX",
        d3
          .forceX()
          .strength(forceProperties.forceX.strength)
          .x(forceProperties.forceX.x)
      )
      .force(
        "forceY",
        d3
          .forceY()
          .strength(forceProperties.forceY.strength)
          .y(forceProperties.forceY.y)
      )
      .force(
        "link",
        d3
          .forceLink(data.edges)
          .id((d) => d.id)
          .distance(forceProperties.link.distance)
          .iterations(forceProperties.link.iterations)
          .strength(forceProperties.link.strength)
      )
      .force(
        "radial",
        d3
          .forceRadial(
            forceProperties.radial.radius,
            forceProperties.radial.x,
            forceProperties.radial.y
          )
          .strength(forceProperties.radial.strength)
      );

    const link = g
      .selectAll("line")
      .data(data.edges)
      .enter()
      .append("line")
      .style("stroke", "#ccc")
      .style("stroke-width", edgeWidth)
      .style("opacity", 0.6);

    const linkLabels = g
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

    const node = g
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
      )
      .on("click", nodeHandleClick);

    // Click event handler
    function nodeHandleClick(event, d) {
      if (setClickedNode === d) {
        // If the clicked node is already clicked, reset the styles
        resetStyles();
      } else {
        if (setClickedNode !== null) {
          // Reset the styles of the previously clicked node
          resetStyles();
        }

        // Get the clicked node and its connected links
        const clickedNode = d;
        const connectedLinks = data.edges.filter(
          (link) =>
            link.source.id === clickedNode.id ||
            link.target.id === clickedNode.id
        );

        // Extract the siblings from connected links
        const siblingNodes = [clickedNode];
        connectedLinks.forEach((link) => {
          if (link.source.id === clickedNode.id) {
            siblingNodes.push(link.target);
          } else {
            siblingNodes.push(link.source);
          }
        });

        // Update visualization to highlight the clicked node and its siblings
        node
          .filter((node) => siblingNodes.includes(node))
          .style("opacity", 1)
          .style("filter", "none")
          .select("circle")
          .style("fill", (node) =>
            node === clickedNode ? "steelblue" : "steelblue"
          )
          .style("stroke", (node) => (node === clickedNode ? "#ddd" : "#bbb"))
          .style("stroke-width", (node) => (node === clickedNode ? 3.5 : 2));

        node
          .filter((node) => !siblingNodes.includes(node))
          .style("opacity", 0.7)
          .style("filter", "grayscale(70%)");

        link
          .filter(
            (link) =>
              siblingNodes.includes(link.source) &&
              siblingNodes.includes(link.target)
          )
          .style("opacity", 1)
          .style("filter", "none");

        link
          .filter(
            (link) =>
              !siblingNodes.includes(link.source) ||
              !siblingNodes.includes(link.target)
          )
          .style("opacity", 0.05)
          .style("filter", "grayscale(70%)");

        linkLabels
          .filter(
            (link) =>
              siblingNodes.includes(link.source) &&
              siblingNodes.includes(link.target)
          )
          .style("opacity", 1)
          .style("filter", "none");

        linkLabels
          .filter(
            (link) =>
              !siblingNodes.includes(link.source) ||
              !siblingNodes.includes(link.target)
          )
          .style("opacity", 0.4)
          .style("filter", "grayscale(70%)");

        // Set the clicked node in order to keep and reset it
        setClickedNode = clickedNode;
      }
    }

    // Function to reset the styles
    function resetStyles() {
      node
        .style("opacity", 1)
        .style("filter", "none")
        .select("circle")
        .style("fill", "steelblue")
        .style("stroke", "#bbb")
        .style("stroke-width", 1);

      link.style("opacity", 0.6).style("filter", "none");
      linkLabels.style("opacity", 1).style("filter", "none");
      setClickedNode = null;
    }

    // Append an outer circle to add a border to the node
    node
      .append("circle")
      .attr("r", nodeRadius)
      .style("fill", "steelblue")
      .style("stroke", "#bbb")
      .style("stroke-width", 1);

    // Append the SVG icon image to each node's g element
    node
      .append("image")
      .attr("x", -15)
      .attr("y", -15)
      .attr("width", 30) //  width of the image
      .attr("height", 30) // height of the image
      .attr("href", (d) => getIcon(d.device_type));

    // Display the node IP above it if nodeLabelVisibility is true
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -nodeRadius - 8) // Position the text above the node
      .style("font-size", "12px")
      .style("fill", "#fff")
      .text((d) => (nodeLabelVisibility ? d.ip_address : ""));

    // Create the tooltip element
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", styles.tooltip)
      .style("opacity", 0);

    node
      .on("mouseover", (event, d) => {
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

    function zoomed({ transform }) {
      g.attr("transform", transform);
    }

    // the function tested, but the button doesn't exist.
    function zoomReset() {
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    }

    // the function tested, but the button doesn't exist.
    function zoomIn() {
      svg.transition().call(zoom.scaleBy, 2);
    }

    // the function tested, but the button doesn't exist.
    function zoomOut() {
      svg.transition().call(zoom.scaleBy, 0.5);
    }

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
        {/* Create a container for the graph elements */}
      </svg>
    </div>
  );
};

export default GraphVisualization;
