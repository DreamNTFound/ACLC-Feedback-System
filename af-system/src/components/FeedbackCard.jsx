import { useState, useEffect } from "react";
import { getLikes, incrementLike } from "../services/feedbackServices";
import { authService } from "../services/authService";

export const FeedbackCard = ({ feedback, likesData, onLike, onDelete }) => {
  const user = authService.getCurrentUser();
  const [likes, setLikes] = useState(likesData?.totalLikes || 0);
  const [isLiked, setIsLiked] = useState(likesData?.hasLiked || false);

  useEffect(() => {
    if (!user?.usn) return;

    const fetchLikes = async () => {
      try {
        const data = await getLikes(feedback.id, user.usn);
        setLikes(data.totalLikes);
        setIsLiked(data.hasLiked);
        if (onLike) {
          onLike(feedback.id, data.totalLikes, data.hasLiked);
        }
      } catch (err) {
        console.error("Failed to fetch likes:", err);
      }
    };

    fetchLikes();
  }, []);

  const handleLike = async () => {
    if (!user?.usn) return;
    try {
      const data = await incrementLike(feedback.id, user.usn);
      setLikes(data.totalLikes);
      setIsLiked(data.hasLiked);
    } catch (err) {
      console.error("Failed to like feedback:", err);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      onDelete(feedback.id);
    }
  };

  return (
    <div className="group">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-300 overflow-hidden">
        <div key={feedback.id}>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <div className="inline-flex items-center rounded-md px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-50 text-blue-700 border-blue-200 border text-xs font-medium">
                    {feedback.category || "N/A"}
                  </div>
                  <span
                    className={`text-sm leading-none ${
                      feedback.type === "👍 Positive"
                        ? "text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-emerald-50 border-emerald-200 border"
                        : feedback.type === "💬 Neutral"
                          ? "text-blue-700 bg-blue-50 border-blue-200 px-1.5 py-0.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-50 border-blue-200 border"
                          : feedback.type === "💡 Suggestion"
                            ? "text-amber-700 bg-amber-50 border-amber-200 px-1.5 py-0.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-amber-50 border-amber-200 border"
                            : feedback.type === "⚠️ Concern"
                              ? "text-rose-700 bg-rose-50 border-rose-200 px-1.5 py-0.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-rose-50 border-rose-200 border"
                              : "text-slate-700 bg-slate-50 border-slate-200 px-1.5 py-0.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-slate-50 border-slate-200 border"
                    }`}
                  >
                    {typeof feedback.type === "string"
                      ? feedback.type
                      : feedback.type?.value || "N/A"}
                  </span>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-auto">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">
                  {feedback.title || "No Title"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {feedback.feedback || "N/A"}
                </p>
              </div>
              {user?.role === "admin" && (
                <button onClick={handleDelete} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                  />
                </svg>
                {user?.role === "admin" ? (
                  <span>posted by: USN {feedback.usn}</span>
                ) : (
                  <span>posted by: Anonymous</span>
                )}
              </div>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all text-slate-500 hover:bg-slate-50 hover:text-indigo-600 ${
                  isLiked ? "bg-indigo-50 text-indigo-600" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                  />
                </svg>
                <span>{likes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
