"use client";

import { WhatsNewGlamlinkContent } from "../../../types";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset } from "../../../config/universalStyles";
import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";
import {
  SectionHeader,
  BackgroundWrapper
} from "../shared";
import {
  FeatureList,
  SneakPeeks,
  TipsList
} from "../whats-new-glamlink";
import MagazineLink from "../../shared/MagazineLink";

interface WhatsNewGlamlinkProps {
  content: WhatsNewGlamlinkContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { 
    main?: string; 
    features?: string; 
    sneakPeeks?: string; 
    tips?: string; 
    usageBoosts?: string 
  };
}

export default function WhatsNewGlamlink({ 
  content, 
  title, 
  subtitle, 
  backgroundColor 
}: WhatsNewGlamlinkProps) {
  // Get merged style settings
  const styles = mergeUniversalStyleSettings(
    content, 
    getUniversalLayoutPreset(content.headerLayout)
  );

  return (
    <BackgroundWrapper backgroundColor={backgroundColor} className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <SectionHeader 
            title={title} 
            subtitle={subtitle} 
            subtitle2={content.subtitle2}
            titleStyles={{
              fontSize: styles.titleFontSize,
              fontFamily: styles.titleFontFamily,
              fontWeight: styles.titleFontWeight,
              alignment: styles.titleAlignment,
              color: styles.titleColor
            }}
            subtitleStyles={{
              fontSize: styles.subtitleFontSize,
              fontFamily: styles.subtitleFontFamily,
              fontWeight: styles.subtitleFontWeight,
              alignment: styles.subtitleAlignment,
              color: styles.subtitleColor
            }}
          />
        )}

        {/* Feature Releases */}
        {content.features && content.features.length > 0 && (
          <div className="mb-16">
            <h3 className={`
              ${styles.subtitleFontSize || "text-2xl"} 
              ${styles.subtitleFontFamily || "font-sans"}
              font-bold mb-8 flex items-center
              ${styles.subtitleColor || "text-gray-900"}
            `}>
              <span className="text-3xl mr-3">🚀</span>
              New Features
            </h3>
            <BackgroundWrapper backgroundColor={backgroundColor} section="features">
              <FeatureList features={content.features} />
            </BackgroundWrapper>
          </div>
        )}

        {/* Sneak Peeks */}
        {content.sneakPeeks && content.sneakPeeks.length > 0 && (
          <div className="mb-16">
            <h3 className={`
              ${styles.subtitleFontSize || "text-2xl"} 
              ${styles.subtitleFontFamily || "font-sans"}
              font-bold mb-8 flex items-center
              ${styles.subtitleColor || "text-gray-900"}
            `}>
              <span className="text-3xl mr-3">👀</span>
              Coming Soon
            </h3>
            <BackgroundWrapper backgroundColor={backgroundColor} section="sneakPeeks">
              <SneakPeeks 
                peeks={content.sneakPeeks.map(peek => ({
                  title: peek.title,
                  teaser: peek.teaser,
                  releaseDate: peek.releaseDate
                }))}
                title=""
              />
            </BackgroundWrapper>
          </div>
        )}

        {/* Platform Tips */}
        {content.tips && content.tips.length > 0 && (
          <div className="mb-16">
            <h3 className={`
              ${styles.subtitleFontSize || "text-2xl"} 
              ${styles.subtitleFontFamily || "font-sans"}
              font-bold mb-8 flex items-center
              ${styles.subtitleColor || "text-gray-900"}
            `}>
              <span className="text-3xl mr-3">💡</span>
              Pro Tips
            </h3>
            <BackgroundWrapper backgroundColor={backgroundColor} section="tips">
              <div className="grid md:grid-cols-3 gap-6">
                {content.tips.map((tip, index) => (
                  <div key={index} className="rounded-lg p-6 bg-gray-50">
                    <div className="text-2xl mb-3">💫</div>
                    <h4 className="font-bold mb-2 text-gray-900">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                    {tip.link && (
                      <MagazineLink 
                        field={tip.link} 
                        className="inline-block mt-3 text-glamlink-teal hover:text-glamlink-purple transition-colors text-sm font-medium"
                      >
                        Learn more →
                      </MagazineLink>
                    )}
                  </div>
                ))}
              </div>
            </BackgroundWrapper>
          </div>
        )}

        {/* Usage Boosts */}
        {content.usageBoosts && content.usageBoosts.length > 0 && (
          <div>
            <h3 className={`
              ${styles.subtitleFontSize || "text-2xl"} 
              ${styles.subtitleFontFamily || "font-sans"}
              font-bold mb-8 flex items-center
              ${styles.subtitleColor || "text-gray-900"}
            `}>
              <span className="text-3xl mr-3">📈</span>
              Boost Your Success
            </h3>
            <BackgroundWrapper 
              backgroundColor={backgroundColor} 
              section="usageBoosts"
              className="rounded-xl p-8 shadow-sm"
            >
              <div className="space-y-4">
                {content.usageBoosts.map((boost, index) => (
                  <div key={index} className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-glamlink-gold/20 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-glamlink-gold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{boost.title}</h4>
                      <p className="text-sm text-gray-600">{boost.impact}</p>
                    </div>
                    {boost.metric && (
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-glamlink-teal">{boost.metric}</div>
                        <div className="text-xs text-gray-500">increase</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </BackgroundWrapper>
          </div>
        )}

        {/* CTA */}
        {content.ctaButtonText && content.ctaButtonLink && (
          <div className="mt-12 text-center">
            <MagazineLink 
              field={content.ctaButtonLink} 
              className="inline-block px-8 py-3 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-purple transition-colors font-medium"
            >
              {content.ctaButtonText}
            </MagazineLink>
          </div>
        )}
      </div>
    </BackgroundWrapper>
  );
}