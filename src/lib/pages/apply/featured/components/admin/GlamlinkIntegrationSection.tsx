"use client";

import { GetFeaturedSubmission } from "../../types";
import {
  TextField,
  TagField,
  BooleanField,
  ConditionalField,
  Field
} from "./FieldRenderers";

interface GlamlinkIntegrationSectionProps {
  submission: GetFeaturedSubmission;
}

export default function GlamlinkIntegrationSection({ submission }: GlamlinkIntegrationSectionProps) {
  // Count the number of filled glamlink integration fields
  const glamlinkFields = [
    submission.excitementFeatures?.length || 0,
    submission.painPoints?.length || 0,
    submission.promotionOffer,
    submission.promotionDetails,
    submission.bookingPreference,
    submission.bookingLink,
    submission.ecommerceInterest,
    submission.contentDays,
    submission.giveaway,
    submission.specialOffers
  ];

  const filledFields = glamlinkFields.filter(field => {
    if (Array.isArray(field)) return field.length > 0;
    return field !== undefined && field !== null && field !== '';
  }).length;

  return (
    <div className="space-y-6">
      {/* Excitement Features (shown as tags) */}
      {submission.excitementFeatures && submission.excitementFeatures.length > 0 && (
        <TagField
          values={submission.excitementFeatures}
          label="Most Excited About"
          color="teal"
        />
      )}

      {/* Pain Points (shown as tags) */}
      {submission.painPoints && submission.painPoints.length > 0 && (
        <TagField
          values={submission.painPoints}
          label="Pain Points to Address"
          color="red"
        />
      )}

      {/* Promotion Offer */}
      <BooleanField
        value={submission.promotionOffer}
        label="Promotion Offer"
        trueText="Offering promotion"
        falseText="No promotion"
      />

      <ConditionalField
        condition={submission.promotionOffer}
        label="Promotion Details"
      >
        <TextField value={submission.promotionDetails} label="Promotion Details" />
      </ConditionalField>

      {/* Booking Preference */}
      {submission.bookingPreference && (
        <Field label="Booking Preference">
          <p className="text-gray-700">
            <span className="font-medium">Method:</span> {submission.bookingPreference === 'in-app' ? 'In-app booking' : 'External booking'}
          </p>
          {submission.bookingLink && (
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Booking Link:</span>{' '}
              <a
                href={submission.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-glamlink-teal hover:underline ml-1"
              >
                {submission.bookingLink}
              </a>
            </p>
          )}
        </Field>
      )}

      {/* E-commerce Interest */}
      {submission.ecommerceInterest && (
        <Field label="E-commerce Interest">
          <p className="text-gray-700">
            {submission.ecommerceInterest === 'yes'
              ? 'Interested in selling products through Glamlink'
              : 'Interested in e-commerce, but later'}
          </p>
        </Field>
      )}

      <TextField value={submission.contentDays} label="Available for Content" />
      <TextField value={submission.giveaway} label="Giveaway Contribution" />
      <TextField value={submission.specialOffers} label="Special Offers for Glamlink Users" />
    </div>
  );
}