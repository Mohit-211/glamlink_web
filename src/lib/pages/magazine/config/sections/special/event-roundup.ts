import { SectionSchema } from '../types';
import { addCommonFields } from '../common';

export const eventRoundupSchema: SectionSchema = {
  id: "event-roundup",
  label: "Event Roundup",
  description: "Upcoming and past event coverage",
  category: "editorial",
  fields: addCommonFields([
    { name: "subtitle2", label: "Section Subtitle 2", type: "text", placeholder: "Additional subtitle text" },
    {
      name: "upcomingEvents",
      label: "Upcoming Events",
      type: "array",
      itemType: "object",
      fields: [
        { name: "title", label: "Event Title", type: "text", required: true },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "image", label: "Event Image", type: "image" },
        { name: "registrationLink", label: "Registration Link", type: "link-action", helperText: "Can be a link or trigger app download" },
      ],
    },
    {
      name: "pastEvents",
      label: "Past Events",
      type: "array",
      itemType: "object",
      fields: [
        { name: "title", label: "Event Title", type: "text", required: true },
        { name: "date", label: "Date", type: "date", required: true },
        {
          name: "highlights",
          label: "Event Highlights",
          type: "array",
          itemType: "text",
        },
        {
          name: "images",
          label: "Event Images",
          type: "array",
          itemType: "image",
        },
        { name: "attendees", label: "Number of Attendees", type: "number" },
      ],
    },
  ]),
};