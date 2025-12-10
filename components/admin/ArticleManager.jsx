import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Edit, X, Loader2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FileUploadInput from "./FileUploadInput";

export default function ArticleManager() {
  const [editingArticle, setEditingArticle] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // File states
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroVideoFile, setHeroVideoFile] = useState(null);
  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);
  const [thumbnailVideoFile, setThumbnailVideoFile] = useState(null);
  const [sidebarReelFile, setSidebarReelFile] = useState(null);
  const [middleSectionVideoFile, setMiddleSectionVideoFile] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => base44.entities.Article.list("-created_date"),
  });

  const { data: authors = [] } = useQuery({
    queryKey: ["editorial-team"],
    queryFn: () => base44.entities.EditorialTeam.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Article.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Article.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Article.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingArticle(null);
    setHeroImageFile(null);
    setHeroVideoFile(null);
    setThumbnailImageFile(null);
    setThumbnailVideoFile(null);
    setSidebarReelFile(null);
    setMiddleSectionVideoFile(null);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData(e.target);
      const data = {
        title: formData.get("title"),
        subtitle: formData.get("subtitle"),
        category: formData.get("category"),
        status: formData.get("status"),
        hero_image_format: formData.get("hero_image_format"),
        content_section_1: formData.get("content_section_1"),
        content_section_2: formData.get("content_section_2"),
        content_section_3: formData.get("content_section_3"),
        embedded_code: formData.get("embedded_code"),
        author_id: formData.get("author_id"),
        read_time: parseInt(formData.get("read_time")) || 0,
        published_date: formData.get("published_date"),
        backlink: formData.get("backlink"),
        middle_section_type: formData.get("middle_section_type") || "none",
      };

      // Upload hero image if new file selected
      if (heroImageFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: heroImageFile });
        data.hero_image = file_url;
      } else if (editingArticle) {
        data.hero_image = editingArticle.hero_image;
      }

      // Upload hero video if new file selected
      if (heroVideoFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: heroVideoFile });
        data.hero_video = file_url;
      } else if (editingArticle) {
        data.hero_video = editingArticle.hero_video;
      }

      // Upload thumbnail image if new file selected
      if (thumbnailImageFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: thumbnailImageFile });
        data.thumbnail_image = file_url;
      } else if (editingArticle) {
        data.thumbnail_image = editingArticle.thumbnail_image;
      }

      // Upload thumbnail video if new file selected
      if (thumbnailVideoFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: thumbnailVideoFile });
        data.thumbnail_video = file_url;
      } else if (editingArticle) {
        data.thumbnail_video = editingArticle.thumbnail_video;
      }

      // Upload sidebar reel if new file selected
      if (sidebarReelFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: sidebarReelFile });
        data.sidebar_reel_video = file_url;
      } else if (editingArticle) {
        data.sidebar_reel_video = editingArticle.sidebar_reel_video;
      }

      // Upload middle section video if new file selected
      if (middleSectionVideoFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: middleSectionVideoFile });
        data.middle_section_video = file_url;
      } else if (editingArticle) {
        data.middle_section_video = editingArticle.middle_section_video;
      }

      if (editingArticle) {
        await updateMutation.mutateAsync({ id: editingArticle.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save article. Please try again.");
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Article Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} className="mr-2" />
          New Article
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-5xl mx-auto bg-gray-900 p-8 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingArticle ? "Edit Article" : "Create New Article"}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="title"
                    placeholder="Article Title"
                    required
                    defaultValue={editingArticle?.title}
                    className="col-span-2"
                  />
                  <Input
                    name="subtitle"
                    placeholder="Subtitle"
                    defaultValue={editingArticle?.subtitle}
                    className="col-span-2"
                  />
                  <Select name="category" required defaultValue={editingArticle?.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                      <SelectItem value="Cuisine">Cuisine</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Beauty">Beauty</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="status" required defaultValue={editingArticle?.status || "draft"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="awaiting_approval">Awaiting Approval</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hero Media */}
                <div className="grid grid-cols-2 gap-4">
                  <FileUploadInput
                    label="Hero Image *"
                    accept="image/*"
                    type="image"
                    currentUrl={editingArticle?.hero_image}
                    onFileSelect={setHeroImageFile}
                  />
                  <FileUploadInput
                    label="Hero Video (Optional)"
                    accept="video/*"
                    type="video"
                    currentUrl={editingArticle?.hero_video}
                    onFileSelect={setHeroVideoFile}
                  />
                </div>

                <Select name="hero_image_format" defaultValue={editingArticle?.hero_image_format || "landscape"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Hero Image Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>

                {/* Thumbnail Media */}
                <div className="grid grid-cols-2 gap-4">
                  <FileUploadInput
                    label="Thumbnail Image"
                    accept="image/*"
                    type="image"
                    currentUrl={editingArticle?.thumbnail_image}
                    onFileSelect={setThumbnailImageFile}
                  />
                  <FileUploadInput
                    label="Thumbnail Video (Optional)"
                    accept="video/*"
                    type="video"
                    currentUrl={editingArticle?.thumbnail_video}
                    onFileSelect={setThumbnailVideoFile}
                  />
                </div>

                {/* Sidebar Reel */}
                <FileUploadInput
                  label="Sidebar Reel Video (Portrait)"
                  accept="video/*"
                  type="video"
                  currentUrl={editingArticle?.sidebar_reel_video}
                  onFileSelect={setSidebarReelFile}
                />

                {/* Content Sections */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Content Section 1 *</label>
                    <Textarea
                      name="content_section_1"
                      rows={8}
                      placeholder="HTML content for first section"
                      required
                      defaultValue={editingArticle?.content_section_1}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content Section 2</label>
                    <Textarea
                      name="content_section_2"
                      rows={8}
                      placeholder="HTML content for second section"
                      defaultValue={editingArticle?.content_section_2}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Middle Section Type</label>
                    <Select name="middle_section_type" defaultValue={editingArticle?.middle_section_type || "none"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Middle Section Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="gallery">Gallery</SelectItem>
                        <SelectItem value="product_carousel">Product Carousel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <FileUploadInput
                    label="Middle Section Video (if type = video)"
                    accept="video/*"
                    type="video"
                    currentUrl={editingArticle?.middle_section_video}
                    onFileSelect={setMiddleSectionVideoFile}
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">Content Section 3</label>
                    <Textarea
                      name="content_section_3"
                      rows={8}
                      placeholder="HTML content for third section"
                      defaultValue={editingArticle?.content_section_3}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Embedded Code (Video Player)</label>
                    <Textarea
                      name="embedded_code"
                      rows={6}
                      placeholder="Paste embedded video player code here (e.g. iframe, script tags)"
                      defaultValue={editingArticle?.embedded_code}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Author and Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <Select name="author_id" required defaultValue={editingArticle?.author_id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    name="read_time"
                    type="number"
                    placeholder="Read Time (minutes)"
                    defaultValue={editingArticle?.read_time}
                  />
                  <Input
                    name="published_date"
                    type="date"
                    defaultValue={editingArticle?.published_date}
                  />
                  <Input
                    name="backlink"
                    placeholder="Backlink URL"
                    defaultValue={editingArticle?.backlink}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={resetForm} disabled={uploading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading Files...
                      </>
                    ) : (
                      editingArticle ? "Update Article" : "Create Article"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium">{article.title}</h3>
              <p className="text-sm text-gray-400">
                {article.category} • {article.status}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingArticle(article);
                  setShowForm(true);
                }}
              >
                <Edit size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (confirm("Delete this article?")) {
                    deleteMutation.mutate(article.id);
                  }
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}