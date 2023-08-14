import { Scene, StandardMaterial, Texture } from "@babylonjs/core";
import { FreeCamera } from "@babylonjs/core/Cameras";
import { Engine } from "@babylonjs/core/Engines";
import { HemisphericLight } from "@babylonjs/core/Lights";
import { Vector3 } from "@babylonjs/core/Maths";
import { MeshBuilder } from "@babylonjs/core/Meshes";

export class BasicScene {
  scene: Scene;
  engine: Engine;
  // camera: FreeCamera;

  constructor(private canvas: HTMLCanvasElement) {
    // antialias: 是否开启抗锯齿
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
    // attach control with mouse.
    camera.attachControl();
    camera.speed = 0.25;

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 0.5;

    const ground = MeshBuilder.CreateGround(
      "ground",
      {
        width: 10,
        height: 10,
      },
      this.scene
    );

    const ball = MeshBuilder.CreateSphere(
      "ball",
      { diameter: 1, updatable: true },
      this.scene
    );
    ball.position = new Vector3(0, 1, 0);
    ball.applyDisplacementMap(
      "./textures/painted/painted_displacement.png",
      0,
      0.05
    );
    ball.material = this.CreateDisplacemet();

    return scene;
  }

  CreateDisplacemet() {
    const mat = new StandardMaterial("mat", this.scene);
    mat.diffuseTexture = new Texture(
      "./textures/painted/painted_diffuse.png",
      this.scene
    );

    // 材质凹凸效果
    mat.bumpTexture = new Texture(
      "./textures/painted/painted_normal.png",
      this.scene
    );
    // // 控制材质凹凸
    mat.invertNormalMapX = true;
    mat.invertNormalMapY = true;

    return mat;
  }
}
