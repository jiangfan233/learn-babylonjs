import {
  ActionManager,
  CubeTexture,
  ExecuteCodeAction,
  GlowLayer,
  IncrementValueAction,
  PBRBaseMaterial,
  PBRMaterial,
  PBRMetallicRoughnessMaterial,
  Scene,
  SceneLoader,
  SetValueAction,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";
import { ArcRotateCamera, FreeCamera } from "@babylonjs/core/Cameras";
import { Engine } from "@babylonjs/core/Engines";
import { HemisphericLight } from "@babylonjs/core/Lights";
import { Color3, Vector3 } from "@babylonjs/core/Maths";
import {
  AbstractMesh,
  CreateGround,
  CreateSphere,
  CreateTube,
  MeshBuilder,
} from "@babylonjs/core/Meshes";

export class MeshActions {
  scene: Scene;
  engine: Engine;
  cube: AbstractMesh | undefined;
  sphere: AbstractMesh | undefined;
  ground: AbstractMesh | undefined;
  sphereMat: PBRMaterial | undefined;

  constructor(private canvas: HTMLCanvasElement) {
    // antialias: 是否开启抗锯齿
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.CreateMeshes();

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

    const camera = new FreeCamera("camera", new Vector3(0, 0, -30), this.scene);
    camera.attachControl(this.scene, true);

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/xmas_bg.env",
      scene
    );

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true, 1000, 0.2, true);

    scene.environmentIntensity = 1.5;

    return scene;
  }

  CreateMeshes() {
    this.sphereMat = new PBRMaterial("sphereMat", this.scene);
    this.sphereMat.albedoColor = new Color3(1, 0, 0);
    this.sphereMat.roughness = 1;

    const mat = new StandardMaterial("mat1", this.scene);
    mat.alpha = 0.8;
    mat.emissiveColor = new Color3(0, 1, 1);
    // 不然只能看到一半
    mat.backFaceCulling = false;
    const path = [];
    for (let i = -20; i < 2; i++) {
      path.push(new Vector3(i * 0.2, 0, 0));
    }
    this.cube = CreateTube(
      "cube",
      {
        path: path,
        radius: 2,
        updatable: true,
        tessellation: 16,
        sideOrientation: 0,
      },
      this.scene
    );
    this.cube.position.fromArray([-10, 0, 0]);
    this.cube.material = mat;
    // this.cube.rotate(Vector3.FromArray([0, 1, 1]), Math.PI / 2);

    this.sphere = CreateSphere("name", undefined, this.scene);
    this.sphere.material = this.sphereMat;

    this.ground = CreateGround("ground", { width: 10, height: 10 }, this.scene);
    this.ground.position.fromArray([10, 0, 0]);
    this.ground.material = mat;
    this.ground.rotate(Vector3.FromArray([1, 0, 0]), 90);
    this.CreateActions();
  }

  CreateActions(): void {
    this.cube!.actionManager = new ActionManager(this.scene);
    this.sphere!.actionManager = new ActionManager(this.scene);
    this.scene.actionManager = new ActionManager(this.scene);

    this.cube!.actionManager.registerAction(
      new SetValueAction(
        ActionManager.OnPickDownTrigger,
        this.cube,
        "scaling",
        new Vector3(1.5, 1.5, 1.5)
      )
    );

    // this.sphere!.actionManager?.registerAction(
    //   new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (e) => {
    //     console.log(e);
    //   })
    // );

    // this.scene.actionManager.registerAction(
    //   new IncrementValueAction(
    //     ActionManager.OnEveryFrameTrigger,
    //     this.cube,
    //     "rotation.z",
    //     -0.01
    //   )
    // );

    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPointerOverTrigger,
          parameter: function (actionEvent: any) {
            console.log(actionEvent)
            return true;
          },
        },
        (e) => {
          console.log("DADAWDW", e);
        }
      )
    );
  }
}
