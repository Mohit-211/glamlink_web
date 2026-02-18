/**
 * Video Block Configuration
 *
 * Configuration for the VideoBlock component used in custom magazine sections.
 * Provides video playback with thumbnail selection and width controls.
 */

export interface VideoBlockConfig {
  type: 'VideoBlock';
  displayName: string;
  description: string;
  category: 'shared';
  complexity: 'medium';
  fields: {
    videoUrl: {
      aiEnabled: false;
      type: 'url';
      displayName: string;
      description: string;
    };
    videoFile: {
      aiEnabled: false;
      type: 'video';
      displayName: string;
      description: string;
    };
    thumbnail: {
      aiEnabled: false;
      type: 'image';
      displayName: string;
      description: string;
    };
    thumbnailSource: {
      aiEnabled: false;
      type: 'select';
      displayName: string;
      description: string;
      options: Array<{ value: string; label: string }>;
    };
    thumbnailFrameTime: {
      aiEnabled: false;
      type: 'number';
      displayName: string;
      description: string;
    };
    containerWidth: {
      aiEnabled: false;
      type: 'select';
      displayName: string;
      description: string;
      options: Array<{ value: string; label: string }>;
    };
    maxWidth: {
      aiEnabled: false;
      type: 'number';
      displayName: string;
      description: string;
    };
    aspectRatio: {
      aiEnabled: false;
      type: 'select';
      displayName: string;
      description: string;
      options: Array<{ value: string; label: string }>;
    };
    showPlayButton: {
      aiEnabled: false;
      type: 'checkbox';
      displayName: string;
      description: string;
    };
    borderRadius: {
      aiEnabled: false;
      type: 'number';
      displayName: string;
      description: string;
    };
    title: {
      aiEnabled: true;
      type: 'text';
      displayName: string;
      description: string;
    };
    titleTypography: {
      aiEnabled: false;
      type: 'typography';
      displayName: string;
      description: string;
    };
    caption: {
      aiEnabled: true;
      type: 'text';
      displayName: string;
      description: string;
    };
    captionTypography: {
      aiEnabled: false;
      type: 'typography';
      displayName: string;
      description: string;
    };
    autoPlay: {
      aiEnabled: false;
      type: 'checkbox';
      displayName: string;
      description: string;
    };
    loop: {
      aiEnabled: false;
      type: 'checkbox';
      displayName: string;
      description: string;
    };
    muted: {
      aiEnabled: false;
      type: 'checkbox';
      displayName: string;
      description: string;
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const videoBlockConfig: VideoBlockConfig = {
  type: 'VideoBlock',
  displayName: 'Video Block',
  description: 'Video player with thumbnail selection, width controls, and optional title/caption',
  category: 'shared',
  complexity: 'medium',
  fields: {
    videoUrl: {
      aiEnabled: false,
      type: 'url',
      displayName: 'Video URL',
      description: 'YouTube or Vimeo video URL'
    },
    videoFile: {
      aiEnabled: false,
      type: 'video',
      displayName: 'Or Upload Video',
      description: 'Upload a video file directly'
    },
    thumbnail: {
      aiEnabled: false,
      type: 'image',
      displayName: 'Thumbnail Image',
      description: 'Custom thumbnail to display before video plays'
    },
    thumbnailSource: {
      aiEnabled: false,
      type: 'select',
      displayName: 'Thumbnail Source',
      description: 'Where to get the thumbnail from',
      options: [
        { value: 'video', label: 'Extract from Video' },
        { value: 'upload', label: 'Upload Custom Image' }
      ]
    },
    thumbnailFrameTime: {
      aiEnabled: false,
      type: 'number',
      displayName: 'Frame Time (seconds)',
      description: 'Time in seconds to extract thumbnail frame from video'
    },
    containerWidth: {
      aiEnabled: false,
      type: 'select',
      displayName: 'Container Width',
      description: 'Width of the video container',
      options: [
        { value: 'full', label: 'Full Width' },
        { value: 'lg', label: 'Large (900px)' },
        { value: 'md', label: 'Medium (600px)' },
        { value: 'sm', label: 'Small (400px)' },
        { value: 'auto', label: 'Auto' }
      ]
    },
    maxWidth: {
      aiEnabled: false,
      type: 'number',
      displayName: 'Max Width (px)',
      description: 'Custom maximum width in pixels (only used when Container Width is Auto)'
    },
    aspectRatio: {
      aiEnabled: false,
      type: 'select',
      displayName: 'Aspect Ratio',
      description: 'Video aspect ratio',
      options: [
        { value: '16:9', label: '16:9 (Widescreen)' },
        { value: '4:3', label: '4:3 (Standard)' },
        { value: '1:1', label: '1:1 (Square)' },
        { value: 'auto', label: 'Auto' }
      ]
    },
    showPlayButton: {
      aiEnabled: false,
      type: 'checkbox',
      displayName: 'Show Play Button',
      description: 'Display a play button overlay on the thumbnail'
    },
    borderRadius: {
      aiEnabled: false,
      type: 'number',
      displayName: 'Border Radius (px)',
      description: 'Corner rounding for the video container'
    },
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Title',
      description: 'Optional title displayed above the video'
    },
    titleTypography: {
      aiEnabled: false,
      type: 'typography',
      displayName: 'Title Typography',
      description: 'Typography settings for the title'
    },
    caption: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Caption',
      description: 'Optional caption displayed below the video'
    },
    captionTypography: {
      aiEnabled: false,
      type: 'typography',
      displayName: 'Caption Typography',
      description: 'Typography settings for the caption'
    },
    autoPlay: {
      aiEnabled: false,
      type: 'checkbox',
      displayName: 'Auto Play',
      description: 'Automatically play the video when visible'
    },
    loop: {
      aiEnabled: false,
      type: 'checkbox',
      displayName: 'Loop',
      description: 'Loop the video continuously'
    },
    muted: {
      aiEnabled: false,
      type: 'checkbox',
      displayName: 'Muted',
      description: 'Start video muted'
    }
  },
  aiPrompts: {
    system: 'You are editing video content for a magazine. Suggest engaging titles and captions that describe or introduce the video content.',
    examples: [
      'Create an engaging title for this video',
      'Write a brief caption describing the video',
      'Make the title more attention-grabbing'
    ]
  }
};

export default videoBlockConfig;
