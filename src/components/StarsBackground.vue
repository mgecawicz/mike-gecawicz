<template>
  <div class="three-background"></div>
</template>

<script>
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export default {
  name: "StarsBackground",
  data() {
    return {
      scrollSpeed: 0.1, // Adjust this value to control the scrolling speed
    };
  },
  mounted() {
    this.initThree();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    initThree() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      this.$el.appendChild(renderer.domElement);

      // Create a star field
      const starsGeometry = new THREE.BufferGeometry();
      const starCount = 10000;
      const positions = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount * 3; i++) {
        positions[i] = Math.random() * 2000 - 1000;
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      const starsMaterial = new THREE.PointsMaterial({ color: 0x219ebc });
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      this.stars = stars; // Save reference for later

      const geometry = new THREE.BoxGeometry(10, 10, 10);
      const material = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.5,
        metalness: 0.5,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true; // Cube casts shadows
      cube.receiveShadow = true; // Cube receives shadows
      cube.position.z = 50;
      cube.position.x = 40;
      scene.add(cube);

      this.cube = cube;

      const cube2 = new THREE.Mesh(geometry, material);
      cube2.castShadow = true; // Cube casts shadows
      cube2.receiveShadow = true; // Cube receives shadows
      cube2.position.z = 70;
      cube2.position.x = -30;
      scene.add(cube2);

      this.cube2 = cube2;

      camera.position.z = 100;

      const planeGeometry = new THREE.PlaneGeometry(500, 500);
      const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -2;
      plane.receiveShadow = true; // Plane receives shadows
      scene.add(plane);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
      scene.add(ambientLight);

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0, 10, 20);
      directionalLight.castShadow = true; // Directional light casts shadows
      scene.add(directionalLight);

      // Post Process ------------------------------------------------
      const composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);
      const filmPass = new FilmPass(0.1, 0, 0, false);
      composer.addPass(filmPass);
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0,
        0.4,
        0.1
      );
      bloomPass.threshold = 0;
      bloomPass.strength = 1.5;
      bloomPass.radius = 1;
      composer.addPass(bloomPass);

      const animate = () => {
        requestAnimationFrame(animate);
        composer.render();
      };
      animate();

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Initialize scroll position
      this.updatePosition();
    },
    handleScroll() {
      this.updatePosition();
    },
    updatePosition() {
      // Get the current scroll position
      const scrollY = window.scrollY;
      // Update the position of the Three.js scene
      if (this.stars) {
        this.stars.position.y = scrollY * this.scrollSpeed;
      }
      if (this.cube) {
        this.cube.position.y = scrollY * this.scrollSpeed * 0.1 + 10;
        this.cube.rotation.x = scrollY * this.scrollSpeed * 0.01;
        this.cube.rotation.y = scrollY * this.scrollSpeed * 0.01;
        this.cube.rotation.z = scrollY * this.scrollSpeed * 0.01;
      }
      if (this.cube2) {
        this.cube2.position.y = scrollY * this.scrollSpeed * 0.1 - 20;
        this.cube2.rotation.x = scrollY * this.scrollSpeed * -0.02;
        this.cube2.rotation.y = scrollY * this.scrollSpeed * -0.01;
        this.cube2.rotation.z = scrollY * this.scrollSpeed * -0.03;
      }
    },
  },
};
</script>

<style scoped>
.three-background {
  width: 100vw;
  height: 100vh;
  position: fixed; /* Ensure it covers the entire screen */
  top: 0;
  left: 0;
  z-index: -1; /* Make sure it's behind other components */
}
</style>
