<template>
  <div class="bg" style="text-align: center">
    <div style="display: flex; flex-direction: column; align-items: center">
      <h2>Collatz Conjecture Calculator</h2>
      <h3 style="color: #fb8500; font-size: 30px; margin-top: -5vh">
        Using WebAssembly
      </h3>
      <h4 style="font-weight: 400; line-height: 1.5">
        I chose to use WebAssembly to compute the Collatz Conjecture algorithm
        because it offers near-native performance, allowing for efficient
        execution of computationally intensive tasks directly in the browser.
        This enables users to experience rapid calculations without the overhead
        of JavaScript, enhancing the overall responsiveness of the application.
        Additionally, WebAssembly's ability to work seamlessly with existing web
        technologies makes it a powerful tool for building high-performance web
        applications. <br /><br />Below is the C code used to generate the .wasm
        file.
      </h4>
      <div class="code-container">
        <highlightjs class="code-block" language="c" :code="code" />
      </div>
      <p>
        This program is designed to take in a positive integer and run the
        following algorithm:
      </p>
      <ul>
        <li>
          If the integer is even, divide it by two, and start algorithm again
        </li>
        <li>
          If the integer is odd, multiply it by three and add one, and start
          algorithm again
        </li>
        <li>
          Loop this alorithm until it converges to 1, and count the number of
          itterations that takes
        </li>
      </ul>
      <p>In the end, it returns the total number of steps to get to 1.</p>
    </div>
    <input v-model="inputNumber" type="number" placeholder="Enter a number" />
    <button @click="calculateSteps">Calculate Steps</button>
    <h2 class="result" v-if="steps !== null">
      Number of steps to complete = <b>{{ steps }}</b>
    </h2>
    <p v-if="error">{{ error }}</p>
    <br />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import code from "raw-loader!../data/wasm.txt";
const inputNumber = ref<number | null>(null);
const steps = ref<number | null>(null);
const error = ref<string | null>(null);

// Define the import object
const importObject = {
  env: {
    memory: new WebAssembly.Memory({ initial: 1 }),
    log: (arg: number) => console.log(arg),
  },
};

// Define the interface for WASM exports
interface WasmExports {
  c: (n: number) => number; // Updated to match the new exported function name
}

// Function to load the WASM module
async function loadWasm() {
  try {
    const response = await fetch("https://mkgz.me/collatz.wasm"); // Update with the correct path
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const bytes = await response.arrayBuffer();
    const results = await WebAssembly.instantiate(bytes, importObject);
    return results.instance.exports as unknown as WasmExports;
  } catch (err) {
    error.value = "Error loading WASM module";
    console.error(err);
    return null;
  }
}

// Function to calculate steps
async function calculateSteps() {
  error.value = null;
  steps.value = null;

  if (
    inputNumber.value === null ||
    isNaN(inputNumber.value) ||
    inputNumber.value < 1
  ) {
    error.value = "Please enter a valid number.";
    return;
  }

  const wasmModule = await loadWasm();
  if (wasmModule) {
    steps.value = wasmModule.c(inputNumber.value); // Call the function named "c"
  }
}
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "WasmTest",
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.result {
  text-align: center;
  font-size: 30px !important;
  font-weight: 300;
  color: #fb8500;
}

.bg {
  background: linear-gradient(
    to bottom,
    #36454f,
    #1a1a4b
  ); /* Charcoal to Dark Blue */
  margin-right: 5vw;
  margin-left: 5vw;
  color: white; /* Optional: set text color for better contrast */
  padding: 20px; /* Optional: padding */
  border-radius: 20px;
  margin-bottom: 5vw;
}

li {
  font-size: 20px;
  text-align: left;
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
  font-size: 3rem !important;
  color: #fb8500;
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
h3 {
  color: #eee;
  text-align: center;
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
