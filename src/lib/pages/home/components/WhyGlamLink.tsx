"use client";

import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { HomePageContent } from "@/lib/config/pageContent";

interface WhyGlamLinkProps {
  content: HomePageContent['whyGlamLink'];
}

const iconMap: { [key: string]: any } = {
  'PersonOutline': PersonOutlineIcon,
  'CalendarTodayOutlined': CalendarTodayOutlinedIcon,
  'ShoppingBagOutlined': ShoppingBagOutlinedIcon,
  'RocketLaunchOutlined': RocketLaunchOutlinedIcon,
  'SearchOutlined': SearchOutlinedIcon,
  'EventNoteOutlined': EventNoteOutlinedIcon,
  'AttachMoneyOutlined': AttachMoneyOutlinedIcon,
  'AutoAwesomeOutlined': AutoAwesomeOutlinedIcon,
};

export default function WhyGlamLink({ content }: WhyGlamLinkProps) {
  return (
    <section className="pt-8 pb-8 bg-white">
      <div className="container-custom">
        <div className="grid lg-custom:grid-cols-2 gap-8">
          {/* Left Card */}
          <div className="card-selected rounded-lg p-8" style={{ backgroundColor: "#faffff", border: "3px solid #c4e2e6" }}>
            <h2 className="text-3xl font-medium text-gray-900 mb-2">{content.title}</h2>
            <p className="text-gray-600 mb-6">{content.subtitle}</p>

            <ul className="space-y-4">
              {content.features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon || ''] || null;
                return (
                  <li key={index} className="flex items-start gap-3">
                    {IconComponent ? (
                      <IconComponent className="text-glamlink-teal mt-1" sx={{ fontSize: 20 }} />
                    ) : feature.icon && feature.icon.length <= 2 ? (
                      <span className="text-xl mt-1">{feature.icon}</span>
                    ) : (
                      <div className="w-5 h-5 bg-glamlink-teal rounded-full mt-1" />
                    )}
                    <div>
                      <span className="text-gray-700 text-lg font-medium">{feature.title}</span>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Card */}
          <div className="rounded-lg shadow-md p-8" style={{ border: "1px solid #f7f7f7" }}>
            <h3 className="text-3xl font-medium text-gray-900 mb-2">For Professionals</h3>
            <p className="text-gray-600 mb-6">Get discovered, get booked, and unlock new ways to grow.</p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <SearchOutlinedIcon className="text-glamlink-teal mt-1" sx={{ fontSize: 20 }} />
                <div>
                  <span className="text-gray-700 text-lg font-medium">Get Discovered</span>
                  <p className="text-gray-600 text-sm">Be found by what you do best. Whether it's lashes, microblading, brows, we'll help connect you to clients actively searching for your exact services.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <EventNoteOutlinedIcon className="text-glamlink-teal mt-1" sx={{ fontSize: 20 }} />
                <div>
                  <span className="text-gray-700 text-lg font-medium">Booked & Busy</span>
                  <p className="text-gray-600 text-sm">Fill your calendar with real bookings. Our smart tools help you manage clients, stay organized, and grow your business seamlessly.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AttachMoneyOutlinedIcon className="text-glamlink-teal mt-1" sx={{ fontSize: 20 }} />
                <div>
                  <span className="text-gray-700 text-lg font-medium">Create. Earn. Expand</span>
                  <p className="text-gray-600 text-sm">From selling your favorite products to launching your own brand or app, it's possible.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AutoAwesomeOutlinedIcon className="text-glamlink-teal mt-1" sx={{ fontSize: 20 }} />
                <div>
                  <span className="text-gray-700 text-lg font-medium">Smarter Tools, Built for You</span>
                  <p className="text-gray-600 text-sm">AI-powered features are helping you do more with the right clients.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
