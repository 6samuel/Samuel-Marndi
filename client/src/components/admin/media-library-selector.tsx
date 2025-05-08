import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Search, Upload, Loader2, FileImage, X, Plus, Check, ExternalLink } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

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
    dimensions: { width: 512, height: 512 }
  },
  {
    id: 2,
    name: "Samuel Marndi Logo Text",
    url: "/attached_assets/Samuel%20Marndi%20Logo%20text.png",
    type: "image/png",
    size: 12840,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 1024, height: 256 }
  },
  {
    id: 3,
    name: "Samuel Marndi",
    url: "/attached_assets/Samuel%20Marndi.png",
    type: "image/png",
    size: 23560,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 800, height: 600 }
  },
  {
    id: 4,
    name: "Logo Icon",
    url: "/attached_assets/s.png",
    type: "image/png",
    size: 3256,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 64, height: 64 }
  },
  {
    id: 5,
    name: "Background Image",
    url: "/attached_assets/simplebg2.png",
    type: "image/png",
    size: 234560,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 1920, height: 1080 }
  },
  {
    id: 6,
    name: "Screenshot",
    url: "/attached_assets/Screenshot_7-5-2025_154531_replit.com.jpeg",
    type: "image/jpeg",
    size: 123456,
    uploadedAt: new Date().toISOString(),
    dimensions: { width: 1024, height: 768 }
  },
];

interface MediaLibrarySelectorProps {
  onSelect: (url: string) => void;
}

export default function MediaLibrarySelector({ onSelect }: MediaLibrarySelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("browse");
  const [isUploading, setIsUploading] = useState(false);
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
  
  const handleUrlUpload = async () => {
    if (!uploadUrl) {
      toast({
        title: "URL required",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }
    
    // Check if URL is valid
    try {
      setIsUploading(true);
      
      // In a real implementation, we would call an API to validate and store the URL
      // For now, we'll just simulate a delay and return the URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If valid, select the URL
      handleSelect(uploadUrl);
      setIsUploading(false);
      setIsDialogOpen(false);
      
      // Reset form
      setUploadUrl("");
      setUploadName("");
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not upload image from URL",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };
  
  const handleSelect = (url: string) => {
    onSelect(url);
    setIsDialogOpen(false);
  };
  
  // Filter media items based on search query
  const filteredMediaItems = mediaItems 
    ? mediaItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Image className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
            <DialogDescription>
              Select an image from your media library or upload a new one
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="upload-url">Upload by URL</TabsTrigger>
              </TabsList>
              
              {activeTab === "browse" && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search media..."
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>
            
            <TabsContent value="browse" className="min-h-[300px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load media library: {(error as Error).message}
                  </AlertDescription>
                </Alert>
              ) : filteredMediaItems.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
                  <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">No media found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 
                      "No matches found. Try a different search term." : 
                      "Your media library is empty. Upload some images to get started."}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[400px] p-1">
                  {filteredMediaItems.map(item => (
                    <div 
                      key={item.id}
                      className={`
                        border rounded-md overflow-hidden cursor-pointer 
                        transition-all duration-200 hover:shadow-md
                        ${selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : ''}
                      `}
                      onClick={() => setSelectedItem(item)}
                      onDoubleClick={() => handleSelect(item.url)}
                    >
                      <div className="relative aspect-square bg-gray-100">
                        <img 
                          src={item.url} 
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/400?text=Error";
                          }}
                        />
                      </div>
                      <div className="p-2 text-xs truncate">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedItem && (
                <div className="mt-4 p-3 border rounded-md bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={selectedItem.url} 
                        alt={selectedItem.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{selectedItem.name}</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                        <div>Type: {selectedItem.type}</div>
                        <div>Size: {Math.round(selectedItem.size / 1024)} KB</div>
                        {selectedItem.dimensions && (
                          <div>Dimensions: {selectedItem.dimensions.width} × {selectedItem.dimensions.height}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Button 
                        size="sm" 
                        onClick={() => handleSelect(selectedItem.url)}
                      >
                        <Check className="mr-2 h-4 w-4" /> Select
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload-url" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Name (Optional)</label>
                  <Input
                    placeholder="My Image"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                  />
                </div>
                
                {uploadUrl && (
                  <div className="mt-4 p-3 border rounded-md bg-gray-50">
                    <h4 className="font-medium text-sm mb-2">Preview</h4>
                    <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={uploadUrl} 
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Invalid+Image+URL";
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleUrlUpload}
                  disabled={!uploadUrl || isUploading}
                  className="w-full"
                >
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUploading ? "Uploading..." : "Upload & Select"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}