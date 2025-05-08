import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Image,
  Search,
  Upload,
  Loader2,
  FileImage,
  X,
  Plus,
  Check,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  Eye,
  Filter,
  Download,
  FileUp,
  Clipboard,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

// This is just a placeholder until we implement the real API
// We'll use static images from attached_assets for now
const DEMO_MEDIA_ITEMS = [
  {
    id: 1,
    name: "Samuel Marndi Logo",
    url: "/attached_assets/Samuel%20Marndi%20Logo%20Final.png",
    type: "image/png",
    size: 15420,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 512, height: 512 },
    alt: "Samuel Marndi main logo",
    tags: ["logo", "branding"],
  },
  {
    id: 2,
    name: "Samuel Marndi Logo Text",
    url: "/attached_assets/Samuel%20Marndi%20Logo%20text.png",
    type: "image/png",
    size: 12840,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 1024, height: 256 },
    alt: "Samuel Marndi text logo",
    tags: ["logo", "branding"],
  },
  {
    id: 3,
    name: "Samuel Marndi",
    url: "/attached_assets/Samuel%20Marndi.png",
    type: "image/png",
    size: 23560,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 800, height: 600 },
    alt: "Samuel Marndi profile",
    tags: ["profile", "portrait"],
  },
  {
    id: 4,
    name: "Logo Icon",
    url: "/attached_assets/s.png",
    type: "image/png",
    size: 3256,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 64, height: 64 },
    alt: "Samuel Marndi logo icon",
    tags: ["logo", "icon"],
  },
  {
    id: 5,
    name: "Background Image",
    url: "/attached_assets/simplebg2.png",
    type: "image/png",
    size: 234560,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 1920, height: 1080 },
    alt: "Simple background pattern",
    tags: ["background", "pattern"],
  },
  {
    id: 6,
    name: "Screenshot",
    url: "/attached_assets/Screenshot_7-5-2025_154531_replit.com.jpeg",
    type: "image/jpeg",
    size: 123456,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 1024, height: 768 },
    alt: "Screenshot of Replit website",
    tags: ["screenshot", "website"],
  },
];

