import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";

// Create basic Babylon scene
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 2, -10), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.9;

// Enable WebXR
const xrHelper = await BABYLON.WebXRDefaultExperience.CreateAsync(scene, {
  uiOptions: {
    sessionMode: "immersive-vr",
    referenceSpaceType: "local-floor"
  }
});

// Dummy graph data
const nodes = [
  { id: 0, x: 0, y: 0, z: 0 },
  { id: 1, x: 2, y: 0, z: 0 },
  { id: 2, x: -2, y: 1, z: 1 }
];

const edges = [
  { source: 0, target: 1 },
  { source: 0, target: 2 }
];

// Create nodes
nodes.forEach((node) => {
  const sphere = BABYLON.MeshBuilder.CreateSphere(`node-${node.id}`, { diameter: 0.5 }, scene);
  sphere.position = new BABYLON.Vector3(node.x, node.y, node.z);
});

// Create edges
edges.forEach(({ source, target }) => {
  const p1 = new BABYLON.Vector3(nodes[source].x, nodes[source].y, nodes[source].z);
  const p2 = new BABYLON.Vector3(nodes[target].x, nodes[target].y, nodes[target].z);
  const distance = BABYLON.Vector3.Distance(p1, p2);
  const edge = BABYLON.MeshBuilder.CreateCylinder("edge", { height: distance, diameter: 0.05 }, scene);

  // Align cylinder between nodes
  const mid = p1.add(p2).scale(0.5);
  edge.position = mid;

  const v1 = p2.subtract(p1).normalize();
  const up = new BABYLON.Vector3(0, 1, 0);
  const axis = BABYLON.Vector3.Cross(up, v1);
  const angle = Math.acos(BABYLON.Vector3.Dot(up, v1));
  const quaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
  edge.rotationQuaternion = quaternion;
});

// Start render loop
engine.runRenderLoop(() => {
  scene.render();
});

// Handle resize
window.addEventListener("resize", () => {
  engine.resize();
});
