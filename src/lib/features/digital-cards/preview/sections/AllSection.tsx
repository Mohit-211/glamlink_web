import React from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

import StyledSectionWrapper from '../components/StyledSectionWrapper';
import EmptySectionState from '../components/EmptySectionState';

import {
  BusinessHours,
  MemoizedMapSection,
} from '@/lib/features/digital-cards/components/sections/contact';

interface AllSectionProps {
  professional: Partial<Professional>;
  sectionId: string;
}

export default function AllSection({
  professional,
  sectionId,
}: AllSectionProps) {
  /* =========================================================
     DATA CHECKS
  ========================================================= */

  const hasBio = !!professional?.bio;

  const hasSignatureWork =
    !!professional?.signatureWork &&
    professional.signatureWork.length > 0;

  const hasLocation =
    !!professional?.location &&
    (professional.location.address ||
      professional.location.city ||
      professional.location.latitude);

  const hasBusinessHours =
    !!professional?.businessHours &&
    professional.businessHours.length > 0;

  const hasSpecialties =
    !!professional?.specialties &&
    professional.specialties.length > 0;

  const hasPromotions =
    !!professional?.promotions &&
    professional.promotions.length > 0;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* ================= BIO ================= */}
      {hasBio && (
        <StyledSectionWrapper
          key={`${sectionId}-bio`}
          title="About"
          titleAlignment="center-with-lines"
        >
          <p className="text-gray-700 leading-relaxed">
            {professional.bio}
          </p>
        </StyledSectionWrapper>
      )}

      {/* ================= SIGNATURE WORK ================= */}
      <StyledSectionWrapper
        key={`${sectionId}-signature`}
        title="Signature Work"
        titleAlignment="center-with-lines"
      >
        {hasSignatureWork ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {professional.signatureWork?.map((item, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-sm bg-white"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title || 'Signature work'}
                    className="w-full h-48 object-cover"
                  />
                )}
                {item.title && (
                  <div className="p-4 font-medium">
                    {item.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptySectionState
            message="Add your signature work"
            icon="image"
          />
        )}
      </StyledSectionWrapper>

      {/* ================= MAP + HOURS ================= */}
      {(hasLocation || hasBusinessHours) && (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm">
          {/* MAP */}
          {hasLocation && (
            <MemoizedMapSection
              professional={professional as Professional}
            />
          )}

          {/* HOURS */}
          {hasBusinessHours && (
            <div className="mt-6">
              <BusinessHours
                professional={professional as Professional}
                section={{
                  id: 'business-hours-inline',
                  sectionType: 'business-hours',
                  label: 'Business Hours',
                  visible: true,
                  position: {
                    x: { value: 0, unit: '%' },
                    y: { value: 0, unit: '%' },
                    width: { value: 100, unit: '%' },
                    height: { value: 100, unit: '%' },
                    visible: true,
                  },
                  props: {
                    showTitle: true,
                    showList: true,
                    compactMode: false,
                    hideTitle: false,
                  },
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ================= SPECIALTIES ================= */}
      <StyledSectionWrapper
        key={`${sectionId}-specialties`}
        title="Specialties"
        titleAlignment="center-with-lines"
      >
        {hasSpecialties ? (
          <div className="flex flex-wrap gap-2">
            {professional.specialties?.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-gray-100 text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <EmptySectionState
            message="Add your specialties"
            icon="star"
          />
        )}
      </StyledSectionWrapper>

      {/* ================= IMPORTANT INFO ================= */}
      <StyledSectionWrapper
        key={`${sectionId}-important`}
        title="Important Information"
        titleAlignment="center-with-lines"
      >
        {professional.importantInfo ? (
          <div className="text-gray-700 whitespace-pre-line">
            {professional.importantInfo}
          </div>
        ) : (
          <EmptySectionState
            message="Add important information"
            icon="info"
          />
        )}
      </StyledSectionWrapper>

      {/* ================= PROMOTIONS ================= */}
      <StyledSectionWrapper
        key={`${sectionId}-promotions`}
        title="Promotions"
        titleAlignment="center-with-lines"
      >
        {hasPromotions ? (
          <div className="space-y-4">
            {professional.promotions?.map((promo, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white shadow-sm border"
              >
                <div className="font-semibold">
                  {promo.title}
                </div>
                {promo.description && (
                  <div className="text-gray-600 mt-1">
                    {promo.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptySectionState
            message="Add your promotions"
            icon="tag"
          />
        )}
      </StyledSectionWrapper>

      {/* ================= STANDALONE BUSINESS HOURS ================= */}
      <StyledSectionWrapper
        key={`${sectionId}-business-hours`}
        title="Business Hours"
        titleAlignment="center-with-lines"
      >
        {hasBusinessHours ? (
          <BusinessHours
            professional={professional as Professional}
            section={{
              id: 'business-hours',
              sectionType: 'business-hours',
              label: 'Business Hours',
              visible: true,
              position: {
                x: { value: 0, unit: '%' },
                y: { value: 0, unit: '%' },
                width: { value: 100, unit: '%' },
                height: { value: 100, unit: '%' },
                visible: true,
              },
              props: {
                showTitle: true,
                showList: true,
                compactMode: false,
                hideTitle: true,
              },
            }}
          />
        ) : (
          <EmptySectionState
            message="Add your business hours"
            icon="list"
          />
        )}
      </StyledSectionWrapper>
    </>
  );
}