import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Menu from "./index.js";

describe("Menu", () => {
  test("renders menu buttons", () => {
    render(<Menu fullScreenHandle={{}} />);

    const zoomInButton = screen.getByRole("button", {
      name: /zoom\-in/i,
    });
    const resetZoomButton = screen.getByRole("button", {
      name: /sync/i,
    });
    const zoomOutButton = screen.getByRole("button", {
      name: /zoom\-out/i,
    });
    const fullScreenButton = screen.getByRole("button", {
      name: /fullscreen/i,
    });
    const downloadButton = screen.getByRole("button", { name: /download/i });

    expect(zoomInButton).toBeInTheDocument();
    expect(resetZoomButton).toBeInTheDocument();
    expect(zoomOutButton).toBeInTheDocument();
    expect(fullScreenButton).toBeInTheDocument();
    expect(downloadButton).toBeInTheDocument();
  });

  test("calls zoomInHandler when Zoom In button is clicked", () => {
    const zoomInHandler = jest.fn();
    render(<Menu zoomInHandler={zoomInHandler} fullScreenHandle={{}} />);
    const zoomInButton = screen.getByRole("button", {
      name: /zoom\-in/i,
    });

    fireEvent.click(zoomInButton);
    expect(zoomInHandler).toHaveBeenCalledTimes(1);
  });

  test("calls zoomResetHandler when Reset Zoom button is clicked", () => {
    const zoomResetHandler = jest.fn();
    render(<Menu zoomResetHandler={zoomResetHandler} fullScreenHandle={{}} />);

    const resetZoomButton = screen.getByRole("button", {
      name: /sync/i,
    });
    fireEvent.click(resetZoomButton);

    expect(zoomResetHandler).toHaveBeenCalledTimes(1);
  });

  test("calls zoomOutHandler when Zoom Out button is clicked", () => {
    const zoomOutHandler = jest.fn();
    render(<Menu zoomOutHandler={zoomOutHandler} fullScreenHandle={{}} />);

    const zoomOutButton = screen.getByRole("button", {
      name: /zoom\-out/i,
    });
    fireEvent.click(zoomOutButton);

    expect(zoomOutHandler).toHaveBeenCalledTimes(1);
  });

  test("calls fullScreenHandle.enter() when Full Screen button is clicked", () => {
    const fullScreenHandle = { enter: jest.fn() };
    render(<Menu fullScreenHandle={fullScreenHandle} />);

    const fullScreenButton = screen.getByRole("button", {
      name: /fullscreen/i,
    });
    fireEvent.click(fullScreenButton);

    expect(fullScreenHandle.enter).toHaveBeenCalledTimes(1);
  });

  test("calls fullScreenHandle.exit() when Full Screen button is clicked and fullScreenHandle is active", () => {
    const fullScreenHandle = { active: true, exit: jest.fn() };
    render(<Menu fullScreenHandle={fullScreenHandle} />);

    const fullScreenButton = screen.getByRole("button", {
      name: /fullscreen/i,
    });
    fireEvent.click(fullScreenButton);

    expect(fullScreenHandle.exit).toHaveBeenCalledTimes(1);
  });

  test("calls downloadGraphImage when Download Image button is clicked", () => {
    const downloadGraphImage = jest.fn();
    render(
      <Menu downloadGraphImage={downloadGraphImage} fullScreenHandle={{}} />
    );

    const downloadButton = screen.getByRole("button", { name: /download/i });
    fireEvent.click(downloadButton);

    expect(downloadGraphImage).toHaveBeenCalledTimes(1);
  });
});
