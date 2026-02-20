import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { SectionBasedEmailData, SectionBasedEmailDataWithTheme, EmailTheme } from '../../types';
import { loadThemeSync } from '../../utils/themeManager';
import { getThemedStyles } from '../../utils/themeHelper';
import PreviewCTA from '../../sections/PreviewCTA';
import CarouselItems from '../../sections/CarouselItems';
import ExploreItems from '../../sections/ExploreItems';
import ViewProfiles from '../../sections/ViewProfiles';
import SignUpSteps from '../../sections/SignUpSteps';
import CTACardWithBackground from '../../sections/CTACardWithBackground';
import AppDownloadCTA from '../../sections/AppDownloadCTA';
import { 
  QuoteSection, 
  AuthorSignature, 
  ProductRecommendations, 
  TipsList, 
  SocialCTA,
  ProductShowcase,
  RewardProgress,
  MonthlyChallenge,
  Leaderboard,
  SpecialOffers,
  FeaturedStories,
  StoryGrid,
  EventsList,
  PhotoGallery,
  CTAWithStats,
  CircleImageGrid,
  DarkCTAModal,
  InteractiveContentCards
} from '../../sections/stubs';

interface SectionBuiltLayoutProps {
  data: SectionBasedEmailData | SectionBasedEmailDataWithTheme;
}

