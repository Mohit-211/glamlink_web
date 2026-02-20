'use client';

import { useState, useEffect } from 'react';

interface StoredVideo {
  url: string;
  path: string;
  videoType: string;
  issueId: string;
  uploadedAt: string;
  name: string;
  duration?: number;
}

interface VideoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentVideoType?: string;
}

export default function VideoGallery({
  isOpen,
  onClose,
  onSelect,
  currentVideoType
}: VideoGalleryProps) {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<StoredVideo[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<StoredVideo | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Load videos from localStorage
      const storedVideos = JSON.parse(localStorage.getItem('magazineEditorVideos') || '[]');
      setVideos(storedVideos);
      setFilteredVideos(storedVideos);
      
      // Set initial filter based on current video type
      if (currentVideoType) {
        setSelectedType(currentVideoType);
      }
    }
  }, [isOpen, currentVideoType]);

  useEffect(() => {
    // Apply filters
    let filtered = videos;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(vid => vid.videoType === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(vid => 
        vid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vid.issueId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVideos(filtered);
  }, [selectedType, searchTerm, videos]);

  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  const handleDelete = (index: number) => {
    if (confirm('Remove this video from the gallery? (The video will still exist in Firebase)')) {
      const updatedVideos = videos.filter((_, i) => i !== index);
      setVideos(updatedVideos);
      localStorage.setItem('magazineEditorVideos', JSON.stringify(updatedVideos));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Video Gallery</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 flex gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
              >
                <option value="all">All Types</option>
                <option value="content">Content</option>
                <option value="hero">Hero</option>
                <option value="background">Background</option>
              </select>

              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
              />

              <div className="text-sm text-gray-500 flex items-center">
                {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedType !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Upload some videos to see them here'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredVideos.map((video, index) => (
                  <div
                    key={index}
                    className="group relative bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    {/* Video Thumbnail */}
                    <div className="aspect-video bg-gray-200 relative">
                      <video 
                        className="w-full h-full object-cover"
                        src={video.url}
                        muted
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <svg className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{video.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {video.issueId} • {formatDate(video.uploadedAt)}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(video.url);
                          }}
                          className="flex-1 px-2 py-1 bg-glamlink-teal text-white text-xs rounded hover:bg-glamlink-teal-dark"
                        >
                          Select
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="absolute inset-0 bg-black bg-opacity-75" />
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{selectedVideo.name}</h3>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <video 
                  src={selectedVideo.url}
                  controls
                  autoPlay
                  className="w-full rounded"
                  style={{ maxHeight: '500px' }}
                />
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      handleSelect(selectedVideo.url);
                      setSelectedVideo(null);
                    }}
                    className="flex-1 px-4 py-2 bg-glamlink-teal text-white rounded hover:bg-glamlink-teal-dark"
                  >
                    Use This Video
                  </button>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}