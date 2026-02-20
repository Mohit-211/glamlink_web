# Google Maps Feature Configuration

## Overview

Configurable Google Maps integration for business location display with multiple layout options.
Now supports both single and multi-location (up to 30 locations) display modes.

## Feature Settings

### Address Display Options

- **showAddressOverlay**: Display business address as overlay on map (default: true)
- **showAddressCard**: Display address in card below map (default: false)

### Map Interaction

- **clickToDirections**: Click map icon opens "Get Directions" in new tab (default: true)
- **showMarker**: Show business location marker (default: true)

### Styling Options

- **overlayPosition**: Position of address overlay ('top-left', 'top-right', 'bottom-left', 'bottom-right')
- **overlayStyle**: CSS classes for overlay styling

## Multi-Location Support

The Google Maps feature now supports displaying multiple business locations per professional.

### Key Features

1. **Up to 30 Locations**: Each professional can have up to 30 business locations
2. **Primary Location**: One location can be marked as primary (shown by default with gold star indicator)
3. **Search/Filter**: Text search input to filter and find locations
4. **Multi-Marker Display**: When zoomed out, all location markers are visible on the map
5. **Location Selection**: Click search results or markers to zoom/pan to specific location

### Data Structure

Locations are stored in the Professional type as either:

- `locationData`: Single location (legacy, backward compatible)
- `locations`: Array of LocationData objects (new, multi-location support)

```typescript
interface LocationData {
  // Required fields
  address: string;
  lat: number;
  lng: number;

  // Optional fields
  id?: string;           // Unique identifier
  isPrimary?: boolean;   // Is this the primary/default location?
  label?: string;        // Display label (e.g., "Main Office", "Downtown Studio")
  businessName?: string; // Business name at this location
  phone?: string;        // Contact phone
  email?: string;        // Contact email
  hours?: string;        // Business hours
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
  googleMapsUrl?: string;
}
```

### Components

#### MultiLocationMapsDisplay

Main component for displaying multiple locations on a map.

```typescript
import MultiLocationMapsDisplay from "@/lib/features/digital-cards/components/items/maps/MultiLocationMapsDisplay";

<MultiLocationMapsDisplay
  professional={professional}
  height="400px"
  showSearch={true}        // Show search/filter bar
  showDirections={true}    // Show directions button
  showInfo={true}          // Show location info
  showAddressOverlay={true}
  zoom={14}
/>
```

#### LocationSearch

Search dropdown component for filtering and selecting locations.

```typescript
import LocationSearch from "@/lib/features/digital-cards/components/items/maps/LocationSearch";

<LocationSearch
  locations={allLocations}
  filteredLocations={filtered}
  selectedLocation={selected}
  searchQuery={query}
  onSearchChange={setQuery}
  onLocationSelect={selectLocation}
  onShowAll={showAllLocations}
/>
```

### Hook: useMultiLocationMaps

Custom hook for managing multi-location map state.

```typescript
import { useMultiLocationMaps } from "@/lib/features/digital-cards/components/items/maps/useMultiLocationMaps";

const {
  mapRef,              // Ref for map container
  isLoading,           // Loading state
  mapError,            // Error state
  selectedLocation,    // Currently selected location
  locations,           // All locations (normalized)
  primaryLocation,     // Primary location
  isMultiLocation,     // Has multiple locations?
  searchQuery,         // Current search query
  setSearchQuery,      // Update search query
  filteredLocations,   // Locations matching search
  selectLocation,      // Select a location (pan to it)
  showAllLocations,    // Fit bounds to show all
  handleDirectionsClick, // Open directions
  getDirectionsUrl,    // Get directions URL
  getOSMapUrl,         // Get OpenStreetMap fallback URL
} = useMultiLocationMaps(professional, zoom, showInfo);
```

### Migration Utilities

Located in `/lib/utils/migrations/locationMigration.ts`:

```typescript
// Normalize both old and new data formats
const locations = normalizeLocations(professional);

// Get primary location
const primary = getPrimaryLocation(locations);

// Filter by search query
const filtered = filterLocationsByQuery(locations, "downtown");

// Get bounds for fitting map view
const bounds = getLocationsBounds(locations);

// Add/remove/update locations
const newLocations = addLocation(locations, { address: "...", lat: 0, lng: 0 });
const updated = updateLocation(locations, "loc_123", { label: "New Label" });
const removed = removeLocation(locations, "loc_123");
const reordered = moveLocation(locations, 0, 2);
const withNewPrimary = setPrimaryLocation(locations, "loc_456");
```

### Admin Field: MultiLocationField

Field type for managing multiple locations in admin panel.

```typescript
// In field configuration
{
  name: "locations",
  label: "Business Locations",
  type: "multiLocation",
  required: false,
  helperText: "Add up to 30 business locations. Mark one as primary."
}
```

Features:
- Accordion-style location editor
- Google Places autocomplete for address entry
- Primary location toggle with star indicator
- Up/down reorder buttons
- Remove location button
- Map preview for each location
- Additional fields: label, business name, phone, hours, description

### UI Specifications

#### Admin Multi-Location Field
```
[ Business Locations ] (2 of 30)

  #1 Downtown Studio * Primary
  ├─ 123 Main St, Las Vegas, NV 89101
  └─ [Edit] [Remove] [^] [v]

  #2 West Side Branch
  ├─ 456 West Ave, Las Vegas, NV 89102
  └─ [Edit] [Remove] [Set Primary] [^] [v]

  [+ Add Location]
```

#### Public Map Display
```
┌────────────────────────────────────────────────┐
│  [Search locations...              v]          │
│                                                │
│        [Google Map with All Markers]           │
│           * = Primary (gold star)              │
│           o = Secondary (teal)                 │
│                                                │
│  [Show All]               [3 locations]        │
│                                                │
│  ┌─────────────────────────────────────────┐  │
│  │ * Downtown Studio (Primary)              │  │
│  │   123 Main St, Las Vegas, NV             │  │
│  │   (555) 123-4567 | Mon-Fri 9am-5pm       │  │
│  │                          [Directions ->] │  │
│  └─────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

### Marker Styling

- **Primary Location**: Teal (#22B8C8) marker with gold star indicator, higher z-index
- **Secondary Locations**: Standard teal (#22B8C8) markers

## Implementation Notes

Address overlay should be styled as semi-transparent overlay with good contrast for readability over map background.

Mobile responsiveness should prioritize map visibility while keeping address information accessible.

For multi-location maps, the search bar should be easily accessible and the "Show All" button should be prominently placed.

## Files

| File | Purpose |
|------|---------|
| `/lib/utils/migrations/locationMigration.ts` | Migration/normalization utilities |
| `/lib/pages/admin/components/shared/editing/fields/custom/location/MultiLocationField.tsx` | Admin multi-location field |
| `/lib/pages/admin/components/shared/editing/fields/custom/location/useMultiLocationField.ts` | Hook for admin field |
| `/lib/features/digital-cards/components/items/maps/useMultiLocationMaps.ts` | Hook for multi-location maps |
| `/lib/features/digital-cards/components/items/maps/MultiLocationMapsDisplay.tsx` | Multi-location map display |
| `/lib/features/digital-cards/components/items/maps/LocationSearch.tsx` | Search/filter dropdown |
