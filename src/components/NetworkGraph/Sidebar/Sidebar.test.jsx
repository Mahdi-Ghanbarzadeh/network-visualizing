import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./index.js";

// Mock the necessary props and functions
const mockSetForceProperties = jest.fn();
const mockSetNodeLabelVisibility = jest.fn();
const mockSetEdgeLabelVisibility = jest.fn();
const mockSetTrafficFlowVisibility = jest.fn();
const mockSetVulnerabilityVisibility = jest.fn();
const mockSetZoomPanning = jest.fn();

const width = "calc(100vw - 350px - 6.5rem)";
const height = "calc(100vh - 6.5rem)";

const node_radius = 25;

const force_properties = {
  center: {
    x: 0.5, // min: 0, max: 1
    y: 0.5, // min: 0, max: 1
    strength: 0.5, // min: 0.1 max: 1
  },
  charge: {
    enabled: true,
    strength: -500, // min: -1000, max: 1000
    distanceMin: 1, // min: 0, max: 50
    distanceMax: 2000, // min: 0, max: 2000
    theta: 0, // min: -1, max: 1
  },
  collide: {
    enabled: true,
    radius: node_radius + 15, // min: 0, max: 100
    strength: 0.7, // min: 0, max: 1
    iterations: 1, // min: 1, max: 10
  },
  forceX: {
    enabled: false,
    strength: 0.1, // min: 0, max: 1
    x: 0, // min: 0, max: 1
  },
  forceY: {
    enabled: false,
    strength: 0.1, // min: 0, max: 1
    y: 0, // min: 0, max: 1
  },
  link: {
    enabled: true,
    distance: 100, // min: 0, max: 500
    iterations: 1, // min: 1, max: 10
    strength: 1, // set
  },
  radial: {
    enabled: false,
    strength: 0, // min: 0, max: 1
    radius: 30, // min: 0, max: 100
    x: width / 2, // had set
    y: height / 2, // had set
  },
};

const device_types = [
  { device_type: "computer", icon: "icons/computer.svg" },
  { device_type: "laptop", icon: "icons/laptop.svg" },
  { device_type: "phone", icon: "icons/phone.svg" },
  { device_type: "printer", icon: "icons/printer.svg" },
  { device_type: "server", icon: "icons/server.svg" },
  { device_type: "switch", icon: "icons/switch.svg" },
  { device_type: "modem", icon: "icons/modem.svg" },
  { device_type: "router", icon: "icons/router.svg" },
  { device_type: "firewall", icon: "icons/firewall.svg" },
  { device_type: "internet", icon: "icons/internet.svg" },
];

