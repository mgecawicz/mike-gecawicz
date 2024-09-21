<template>
  <div style="min-height: 100vh">
    <div class="title">
      <h1 v-motion-slide-visible-once-left>Projects</h1>
    </div>
    <div style="margin-top: 20vh">
      <div>
        <h2>Add a Movie</h2>
        <form @submit.prevent="addMovie">
          <input v-model="movie.movie_id" placeholder="Movie ID" required />
          <input v-model="movie.title" placeholder="Title" required />
          <input v-model="movie.genre" placeholder="Genre" required />
          <input
            v-model="movie.release_year"
            placeholder="Release Year"
            required
          />
          <button type="submit">Add Movie</button>
        </form>
        <h2>Movie List</h2>
        <ul v-if="movies.length">
          <li v-for="movie in movies" :key="movie.movie_id">
            {{ movie.title }} ({{ movie.release_year }})
          </li>
        </ul>
        <p v-else>No movies found.</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getMovies, postMovie } from "@/api/callMovies"; // Adjust the path as necessary

const movies = ref<any[]>([]);
const movie = ref({
  movie_id: "",
  title: "",
  genre: "",
  release_year: "",
});

const addMovie = async () => {
  try {
    await postMovie(movie.value);
    movie.value = { movie_id: "", title: "", genre: "", release_year: "" }; // Reset form
    await fetchMovies(); // Refresh the movie list
  } catch (error) {
    console.error("Error adding movie:", error);
  }
};

const fetchMovies = async () => {
  try {
    movies.value = await getMovies(); // Call the imported function
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};
fetchMovies();
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProjectsView",
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 0.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

h2 {
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #333;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
  color: #555;
}

li:last-child {
  border-bottom: none;
}
template {
  background-color: #ffb703;
}
.name {
  line-height: 0.8;
}
.tagLine {
  margin-top: 3%;
  margin-left: 3%;
  line-height: 0.4;
}
h2 {
  text-align: center;
  font-size: 18px;
}
h3 {
  color: #888;
  text-align: left;
  font-size: 2vw;
}
h1 {
  text-align: left;
  margin-bottom: 0;
  color: #ffb703;
  margin-left: 2%;
  margin-top: 0;
  font-size: 10vw;
}
</style>
