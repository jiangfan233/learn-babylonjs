<template>
  <div>
    <h3>Babylon Examples</h3>
    <canvas></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { StandardMaterials } from "@/BabylonExamples/StandardMaterials";
import { CustomLoading } from "@/BabylonExamples/Customloading";
import { PBR } from "@/BabylonExamples/PBR";
import { BasicScene } from "@/BabylonExamples/BasicScene";
import { CameraMachanics } from "@/BabylonExamples/CameraMachanics";
import { MeshActions } from "@/BabylonExamples/MeshActions";

export default defineComponent({
  name: "BabylonExamples",
  mounted() {
    const canvas = document.querySelector("canvas")!;
    new MeshActions(canvas);
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 90%;
  height: 90%;
}
</style>
