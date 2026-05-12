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

export const getLikes = async (id, user) =>
  api(() => {
    const feedback_likes = getStorage(LIKE_KEY) || {};
    const likedUsers = Array.isArray(feedback_likes[id])
      ? feedback_likes[id]
      : [];
    return {
      hasLiked: likedUsers.includes(user),
      totalLikes: likedUsers.length,
    };
  });

export const incrementLike = async (id, user) =>
  api(() => {
    const feedback_likes = getStorage(LIKE_KEY) || {};
    const likedUsers = Array.isArray(feedback_likes[id])
      ? feedback_likes[id]
      : [];
    const hasAlreadyLiked = likedUsers.includes(user);

    let updatedUsers;

    if (hasAlreadyLiked) {
      updatedUsers = likedUsers.filter((u) => u !== user);
    } else {
      updatedUsers = [...likedUsers, user];
    }
    feedback_likes[id] = updatedUsers;
    setStorage(LIKE_KEY, feedback_likes);

    return {
      hasLiked: !hasAlreadyLiked,
      totalLikes: updatedUsers.length,
    };
  });

export const deleteFeedback = async (id) =>
  api(() => {
    const feedback = getStorage(FEEDBACK_KEY) || [];
    const updatedFeedback = feedback.filter((item) => item.id !== id);

    setStorage(FEEDBACK_KEY, updatedFeedback);

    const feedback_likes = getStorage(LIKE_KEY) || {};

    delete feedback_likes[id];
    setStorage(LIKE_KEY, feedback_likes);

    return updatedFeedback;
  });
