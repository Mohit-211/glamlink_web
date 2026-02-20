"use client";

import Image from "next/image";
import Link from "next/link";
import { CoinDropContent } from "../../../types";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset, getAlignmentClass } from "../../../config/universalStyles";
import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";

interface CoinDropProps {
  content: CoinDropContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { main?: string; challenge?: string; earn?: string; rewards?: string; leaderboard?: string; offers?: string; cta?: string };
}

export default function CoinDrop({ content, title, subtitle, backgroundColor }: CoinDropProps) {
  // Get merged style settings
  const styles = mergeUniversalStyleSettings(content, getUniversalLayoutPreset(content.headerLayout));

  // Parse background colors
  const backgrounds = typeof backgroundColor === "object" ? backgroundColor : { main: backgroundColor };

  // Check if a value is a Tailwind class
  const isTailwindClass = (value?: string) => {
    return value && (value.startsWith("bg-") || value.includes(" bg-") || value.includes("from-") || value.includes("to-"));
  };

  // Apply background style or class
  const getBackgroundProps = (bgValue?: string) => {
    if (!bgValue || bgValue === "transparent") return {};
    if (isTailwindClass(bgValue)) {
      return { className: bgValue };
    }
    return { style: { background: bgValue } };
  };

  const mainBgProps = getBackgroundProps(backgrounds?.main);
  const challengeBgProps = getBackgroundProps(backgrounds?.challenge);
  const earnBgProps = getBackgroundProps(backgrounds?.earn);
  const rewardsBgProps = getBackgroundProps(backgrounds?.rewards);
  const leaderboardBgProps = getBackgroundProps(backgrounds?.leaderboard);
  const offersBgProps = getBackgroundProps(backgrounds?.offers);
  const ctaBgProps = getBackgroundProps(backgrounds?.cta);

  return (
    <div className={`py-12 px-8 ${mainBgProps.className || "bg-gradient-to-br from-yellow-50 to-glamlink-gold/10"}`} style={mainBgProps.style}>
      <div className="max-w-6xl mx-auto">
        {/* Header with dynamic styling */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2
                className={`
                ${styles.titleFontSize || "text-3xl md:text-4xl"} 
                ${styles.titleFontFamily || "font-serif"}
                ${styles.titleFontWeight || "font-bold"}
                ${getAlignmentClass(styles.titleAlignment)}
                ${styles.titleColor || "text-gray-900"}
                mb-2
              `}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={`
                ${styles.subtitleFontSize || "text-lg md:text-xl"} 
                ${styles.subtitleFontFamily || "font-sans"}
                ${styles.subtitleFontWeight || "font-medium"}
                ${getAlignmentClass(styles.subtitleAlignment)}
                ${styles.subtitleColor || "text-gray-600"}
              `}
              >
                {subtitle}
              </p>
            )}
            {content.subtitle2 && (
              <p
                className={`
                ${styles.subtitle2FontSize || "text-base"} 
                ${styles.subtitle2FontFamily || "font-sans"}
                ${styles.subtitle2FontWeight || "font-normal"}
                ${getAlignmentClass(styles.subtitle2Alignment)}
                ${styles.subtitle2Color || "text-gray-500"}
                mt-1
              `}
              >
                {content.subtitle2}
              </p>
            )}
          </div>
        )}

        {/* Coin icon */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="text-6xl">🥯</div>
          </div>
        </div>

        {/* Monthly Challenge */}
        {content.monthlyChallenge && (
          <div className={`rounded-2xl shadow-lg p-8 mb-8 ${challengeBgProps.className || "bg-white"}`} style={challengeBgProps.style}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`${styles.subtitleFontSize || "text-2xl"} font-bold ${styles.subtitleColor || "text-gray-900"}`}>{content.monthlyChallenge.title}</h3>
              <div className="text-3xl font-bold text-glamlink-gold">+{content.monthlyChallenge.coinReward} 🥯</div>
            </div>
            <p className="text-gray-700 mb-6">{content.monthlyChallenge.description}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-bold mb-3 ${styles.bodyColor || "text-gray-900"}`}>How to Participate:</h4>
                <ol className="space-y-2">
                  {content.monthlyChallenge.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="font-bold text-glamlink-gold mr-2">{index + 1}.</span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className={`font-bold mb-3 ${styles.bodyColor || "text-gray-900"}`}>Challenge Details:</h4>
                <div className="space-y-2">
                  {content.monthlyChallenge.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">{formatMagazineDate(content.monthlyChallenge.deadline)}</span>
                    </div>
                  )}
                  {content.monthlyChallenge.participants && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium">{content.monthlyChallenge.participants}+</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ways to Earn */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className={`rounded-xl p-6 ${earnBgProps.className || "bg-white"}`} style={earnBgProps.style}>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">💰</span>
              Ways to Earn This Month
            </h3>
            <div className="space-y-3">
              {content.waysToEarn.map((way, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-glamlink-gold/10 transition-colors">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{way.icon}</span>
                    <div>
                      <div className="font-medium">{way.action}</div>
                      {way.frequency && <div className="text-xs text-gray-600">{way.frequency}</div>}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-glamlink-gold">+{way.coins}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Rewards */}
          <div className={`rounded-xl p-6 ${rewardsBgProps.className || "bg-white"}`} style={rewardsBgProps.style}>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🎁</span>
              Featured Rewards
            </h3>
            <div className="space-y-3">
              {content.featuredRewards.map((reward, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-glamlink-purple/10 transition-colors">
                  <div className="flex items-center">
                    {reward.image && (
                      <div className="relative w-12 h-12 rounded mr-3">
                        <Image src={reward.image} alt={reward.name} fill className="object-cover rounded" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{reward.name}</div>
                      {reward.value && <div className="text-xs text-gray-600">Value: ${reward.value}</div>}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-glamlink-purple">{reward.coinCost} 🥯</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        {content.leaderboard && content.leaderboard.length > 0 && (
          <div className={`rounded-xl p-8 mb-8 ${leaderboardBgProps.className || "bg-white"}`} style={leaderboardBgProps.style}>
            <h3 className="text-2xl font-bold mb-6 text-center">🏆 This Month's Top Earners</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {content.leaderboard.slice(0, 3).map((user, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-b from-glamlink-gold/20 to-white rounded-lg">
                  <div className="text-4xl mb-3">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>
                  {user.image && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                      <Image src={user.image} alt={user.name} fill className="object-cover" />
                    </div>
                  )}
                  <h4 className="font-bold mb-1">{user.name}</h4>
                  <div className="text-2xl font-bold text-glamlink-gold">{user.coins} 🥯</div>
                  {user.badge && <div className="mt-2 inline-block px-3 py-1 bg-glamlink-purple/20 text-glamlink-purple rounded-full text-xs">{user.badge}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Offers */}
        {content.specialOffers && content.specialOffers.length > 0 && (
          <div className={`border-2 border-gradient-to-r from-glamlink-purple to-glamlink-teal rounded-xl p-8 mb-8 ${offersBgProps.className || "bg-white"}`} style={offersBgProps.style}>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">⚡ Limited Time Offers</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {content.specialOffers.map((offer, index) => (
                <div key={index} className="bg-gradient-to-r from-glamlink-purple/10 to-glamlink-teal/10 rounded-lg p-4 border border-glamlink-purple/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{offer.title}</h4>
                    {offer.endsIn && <span className="text-xs bg-glamlink-purple/20 text-glamlink-purple px-2 py-1 rounded font-medium">Ends in {offer.endsIn}</span>}
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-glamlink-purple">{offer.discount}</span>
                    <span className="text-sm text-gray-600">Min: {offer.minCoins} 🥯</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <div className={`inline-block p-6 rounded-xl shadow-lg ${ctaBgProps.className || "bg-white"}`} style={ctaBgProps.style}>
            <p className="text-lg mb-4">Your Current Balance:</p>
            <div className="text-4xl font-bold text-glamlink-gold mb-4">{content.userBalance || "---"} 🥯</div>
            <div className="flex gap-4">
              <Link href="/rewards/earn" className="px-6 py-3 bg-glamlink-gold text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium">
                Earn More Coins
              </Link>
              <Link href="/rewards/redeem" className="px-6 py-3 bg-glamlink-purple text-white rounded-lg hover:bg-glamlink-teal transition-colors font-medium">
                Redeem Rewards
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
