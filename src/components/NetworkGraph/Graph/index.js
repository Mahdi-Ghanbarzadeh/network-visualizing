import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import styles from "./Graph.module.css";
import Menu from "./Menu";

import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

const GraphVisualization = ({
  width,
  height,
  edge_width,
  node_radius,
  node_label_visibility,
  edge_label_visibility,
  traffic_flow_visibility,
  vulnerability_visibility,
  zoom_scale,
  force_properties,
  default_force_properties,
  data,
  fullScreenHandle,
}) => {
  const [highlightedNodes, setHighlightedNodes] = useState(
    new Set(["modem1", "switch1", "server2"])
  );

  // Create a ref to store the graph
  const graphRef = useRef();

  const containerGraphRef = useRef();

  // variable to keep track of clicked nodes in order to reset styles
  let setClickedNode = null;

  // Create a ref to store the simulation, link, linkLabels and node instance
  const simulationRef = useRef(null);
  const linkRef = useRef();
  const linkLabelsRef = useRef();
  const nodeRef = useRef();

  const zoomRef = useRef();
  const svgRef = useRef();

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
    zoomRef.current = d3
      .zoom()
      .scaleExtent([zoom_scale[0], zoom_scale[1]])
      .on("zoom", zoomed);

    svgRef.current = d3
      .select(graphRef.current)
      .attr("width", width)
      .attr("height", height)
      .call(zoomRef.current);

    const g = svgRef.current.select("g");
    if (g.empty()) {
      // Create the 'g' element only if it doesn't exist yet
      // if it doesn't check, the graph will be shown twice
      svgRef.current.append("g");
    }

    // linkRef.current = g
    //   .selectAll("line")
    //   .data(data.edges)
    //   .enter()
    //   .append("line")
    //   .style("stroke", "#ccc")
    //   .style("stroke-width", edge_width)
    //   .style("opacity", 0.6);

    // const colours = [
    //   "#FDA860",
    //   "#FC8669",
    //   "#E36172",
    //   "#C64277",
    //   "#E36172",
    //   "#FC8669",
    //   "#FDA860",
    // ];

    //Four different colors
    // var colours = ["#FDA860", "#FC8669", "#E36172", "#C64277"];

    const colours = [
      "#32CD32",
      "#006400",
      "#32CD32",
      "#006400",
      "#32CD32",
      "#006400",
      "#32CD32",
      "#006400",
    ];

    // Define the linear gradient for the flow animation
    const linearGradient = svgRef.current
      .append("defs")
      .append("linearGradient")
      .attr("id", "animate-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    // Add color stops to the gradient
    linearGradient
      .selectAll(".stop")
      .data(colours)
      .enter()
      .append("stop")
      .attr("offset", (d, i) => i / (colours.length - 1))
      .attr("stop-color", (d) => d);

    // Add animation to the gradient
    linearGradient
      .append("animate")
      .attr("attributeName", "y1")
      .attr("values", "0%;100%")
      .attr("dur", "6s") // Increase the duration for smoother flow
      .attr("repeatCount", "indefinite");

    linearGradient
      .append("animate")
      .attr("attributeName", "y2")
      .attr("values", "100%;200%")
      .attr("dur", "6s") // Increase the duration for smoother flow
      .attr("repeatCount", "indefinite");

    // Enter/update pattern for the links
    linkRef.current = g
      .selectAll(".link")
      .data(data.edges)
      .join("line")
      .attr("class", "link")
      .style("stroke-width", (d) =>
        d.flow > 0 && traffic_flow_visibility ? 10 : 2
      )
      .style("stroke", (d) =>
        d.flow > 0 && traffic_flow_visibility
          ? "url(#animate-gradient)"
          : "#ccc"
      )
      .style("opacity", (d) =>
        d.flow > 0 && traffic_flow_visibility ? 1 : 0.6
      );

    // If you want to animate the edges, you can transition the positions
    linkRef.current
      .transition()
      .duration(2000) // Adjust the duration as needed
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .on("end", () => {
        // Restart the animation when the transition ends
        linearGradient.selectAll("animate").each(function () {
          this.beginElement();
        });
      });

    // Start the initial animation
    linearGradient.selectAll("animate").each(function () {
      this.beginElement();
    });

    // label for edges between nodes
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

      // linkRef.current.style("opacity", 0.6).style("filter", "none");

      linkRef.current
        .style("opacity", (d) =>
          d.flow > 0 && traffic_flow_visibility ? 1 : 0.6
        )
        .style("filter", "none");

      linkLabelsRef.current.style("opacity", 1).style("filter", "none");
      setClickedNode = null;
    }

    // Append an outer circle to add a border to the node
    nodeRef.current
      .append("circle")
      .attr("r", node_radius)
      .style("fill", "steelblue")
      .style("stroke", "#bbb")
      .style("stroke-width", 1)
      .attr("class", (d) =>
        vulnerability_visibility && highlightedNodes.has(d.id)
          ? styles.winker_animation
          : ""
      );

    // Append the SVG icon image to each node's g element
    nodeRef.current
      .append("image")
      .attr("x", -15)
      .attr("y", -15)
      .attr("width", 30) //  width of the image
      .attr("height", 30) // height of the image
      .attr("href", (d) => getIcon(d.device_type));

    // Append a foreignObject for each node to embed the React component
    // nodeRef.current
    //   .append("foreignObject")
    //   .attr("width", 30) // Adjust the size
    //   .attr("height", 30) // Adjust the size
    //   .attr("x", -15) // Adjust the positioning
    //   .attr("y", -15) // Adjust the positioning
    //   .html((d) => {
    //     switch (d.device_type) {
    //       case "computer":
    //         return <ComputerIcon />; // Embed the React component
    //       // Add cases for other icons
    //       default:
    //         return ""; // Return empty string if no matching icon
    //     }
    //   });

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

    // Initialize the simulation with the initial force properties
    initializeSimulation();

    return () => {
      // Cleanup function to stop the simulation on unmount
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [data]);

  // the function tested, but the button doesn't exist.
  function zoomReset() {
    svgRef.current
      .transition()
      .duration(750)
      .call(
        zoomRef.current.transform,
        d3.zoomIdentity,
        d3
          .zoomTransform(svgRef.current.node())
          .invert([
            containerGraphRef.current.clientWidth / 2,
            containerGraphRef.current.clientHeight / 2,
          ])
      );
  }

  // the function tested, but the button doesn't exist.
  function zoomIn() {
    svgRef.current.transition().call(zoomRef.current.scaleBy, 2);
  }

  // the function tested, but the button doesn't exist.
  function zoomOut() {
    svgRef.current.transition().call(zoomRef.current.scaleBy, 0.5);
  }

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

  // Use useEffect hook to update the show traffic flow
  useEffect(() => {
    // Enter/update pattern for the links
    linkRef.current = svgRef.current
      .select("g")
      .selectAll(".link")
      .data(data.edges)
      .join("line")
      .attr("class", "link")
      .style("stroke-width", (d) =>
        d.flow > 0 && traffic_flow_visibility ? 10 : 2
      )
      .style("stroke", (d) =>
        d.flow > 0 && traffic_flow_visibility
          ? "url(#animate-gradient)"
          : "#ccc"
      )
      .style("opacity", (d) =>
        d.flow > 0 && traffic_flow_visibility ? 1 : 0.6
      );
  }, [traffic_flow_visibility]);

  // Use useEffect hook to update the show vulnerability points
  useEffect(() => {
    nodeRef.current
      .selectAll("circle")
      .attr("class", (d) =>
        vulnerability_visibility && highlightedNodes.has(d.id)
          ? styles.winker_animation
          : ""
      );
  }, [vulnerability_visibility]);

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
        d.x = Math.max(
          20,
          Math.min(
            containerGraphRef.current.clientWidth - (node_radius + 10),
            d.x
          )
        );
        d.y = Math.max(
          20,
          Math.min(
            containerGraphRef.current.clientHeight - (node_radius + 10),
            d.y
          )
        );
        return `translate(${d.x},${d.y})`;
      });
    });
  };

  // Function to update the simulation forces with new force_properties
  const updateForces = () => {
    if (!simulationRef.current) return;

    // containerGraphRef.current.clientWidth = width , containerGraphRef.current.clientHeight = height
    simulationRef.current
      .force("center")
      .x(containerGraphRef.current.clientWidth * force_properties.center.x)
      .y(containerGraphRef.current.clientHeight * force_properties.center.y)
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

  // Function to trigger SVG download
  const downloadGraphImage = () => {
    const svgElement = graphRef.current;

    // Convert SVG to data URL
    domtoimage
      .toPng(svgElement)
      .then(function (dataUrl) {
        // Create a Blob from the data URL
        const blob = dataURLtoBlob(dataUrl);

        // Save the Blob as a file using FileSaver.js
        saveAs(blob, "graph.png");
      })
      .catch(function (error) {
        console.error("Error generating image:", error);
      });
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <div className={styles.graph}>
      <Menu
        zoomInHandler={zoomIn}
        zoomResetHandler={zoomReset}
        zoomOutHandler={zoomOut}
        fullScreenHandle={fullScreenHandle}
        downloadGraphImage={downloadGraphImage}
      ></Menu>
      <div ref={containerGraphRef}>
        <svg ref={graphRef}>
          {/* Create a container for the graph elements */}
        </svg>
      </div>
    </div>
  );
};

export default GraphVisualization;
