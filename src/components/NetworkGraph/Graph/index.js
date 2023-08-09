import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import styles from "./Graph.module.css";

const GraphVisualization = ({
  width,
  height,
  edge_width,
  node_radius,
  node_label_visibility,
  edge_label_visibility,
  zoom_scale,
  force_properties,
  default_force_properties,
  data,
}) => {
  console.log("force properties in graph");
  console.log(force_properties);
  console.log("node_label_visibility");
  console.log(node_label_visibility);
  console.log("edge_label_visibility");
  console.log(edge_label_visibility);

  // Create a ref to store the graph
  const graphRef = useRef();

  // variable to keep track of clicked nodes in order to reset styles
  let setClickedNode = null;

  // Create a ref to store the simulation, link, linkLabels and node instance
  const simulationRef = useRef(null);
  const linkRef = useRef();
  const linkLabelsRef = useRef();
  const nodeRef = useRef();

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
      .scaleExtent([zoom_scale[0], zoom_scale[1]])
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

    linkRef.current = g
      .selectAll("line")
      .data(data.edges)
      .enter()
      .append("line")
      .style("stroke", "#ccc")
      .style("stroke-width", edge_width)
      .style("opacity", 0.6);

    linkLabelsRef.current = g
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
      .text((d) => (edge_label_visibility ? d.label : ""));

    nodeRef.current = g
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
            if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulationRef.current.alphaTarget(0);
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
        nodeRef.current
          .filter((node) => siblingNodes.includes(node))
          .style("opacity", 1)
          .style("filter", "none")
          .select("circle")
          .style("fill", (node) =>
            node === clickedNode ? "steelblue" : "steelblue"
          )
          .style("stroke", (node) => (node === clickedNode ? "#ddd" : "#bbb"))
          .style("stroke-width", (node) => (node === clickedNode ? 3.5 : 2));

        nodeRef.current
          .filter((node) => !siblingNodes.includes(node))
          .style("opacity", 0.7)
          .style("filter", "grayscale(70%)");

        linkRef.current
          .filter(
            (link) =>
              siblingNodes.includes(link.source) &&
              siblingNodes.includes(link.target)
          )
          .style("opacity", 1)
          .style("filter", "none");

        linkRef.current
          .filter(
            (link) =>
              !siblingNodes.includes(link.source) ||
              !siblingNodes.includes(link.target)
          )
          .style("opacity", 0.05)
          .style("filter", "grayscale(70%)");

        linkLabelsRef.current
          .filter(
            (link) =>
              siblingNodes.includes(link.source) &&
              siblingNodes.includes(link.target)
          )
          .style("opacity", 1)
          .style("filter", "none");

        linkLabelsRef.current
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
      nodeRef.current
        .style("opacity", 1)
        .style("filter", "none")
        .select("circle")
        .style("fill", "steelblue")
        .style("stroke", "#bbb")
        .style("stroke-width", 1);

      linkRef.current.style("opacity", 0.6).style("filter", "none");
      linkLabelsRef.current.style("opacity", 1).style("filter", "none");
      setClickedNode = null;
    }

    // Append an outer circle to add a border to the node
    nodeRef.current
      .append("circle")
      .attr("r", node_radius)
      .style("fill", "steelblue")
      .style("stroke", "#bbb")
      .style("stroke-width", 1);

    // Append the SVG icon image to each node's g element
    nodeRef.current
      .append("image")
      .attr("x", -15)
      .attr("y", -15)
      .attr("width", 30) //  width of the image
      .attr("height", 30) // height of the image
      .attr("href", (d) => getIcon(d.device_type));

    // Display the node IP above it if node_label_visibility is true
    nodeRef.current
      .append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("y", -node_radius - 8) // Position the text above the node
      .style("font-size", "12px")
      .style("fill", "#fff")
      .text((d) => (node_label_visibility ? d.ip_address : ""));

    // Create the tooltip element
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", styles.tooltip)
      .style("opacity", 0);

    nodeRef.current
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

    // Initialize the simulation with the initial force properties
    initializeSimulation();

    return () => {
      // Cleanup function to stop the simulation on unmount
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [data]);

  // Use useEffect hook to update the simulation whenever force_properties changes
  useEffect(() => {
    console.log("useEffect with force_properties*****");
    if (!data || !data.nodes || data.nodes.length === 0) return; // Don't proceed if data is not ready

    // If the simulation is running, stop it before updating the forces
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Update the simulation forces with the new force_properties
    updateForces();

    // Restart the simulation with the updated forces
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
    }
  }, [data, force_properties]);

  // Use useEffect hook to update the edge and node labels visibility
  useEffect(() => {
    linkLabelsRef.current.text((d) => (edge_label_visibility ? d.label : ""));

    nodeRef.current
      .select(".node-label")
      .text((d) => (node_label_visibility ? d.ip_address : ""));
  }, [node_label_visibility, edge_label_visibility]);

  // Function to initialize the simulation with the initial force properties
  const initializeSimulation = () => {
    simulationRef.current = d3
      .forceSimulation(data.nodes)
      .force("center", d3.forceCenter())
      .force("charge", d3.forceManyBody())
      .force("collide", d3.forceCollide())
      .force("forceX", d3.forceX())
      .force("forceY", d3.forceY())
      .force(
        "link",
        d3
          .forceLink()
          .links(data.edges)
          .id((d) => d.id)
      )
      .force("radial", d3.forceRadial());

    simulationRef.current.on("tick", () => {
      // Access link, linkLabels, and node using refs
      linkRef.current
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      // Position the link labels at the midpoint between the source and target nodes
      linkLabelsRef.current
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

      nodeRef.current.attr("transform", (d) => {
        // Ensure nodes stay within SVG bounds
        d.x = Math.max(20, Math.min(width - (node_radius + 10), d.x));
        d.y = Math.max(20, Math.min(height - (node_radius + 10), d.y));
        return `translate(${d.x},${d.y})`;
      });
    });
  };

  // Function to update the simulation forces with new force_properties
  const updateForces = () => {
    if (!simulationRef.current) return;

    simulationRef.current
      .force("center")
      .x(width * force_properties.center.x)
      .y(height * force_properties.center.y)
      .strength(force_properties.center.strength);

    if (force_properties.charge.enabled) {
      simulationRef.current
        .force("charge")
        .strength(force_properties.charge.strength)
        .distanceMin(force_properties.charge.distanceMin)
        .distanceMax(force_properties.charge.distanceMax)
        .theta(force_properties.charge.theta);
    } else {
      simulationRef.current.force("charge", null); // Remove the charge force
      simulationRef.current.force(
        "charge",
        d3.forceManyBody().strength(default_force_properties.charge.strength)
      );

      // return to the all default state
      // simulationRef.current
      //   .force("charge")
      //   .strength(default_force_properties.charge.strength)
      //   .distanceMin(default_force_properties.charge.distanceMin)
      //   .distanceMax(default_force_properties.charge.distanceMax)
      //   .theta(default_force_properties.charge.theta);
    }

    if (force_properties.collide.enabled) {
      simulationRef.current
        .force("collide")
        .radius(force_properties.collide.radius)
        .strength(force_properties.collide.strength)
        .iterations(force_properties.collide.iterations);
    } else {
      simulationRef.current.force("collide", null); // Remove the collide force
      simulationRef.current.force("collide", d3.forceCollide());
    }

    if (force_properties.forceX.enabled) {
      simulationRef.current
        .force("forceX")
        .strength(force_properties.forceX.strength)
        .x(force_properties.forceX.x);
    } else {
      simulationRef.current.force("forceX", null); // Remove the forceX force
      simulationRef.current.force("forceX", d3.forceX());
    }

    if (force_properties.forceY.enabled) {
      simulationRef.current
        .force("forceY")
        .strength(force_properties.forceY.strength)
        .y(force_properties.forceY.y);
    } else {
      simulationRef.current.force("forceY", null); // Remove the forceY force
      simulationRef.current.force("forceY", d3.forceY());
    }

    if (force_properties.link.enabled) {
      simulationRef.current
        .force("link")
        .distance(force_properties.link.distance)
        .iterations(force_properties.link.iterations)
        .strength(force_properties.link.strength);
    } else {
      simulationRef.current.force("link", null); // Remove the link force
      simulationRef.current.force(
        "link",
        d3
          .forceLink()
          .links(data.edges)
          .id((d) => d.id)
      );
    }

    if (force_properties.radial.enabled) {
      simulationRef.current.force(
        "radial",
        d3
          .forceRadial()
          .radius(force_properties.radial.radius)
          .x(force_properties.radial.x)
          .y(force_properties.radial.y)
          .strength(force_properties.radial.strength)
      );
    } else {
      simulationRef.current.force("radial", null); // Remove the radial force without adding it again

      // simulationRef.current.force(
      //   "radial",
      //   d3
      //     .forceRadial()
      //     .radius(default_force_properties.radial.radius)
      //     .x(default_force_properties.radial.x)
      //     .y(default_force_properties.radial.y)
      //     .strength(default_force_properties.radial.strength)
      // );
    }
  };

  return (
    <div className={styles.graph}>
      <svg ref={graphRef} width={width} height={height}>
        {/* Create a container for the graph elements */}
      </svg>
    </div>
  );
};

export default GraphVisualization;
