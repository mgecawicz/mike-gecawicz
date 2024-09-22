<template>
  <div style="display: flex; justify-content: center">
    <video-player
      :src="require('../videos/0001 copy.mp4')"
      autoplay
      loop
      :volume="-1"
      style="width: 40vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/bubbles.mp4')"
      autoplay
      loop
      :volume="-1"
      style="width: 40vw; height: 40vw"
    />
  </div>
  <div style="display: flex; justify-content: center">
    <video-player
      :src="require('../videos/cloth.mp4')"
      autoplay
      loop
      :volume="-1"
      style="width: 40vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/cuboid.mp4')"
      autoplay
      loop
      :volume="-1"
      style="width: 40vw; height: 40vw"
    />
  </div>
  <div style="display: flex; justify-content: center">
    <video-player
      :src="require('../videos/dropit_00001_1.mp4')"
      autoplay
      loop
      :volume="-1"
      style="width: 40vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/WAVEY.mp4')"
      autoplay
      loop
      :volume="-1"
      style="width: 40vw; height: 40vw"
    />
  </div>
  <div style="display: flex; justify-content: center">
    <video-player
      :src="require('../videos/DragonFinal2.mp4')"
      autoplay
      loop
      :volume="-1"
      style="width: 20vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/failedDominoes.mp4')"
      autoplay
      loop
      :volume="-1"
      style="width: 20vw; height: 40vw"
    />
    <video-player
      :src="require('../videos/PEGSDAMMiT.mp4')"
      autoplay
      loop
      :volume="-1"
      style="width: 20vw; height: 40vw"
    />
    <br />
    <video-player
      :src="require('../videos/moonsystem_00001.mp4')"
      autoplay
      loop
      :volume="-1"
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
