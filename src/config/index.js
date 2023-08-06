// *only can use in NetworkGraph component*

// set the dimensions and margins of the graph
export const margin = { top: 10, right: 0, bottom: 10, left: 10 };
export const width = 1100 - margin.left - margin.right;
export const height = 700 - margin.top - margin.bottom;

// set the node radius and edge width
export const edge_width = 2;
export const node_radius = 25;

// set the visibility of nodes and edges
export const node_label_visibility = true;
export const edge_label_visibility = true;

// set the min and max amount of zoom
export const zoom_scale = [1, 5];

// set the force properties
export const force_properties = {
  center: {
    x: 0.5, // min: 0, max: 1
    y: 0.5, // min: 0, max: 1
    strength: 0.5, // min: 0.1 max: 2
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
    radius: node_radius + 10,
    strength: 0.7, // 0 - 2
    iterations: 5, // 1 - 10
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