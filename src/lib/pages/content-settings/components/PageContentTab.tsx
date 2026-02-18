'use client';

import { PageContentTabProps } from '../types';
import { TextField, TextAreaField, ButtonArrayField, FeatureArrayField, ServiceArrayField, CollapsibleSection } from '@/lib/components/content-editor/FieldEditors';
import { ImageUploadField } from '@/lib/components/content-editor/ImageUploadField';

export default function PageContentTab({
  selectedPage,
  pageContent,
  isLoadingContent,
  isSavingContent,
  onPageChange,
  onContentUpdate,
  onSave,
}: PageContentTabProps) {
  return (
    <>
      {/* Content Editor Tab */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Page Content</h2>
            <p className="text-gray-600 mt-1">Select a page to edit its content</p>
          </div>
          <select 
            value={selectedPage} 
            onChange={(e) => onPageChange(e.target.value as any)} 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-glamlink-teal"
          >
            <option value="home">Home Page</option>
            <option value="forClients">For Clients Page</option>
          </select>
        </div>

        {isLoadingContent ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glamlink-teal mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading content...</p>
          </div>
        ) : pageContent ? (
          <div className="space-y-6">
            {selectedPage === "home" ? (
              <>
                {/* Hero Section */}
                <CollapsibleSection title="Hero Section" defaultOpen={true}>
                  <TextField 
                    label="Title" 
                    value={pageContent.hero?.title || ""} 
                    onChange={(value) => onContentUpdate(["hero", "title"], value)} 
                  />
                  <TextAreaField 
                    label="Subtitle" 
                    value={pageContent.hero?.subtitle || ""} 
                    onChange={(value) => onContentUpdate(["hero", "subtitle"], value)} 
                    rows={3} 
                  />
                  <ButtonArrayField 
                    buttons={pageContent.hero?.buttons || []} 
                    onChange={(buttons) => onContentUpdate(["hero", "buttons"], buttons)} 
                  />
                </CollapsibleSection>

                {/* Why Glamlink Section */}
                <CollapsibleSection title="Why Glamlink Section">
                  <TextField 
                    label="Title" 
                    value={pageContent.whyGlamLink?.title || ""} 
                    onChange={(value) => onContentUpdate(["whyGlamLink", "title"], value)} 
                  />
                  <TextAreaField 
                    label="Subtitle" 
                    value={pageContent.whyGlamLink?.subtitle || ""} 
                    onChange={(value) => onContentUpdate(["whyGlamLink", "subtitle"], value)} 
                    rows={2} 
                  />
                  <FeatureArrayField 
                    features={pageContent.whyGlamLink?.features || []} 
                    onChange={(features) => onContentUpdate(["whyGlamLink", "features"], features)} 
                  />
                </CollapsibleSection>

                {/* Book Trusted Pros Section */}
                <CollapsibleSection title="Book Trusted Pros Section">
                  <ServiceArrayField 
                    services={pageContent.bookTrustedPros?.services || []} 
                    onChange={(services) => onContentUpdate(["bookTrustedPros", "services"], services)} 
                  />
                </CollapsibleSection>

                {/* Founder Badge Section */}
                <CollapsibleSection title="Founder Badge Section">
                  <TextField 
                    label="Title" 
                    value={pageContent.founderBadge?.title || ""} 
                    onChange={(value) => onContentUpdate(["founderBadge", "title"], value)} 
                  />
                  <TextAreaField 
                    label="Description" 
                    value={pageContent.founderBadge?.description || ""} 
                    onChange={(value) => onContentUpdate(["founderBadge", "description"], value)} 
                    rows={2} 
                  />
                  <TextField 
                    label="Subtext" 
                    value={pageContent.founderBadge?.subtext || ""} 
                    onChange={(value) => onContentUpdate(["founderBadge", "subtext"], value)} 
                  />
                  <ImageUploadField 
                    label="Badge Image" 
                    value={pageContent.founderBadge?.image || ""} 
                    onChange={(value) => onContentUpdate(["founderBadge", "image"], value)} 
                    placeholder="/images/gold_badge.png" 
                  />
                </CollapsibleSection>

                {/* Testimonials Section */}
                <CollapsibleSection title="Testimonials Section">
                  <TextField 
                    label="Section Title" 
                    value={pageContent.testimonials?.title || ""} 
                    onChange={(value) => onContentUpdate(["testimonials", "title"], value)} 
                  />
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Testimonials</label>
                      <button
                        type="button"
                        onClick={() => {
                          const testimonials = pageContent.testimonials?.items || [];
                          onContentUpdate(["testimonials", "items"], [...testimonials, { name: "", role: "", text: "", image: "" }]);
                        }}
                        className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark"
                      >
                        + Add Testimonial
                      </button>
                    </div>
                    {(pageContent.testimonials?.items || []).map((testimonial: any, index: number) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Testimonial {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const testimonials = [...(pageContent.testimonials?.items || [])];
                              testimonials.splice(index, 1);
                              onContentUpdate(["testimonials", "items"], testimonials);
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <TextField
                          label="Name"
                          value={testimonial.name}
                          onChange={(value) => {
                            const testimonials = [...(pageContent.testimonials?.items || [])];
                            testimonials[index] = { ...testimonials[index], name: value };
                            onContentUpdate(["testimonials", "items"], testimonials);
                          }}
                        />
                        <TextField
                          label="Role"
                          value={testimonial.role}
                          onChange={(value) => {
                            const testimonials = [...(pageContent.testimonials?.items || [])];
                            testimonials[index] = { ...testimonials[index], role: value };
                            onContentUpdate(["testimonials", "items"], testimonials);
                          }}
                        />
                        <TextAreaField
                          label="Testimonial Text"
                          value={testimonial.text}
                          onChange={(value) => {
                            const testimonials = [...(pageContent.testimonials?.items || [])];
                            testimonials[index] = { ...testimonials[index], text: value };
                            onContentUpdate(["testimonials", "items"], testimonials);
                          }}
                          rows={3}
                        />
                        <ImageUploadField
                          label="Image"
                          value={testimonial.image || ""}
                          onChange={(value) => {
                            const testimonials = [...(pageContent.testimonials?.items || [])];
                            testimonials[index] = { ...testimonials[index], image: value };
                            onContentUpdate(["testimonials", "items"], testimonials);
                          }}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                {/* Final CTA Section */}
                <CollapsibleSection title="Final CTA Section">
                  <TextField 
                    label="Main Title" 
                    value={pageContent.finalCTA?.title || ""} 
                    onChange={(value) => onContentUpdate(["finalCTA", "title"], value)} 
                  />
                  <TextAreaField 
                    label="Subtitle" 
                    value={pageContent.finalCTA?.subtitle || ""} 
                    onChange={(value) => onContentUpdate(["finalCTA", "subtitle"], value)} 
                    rows={2} 
                  />
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">User Section</h4>
                      <TextField 
                        label="Title" 
                        value={pageContent.finalCTA?.userSection?.title || ""} 
                        onChange={(value) => onContentUpdate(["finalCTA", "userSection", "title"], value)} 
                      />
                      <TextAreaField 
                        label="Description" 
                        value={pageContent.finalCTA?.userSection?.description || ""} 
                        onChange={(value) => onContentUpdate(["finalCTA", "userSection", "description"], value)} 
                        rows={2} 
                      />
                      <TextField 
                        label="Button Text" 
                        value={pageContent.finalCTA?.userSection?.button?.text || ""} 
                        onChange={(value) => onContentUpdate(["finalCTA", "userSection", "button", "text"], value)} 
                      />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Pro Section</h4>
                      <TextField 
                        label="Title" 
                        value={pageContent.finalCTA?.proSection?.title || ""} 
                        onChange={(value) => onContentUpdate(["finalCTA", "proSection", "title"], value)} 
                      />
                      <TextAreaField 
                        label="Description" 
                        value={pageContent.finalCTA?.proSection?.description || ""} 
                        onChange={(value) => onContentUpdate(["finalCTA", "proSection", "description"], value)} 
                        rows={2} 
                      />
                      <TextField 
                        label="Button Text" 
                        value={pageContent.finalCTA?.proSection?.button?.text || ""} 
                        onChange={(value) => onContentUpdate(["finalCTA", "proSection", "button", "text"], value)} 
                      />
                    </div>
                  </div>
                </CollapsibleSection>
              </>
            ) : selectedPage === "forClients" ? (
              <>
                {/* For Clients Page Sections */}
                <CollapsibleSection title="Hero Section" defaultOpen={true}>
                  <TextField 
                    label="Title" 
                    value={pageContent.hero?.title || ""} 
                    onChange={(value) => onContentUpdate(["hero", "title"], value)} 
                  />
                  <TextAreaField 
                    label="Subtitle" 
                    value={pageContent.hero?.subtitle || ""} 
                    onChange={(value) => onContentUpdate(["hero", "subtitle"], value)} 
                    rows={3} 
                  />
                  <ButtonArrayField 
                    buttons={pageContent.hero?.buttons || []} 
                    onChange={(buttons) => onContentUpdate(["hero", "buttons"], buttons)} 
                  />
                </CollapsibleSection>

                <CollapsibleSection title="Features Section">
                  <TextField 
                    label="Section Title" 
                    value={pageContent.features?.title || ""} 
                    onChange={(value) => onContentUpdate(["features", "title"], value)} 
                  />
                  <FeatureArrayField 
                    features={pageContent.features?.items || []} 
                    onChange={(features) => onContentUpdate(["features", "items"], features)} 
                  />
                </CollapsibleSection>
              </>
            ) : null}

            {/* Save Button */}
            <div className="flex justify-end sticky bottom-0 bg-white pt-4">
              <button 
                onClick={onSave} 
                disabled={isSavingContent} 
                className="px-6 py-2 bg-glamlink-teal text-white font-semibold rounded-lg hover:bg-glamlink-teal-dark transition-colors disabled:opacity-50"
              >
                {isSavingContent ? "Saving..." : "Save Content"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No content loaded</p>
        )}
      </div>
    </>
  );
}