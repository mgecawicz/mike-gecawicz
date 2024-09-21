export async function getMovies(): Promise<void> {
  const url =
    "https://8x32yt4ed6.execute-api.us-east-1.amazonaws.com/prod/getMovies"; // Replace with your API endpoint
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Uncomment and set the Authorization header if using Cognito or IAM
        // 'Authorization': 'Bearer ' + token,
        // 'x-api-key': 'your-api-key', // Uncomment if using API keys
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error retrieving movies:", error);
      throw new Error("Failed to retrieve movies");
    }

    const data = await response.json();
    console.log("Movies retrieved successfully:", data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export const postMovie = async (movie: {
  movie_id: string;
  title: string;
  genre: string;
  release_year: string;
}): Promise<void> => {
  const url =
    "https://8x32yt4ed6.execute-api.us-east-1.amazonaws.com/prod/getMovies"; // Replace with your API endpoint

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Uncomment if using API keys or authorization
        // 'Authorization': 'Bearer ' + token,
        // 'x-api-key': 'your-api-key',
      },
      body: JSON.stringify(movie), // Convert movie object to JSON
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error posting movie:", error);
      throw new Error("Failed to post movie");
    }

    console.log("Movie posted successfully");
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow the error for handling in the component
  }
};
