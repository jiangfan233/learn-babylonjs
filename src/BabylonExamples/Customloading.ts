import { CubeTexture, Scene, SceneLoader } from "@babylonjs/core";
import { FreeCamera } from "@babylonjs/core/Cameras";
import { Engine } from "@babylonjs/core/Engines";
import { HemisphericLight } from "@babylonjs/core/Lights";
import { Vector3 } from "@babylonjs/core/Maths";
import { MeshBuilder } from "@babylonjs/core/Meshes";
import "@babylonjs/loaders";

export class CustomLoading {
  scene: Scene;
  engine: Engine;
  // camera: FreeCamera;

  constructor(private canvas: HTMLCanvasElement) {
    // antialias: 是否开启抗锯齿
    this.engine = new Engine(this.canvas, true);

    this.engine.displayLoadingUI();

    this.scene = this.CreateScene();

    this.CreateEnvironment();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera(
      "camera",
      new Vector3(0, 0.75, -8),
      this.scene
    );
    // attach control with mouse.
    camera.attachControl();
    camera.speed = 0.25;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky.env",
      scene
    );
    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true);

    scene.environmentIntensity = 0.5;

    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    // SceneLoader.ImportMesh(
    //   "",
    //   "./models/",
    //   "LightingScene.glb",
    //   this.scene,
    //   (...rest) => {
    //     this.engine.hideLoadingUI();
    //   },
    //   (evt) => {
    //     // onProgress
    //     let loadedPercent = 0;
    //     if (evt.lengthComputable) {
    //       loadedPercent = Math.round((evt.loaded * 100) / evt.total);
    //     } else {
    //       const dlCount = evt.loaded / (1024 * 1024);
    //       loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
    //     }
    //     console.log(loadedPercent);
    //   },
    //   null,
    // );

    SceneLoader.Append(
      
      "http://models.babylonjs.com/CornellBox/",
      "cornellBox.glb",
      this.scene,
      (...rest) => {
        this.engine.hideLoadingUI();
      },
      (evt) => {
        // onProgress
        let loadedPercent = 0;
        if (evt.lengthComputable) {
          loadedPercent = Math.round((evt.loaded * 100) / evt.total);
        } else {
          const dlCount = evt.loaded / (1024 * 1024);
          loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
        }
        console.log(loadedPercent);
      },
      null
    );
  }
}
