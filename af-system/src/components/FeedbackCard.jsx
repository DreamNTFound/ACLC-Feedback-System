import { useState, useEffect } from "react";
import { getLikes } from "../services/feedbackServices";

export const FeedbackCard = ({ feedback, onLikeUpdate }) => {
  const [likes, setLikes] = useState(feedback.likes || 0);

  useEffect(() => {
    const fetchLikes = async () => {
      const likes = await getLikes(feedback.id);
      setLikes(likes);
    };
    fetchLikes();
  }, [feedback.id]);

  const handleLike = () => {
    onLikeUpdate(feedback.id);
  };

  return (
    <div className="group">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-300 overflow-hidden">
        <div key={feedback.id}>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center rounded-md px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-50 text-blue-700 border-blue-200 border text-xs font-medium">
                  {feedback.category || "N/A"}
                </div>
                <span className="text-lg leading-none">
                  {typeof feedback.type === "string"
                    ? feedback.type
                    : feedback.type?.value || "N/A"}
                </span>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">
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
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
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
              Anonymous
            </div>
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
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
              {feedback.likes !== undefined ? feedback.likes : likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
