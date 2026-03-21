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
  submitFeedback,
  getLikes,
  incrementLike,
} from "../services/feedbackServices";
import { seedFeedback } from "../services/seedData";
import { FeedbackCard } from "../components/FeedbackCard";

export default function Homepage() {
  const [openSelectFBCat, setOpenSelectFBCat] = useState(false);
  const [selectCategory, setSelectCategory] = useState("All Category");
  const [openSelectCat, setOpenSelectCat] = useState(false);
  const [selectType, setSelectType] = useState("All Types");
  const [openSelectType, setOpenSelectType] = useState(false);
  const [selectSort, setSelectSort] = useState("Newest First");
  const [openSelectSort, setOpenSelectSort] = useState(false);

  const initialData = {
    title: "",
    feedback: "",
    category: "",
    type: "",
    created_at: new Date(),
  };
  const [formData, setFormData] = useState(initialData);
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    seedFeedback();
    const fetchFeedback = async () => {
      const feedback = await getFeedback();
      const feedbackWithLikes = await Promise.all(
        feedback.map(async (item) => ({
          ...item,
          likes: await getLikes(item.id),
        })),
      );
      setFeedbackData(feedbackWithLikes);
    };
    fetchFeedback();
  }, []);

  const getButtonClass = (value) =>
    `px-3 py-2 rounded-lg text-sm border transition-all ${
      formData.type === value
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-white border-slate-200 text-slate-500 hover:border-slate-500"
    }`;

  const post = async (e) => {
    e.preventDefault();
    const form = await submitFeedback(formData);
    setFeedbackData((prev) => [...prev, form]);
    setFormData(initialData);
  };

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

  const handleLike = async (id) => {
    const updatedFeedback = await incrementLike(id);
    setFeedbackData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: updatedFeedback } : item,
      ),
    );
  };

  const totalUpVotes = feedbackData.reduce(
    (sum, item) => sum + (item.likes || 0),
    0,
  );

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600 bg-indigo-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">
              {feedbackData.length}
            </p>
            <p className="text-xs text-slate-500">Total Feedback</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-emerald-600 bg-emerald-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">{totalUpVotes}</p>
            <p className="text-xs text-slate-500">Total Upvotes</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-amber-600 bg-amber-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              />
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">
              {getThisWeekFeedback(feedbackData)}
            </p>
            <p className="text-xs text-slate-500">This Week</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-rose-600 bg-rose-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">
              {getCategoryCounts(feedbackData)}
            </p>
            <p className="text-xs text-slate-500">Categories</p>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>

              <h2 className="text-lg font-semibold text-slate-900">
                Share Your Feedback
              </h2>
            </div>
            <p className="text-sm text-slate-500 ml-7">
              Your identity is never stored or shared — speak freely.
            </p>
          </div>
          <form className="px-4 pb-6 space-y-4">
            <input
              type="text"
              value={feedbackData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Give your feedback a title..."
              className="flex w-full rounded-md border px-3 py-1 text-base shadow-sm md:text-sm h-11 bg-slate-50-50 border-slate-200 focus:white transition-colors"
            />
            <textarea
              value={feedbackData.feedback}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
              placeholder="Describe your feedback in detail..."
              className="flex w-full rounded-md border px-3 py-1 text-base shadow-sm md:text-sm min-h-[120px] bg-slate-50-50 border-slate-200 focus:white transition-colors resize-none"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-48">
                <button
                  type="button"
                  onClick={() => setOpenSelectFBCat(!openSelectFBCat)}
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md px-3 py-2 text-sm shadow-sm ring-offset-background sm:w-48 bg-slate-50/50 border border-slate-200"
                >
                  {formData.category || "Select"}
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
                {openSelectFBCat && (
                  <ul className="absolute mt-1 w-full bg-white border rounded-md shadow-md sm:w-48 z-50">
                    {categorySelections.map((option) => (
                      <li
                        key={option}
                        onClick={() => {
                          setFormData({ ...formData, category: option });
                          setOpenSelectFBCat(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {types.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() =>
                      setFormData({ ...formData, type: item.value })
                    }
                    className={getButtonClass(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                disabled={!formData.title && !formData.feedback}
                onClick={post}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-11 gap-2 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-send w-4 h-4"
                >
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                  <path d="m21.854 2.147-10.94 10.939"></path>
                </svg>
                Submit Anonymously
              </button>
            </div>
          </form>
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
              onLikeUpdate={handleLike}
            />
          ))}
        </div>
      </div>
    </>
  );
}