export default function MediaLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editTags, setEditTags] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "size">("newest");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // This would be a real API call in production
  const { data: mediaItems, isLoading, error } = useQuery({
    queryKey: ["/api/media"],
    queryFn: async () => {
      // In a real implementation, this would be an API call
      return DEMO_MEDIA_ITEMS;
    },
    refetchOnWindowFocus: false,
  });

  const uploadMediaMutation = useMutation({
    mutationFn: async (data: {
      url?: string;
      file?: File;
      name: string;
      alt: string;
      tags: string[];
    }) => {
      // In a real implementation, this would be an API call
      setIsUploading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate response
      const newItem = {
        id: Math.max(0, ...DEMO_MEDIA_ITEMS.map((item) => item.id)) + 1,
        name: data.name,
        url: data.url || URL.createObjectURL(data.file!),
        type: data.file?.type || "image/jpeg",
        size: data.file?.size || 10000,
        uploadedAt: new Date().toISOString(),
        dimensions: { width: 800, height: 600 },
        alt: data.alt,
        tags: data.tags,
      };

      return newItem;
    },
    onSuccess: (newItem) => {
      // In a real implementation, we would invalidate the query
      // For now, we'll just add the new item to our demo data
      DEMO_MEDIA_ITEMS.push(newItem);

      toast({
        title: "Upload successful",
        description: "Media has been uploaded successfully.",
      });
      setIsUploading(false);
      setIsUploadModalOpen(false);
      setUploadUrl("");
      setUploadName("");
      setUploadAlt("");
      setUploadTags("");
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload.",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: async (data: {
      id: number;
      name: string;
      alt: string;
      tags: string[];
    }) => {
      // In a real implementation, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find and update the item in our demo data
      const itemIndex = DEMO_MEDIA_ITEMS.findIndex((i) => i.id === data.id);
      if (itemIndex !== -1) {
        DEMO_MEDIA_ITEMS[itemIndex] = {
          ...DEMO_MEDIA_ITEMS[itemIndex],
          name: data.name,
          alt: data.alt,
          tags: data.tags,
        };
      }

      return DEMO_MEDIA_ITEMS[itemIndex];
    },
    onSuccess: (updatedItem) => {
      toast({
        title: "Update successful",
        description: "Media details have been updated.",
      });
      setIsEditModalOpen(false);
      setSelectedItem(updatedItem);
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred during update.",
        variant: "destructive",
      });
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real implementation, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove the item from our demo data
      const itemIndex = DEMO_MEDIA_ITEMS.findIndex((i) => i.id === id);
      if (itemIndex !== -1) {
        DEMO_MEDIA_ITEMS.splice(itemIndex, 1);
      }

      return id;
    },
    onSuccess: () => {
      toast({
        title: "Delete successful",
        description: "Media has been deleted.",
      });
      setIsDeleteConfirmOpen(false);
      setIsDetailModalOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "An error occurred during deletion.",
        variant: "destructive",
      });
      setIsDeleteConfirmOpen(false);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadName(file.name.split(".")[0]);
    setUploadMethod("file");
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = async () => {
    const name = uploadName.trim() || "Untitled";
    const tags = uploadTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (uploadMethod === "url") {
      if (!uploadUrl) {
        toast({
          title: "URL required",
          description: "Please enter a valid image URL",
          variant: "destructive",
        });
        return;
      }

      uploadMediaMutation.mutate({
        url: uploadUrl,
        name,
        alt: uploadAlt,
        tags,
      });
    } else {
      if (!fileInputRef.current?.files?.length) {
        toast({
          title: "File required",
          description: "Please select a file to upload",
          variant: "destructive",
        });
        return;
      }

      uploadMediaMutation.mutate({
        file: fileInputRef.current.files[0],
        name,
        alt: uploadAlt,
        tags,
      });
    }
  };

  const handleEditSubmit = () => {
    if (!selectedItem) return;

    const tags = editTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    updateMediaMutation.mutate({
      id: selectedItem.id,
      name: editName || "Untitled",
      alt: editAlt,
      tags,
    });
  };

  const handleDeleteMedia = () => {
    if (!selectedItem) return;
    deleteMediaMutation.mutate(selectedItem.id);
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditAlt(item.alt || "");
    setEditTags((item.tags || []).join(", "));
    setIsEditModalOpen(true);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "The media URL has been copied to your clipboard.",
    });
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get all unique tags for filtering
  const allTags = mediaItems
    ? Array.from(
        new Set(
          mediaItems.flatMap((item: any) => item.tags || []).filter(Boolean)
        )
      )
    : [];

  // Filter media items based on search query and tag filter
  let filteredMediaItems = mediaItems
    ? mediaItems.filter((item: any) => {
        const matchesSearch =
          searchQuery === "" ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.alt &&
            item.alt.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.tags &&
            item.tags.some((tag: string) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ));

        const matchesTag =
          !filterTag || (item.tags && item.tags.includes(filterTag));

        return matchesSearch && matchesTag;
      })
    : [];

  // Sort the filtered media items
  filteredMediaItems = [...filteredMediaItems].sort((a: any, b: any) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return b.size - a.size;
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">
            Manage all your website images and media assets
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            onClick={() => {
              setUploadMethod("url");
              setUploadUrl("");
              setUploadName("");
              setUploadAlt("");
              setUploadTags("");
              setIsUploadModalOpen(true);
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Add from URL
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-3 md:space-y-0">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search media..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={filterTag || ""}
            onValueChange={(value) => setFilterTag(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
            List
          </Button>
        </div>
      </div>

      {/* Media Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="aspect-square rounded-md" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error loading media</AlertTitle>
          <AlertDescription>
            {(error as Error).message ||
              "An error occurred while loading your media library."}
          </AlertDescription>
        </Alert>
      ) : filteredMediaItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No media found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterTag
              ? "No matches found. Try different search terms or filters."
              : "Your media library is empty. Upload images to get started."}
          </p>
          {(searchQuery || filterTag) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilterTag(null);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMediaItems.map((item: any) => (
            <div
              key={item.id}
              className="border rounded-md overflow-hidden group hover:shadow-md transition-shadow duration-200"
            >
              <div
                className="aspect-square bg-gray-100 relative cursor-pointer"
                onClick={() => handleViewDetails(item)}
              >
                <img
                  src={item.url}
                  alt={item.alt || item.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400?text=Error";
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(item.url);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(item);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">
                    {formatFileSize(item.size)}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1">
                      {item.tags.slice(0, 2).map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs py-0 px-1.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs py-0 px-1.5"
                        >
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Preview</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden md:table-cell">Dimensions</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMediaItems.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="p-2">
                    <div
                      className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={() => handleViewDetails(item)}
                    >
                      <img
                        src={item.url}
                        alt={item.alt || item.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/400?text=Error";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.type.split("/")[1].toUpperCase()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatFileSize(item.size)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.dimensions
                      ? `${item.dimensions.width} × ${item.dimensions.height}`
                      : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(item.uploadedAt)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.tags && item.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs py-0 px-1.5"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
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
                            className="lucide lucide-more-vertical"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(item)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyUrl(item.url)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDeleteConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Add new images to your media library
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue={uploadMethod}
            value={uploadMethod}
            onValueChange={(v: any) => setUploadMethod(v)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4 pt-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  className="w-full h-32 flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileUp className="h-8 w-8 mb-2 text-gray-400" />
                  <div className="font-medium">Click to select a file</div>
                  <div className="text-xs text-gray-500 mt-1">
                    or drag and drop
                  </div>
                </Button>
              </div>

              {fileInputRef.current?.files?.length ? (
                <div className="p-3 border rounded-md bg-gray-50 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(fileInputRef.current.files[0])}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {fileInputRef.current.files[0].name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(fileInputRef.current.files[0].size)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="url" className="space-y-4 pt-4">
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                />
              </div>

              {uploadUrl && (
                <div className="p-3 border rounded-md bg-gray-50">
                  <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={uploadUrl}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x300?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="media-name">Name</Label>
              <Input
                id="media-name"
                placeholder="My Image"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="media-alt">Alt Text</Label>
              <Input
                id="media-alt"
                placeholder="Descriptive text for accessibility"
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-1">
                Describe the image for screen readers and SEO
              </div>
            </div>

            <div>
              <Label htmlFor="media-tags">Tags</Label>
              <Input
                id="media-tags"
                placeholder="logo, banner, product (comma separated)"
                value={uploadTags}
                onChange={(e) => setUploadTags(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={isUploading}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>Update media details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedItem && (
              <div className="p-3 border rounded-md bg-gray-50 flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.alt || selectedItem.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400?text=Error";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {selectedItem.type.split("/")[1].toUpperCase()} Image
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(selectedItem.size)} •{" "}
                    {selectedItem.dimensions
                      ? `${selectedItem.dimensions.width} × ${selectedItem.dimensions.height}`
                      : "Unknown dimensions"}
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="edit-alt">Alt Text</Label>
              <Input
                id="edit-alt"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-1">
                Describe the image for screen readers and SEO
              </div>
            </div>

            <div>
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                placeholder="logo, banner, product (comma separated)"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Media Details</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.alt || selectedItem.name}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/800x450?text=Error+Loading+Image";
                  }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{selectedItem.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="mt-1">{selectedItem.type}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Dimensions
                  </h3>
                  <p className="mt-1">
                    {selectedItem.dimensions
                      ? `${selectedItem.dimensions.width} × ${selectedItem.dimensions.height} pixels`
                      : "Unknown"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Size</h3>
                  <p className="mt-1">{formatFileSize(selectedItem.size)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Upload Date
                  </h3>
                  <p className="mt-1">{formatDate(selectedItem.uploadedAt)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Alt Text</h3>
                  <p className="mt-1">{selectedItem.alt || "—"}</p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">URL</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="text-xs bg-gray-100 p-2 rounded flex-1 overflow-x-auto">
                      {selectedItem.url}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyUrl(selectedItem.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="mt-1">
                    {selectedItem.tags && selectedItem.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No tags</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleEditClick(selectedItem)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Details
                </Button>
                <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Media
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this media from your
                        library. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteMedia}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}