import { getStorage, setStorage } from "./storage";
import { api } from "./api";

const FEEDBACK_KEY = "feedback";
const LIKE_KEY = "feedback_likes";

export const getFeedback = async () =>
  api(() => {
    const feedback = getStorage(FEEDBACK_KEY) || [];
    return feedback;
  });

export const submitFeedback = async (feedbackData) =>
  api(() => {
    const existingFeedback = getStorage(FEEDBACK_KEY) || [];
    const newFeedback = { id: Date.now(), ...feedbackData };
    const updatedFeedback = [...existingFeedback, newFeedback];
    setStorage(FEEDBACK_KEY, updatedFeedback);
    return newFeedback;
  });

export const getLikes = async (id) =>
  api(() => {
    const feedback_likes = getStorage(LIKE_KEY) || {};
    return feedback_likes[id] || 0;
  });

export const incrementLike = async (id) =>
  api(() => {
    const feedback_likes = getStorage(LIKE_KEY) || {};
    const currentLikes = feedback_likes[id] || 0;
    const updatedLikes = currentLikes + 1;
    feedback_likes[id] = updatedLikes;
    setStorage(LIKE_KEY, feedback_likes);
    return updatedLikes;
  });

export const deleteFeedback = async (id) =>
  api(() => {
    const feedback = getStorage(FEEDBACK_KEY) || [];
    const updatedFeedback = feedback.filter((item) => item.id !== id);
    setStorage(FEEDBACK_KEY, updatedFeedback);
    return updatedFeedback;
  });
