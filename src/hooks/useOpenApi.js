import { useState, useCallback } from "react";
import axios from "axios";
import { OPENAI_KEY } from "../constants";
const useOpenApi = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const fetchResponse = useCallback(
    async (messages) => {
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.error("Invalid messages array");
        return null;
      }
      setIsFetching(true);
      setError(null);

      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-2024-08-06",
            messages,
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        return response.data.choices[0].message.content;
      } catch (err) {
        console.error("Error fetching requirement:", err);
        setError(err);
        return null;
      } finally {
        setIsFetching(false);
      }
    },
    []
  );

  return { isFetching, error, fetchResponse };
};

export default useOpenApi;
