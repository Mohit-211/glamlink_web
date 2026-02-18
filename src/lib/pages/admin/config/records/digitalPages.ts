/**
 * Sample Digital Pages Data
 *
 * Example data for batch uploading digital magazine pages.
 * Note: issueId is a placeholder - it will be replaced with the actual issue ID when uploading.
 */

export const sampleDigitalPagesData = [
  {
    pageNumber: 1,
    pageType: "full-page-image",
    title: "Cover Page",
    pageData: {
      id: "cover-1",
      type: "full-page-image",
      title: "Cover Page",
      image: "/images/magazine/sample-cover.jpg",
      backgroundColor: "#000000"
    },
    pdfSettings: {
      ratio: "a4-portrait",
      backgroundColor: "#000000",
      margin: 0
    },
    hasCanvas: false
  },
  {
    pageNumber: 2,
    pageType: "article-start-hero",
    title: "Feature Article",
    pageData: {
      id: "article-1",
      type: "article-start-hero",
      title: "The Art of Beauty",
      subtitle: "Exploring modern aesthetics",
      image: "/images/magazine/sample-hero.jpg",
      articleContent: "<p>Welcome to our feature article exploring the latest trends in the beauty industry.</p><p>In this edition, we dive deep into what makes modern aesthetics so captivating.</p>",
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      useDropCap: true
    },
    pdfSettings: {
      ratio: "a4-portrait",
      backgroundColor: "#ffffff",
      margin: 0
    },
    hasCanvas: false
  },
  {
    pageNumber: 3,
    pageType: "image-with-caption",
    title: "Gallery Page",
    pageData: {
      id: "gallery-1",
      type: "image-with-caption",
      title: "Behind the Scenes",
      image: "/images/magazine/sample-gallery.jpg",
      caption: "A glimpse into our latest photoshoot",
      captionPosition: "bottom",
      backgroundColor: "#f5f5f5"
    },
    pdfSettings: {
      ratio: "a4-portrait",
      backgroundColor: "#f5f5f5",
      margin: 0
    },
    hasCanvas: false
  },
  {
    pageNumber: 4,
    pageType: "two-column-with-quote",
    title: "Interview Page",
    pageData: {
      id: "interview-1",
      type: "two-column-with-quote",
      title: "Interview with the Founder",
      leftColumnContent: "<p>We sat down with the founder to discuss their vision for the future of beauty technology.</p><p>Their insights reveal a fascinating perspective on innovation and creativity.</p>",
      rightColumnContent: "<p>The conversation explored topics ranging from sustainability to personalization in the industry.</p><p>Key takeaways include the importance of authenticity and customer connection.</p>",
      quote: "Beauty is not just about appearance—it's about confidence and self-expression.",
      quoteAttribution: "Founder & CEO",
      backgroundColor: "#ffffff"
    },
    pdfSettings: {
      ratio: "a4-portrait",
      backgroundColor: "#ffffff",
      margin: 0
    },
    hasCanvas: false
  }
];
