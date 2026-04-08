export const seedFeedback = () => {
  if (!localStorage.getItem("feedback")) {
    const initialFeedback = [
      {
        id: 1,
        usn: "12345678",
        title: "Teaching Quality Improved",
        feedback:
          "The teaching quality has improved significantly this semester.",
        category: "Teaching",
        type: "👍 Positive",
        created_at: "03-25-2025",
      },
      {
        id: 2,
        usn: "87654321",
        title: "Administration Issues",
        feedback:
          "There are several issues with the administration's handling of student concerns.",
        category: "Administration",
        type: "⚠️ Concern",
        created_at: "03-25-2025",
      },
      {
        id: 3,
        usn: "43215678",
        title: "More Tech Support Needed",
        feedback: "The faculty needs to provide more tech support to students.",
        category: "Course Content",
        type: "💡 Suggestion",
        created_at: "03-25-2025",
      },
      {
        id: 4,
        usn: "87651234",
        title: "Facilities Upgrade Needed",
        feedback:
          "The facilities need to be upgraded to improve student experience.",
        category: "Facilities",
        type: "💬 Neutral",
        created_at: "03-25-2025",
      },
      {
        id: 5,
        usn: "12348765",
        title: "Great Course Content",
        feedback: "The course content was very engaging and informative.",
        category: "Course Content",
        type: "👍 Positive",
        created_at: "03-25-2025",
      },
    ];
    const feedbackWithLikes = {
      1: 5,
      2: 7,
      3: 10,
      4: 3,
      5: 15,
    };
    localStorage.setItem("feedback", JSON.stringify(initialFeedback));
    localStorage.setItem("feedback_likes", JSON.stringify(feedbackWithLikes));
  }
};
