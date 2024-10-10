<template>
  <div class="bg">
    <a id="maze" />
    <div style="display: flex; flex-direction: column; align-items: center">
      <h2>A* Algorithm with Recursive Backtracking</h2>
      <p style="width: 80vw; text-align: center">
        A* Maze is a C++ implementation of the A* search algorithm to navigate a
        maze generated with recursive backtracking. The program visualizes the
        pathfinding process, allowing users to observe how the algorithm
        explores the maze.
      </p>
      <p style="width: 80vw; text-align: center">
        The output of the maze soler is printed using ASCII characters in the
        terminal.
        <br />
        For more details, checkout the github repo below.
      </p>
      <a href="https://github.com/mgecawicz/AStarMaze/tree/main"
        ><h3>A* Maze on GitHub 🔗</h3></a
      >
    </div>
    <img src="../images/AStarMaze.png" width="50%" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AStarMaze",
});
</script>

<style scoped>
.bg {
  background: linear-gradient(
    to bottom,
    #36454f,
    #cc0000
  ); /* Charcoal to Dark Blue */
  margin-right: 5vw;
  margin-left: 5vw;
  color: white; /* Optional: set text color for better contrast */
  padding: 20px; /* Optional: padding */
  padding-bottom: 60px;
  border-radius: 20px;
  margin-bottom: 5vw;
}
h2 {
  margin-top: 2rem;
  font-size: 3rem !important;
  color: #8ecae6;
}
h3 {
  text-align: center;
  color: white;
  font-size: 20px;
}
</style>