describe("Sidebar Component", () => {
  test("Sidebar Component renders correctly", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        node_label_visibility={true}
      />
    );
  });

  test("displays device icons for each device type", () => {
    render(
      <Sidebar device_types={device_types} forceProperties={force_properties} />
    );

    const deviceIcons = screen.getAllByAltText(/SVG Example for/i);
    expect(deviceIcons).toHaveLength(device_types.length);
  });

  // test("drags and drops a node onto canvas", () => {
  //   render(
  //     <Sidebar device_types={device_types} forceProperties={force_properties} />
  //   );

  //   // Mock device icon
  //   const deviceIcon = screen.getByAltText("SVG Example for router");

  //   // Spy on the handleDragStart function
  //   const handleDragStartSpy = jest.spyOn({}, "handleDragStart");

  //   // Simulate drag start event
  //   fireEvent.dragStart(deviceIcon);

  //   // Assertion: Check if handleDragStart has been called
  //   expect(handleDragStartSpy).toHaveBeenCalled();

  //   // Clean up the spy
  //   handleDragStartSpy.mockRestore();
  // });

  test("toggle zoom panning availability", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setZoomPanning={mockSetZoomPanning}
      />
    );

    const drawEdgeSwitch = screen.getByTestId("draw-edge");
    fireEvent.click(drawEdgeSwitch);

    expect(mockSetZoomPanning).toHaveBeenCalled();
  });

  test("toggle node label visibility", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setNodeLabelVisibility={mockSetNodeLabelVisibility}
      />
    );

    const networkFilterPanel = screen.getByRole("button", {
      name: /right network filter/i,
    });
    fireEvent.click(networkFilterPanel);

    const showNodeLabelsSwitch = screen.getByTestId("show-node");
    fireEvent.click(showNodeLabelsSwitch);

    expect(mockSetNodeLabelVisibility).toHaveBeenCalled();
  });

  test("toggle edge label visibility", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setEdgeLabelVisibility={mockSetEdgeLabelVisibility}
      />
    );

    const networkFilterPanel = screen.getByRole("button", {
      name: /right network filter/i,
    });
    fireEvent.click(networkFilterPanel);

    const showEdgeLabelsSwitch = screen.getByTestId("show-edge");
    fireEvent.click(showEdgeLabelsSwitch);

    expect(mockSetEdgeLabelVisibility).toHaveBeenCalled();
  });

  test("toggle traffic flow visibility", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setTrafficFlowVisibility={mockSetTrafficFlowVisibility}
      />
    );

    const networkFilterPanel = screen.getByRole("button", {
      name: /right network filter/i,
    });
    fireEvent.click(networkFilterPanel);

    const showTrafficFlowSwitch = screen.getByTestId("show-traffic-flow");
    fireEvent.click(showTrafficFlowSwitch);

    expect(mockSetTrafficFlowVisibility).toHaveBeenCalled();
  });

  test("toggle vulnerability visibility", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setVulnerabilityVisibility={mockSetVulnerabilityVisibility}
      />
    );

    const networkFilterPanel = screen.getByRole("button", {
      name: /right network filter/i,
    });
    fireEvent.click(networkFilterPanel);

    const showVulnerabilitySwitch = screen.getByTestId("show-vulnerability");
    fireEvent.click(showVulnerabilitySwitch);

    expect(mockSetVulnerabilityVisibility).toHaveBeenCalled();
  });

  // test("change center x using slider", () => {
  //   render(
  //     <Sidebar
  //       device_types={device_types}
  //       forceProperties={force_properties}
  //       setForceProperties={mockSetForceProperties}
  //     />
  //   );

  //   const networkRepresentationPanel = screen.getByRole("button", {
  //     name: /right network representation/i,
  //   });
  //   fireEvent.click(networkRepresentationPanel);

  //   const centerXSlider = screen
  //     .getByTestId("x-coord-container")
  //     .querySelector(".ant-slider-handle");
  //   // const centerXSlider = screen.getByTestId("x-coord");

  //   // fireEvent.change(centerXSlider, { target: { "aria-valuenow": 0.3 } });

  //   console.log("find me", centerXSlider);

  //   // Simulate slider interaction by dispatching an input event
  //   fireEvent(
  //     centerXSlider,
  //     new MouseEvent("input", {
  //       bubbles: true,
  //       cancelable: true,
  //       target: { value: 0.3 },
  //     })
  //   );

  //   // Verify that the expected property has been updated
  //   const expectedUpdatedProperties = {
  //     center: {
  //       x: 0.2,
  //       y: 0.5,
  //       strength: 0.5,
  //     },
  //     // ... other properties
  //   };

  //   expect(mockSetForceProperties).toHaveBeenCalledWith(
  //     expectedUpdatedProperties
  //   );
  // });

  test("change center strength using slider", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setForceProperties={mockSetForceProperties}
      />
    );

    const networkRepresentationPanel = screen.getByRole("button", {
      name: /right network representation/i,
    });
    fireEvent.click(networkRepresentationPanel);

    const centerStrengthSlider = screen.getByTestId("center-strength");
    fireEvent.change(centerStrengthSlider, { target: { value: 0.7 } });

    expect(mockSetForceProperties).toHaveBeenCalled();
  });

  test("toggle charge switch", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setForceProperties={mockSetForceProperties}
      />
    );

    const networkRepresentationPanel = screen.getByRole("button", {
      name: /right network representation/i,
    });
    fireEvent.click(networkRepresentationPanel);

    const showVulnerabilitySwitch = screen.getByTestId("charge-switch");
    fireEvent.click(showVulnerabilitySwitch);

    expect(mockSetForceProperties).toHaveBeenCalled();
  });

  test("change charge strength", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setForceProperties={mockSetForceProperties}
      />
    );

    const networkRepresentationPanel = screen.getByRole("button", {
      name: /right network representation/i,
    });
    fireEvent.click(networkRepresentationPanel);

    const strengthInput = screen.getByTestId("charge-strength");
    fireEvent.change(strengthInput, { target: { value: 500 } });

    expect(mockSetForceProperties).toHaveBeenCalled();
  });

  test("change charge distance min", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setForceProperties={mockSetForceProperties}
      />
    );

    const networkRepresentationPanel = screen.getByRole("button", {
      name: /right network representation/i,
    });
    fireEvent.click(networkRepresentationPanel);

    const distanceMinInput = screen.getByTestId("charge-distance-min");
    fireEvent.change(distanceMinInput, { target: { value: 10 } });

    expect(mockSetForceProperties).toHaveBeenCalled();
  });

  test("change charge distance max", () => {
    render(
      <Sidebar
        device_types={device_types}
        forceProperties={force_properties}
        setForceProperties={mockSetForceProperties}
      />
    );

    const networkRepresentationPanel = screen.getByRole("button", {
      name: /right network representation/i,
    });
    fireEvent.click(networkRepresentationPanel);

    const distanceMaxInput = screen.getByTestId("charge-distance-max");
    fireEvent.change(distanceMaxInput, { target: { value: 1500 } });

    expect(mockSetForceProperties).toHaveBeenCalled();
  });
});