const SectionBuiltLayout: React.FC<SectionBuiltLayoutProps> = ({ data }) => {
  // Add safety checks for data
  if (!data) {
    return <div>No data provided</div>;
  }

  const { customer, brand, tracking, socialMedia, sections = [] } = data;
  
  // Load theme if specified
  const themeName = (data as SectionBasedEmailDataWithTheme).theme;
  const theme: EmailTheme = loadThemeSync(themeName);
  const styles = getThemedStyles(theme);

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || ''
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Render a section based on its type
  const renderSection = (section: any, index: number) => {
    console.log('Rendering section:', { type: section.type, index, section });
    
    switch (section.type) {
      case 'preview-cta':
        console.log('Rendering PreviewCTA with data:', {
          hasSecondaryCards: !!section.secondaryCards,
          cardsCount: section.secondaryCards?.length
        });
        const previewComponent = <PreviewCTA section={section} tracking={tracking} theme={theme} />;
        const previewHtml = ReactDOMServer.renderToStaticMarkup(previewComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: previewHtml }} />;
      
      case 'carousel-items':
        console.log('Rendering CarouselItems with data:', {
          itemsCount: section.items?.length,
          headerTitle: section.headerTitle
        });
        const carouselComponent = <CarouselItems section={section} tracking={tracking} theme={theme} />;
        const carouselHtml = ReactDOMServer.renderToStaticMarkup(carouselComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: carouselHtml }} />;
      
      case 'explore-items':
        console.log('Rendering ExploreItems with data:', {
          categoriesCount: section.categories?.length,
          headerTitle: section.headerTitle
        });
        const exploreComponent = <ExploreItems section={section} tracking={tracking} theme={theme} />;
        const exploreHtml = ReactDOMServer.renderToStaticMarkup(exploreComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: exploreHtml }} />;
      
      case 'view-profiles':
        console.log('Rendering ViewProfiles with data:', {
          profilesCount: section.profiles?.length,
          headerTitle: section.headerTitle
        });
        const viewProfilesComponent = <ViewProfiles section={section} tracking={tracking} theme={theme} />;
        const viewProfilesHtml = ReactDOMServer.renderToStaticMarkup(viewProfilesComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: viewProfilesHtml }} />;
      
      case 'signup-steps':
        console.log('Rendering SignUpSteps with data:', {
          stepsCount: section.steps?.length,
          headerTitle: section.headerTitle
        });
        const signUpStepsComponent = <SignUpSteps section={section} tracking={tracking} theme={theme} />;
        const signUpStepsHtml = ReactDOMServer.renderToStaticMarkup(signUpStepsComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: signUpStepsHtml }} />;
      
      case 'cta-cards-background':
        console.log('Rendering CTACardWithBackground with data:', {
          cardsCount: section.cards?.length,
          headerTitle: section.headerTitle
        });
        const ctaCardsComponent = <CTACardWithBackground section={section} tracking={tracking} theme={theme} />;
        const ctaCardsHtml = ReactDOMServer.renderToStaticMarkup(ctaCardsComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: ctaCardsHtml }} />;
      
      case 'app-download-cta':
        console.log('Rendering AppDownloadCTA with data:', {
          showUserSection: section.showUserSection,
          showProSection: section.showProSection
        });
        const appDownloadComponent = <AppDownloadCTA section={section} tracking={tracking} theme={theme} />;
        const appDownloadHtml = ReactDOMServer.renderToStaticMarkup(appDownloadComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: appDownloadHtml }} />;
      
      case 'quote':
        const quoteComponent = <QuoteSection section={section} tracking={tracking} theme={theme} />;
        const quoteHtml = ReactDOMServer.renderToStaticMarkup(quoteComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: quoteHtml }} />;
      
      case 'author-signature':
        const authorComponent = <AuthorSignature section={section} tracking={tracking} theme={theme} />;
        const authorHtml = ReactDOMServer.renderToStaticMarkup(authorComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: authorHtml }} />;
      
      case 'product-recommendations':
        const productRecsComponent = <ProductRecommendations section={section} tracking={tracking} theme={theme} />;
        const productRecsHtml = ReactDOMServer.renderToStaticMarkup(productRecsComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: productRecsHtml }} />;
      
      case 'tips-list':
        const tipsComponent = <TipsList section={section} tracking={tracking} theme={theme} />;
        const tipsHtml = ReactDOMServer.renderToStaticMarkup(tipsComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: tipsHtml }} />;
      
      case 'social-cta':
        const socialComponent = <SocialCTA section={section} tracking={tracking} theme={theme} />;
        const socialHtml = ReactDOMServer.renderToStaticMarkup(socialComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: socialHtml }} />;
      
      case 'product-showcase':
        const showcaseComponent = <ProductShowcase section={section} tracking={tracking} theme={theme} />;
        const showcaseHtml = ReactDOMServer.renderToStaticMarkup(showcaseComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: showcaseHtml }} />;
      
      // Engagement Sections
      case 'reward-progress':
        const rewardProgressComponent = <RewardProgress section={section} tracking={tracking} theme={theme} />;
        const rewardProgressHtml = ReactDOMServer.renderToStaticMarkup(rewardProgressComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: rewardProgressHtml }} />;
      
      case 'monthly-challenge':
        const monthlyChallengeComponent = <MonthlyChallenge section={section} tracking={tracking} theme={theme} />;
        const monthlyChallengeHtml = ReactDOMServer.renderToStaticMarkup(monthlyChallengeComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: monthlyChallengeHtml }} />;
      
      case 'leaderboard':
        const leaderboardComponent = <Leaderboard section={section} tracking={tracking} theme={theme} />;
        const leaderboardHtml = ReactDOMServer.renderToStaticMarkup(leaderboardComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: leaderboardHtml }} />;
      
      case 'special-offers':
        const specialOffersComponent = <SpecialOffers section={section} tracking={tracking} theme={theme} />;
        const specialOffersHtml = ReactDOMServer.renderToStaticMarkup(specialOffersComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: specialOffersHtml }} />;
      
      // Content Sections
      case 'featured-stories':
        const featuredStoriesComponent = <FeaturedStories section={section} tracking={tracking} theme={theme} />;
        const featuredStoriesHtml = ReactDOMServer.renderToStaticMarkup(featuredStoriesComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: featuredStoriesHtml }} />;
      
      case 'story-grid':
        const storyGridComponent = <StoryGrid section={section} tracking={tracking} theme={theme} />;
        const storyGridHtml = ReactDOMServer.renderToStaticMarkup(storyGridComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: storyGridHtml }} />;
      
      case 'events-list':
        const eventsListComponent = <EventsList section={section} tracking={tracking} theme={theme} />;
        const eventsListHtml = ReactDOMServer.renderToStaticMarkup(eventsListComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: eventsListHtml }} />;
      
      case 'photo-gallery':
        const photoGalleryComponent = <PhotoGallery section={section} tracking={tracking} theme={theme} />;
        const photoGalleryHtml = ReactDOMServer.renderToStaticMarkup(photoGalleryComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: photoGalleryHtml }} />;
      
      case 'cta-with-stats':
        const ctaWithStatsComponent = <CTAWithStats section={section} tracking={tracking} theme={theme} />;
        const ctaWithStatsHtml = ReactDOMServer.renderToStaticMarkup(ctaWithStatsComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: ctaWithStatsHtml }} />;
      
      // Modern Sections
      case 'circle-image-grid':
        const circleImageGridComponent = <CircleImageGrid section={section} tracking={tracking} theme={theme} />;
        const circleImageGridHtml = ReactDOMServer.renderToStaticMarkup(circleImageGridComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: circleImageGridHtml }} />;
      
      case 'dark-cta-modal':
        const darkCTAModalComponent = <DarkCTAModal section={section} tracking={tracking} theme={theme} />;
        const darkCTAModalHtml = ReactDOMServer.renderToStaticMarkup(darkCTAModalComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: darkCTAModalHtml }} />;
      
      case 'interactive-content-cards':
        const interactiveContentCardsComponent = <InteractiveContentCards section={section} tracking={tracking} theme={theme} />;
        const interactiveContentCardsHtml = ReactDOMServer.renderToStaticMarkup(interactiveContentCardsComponent);
        return <div key={index} dangerouslySetInnerHTML={{ __html: interactiveContentCardsHtml }} />;
      
      case 'header':
        return (
          <div key={index} dangerouslySetInnerHTML={{ __html: `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${theme.colors.primary.main};">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  ${section.logo ? `
                    <img src="${section.logo}" alt="${brand.name}" width="150" style="display: block; margin: 0 auto 15px;" />
                  ` : `
                    <h1 style="margin: 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xxxl}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.primary.text};">
                      ${section.title || brand.name}
                    </h1>
                  `}
                  ${section.subtitle ? `
                    <p style="margin: 10px 0 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; color: ${theme.colors.primary.light};">
                      ${section.subtitle}
                    </p>
                  ` : ''}
                </td>
              </tr>
            </table>
          ` }} />
        );
      
      case 'text':
        return (
          <div key={index} dangerouslySetInnerHTML={{ __html: `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="padding: 30px;" align="${section.alignment || 'left'}">
                  <div style="font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; line-height: ${theme.typography.lineHeight.normal}; color: ${theme.colors.text.secondary};">
                    ${section.content}
                  </div>
                </td>
              </tr>
            </table>
          ` }} />
        );
      
      case 'button':
        return (
          <div key={index} dangerouslySetInnerHTML={{ __html: `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td align="${section.alignment || 'center'}" style="padding: 20px 30px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="border-radius: ${theme.borderRadius.sm}; background-color: ${section.style === 'secondary' ? theme.colors.button.secondary.background : theme.colors.button.primary.background}; border: ${section.style === 'secondary' ? `2px solid ${theme.colors.button.secondary.border}` : 'none'};">
                        <a href="${addTrackingParams(section.url, `button_${index}`)}" 
                           style="display: inline-block; padding: 15px 30px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${section.style === 'secondary' ? theme.colors.button.secondary.text : theme.colors.button.primary.text}; text-decoration: none; border-radius: ${theme.borderRadius.sm};">
                          ${section.text}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          ` }} />
        );
      
      case 'footer':
        return (
          <div key={index} dangerouslySetInnerHTML={{ __html: `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${theme.colors.background.alternateSection};">
              <tr>
                <td style="padding: 30px;">
                  <!-- Social Media Links -->
                  ${socialMedia ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom: 20px;">
                      <tr>
                        ${socialMedia.facebook ? `
                          <td style="padding: 0 10px;">
                            <a href="${addTrackingParams(socialMedia.facebook, 'social_facebook')}" target="_blank">
                              <img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" alt="Facebook" width="32" height="32" style="display: block;" />
                            </a>
                          </td>
                        ` : ''}
                        ${socialMedia.instagram ? `
                          <td style="padding: 0 10px;">
                            <a href="${addTrackingParams(socialMedia.instagram, 'social_instagram')}" target="_blank">
                              <img src="https://cdn-icons-png.flaticon.com/32/2111/2111463.png" alt="Instagram" width="32" height="32" style="display: block;" />
                            </a>
                          </td>
                        ` : ''}
                        ${socialMedia.twitter ? `
                          <td style="padding: 0 10px;">
                            <a href="${addTrackingParams(socialMedia.twitter, 'social_twitter')}" target="_blank">
                              <img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" width="32" height="32" style="display: block;" />
                            </a>
                          </td>
                        ` : ''}
                        ${socialMedia.tiktok ? `
                          <td style="padding: 0 10px;">
                            <a href="${addTrackingParams(socialMedia.tiktok, 'social_tiktok')}" target="_blank">
                              <img src="https://cdn-icons-png.flaticon.com/32/5968/5968812.png" alt="TikTok" width="32" height="32" style="display: block;" />
                            </a>
                          </td>
                        ` : ''}
                      </tr>
                    </table>
                  ` : ''}
                  
                  <!-- Footer Text -->
                  <p style="margin: 0 0 10px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; line-height: 18px; color: ${theme.colors.text.tertiary}; text-align: center;">
                    ${section.copyrightText || `&copy; ${new Date().getFullYear()} ${brand.name}. All rights reserved.`}<br />
                    Questions? Contact us at <a href="mailto:${brand.supportEmail}" style="color: ${theme.colors.text.link};">${brand.supportEmail}</a>
                  </p>
                  
                  ${(section.unsubscribeUrl || section.preferencesUrl) ? `
                    <p style="margin: 10px 0 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; color: ${theme.colors.text.tertiary}; text-align: center;">
                      ${section.unsubscribeUrl ? `
                        <a href="${addTrackingParams(section.unsubscribeUrl, 'unsubscribe')}" style="color: ${theme.colors.text.tertiary}; text-decoration: underline;">Unsubscribe</a>
                      ` : ''}
                      ${section.unsubscribeUrl && section.preferencesUrl ? ' | ' : ''}
                      ${section.preferencesUrl ? `
                        <a href="${addTrackingParams(section.preferencesUrl, 'preferences')}" style="color: ${theme.colors.text.tertiary}; text-decoration: underline;">Update Preferences</a>
                      ` : ''}
                    </p>
                  ` : ''}
                </td>
              </tr>
            </table>
          ` }} />
        );
      
      default:
        return null;
    }
  };

  // Build the complete email HTML by rendering each section
  const renderedSections = sections.map((section, index) => {
    const element = renderSection(section, index);
    if (!element) return '';
    
    // Extract HTML from React elements with dangerouslySetInnerHTML
    if (React.isValidElement(element)) {
      // Check if it has dangerouslySetInnerHTML prop
      const props = element.props as any;
      if (props?.dangerouslySetInnerHTML) {
        console.log(`Section ${index} (${section.type}): Extracting HTML from dangerouslySetInnerHTML`);
        return props.dangerouslySetInnerHTML.__html;
      } else {
        console.log(`Section ${index} (${section.type}): React element without dangerouslySetInnerHTML - this might be a problem`);
      }
    }
    
    return '';
  }).join('');

  // Create the complete email HTML
  const completeEmailHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${brand?.name || 'Glamlink'} - Email</title>
  
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <![endif]-->

  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; }
    
    @media only screen and (max-width: 600px) {
      .mobile-hide { display: none !important; }
      .mobile-center { text-align: center !important; }
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding: 20px !important; }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; word-spacing: normal; background-color: ${theme.colors.background.body};">
  <!-- Preheader Text -->
  <div style="display: none; font-size: 1px; color: ${theme.colors.text.primary}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${brand?.name || 'Glamlink'} - Important updates for ${customer?.firstName || 'you'}
  </div>

  <!-- Email Container -->
  <div role="article" aria-roledescription="email" aria-label="Email" lang="en" style="text-size-adjust: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <!--[if mso]>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600">
    <tr>
    <td>
    <![endif]-->
    
    <!-- Main Table -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: ${theme.spacing.container}; margin: 0 auto; background-color: ${theme.colors.background.email};">
      <tr>
        <td>
          ${renderedSections}
        </td>
      </tr>
    </table>

    <!--[if mso]>
    </td>
    </tr>
    </table>
    <![endif]-->
  </div>
</body>
</html>
  `;

  // Return the complete email HTML
  return <div dangerouslySetInnerHTML={{ __html: completeEmailHtml }} />;
};

export default SectionBuiltLayout;