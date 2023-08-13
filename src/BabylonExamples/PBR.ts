import {
  CubeTexture,
  GlowLayer,
  PBRBaseMaterial,
  PBRMaterial,
  PBRMetallicRoughnessMaterial,
  Scene,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";
import { FreeCamera } from "@babylonjs/core/Cameras";
import { Engine } from "@babylonjs/core/Engines";
import { HemisphericLight } from "@babylonjs/core/Lights";
import { Color3, Vector3 } from "@babylonjs/core/Maths";
import { MeshBuilder } from "@babylonjs/core/Meshes";

export class PBR {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    // antialias: 是否开启抗锯齿
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.CreateEnvironment();

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

    hemiLight.intensity = 0;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky2.env",
      scene
    );

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true);

    // scene.environmentIntensity = 0.2;

    return scene;
  }

  CreateEnvironment() {
    const ground = MeshBuilder.CreateGround(
      "ground",
      {
        width: 10,
        height: 10,
      },
      this.scene
    );
    ground.material = this.CreateAsphalt();

    const ball = MeshBuilder.CreateSphere(
      "ball",
      { diameter: 1, updatable: true },
      this.scene
    );
    ball.applyDisplacementMap(
      "./textures/painted/painted_displacement.png",
      0,
      0.1
    );
    ball.position = new Vector3(0, 1, 0);
    ball.material = this.CreateMagic();
  }

  CreateAsphalt(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene);

    // 材质光照效果
    pbr.albedoTexture = new Texture(
      "./textures/asphalt/asphalt_diffuse.jpg",
      this.scene
    );

    // 材质凹凸效果
    pbr.bumpTexture = new Texture(
      "./textures/asphalt/asphalt_normal.jpg",
      this.scene
    );

    // 控制材质凹凸
    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture(
      "./textures/asphalt/asphalt_ao_rough_metal.jpg",
      this.scene
    );

    // pbr.roughness = 1;

    return pbr;
  }

  CreateMagic(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene);

    pbr.environmentIntensity = 0.2;

    // 材质光照效果
    pbr.albedoTexture = new Texture(
      "./textures/painted/painted_diffuse.png",
      this.scene
    );

    // 材质凹凸效果
    pbr.bumpTexture = new Texture(
      "./textures/painted/painted_normal.png",
      this.scene
    );
    // // 控制材质凹凸
    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture(
      "./textures/painted/painted_arm.png",
      this.scene
    );

    pbr.microSurfaceTexture = new Texture(
      "./textures/painted/painted_displacement.png",
      this.scene
    );

    pbr.emissiveColor = new Color3(0.55, 0.08, 0);
    pbr.emissiveTexture = new Texture(
      "./textures/painted/painted_displacement.png",
      this.scene
    );
    pbr.emissiveIntensity = 0.06;

    const glowLayer = new GlowLayer("glow", this.scene);
    glowLayer.intensity = 1;

    pbr.roughness = 1;

    return pbr;
  }
}
