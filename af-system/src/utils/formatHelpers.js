export const categorySelections = [
  "Course Content",
  "Teaching",
  "Facilities",
  "Technology",
  "Administration",
  "Others",
];

export const types = [
  { label: "👍 Positive", value: "👍 Positive" },
  { label: "💬 Neutral", value: "💬 Neutral" },
  { label: "💡 Suggestion", value: "💡 Suggestion" },
  { label: "⚠️ Concern", value: "⚠️ Concern" },
];

export const getCategoryCounts = (feedbackData) => {
  const categoryCounts = new Set(
    feedbackData.map((item) => item.category).filter(Boolean),
  );
  return categoryCounts.size;
};

export const sortOptions = ["Newest First", "Oldest First", "Most UpVotes"];

export const sortFeedback = (feedbackData, sortOption) => {
  const sortedData = [...feedbackData];
  if (sortOption === "Newest First") {
    sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOption === "Oldest First") {
    sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortOption === "Most UpVotes") {
    sortedData.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }
  return sortedData;
};
