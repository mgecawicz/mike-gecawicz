export interface Movie {
  movie_id: { S: string };
  title: { S: string };
  genre: { S: string };
  release_year: { S: string };
}

export async function getMovies(): Promise<Movie[]> {
  const url =
    "https://ohqm2r8blb.execute-api.us-east-1.amazonaws.com/api/GETMovie"; // Replace with your API endpoint
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Uncomment and set the Authorization header if using Cognito or IAM
        // 'Authorization': 'Bearer ' + token,
        "x-api-key": "c3gv9JfWgDaAWVPYoqHYSakQrTxC49851RFVSnVq",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error retrieving movies:", error);
      throw new Error("Failed to retrieve movies");
    }

    const data = await response.json();
    console.log("Movies retrieved successfully:", JSON.parse(data.body));
    return JSON.parse(data.body);
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export const postMovie = async (movie: {
  movie_id: string;
  title: string;
  genre: string;
  release_year: string;
}): Promise<void> => {
  const url =
    "https://ohqm2r8blb.execute-api.us-east-1.amazonaws.com/api/POSTMovie"; // Replace with your API endpoint

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Uncomment if using API keys or authorization
        // 'Authorization': 'Bearer ' + token,
        "x-api-key": "c3gv9JfWgDaAWVPYoqHYSakQrTxC49851RFVSnVq",
      },
      body: JSON.stringify({ movies: [movie] }), // Convert movie object to JSON
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
