import {
  CubeTexture,
  GlowLayer,
  PBRBaseMaterial,
  PBRMaterial,
  PBRMetallicRoughnessMaterial,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";
import { ArcRotateCamera, FreeCamera } from "@babylonjs/core/Cameras";
import { Engine } from "@babylonjs/core/Engines";
import { HemisphericLight } from "@babylonjs/core/Lights";
import { Color3, Vector3 } from "@babylonjs/core/Maths";
import { AbstractMesh, MeshBuilder } from "@babylonjs/core/Meshes";

export class CameraMachanics {
  scene: Scene;
  engine: Engine;
  watch: AbstractMesh | undefined;
  camera: ArcRotateCamera | undefined;

  constructor(private canvas: HTMLCanvasElement) {
    // antialias: 是否开启抗锯齿
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    
    this.CreateCamera();
    this.CreateWatch();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    
    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 0;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/xmas_bg.env",
      scene
    );

    envTex.gammaSpace = false;

    envTex.rotationY = Math.PI;

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true);

    // scene.environmentIntensity = 0.2;

    return scene;
  }

  CreateCamera(): void {
    this.camera = new ArcRotateCamera(
      "camera",
      0,
      0,
      5,
      Vector3.Zero(),
      this.scene
    );
    this.camera.attachControl(this.canvas, true);
  }


  async CreateWatch(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "http://localhost:8080/models/",
      "vintage_watch.glb"
    );

    // console.log("meshes", meshes);

    this.watch = meshes[0];

    // meshes[1].showBoundingBox = true;
    // meshes[2].showBoundingBox = true;
    // meshes[3].showBoundingBox = true;

    this.camera!.setTarget(meshes[2]);

    this.engine.hideLoadingUI();
  }
}
