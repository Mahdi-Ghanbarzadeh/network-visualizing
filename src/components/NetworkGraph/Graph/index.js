import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import styles from "./Graph.module.css";
import Menu from "./Menu";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import ContextMenu from "./ContextMenu";

const GraphVisualization = ({
  width,
  height,
  edge_width,
  node_radius,
  zoom_panning_availability,
  node_label_visibility,
  edge_label_visibility,
  traffic_flow_visibility,
  vulnerability_visibility,
  zoom_scale,
  force_properties,
  default_force_properties,
  data,
  setData,
  device_types,
  fullScreenHandle,
}) => {
  // const [data, setData] = useState(dataset);
  const [highlightedNodes, setHighlightedNodes] = useState(
    new Set(["phone2", "computer3"])
  );

  const [highlightedEdges, setHighlightedEdges] = useState(
    new Set(["10", "17", "18"])
  );

  console.log("--- data ---");
  console.log(data);

  // modal confirm deletion
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // variable to determine permission in order to delete node or edge
  const deleteAvailable = useRef(true);

  // draw edge
  const [isDrawingEdge, setIsDrawingEdge] = useState(false);
  const [drawingStartNode, setDrawingStartNode] = useState(null);

  // Create a ref to store the graph
  const graphRef = useRef();
  const containerGraphRef = useRef();

  // variable to keep track of clicked node and edge in order to reset styles
  const clickedEdgeRef = useRef(null);
  const clickedNodeRef = useRef(null);

  // Create a ref to store the simulation, link, linkLabels and node instance
  const simulationRef = useRef(null);
  const linkRef = useRef();
  const linkLabelsRef = useRef();
  const nodeRef = useRef();
  const nodeLabelsRef = useRef();

  const [currentMenuContext, setCurrentMenuContext] = useState();
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [rightClickedNodeData, setRightClickedNodeData] = useState(null);
  const [rightClickedEdgeData, setRightClickedEdgeData] = useState(null);

  const zoomRef = useRef();
  const svgRef = useRef();

  const lan_colors = [
    "#3498db",
    "#2ecc71",
    "#9b59b6",
    "#e67e22",
    "#34495e",
    "#27ae60",
    "#2980b9",
    "#d35400",
    "#e74c3c",
    "#2c3e50",
    "#7f8c8d",
  ];

  // Convert the device_types array to an object
  const deviceTypeIcons = {};
  device_types.forEach((item) => {
    deviceTypeIcons[item.device_type] = item.icon;
  });

  const getIcon = (device_type) => {
    return deviceTypeIcons[device_type] || "icons/coding.svg";
  };

  useEffect(() => {
    // D3 code to create the graph visualization
    zoomRef.current = d3
      .zoom()
      .scaleExtent([zoom_scale[0], zoom_scale[1]])
      .on("zoom", zoomed);

    function zoomed({ transform }) {
      g.attr("transform", transform);
    }

    svgRef.current = d3
      .select(graphRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svgRef.current.select("g");

    if (g.empty()) {
      // Create the 'g' element only if it doesn't exist yet
      // if it doesn't check, the graph will be shown twice
      svgRef.current.append("g");
    }

    // Add a "g" element to the SVG for the drag-and-drop area
    svgRef.current
      .on("drop", dropHandler)
      .on("dragenter", dragEnterHandler)
      .on("dragover", dragOverHandler);
    // .on("dragleave", dragLeaveHandler);

    function dragOverHandler(event) {
      event.preventDefault(); // Add this line to prevent the default behavior
      console.log("dragover");
    }

    function dropHandler(event) {
      event.preventDefault();

      // Parse the dropped node from the dataTransfer
      const newNode = JSON.parse(
        event.dataTransfer.getData("application/x-d3-node")
      );

      // Update the position of the new node to match the drop coordinates
      newNode.x = event.x;
      newNode.y = event.y;

      // Update the graph's data with the new node
      setData((prevData) => ({
        ...prevData,
        nodes: [...prevData.nodes, newNode],
      }));

      // // Stop the current simulation
      // simulationRef.current.stop();

      // // Reinitialize the simulation with the updated data
      // initializeSimulation();
    }

    function dragEnterHandler(event) {
      event.preventDefault();
      console.log("dragenter");
    }

    function dragLeaveHandler(event) {
      event.preventDefault();
      console.log("dragleave");
    }

    // to simulate and update visualization
    if (linkLabelsRef.current) {
      linkLabelsRef.current.remove();
    }

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
      .text((d) => (edge_label_visibility ? d.label : ""))
      .attr("draggable", "false")
      .style("pointer-events", "none")
      .style("user-select", "none"); // Prevent text selection

    // Initialize the simulation with the initial force properties
    initializeSimulation();

    return () => {
      // Cleanup function to stop the simulation on unmount
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [data]);

  // Use useEffect hook to update the show traffic flow
  useEffect(() => {
    // to simulate and update visualization
    if (linkRef.current) {
      linkRef.current.remove();
    }
    // Enter/update pattern for the links
    linkRef.current = svgRef.current
      .select("g")
      .selectAll(".link")
      .data(data.edges)
      .join("line")
      .style("cursor", "pointer")
      .attr("class", (d) =>
        d.flow > 0 && traffic_flow_visibility ? styles.animate_line : "link"
      )
      .on("click", edgeHandleClick)
      .on("contextmenu", edgeContextMenuHandler);

    // Restart the simulation with the updated forces
    if (simulationRef.current) {
      simulationRef.current.alpha(0).restart();
    }
    // Initialize the simulation with the initial force properties
  }, [data, traffic_flow_visibility, vulnerability_visibility]);

  useEffect(() => {
    // to simulate and update visualization
    if (nodeRef.current) {
      nodeRef.current.remove();
    }

    nodeRef.current = svgRef.current
      .select("g")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("click", nodeHandleClick)
      .on("contextmenu", nodeContextMenuHandler);

    // Append an outer circle to add a border to the node
    nodeRef.current
      .append("circle")
      .attr("r", node_radius)
      .style("fill", (d) =>
        d.lan_number ? lan_colors[d.lan_number] : "steelblue"
      )
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
      .attr("draggable", "false")
      .attr("href", (d) => getIcon(d.device_type))
      .style("pointer-events", "none");

    // Display the node IP above it if node_label_visibility is true
    nodeLabelsRef.current = nodeRef.current
      .append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("y", -node_radius - 8) // Position the text above the node
      .style("font-size", "12px")
      .style("fill", "#fff")
      .text((d) => (node_label_visibility ? d.label : ""))
      .attr("draggable", "false")
      .style("pointer-events", "none")
      .style("user-select", "none"); // Prevent text selection

    // Create the tooltip element
    nodeRef.current
      .on("mouseover", (event, d) => {
        if (contextMenuVisible) return;
        // Remove the existing tooltip if it exists
        d3.select("." + styles.tooltip).remove();

        // Create a new tooltip element
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", styles.tooltip)
          .style("opacity", 0.9);

        // Position the tooltip
        tooltip
          .html(
            `<strong>Device Type:</strong> ${
              d.device_type
            }<br/><strong>Model:</strong> ${d.model}<br/>${
              d.ip_address !== ""
                ? `<strong>IP:</strong> ${d.ip_address}<br/>`
                : ""
            }${
              d.subnet_mask !== ""
                ? `<strong>Subnet Mask:</strong> ${d.subnet_mask}<br/>`
                : ""
            }${
              d.subnet_mask !== ""
                ? `<strong>Network Address:</strong> ${d.network_address}<br/>`
                : ""
            }<strong>MAC:</strong> ${d.mac_address}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");

        // Hide the tooltip when mouse leaves the node
        tooltip.transition().duration(200).style("opacity", 0.9);
      })
      .on("mouseout", () => {
        // Hide the tooltip when mouse leaves the node
        d3.select("." + styles.tooltip)
          .transition()
          .duration(500)
          .style("opacity", 0)
          .on("end", () => {
            // Remove the tooltip element from the body
            d3.select("." + styles.tooltip).remove();
          });
      });
  });

  // Use useEffect hook to update the show vulnerability points
  useEffect(() => {
    svgRef.current
      .select("g")
      .selectAll(".link")
      .attr("class", (d) =>
        vulnerability_visibility && highlightedEdges.has(d.id)
          ? styles.animate_line_error
          : `link ${styles.link}`
      );

    nodeRef.current
      .selectAll("circle")
      .attr("class", (d) =>
        vulnerability_visibility && highlightedNodes.has(d.id)
          ? styles.winker_animation
          : ""
      );
  }, [data, vulnerability_visibility, traffic_flow_visibility]);

  // Click event handler
  function nodeHandleClick(event, d) {
    if (clickedNodeRef.current === d) {
      // If the clicked node is already clicked, reset the styles
      resetStyles();
    } else {
      if (clickedNodeRef.current !== null) {
        // Reset the styles of the previously clicked node
        resetStyles();
      }

      // Get the clicked node and its connected links
      const clickedNode = d;
      const connectedLinks = data.edges.filter(
        (link) =>
          link.source.id === clickedNode.id || link.target.id === clickedNode.id
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
        // .style("fill", (node) =>
        //   node === clickedNode ? "steelblue" : "steelblue"
        // )
        .style("stroke", (node) => (node === clickedNode ? "#ddd" : "#bbb"))
        .style("stroke-width", (node) => (node === clickedNode ? 3.5 : 2));

      nodeRef.current
        .filter((node) => !siblingNodes.includes(node))
        .style("opacity", 0.7)
        .style("filter", "grayscale(70%)");

      nodeLabelsRef.current
        .filter(
          (node) => siblingNodes.includes(node) && siblingNodes.includes(node)
        )
        .style("opacity", 1)
        .style("filter", "none");

      nodeLabelsRef.current
        .filter(
          (node) =>
            !(siblingNodes.includes(node) && siblingNodes.includes(node))
        )
        .style("opacity", 0.4)
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
      clickedNodeRef.current = clickedNode;

      // Add a keydown event listener
      window.addEventListener("keydown", handleKeyDown);
    }
  }

  function nodeContextMenuHandler(event, node) {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuVisible(true);
    setRightClickedNodeData(node); // Store clicked node data
    setCurrentMenuContext("Node");

    // Hide the tooltip when mouse leaves the node (because it is still shown)
    hideTooltip();
  }

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
    }
  };

  function hideTooltip() {
    d3.select("." + styles.tooltip)
      .style("opacity", 0)
      .on("end", () => {
        d3.select("." + styles.tooltip).remove();
      });
  }

  // Keyboard event handler
  function handleKeyDown(event) {
    console.log("handleKeyDown runs");
    const isBackspaceOrDelete =
      event.key === "Backspace" || event.key === "Delete";

    // keep deleted edge in a variable to make sure it deletes
    const deletedEdge = clickedEdgeRef.current;
    const deletedNode = clickedNodeRef.current;

    if (isBackspaceOrDelete) {
      if (deletedEdge !== null || deletedNode !== null) {
        console.log("isBackspaceOrDelete runs");
        // run Modal
        openModal();
      }
    }
  }

  // Function to reset the styles
  function resetStyles() {
    nodeRef.current
      .style("opacity", 1)
      .style("filter", "none")
      .select("circle")
      .style("fill", (d) =>
        d.lan_number ? lan_colors[d.lan_number] : "steelblue"
      )
      .style("stroke", "#bbb")
      .style("stroke-width", 1);

    nodeLabelsRef.current.style("opacity", 1).style("filter", "none");

    linkRef.current
      .style("opacity", (d) =>
        (d.flow > 0 && traffic_flow_visibility) ||
        (vulnerability_visibility && highlightedEdges.has(d.id))
          ? 1
          : 0.6
      )
      .style("filter", "none")
      .style("stroke-width", 3);

    linkLabelsRef.current.style("opacity", 1).style("filter", "none");

    // Remove the global keydown event listener
    window.removeEventListener("keydown", handleKeyDown);

    clickedEdgeRef.current = null;
    clickedNodeRef.current = null;
  }

  function confirmDeleteActionModal() {
    console.log("run handle ok");

    if (deleteAvailable.current) confirmDeleteAction();

    closeModal();
  }

  function confirmDeleteAction(
    deletedEdge = clickedEdgeRef.current,
    deletedNode = clickedNodeRef.current
  ) {
    if (deletedEdge !== null) {
      // Remove the clicked edge from data
      setData((prevData) => ({
        ...prevData,
        edges: prevData.edges.filter((edge) => edge !== deletedEdge),
      }));

      // Reset styles and clicked edge
      resetStyles();
    } else if (deletedNode !== null) {
      // Remove the clicked node from data
      setData((prevData) => {
        // Filter out the edges that are connected to the deleted node
        const filteredEdges = prevData.edges.filter(
          (edge) => edge.source !== deletedNode && edge.target !== deletedNode
        );

        // Filter out the deleted node
        const filteredNodes = prevData.nodes.filter(
          (node) => node !== deletedNode
        );

        return {
          nodes: filteredNodes,
          edges: filteredEdges,
        };
      });
      // Reset styles and clicked edge
      resetStyles();
    }
    // Hide the tooltip when mouse leaves the node (because it is still shown)
    hideTooltip();
  }

  // Instead of directly using the handleMouseMove and handleMouseUp functions as event handlers, define them inside a useEffect callback function to capture the current value of isDrawingEdge. This will ensure that the event handlers always use the correct value of isDrawingEdge
  useEffect(() => {
    // Separate g element for the drag line
    const dragLineContainer = svgRef.current.append("g");
    const dragLine = dragLineContainer
      .append("line")
      .attr("class", "link dragline")
      .style("stroke", "#ccc")
      .style("stroke-width", "2px")
      .style("stroke-dasharray", "5,5") // Set dash pattern (5px dash, 5px gap)
      .style("pointer-events", "none"); // Prevent interference with mouse events

    // Event handlers for edge drawing
    function handleMouseDown(event, d) {
      // Close context menu on any click
      contextMenuCloseHandler();

      if (!isDrawingEdge && !zoom_panning_availability) {
        const clickedNode = getClickedNode(event);

        if (clickedNode) {
          // Check if the clicked position is the same as node radius
          if (distanceToNode(event, clickedNode) <= node_radius) {
            setIsDrawingEdge(true);
            setDrawingStartNode(clickedNode);
          }
        }
      }
    }

    function handleMouseMove(event) {
      if (isDrawingEdge && drawingStartNode && !zoom_panning_availability) {
        const [x, y] = d3.pointer(event);

        // Reverse the current zoom and pan transformation
        const [reversedX, reversedY] = d3
          .zoomTransform(svgRef.current.node())
          .invert([x, y]);

        // Calculate the starting point coordinates at the node's border
        const angle = Math.atan2(
          reversedY - drawingStartNode.y,
          reversedX - drawingStartNode.x
        );
        const startX = drawingStartNode.x + node_radius * Math.cos(angle);
        const startY = drawingStartNode.y + node_radius * Math.sin(angle);

        // Check if the mouse is over a node
        const overNode = getClickedNode(event);

        // Check if the mouse is over the drawing start node
        const overEndNode = distanceToNode(event, overNode) <= node_radius;

        // Check if the mouse is over the drawing start node
        const overStartNode =
          distanceToNode(event, drawingStartNode) <= node_radius;

        // If the mouse is not over the drawing start node, update the drag line coordinates
        if (!overStartNode) {
          // Transform the starting point coordinates to the transformed space
          const [transformedStartX, transformedStartY] = d3
            .zoomTransform(svgRef.current.node())
            .apply([startX, startY]);

          dragLine
            .attr("x1", transformedStartX)
            .attr("y1", transformedStartY)
            .attr("x2", x)
            .attr("y2", y);

          // If the node is the drawing end node, increase its radius
          if (overEndNode) {
            nodeRef.current
              .filter((node) => node === overNode)
              .select("circle")
              .attr("r", node_radius + 3)
              .style("stroke-width", "2px"); // Increase stroke width
          } else {
            nodeRef.current
              .select("circle")
              .attr("r", node_radius)
              .style("stroke-width", "1px"); // Reset stroke width
          }
        } else {
          // Hide the drag line if the mouse is over the drawing start node
          dragLine.attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 0);
        }
      }
    }

    function handleMouseUp(event) {
      if (isDrawingEdge && !zoom_panning_availability) {
        const clickedNode = getClickedNode(event);

        if (
          clickedNode &&
          drawingStartNode &&
          clickedNode !== drawingStartNode
        ) {
          if (distanceToNode(event, clickedNode) <= node_radius) {
            const newEdge = {
              source: drawingStartNode,
              target: clickedNode,
              flow: 0,
              label: "",
            };
            setData((prevData) => ({
              ...prevData,
              edges: [...prevData.edges, newEdge],
            }));
          }

          // Hide the tooltip when mouse leaves the node (because it is still shown)
          hideTooltip();
        }

        setIsDrawingEdge(false);
        setDrawingStartNode(null);

        // Clear drag line coordinates
        dragLine.attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 0);
      }
    }

    // calculate the distance of click event and nodes
    function distanceToNode(event, clickedNode) {
      const [x, y] = d3.pointer(event);

      // Reverse the current zoom and pan transformation
      const [reversedX, reversedY] = d3
        .zoomTransform(svgRef.current.node())
        .invert([x, y]);

      const distance = Math.sqrt(
        (reversedX - clickedNode.x) ** 2 + (reversedY - clickedNode.y) ** 2
      );
      return distance;
    }

    // Function to get the clicked node
    function getClickedNode(event) {
      const [x, y] = d3.pointer(event);

      // Reverse the current zoom and pan transformation
      const [reversedX, reversedY] = d3
        .zoomTransform(svgRef.current.node())
        .invert([x, y]);

      // Find the node based on the reversed coordinates
      const clickedNode = simulationRef.current.find(reversedX, reversedY);
      return clickedNode;
    }

    svgRef.current.on("mousedown", handleMouseDown);
    svgRef.current.on("mousemove", handleMouseMove);
    svgRef.current.on("mouseup", handleMouseUp);

    return () => {
      svgRef.current.on("mousedown", null);
      svgRef.current.on("mousemove", null);
      svgRef.current.on("mouseup", null);
    };
  }, [isDrawingEdge, drawingStartNode, zoom_panning_availability]);

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

  // Use useEffect hook to update the zoom and panning availability
  useEffect(() => {
    // Update the zoom and pan behavior based on zoom_panning_availability
    if (zoom_panning_availability) {
      svgRef.current.call(zoomRef.current);
    } else {
      svgRef.current.on(".zoom", null);
    }

    // Update the drag behavior based on zoom_panning_availability
    if (zoom_panning_availability) {
      const drag = d3
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
        });

      nodeRef.current.call(drag);
    } else {
      nodeRef.current.on(".drag", null);
    }
  }, [
    data,
    zoom_panning_availability,
    node_label_visibility,
    edge_label_visibility,
    traffic_flow_visibility,
    vulnerability_visibility,
    force_properties,
  ]);

  // Use useEffect hook to update the simulation whenever force_properties changes
  useEffect(() => {
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

    nodeLabelsRef.current.text((d) => (node_label_visibility ? d.label : ""));
  }, [node_label_visibility, edge_label_visibility]);

  function edgeHandleClick(event, d) {
    if (clickedEdgeRef.current === d) {
      // If the clicked edge is already clicked, reset the styles
      resetStyles();
    } else {
      if (clickedEdgeRef.current !== null) {
        // Reset the styles of the previously clicked edge
        resetStyles();
      }

      // Get the clicked edge's source and target nodes
      clickedEdgeRef.current = d;
      const sourceNode = clickedEdgeRef.current.source;
      const targetNode = clickedEdgeRef.current.target;

      // Extract the sibling nodes from the clicked edge
      const siblingNodes = [sourceNode, targetNode];

      // Update visualization to highlight the clicked edge and its nodes
      linkRef.current
        .filter((edge) => edge === clickedEdgeRef.current)
        .style("opacity", 1)
        .style("filter", "none")
        .style("stroke-width", 4);

      linkRef.current
        .filter((edge) => edge !== clickedEdgeRef.current)
        .style("opacity", 0.05)
        .style("filter", "grayscale(70%)");

      linkLabelsRef.current
        .filter((edge) => edge === clickedEdgeRef.current)
        .style("opacity", 1)
        .style("filter", "none");

      linkLabelsRef.current
        .filter((edge) => edge !== clickedEdgeRef.current)
        .style("opacity", 0.4)
        .style("filter", "grayscale(70%)");

      nodeRef.current
        .filter((node) => siblingNodes.includes(node))
        .style("opacity", 1)
        .style("filter", "none")
        .select("circle")
        .style("stroke", (node) =>
          siblingNodes.includes(node) ? "#ddd" : "#bbb"
        )
        .style("stroke-width", (node) =>
          siblingNodes.includes(node) ? 3.5 : 2
        );

      nodeRef.current
        .filter((node) => !siblingNodes.includes(node))
        .style("opacity", 0.7)
        .style("filter", "grayscale(70%)");

      nodeLabelsRef.current
        .filter((node) => siblingNodes.includes(node))
        .style("opacity", 1)
        .style("filter", "none");

      nodeLabelsRef.current
        .filter((node) => !siblingNodes.includes(node))
        .style("opacity", 0.4)
        .style("filter", "grayscale(70%)");

      // Set the clicked edge in order to keep and reset it
      // clickedEdgeRef.current = clickedEdgeRef.current;

      // Add a keydown event listener
      window.addEventListener("keydown", handleKeyDown);
    }
  }

  function edgeContextMenuHandler(event, edge) {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuVisible(true);
    setRightClickedEdgeData(edge); // Store clicked node data
    setCurrentMenuContext("Edge");

    // Hide the tooltip when mouse leaves the node (because it is still shown)

    hideTooltip();
  }

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

  function contextMenuCloseHandler() {
    setContextMenuVisible(false);
  }

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
        <svg ref={graphRef}></svg>

        <Modal
          title="Are you sure?"
          open={modalVisible}
          // handleOk={}
          onOk={confirmDeleteActionModal}
          onCancel={closeModal}
          icon={<ExclamationCircleOutlined />}
          width={400}
        >
          {/* {clickedNodeRef.current && (
            <div>
              <p>ID: {clickedNodeRef.current.id}</p>
              <p>Device Type: {clickedNodeRef.current.device_type}</p>
              <p>Model: {clickedNodeRef.current.model}</p>
              <p>IP Address: {clickedNodeRef.current.ip_address}</p>
              <p>MAC Address: {clickedNodeRef.current.mac_address}</p>
            </div>
          )}
          {clickedEdgeRef.current && (
            <div>
              <p>Source: {clickedEdgeRef.current.source.id}</p>
              <p>Target: {clickedEdgeRef.current.target.id}</p>
              <p>Label: {clickedEdgeRef.current.label}</p>
              <p>Flow: {clickedEdgeRef.current.flow}</p>
            </div>
          )} */}
        </Modal>
      </div>

      <ContextMenu
        visible={contextMenuVisible}
        position={contextMenuPosition}
        onClose={() => {
          contextMenuCloseHandler();
        }}
        options={
          currentMenuContext === "Node"
            ? [
                {
                  label: "Show Information",
                },
                {
                  label: "Edit Information",
                },
                {
                  label: "Show Report",
                },
                {
                  label: "Collapse / Expand",
                },
                {
                  label: "Delete Node",
                },
              ]
            : [
                {
                  label: "Show Information",
                },
                {
                  label: "Edit Information",
                },
                {
                  label: "Delete Edge",
                },
              ]
        }
        data={data}
        setData={setData}
        clickedNodeData={rightClickedNodeData}
        setClickedNodeData={setRightClickedNodeData}
        clickedEdgeData={rightClickedEdgeData}
        setClickedEdgeData={setRightClickedEdgeData}
        confirmDeleteAction={confirmDeleteAction}
        currentMenuContext={currentMenuContext}
        deleteAvailable={deleteAvailable}
        device_types={device_types}
        simulationRef={simulationRef}
      />
    </div>
  );
};

export default GraphVisualization;
