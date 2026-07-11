"use client";

import React, { useState, useTransition, useRef } from "react";
import { Plus, Edit2, Trash2, X, Newspaper, AlertCircle, Star, Image as ImageIcon, Upload } from "lucide-react";
import {
  createNewsArticleAction,
  updateNewsArticleAction,
  deleteNewsArticleAction,
  toggleNewsHighlightAction
} from "@/app/actions/adminActions";

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  content: string;
  imageUrl: string | null;
  isHighlighted: boolean;
  order: number;
}

interface ManageNewsClientProps {
  articles: NewsArticle[];
}

const CATEGORY_OPTIONS = [
  "Facilities Update",
  "Administration",
  "Syllabus Update",
  "Certifications",
  "Events",
  "Announcements"
];

export default function ManageNewsClient({ articles }: ManageNewsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editArticle, setEditArticle] = useState<NewsArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [order, setOrder] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const highlightedArticles = articles.filter(a => a.isHighlighted);
  const highlightedCount = highlightedArticles.length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast("Error: Image file size exceeds 5MB limit.");
        if (e.target) e.target.value = "";
        return;
      }
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadToR2 = async (file: File): Promise<string> => {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&prefix=news`);
    if (!res.ok) {
      throw new Error("Failed to get upload signature");
    }
    const { uploadUrl, publicUrl } = await res.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload image to storage");
    }
    return publicUrl;
  };

  const handleOpenAdd = () => {
    setEditArticle(null);
    setTitle("");
    setCategory("");
    setCustomCategory("");
    setDate("");
    setDescription("");
    setContent("");
    setImageUrl("");
    setSelectedFile(null);
    setIsHighlighted(false);
    const nextOrder = articles.length > 0 ? Math.max(...articles.map(a => a.order)) + 1 : 0;
    setOrder(nextOrder);
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (article: NewsArticle) => {
    setEditArticle(article);
    setTitle(article.title);
    // Check if category is a known option
    if (CATEGORY_OPTIONS.includes(article.category)) {
      setCategory(article.category);
      setCustomCategory("");
    } else {
      setCategory("__custom__");
      setCustomCategory(article.category);
    }
    setDate(article.date);
    setDescription(article.description);
    setContent(article.content || "");
    setImageUrl(article.imageUrl || "");
    setSelectedFile(null);
    setIsHighlighted(article.isHighlighted);
    setOrder(article.order);
    setError(null);
    setIsOpen(true);
  };

  const getResolvedCategory = () => {
    if (category === "__custom__") return customCategory.trim();
    return category;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedCategory = getResolvedCategory();
    if (!title.trim() || !resolvedCategory || !date.trim() || !description.trim() || !content.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setUploading(true);
    setError(null);

    const run = async () => {
      let finalImageUrl = imageUrl;
      try {
        if (selectedFile) {
          finalImageUrl = await uploadToR2(selectedFile);
        }

        startTransition(async () => {
          try {
            const payload = {
              title: title.trim(),
              category: resolvedCategory,
              date: date.trim(),
              description: description.trim(),
              content: content.trim(),
              imageUrl: finalImageUrl.trim() || null,
              isHighlighted,
              order: Number(order)
            };

            if (editArticle) {
              const res = await updateNewsArticleAction(editArticle.id, payload);
              if (!res.success) {
                setError(res.error || "Failed to update article.");
                return;
              }
            } else {
              const res = await createNewsArticleAction(payload);
              if (!res.success) {
                setError(res.error || "Failed to create article.");
                return;
              }
            }
            setIsOpen(false);
          } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred.");
          } finally {
            setUploading(false);
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Image upload failed.");
        setUploading(false);
      }
    };

    run();
  };

  const handleDelete = (id: string, articleTitle: string) => {
    if (!confirm(`Are you sure you want to delete the article: "${articleTitle}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteNewsArticleAction(id);
        if (!res.success) throw new Error("Failed to delete article.");
      } catch (err) {
        alert(err instanceof Error ? err.message : "An error occurred.");
      }
    });
  };

  const handleToggleHighlight = (id: string, currentState: boolean) => {
    const newState = !currentState;

    startTransition(async () => {
      try {
        const res = await toggleNewsHighlightAction(id, newState);
        if (!res.success) {
          showToast(res.error || "Failed to toggle highlight.");
          return;
        }
      } catch (err) {
        showToast(err instanceof Error ? err.message : "An error occurred.");
      }
    });
  };

  return (
    <div className="space-y-6">

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] max-w-sm animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <span>Manage News Articles</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, or delete news articles. Select up to 4 articles to highlight in the hero carousel.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="rounded-lg bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Article</span>
        </button>
      </div>

      {/* Highlighted Articles Panel */}
      <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-semibold text-slate-800">Highlighted Articles</h2>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            highlightedCount === 4
              ? "bg-emerald-100 text-emerald-700"
              : highlightedCount > 4
              ? "bg-red-100 text-red-700"
              : "bg-amber-100 text-amber-700"
          }`}>
            {highlightedCount} / 4 selected
          </span>
        </div>

        {highlightedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {highlightedArticles.map((article, idx) => (
              <div
                key={article.id}
                className="relative bg-white border border-amber-200/60 rounded-xl p-3 flex flex-col gap-2 group"
              >
                {/* Slot number badge */}
                <div className="absolute -top-2 -left-2 h-6 w-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-semibold shadow-sm">
                  {idx + 1}
                </div>

                {/* Image preview */}
                {article.imageUrl ? (
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full rounded-lg bg-slate-100 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-slate-300" />
                  </div>
                )}

                <p className="text-[11px] font-semibold text-slate-800 leading-tight line-clamp-2">
                  {article.title}
                </p>
                <span className="text-[10px] font-semibold text-amber-600">{article.category}</span>

                {/* Un-highlight button */}
                <button
                  onClick={() => handleToggleHighlight(article.id, article.isHighlighted)}
                  disabled={isPending}
                  className="mt-auto text-[10px] font-semibold text-amber-600 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Star className="h-3 w-3 fill-amber-500" />
                  <span>Remove highlight</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-amber-700/60 font-medium">
            No articles highlighted yet. Click the star icon on any article below to add it to the hero carousel.
          </p>
        )}
      </div>

      {/* Articles List Table */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-2xl">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-semibold text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 w-14">Order</th>
              <th className="px-5 py-3 w-14 text-center">
                <Star className="h-3.5 w-3.5 mx-auto text-slate-400" />
              </th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 w-16">Image</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-medium font-body">
                  No news articles configured yet. Click &quot;Add Article&quot; to begin.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-sans text-slate-400 font-semibold">
                    {article.order}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => handleToggleHighlight(article.id, article.isHighlighted)}
                      disabled={isPending}
                      className="cursor-pointer transition-colors hover:scale-110 transform"
                      title={article.isHighlighted ? "Remove from highlights" : "Add to highlights"}
                    >
                      <Star className={`h-4 w-4 ${
                        article.isHighlighted
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-300 hover:text-amber-400"
                      }`} />
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-heading font-semibold text-slate-900 leading-tight line-clamp-1">
                      {article.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                      {article.description}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold">
                      {article.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 font-medium font-body">
                    {article.date}
                  </td>
                  <td className="px-5 py-3.5">
                    {article.imageUrl ? (
                      <div className="h-8 w-12 overflow-hidden rounded bg-slate-100">
                        <img
                          src={article.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-12 rounded bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-slate-300" />
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(article)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-pointer px-2 py-1 border border-slate-200 hover:border-primary/20 bg-white rounded-md"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-1 border border-slate-200 hover:border-red-200 bg-white rounded-md"
                      disabled={isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg border border-slate-200 bg-white p-6 shadow-lg animate-in zoom-in-95 duration-200 rounded-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-heading text-sm font-semibold text-slate-900">
                {editArticle ? "Edit News Article" : "Create New Article"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">

              <div>
                <label className="block text-slate-500 mb-1">Article Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MIMOS cleanroom upgrade completed"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none bg-white"
                    required
                  >
                    <option value="">Select category…</option>
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    <option value="__custom__">Custom…</option>
                  </select>
                  {category === "__custom__" && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter custom category"
                      className="w-full mt-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Display Date *</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. 20 June 2026"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the article..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none font-body font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Article Content (Markdown) *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed news article content in Markdown format..."
                  rows={8}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none font-body font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Article Image</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border border-dashed border-slate-300 hover:border-primary/50 bg-slate-50/50 p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1 rounded-lg"
                    >
                      <Upload className="h-5 w-5 text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-600 block">
                        {selectedFile ? selectedFile.name : "Choose image file"}
                      </span>
                      <span className="text-[8px] text-slate-400 block font-medium">
                        PNG, JPG, or WebP. Max 5MB.
                      </span>
                    </button>
                  </div>

                  {imageUrl && (
                    <div className="h-16 w-24 relative bg-slate-50 border border-slate-200 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Highlighted</label>
                  <div
                    onClick={() => setIsHighlighted(!isHighlighted)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                      isHighlighted
                        ? "bg-amber-50 border-amber-300 text-amber-700"
                        : "bg-white border-slate-200 text-slate-500"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${isHighlighted ? "fill-amber-500 text-amber-500" : "text-slate-300"}`} />
                    <span className="font-semibold">{isHighlighted ? "Highlighted" : "Not highlighted"}</span>
                  </div>
                  {isHighlighted && !editArticle && highlightedCount >= 4 && (
                    <p className="text-[10px] text-red-500 font-medium mt-1">
                      ⚠ Already 4 highlights selected. This will be rejected unless you remove one first.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-650 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploading}
                  className="rounded-lg bg-primary hover:bg-primary-hover px-5 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading ? "Uploading image..." : isPending ? "Saving..." : editArticle ? "Save Changes" : "Create Article"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
