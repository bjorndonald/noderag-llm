"use client";
import React, { useEffect } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { nodes as initialNodes, edges as initialEdges } from "./data";

const NodeRAGpage = () => {
  // This method is responsible for drawing the graph, returns the drawn network
  function drawGraph() {
    const filter = {
      item: "",
      property: "",
      value: [],
    };
    const container = document.getElementById("mynetwork");

    if (!container) return;

    // Create new datasets with proper typing
    const nodes = new DataSet(initialNodes); // @ts-ignore
    const edges = new DataSet(initialEdges);

    // Create node colors map
    const nodeColors: { [key: string]: string } = {};
    const allNodes = nodes.get({ returnType: "Object" });

    for (const nodeId in allNodes) {
      if (allNodes[nodeId]) {
        // @ts-ignore
        nodeColors[nodeId] = allNodes[nodeId].color;
      }
    }

    // Get all edges
    const allEdges = edges.get({ returnType: "Object" });

    // Adding nodes and edges to the graph
    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      nodes: {
        hover: true,
        title: "NodeInformation",
        label: {
          enabled: true,
        },
      },
      edges: {
        hover: true,
        title: "EdgeInformation",
      },
      physics: {
        forceAtlas2Based: {
          springLength: 1,
        },
        minVelocity: 0.1,
        solver: "forceAtlas2Based",
        timestep: 0.1,
        stabilization: {
          enabled: true,
        },
      },
    };

    // Create network
    // @ts-ignore
    const network = new Network(container, data, options);

    // Add loading bar handlers
    network.on("stabilizationProgress", function (params) {
      const loadingBar = document.getElementById("loading-bar-container");
      const progressBar = document.getElementById("progress-bar");
      const progressText = document.getElementById("progress-text");

      if (!loadingBar || !progressBar || !progressText) return;

      loadingBar.style.display = "flex";
      const widthFactor = params.iterations / params.total;
      const percentage = Math.round(widthFactor * 100);

      progressBar.style.width = `${percentage}%`;
      progressText.innerHTML = `${percentage}%`;
    });

    network.once("stabilizationIterationsDone", function () {
      const loadingBar = document.getElementById("loading-bar-container");
      const progressBar = document.getElementById("progress-bar");
      const progressText = document.getElementById("progress-text");

      if (!loadingBar || !progressBar || !progressText) return;

      progressBar.style.width = "100%";
      progressText.innerHTML = "100%";

      // Fade out and remove the loading bar
      setTimeout(() => {
        loadingBar.style.opacity = "0";
        setTimeout(() => {
          loadingBar.style.display = "none";
        }, 500);
      }, 500);
    });

    return network;
  }

  useEffect(() => {
    drawGraph();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <h1>
        Resume as a heterograph. See link <a href="">here</a>
      </h1>
      <div className="relative mx-auto h-screen w-full max-w-2xl">
        <div id="mynetwork" className="absolute inset-0" />

        {/* Loading Bar */}
        <div
          id="loading-bar-container"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500"
          style={{ display: "none" }}
        >
          <div className=" rounded-lg w-96 p-6 shadow-xl">
            <div className="mb-4 text-center">
              <h3 className="text-gray-800 text-lg font-semibold">
                Loading Network
              </h3>
              <p id="progress-text" className="text-gray-600">
                0%
              </p>
            </div>
            <div className="bg-gray-200 h-2.5 w-full rounded-full">
              <div
                id="progress-bar"
                className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: "0%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeRAGpage;
