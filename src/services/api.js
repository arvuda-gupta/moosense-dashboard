const API_URL =
  "https://4cjxotmvk3.execute-api.us-east-1.amazonaws.com/gatecow";

export const fetchActivities = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return await response.json();
};