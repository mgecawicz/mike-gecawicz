<template>
  <div style="margin-top: 5vw">
    <video-player
      :src="require('../videos/0001 copy.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 40vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/bubbles.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 40vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/cloth.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 40vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/cuboid.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 40vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/dropit_00001_1.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 40vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/WAVEY.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 40vw; height: 40vw"
    />
    <br />
    <video-player
      :src="require('../videos/wohhh.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 20vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/DragonFinal2.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 20vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/failedDominoes.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 20vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/PEGSDAMMiT.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 20vw; height: 40vw"
    />
    <br />
    <video-player
      :src="require('../videos/moonsystem_00001.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 20vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/SpiralStairCase.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 20vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/LETITFALL.mp4')"
      controls
      :loop="false"
      :volume="0"
      style="width: 20vw; height: 40vw"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";

export default defineComponent({
  components: {
    VideoPlayer,
  },
});
</script>

<style scoped>
.bg {
  background: linear-gradient(
    to bottom,
    #333333,
    #219ebc
  ); /* Charcoal to Dark Blue */
  margin-right: 5vw;
  margin-left: 5vw;
  overflow-y: scroll !important; /* Enable vertical scrolling */
  max-height: 150vh;
  color: white; /* Optional: set text color for better contrast */
  padding: 20px; /* Optional: padding */
  padding-bottom: 60px;
  border-radius: 20px;
  margin-bottom: 5vw;
}
h2 {
  margin-top: 2rem;
  font-size: 3rem !important;
  color: #fb8500;
}
</style>
