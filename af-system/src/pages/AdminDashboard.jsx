import { useState, useEffect } from "react";
import {
  categorySelections,
  types,
  getCategoryCounts,
  sortOptions,
  sortFeedback,
} from "../utils/formatHelpers";
import { getThisWeekFeedback } from "../utils/weekFormat";
import {
  getFeedback,
  getLikes,
  deleteFeedback,
} from "../services/feedbackServices";
import { seedFeedback } from "../services/seedData";
import { FeedbackCard } from "../components/FeedbackCard";

export default function AdminDashboard() {
  const [selectCategory, setSelectCategory] = useState("All Category");
  const [openSelectCat, setOpenSelectCat] = useState(false);
  const [selectType, setSelectType] = useState("All Types");
  const [openSelectType, setOpenSelectType] = useState(false);
  const [selectSort, setSelectSort] = useState("Newest First");
  const [openSelectSort, setOpenSelectSort] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    seedFeedback();
    const fetchFeedback = async () => {
      const feedback = await getFeedback();
      const feedbackWithLikes = await Promise.all(
        feedback.map(async (fb) => {
          const likesData = await getLikes(fb.id);
          return { ...fb, likes: likesData?.totalLikes || 0 };
        }),
      );
      setFeedbackData(feedbackWithLikes);
    };
    fetchFeedback();
  }, []);

  const filteredFeedback = feedbackData.filter((fb) => {
    if (selectCategory && selectCategory !== "All Category") {
      if (fb.category !== selectCategory) return false;
    }
    if (selectType && selectType !== "All Types") {
      if (fb.type !== selectType) return false;
    }
    return true;
  });

  const sortedFeedback = sortFeedback(filteredFeedback, selectSort);

  const totalUpvotes = feedbackData.reduce(
    (sum, fb) => sum + (fb.likes || 0),
    0,
  );
  const thisWeekFeedback = getThisWeekFeedback(feedbackData);
  const categoryCounts = getCategoryCounts(feedbackData);

  const filteredTypesCount = types.map((t) => ({
    ...t,
    count: feedbackData.filter((fb) => fb.type === t.value).length,
  }));

  const handleDelete = async (id) => {
    const updatedFeedback = await deleteFeedback(id);

    const mergedFeedback = updatedFeedback.map((fb) => {
      const old = feedbackData.find((f) => f.id === fb.id);
      return { ...fb, likes: old?.likes || 0 };
    });

    setFeedbackData(mergedFeedback);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-indigo-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <div>
            <p className="text-xl font-bold text-slate-900">
              {feedbackData.length}
            </p>
            <p className="text-xs text-slate-500">Total Feedback</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-blue-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
            />
          </svg>
          <div>
            <p className="text-xl font-bold text-slate-900">{totalUpvotes}</p>
            <p className="text-xs text-slate-500">Total Upvotes</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-amber-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
            />
          </svg>
          <div>
            <p className="text-xl font-bold text-slate-900">
              {thisWeekFeedback}
            </p>
            <p className="text-xs text-slate-500">This Week</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-rose-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
          <div>
            <p className="text-xl font-bold text-slate-900">{categoryCounts}</p>
            <p className="text-xs text-slate-500">Categories</p>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Feedback Breakdown by Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border p-3 bg-emerald-50 text-emerald-700 border-emerald-200">
            <p className="text-2xl mb-1">👍</p>
            <p className="text-lg font-bold">
              {filteredTypesCount.find((t) => t.value === "👍 Positive")
                ?.count || 0}
            </p>
            <p className="text-xs font-medium">Positive</p>
          </div>
          <div className="rounded-xl border p-3 bg-blue-50 text-blue-700 border-blue-200">
            <p className="text-2xl mb-1">💬</p>
            <p className="text-lg font-bold">
              {filteredTypesCount.find((t) => t.value === "💬 Neutral")
                ?.count || 0}
            </p>
            <p className="text-xs font-medium">Neutral</p>
          </div>
          <div className="rounded-xl border p-3 bg-amber-50 text-amber-700 border-amber-200">
            <p className="text-2xl mb-1">💡</p>
            <p className="text-lg font-bold">
              {
                filteredTypesCount.find((t) => t.value === "💡 Suggestion")
                  ?.count
              }
            </p>
            <p className="text-xs font-medium">Suggest</p>
          </div>
          <div className="rounded-xl border p-3 bg-rose-50 text-rose-700 border-rose-200">
            <p className="text-2xl mb-1">⚠️</p>
            <p className="text-lg font-bold">
              {filteredTypesCount.find((t) => t.value === "⚠️ Concern")?.count}
            </p>
            <p className="text-xs font-medium">Concern</p>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Feedback Board
            </h2>
            <p className="text-sm text-slate-500">posts</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenSelectCat(!openSelectCat)}
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md px-3 py-2 text-sm shadow-sm ring-offset-background sm:w-48 bg-slate-50/50 border border-slate-200"
              >
                <span>{selectCategory}</span>
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
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {openSelectCat && (
                <ul className="absolute mt-1 w-full bg-white border rounded-md shadow-md sm:w-48">
                  <li
                    onClick={() => {
                      setSelectCategory("All Category");
                      setOpenSelectCat(false);
                    }}
                    className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                  >
                    All Category
                  </li>

                  {categorySelections.map((option) => (
                    <li
                      key={option}
                      onClick={() => {
                        setSelectCategory(option);
                        setOpenSelectCat(false);
                      }}
                      className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenSelectType(!openSelectType)}
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md px-3 py-2 text-sm shadow-sm ring-offset-background sm:w-48 bg-slate-50/50 border border-slate-200"
              >
                <span>
                  {selectType === "All Types"
                    ? "All Types"
                    : types.find((t) => t.value === selectType).label}
                </span>
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
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {openSelectType && (
                <ul className="absolute mt-1 w-full bg-white border rounded-md shadow-md sm:w-48">
                  <li
                    onClick={() => {
                      setSelectType("All Types");
                      setOpenSelectType(false);
                    }}
                    className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                  >
                    All Types
                  </li>

                  {types.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        setSelectType(option.value);
                        setOpenSelectType(false);
                      }}
                      className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setOpenSelectSort(!openSelectSort)}
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md px-3 py-2 text-sm shadow-sm ring-offset-background sm:w-48 bg-slate-50/50 border border-slate-200"
              >
                <span>{selectSort}</span>
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
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {openSelectSort && (
                <ul className="absolute mt-1 w-full bg-white border rounded-md shadow-md sm:w-48">
                  {sortOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => {
                        setSelectSort(option);
                        setOpenSelectSort(false);
                      }}
                      className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {sortedFeedback.map((item) => (
            <FeedbackCard
              key={item.id}
              feedback={item}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
}
