export const getThisWeekFeedback = (feedbackData) => {
  const now = new Date();
  const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  firstDayOfWeek.setHours(0, 0, 0, 0);
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  return feedbackData.filter((item) => {
    const date = new Date(item.created_at);
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  }).length;
};
