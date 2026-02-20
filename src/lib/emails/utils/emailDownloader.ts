/**
 * Downloads HTML content as a file
 * @param html - The HTML content to download
 * @param filename - The name of the file to download
 */
export function downloadHtmlFile(html: string, filename: string = 'email-template.html'): void {
  // Create a Blob from the HTML string
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
}

/**
 * Copies HTML content to clipboard
 * @param html - The HTML content to copy
 * @returns Promise that resolves when copied
 */
export async function copyHtmlToClipboard(html: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(html);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = html;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

/**
 * Generates a filename based on template type and timestamp
 * @param templateType - The type of email template
 * @param templateName - The specific template name
 * @returns Formatted filename
 */
export function generateFilename(templateType: string, templateName: string): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const sanitizedType = templateType.replace(/[^a-z0-9]/gi, '-');
  const sanitizedName = templateName.replace(/[^a-z0-9]/gi, '-');
  
  return `${sanitizedType}-${sanitizedName}-${timestamp}.html`;
}

/**
 * Opens HTML in a new window for preview
 * @param html - The HTML content to preview
 */
export function previewInNewWindow(html: string): void {
  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(html);
    previewWindow.document.close();
  }
}