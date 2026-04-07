export interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}
export interface Review {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
  time: number
  profile_photo_url?: string
}
export interface OpeningPeriod {
  open: {
    day: number
    time: string
  }
  close?: {
    day: number
    time: string
  }
}
export interface Photo {
  photo_reference: string
  height: number
  width: number
  html_attributions?: string[]
}

export interface Provider {
  locations: any
  booking_link: string
  profile_image: any
  specialties: any
  details: any
    
  name: string
  vicinity?: string
  business_status?: string
  place_id?: string

  rating?: number
  user_ratings_total?: number

  formatted_address?: string
  formatted_phone_number?: string
  international_phone_number?: string
  website?: string
  url?: string

  adr_address?: string

  geometry?: {
    location: {
      lat: number
      lng: number
    }
    viewport?: {
      northeast: {
        lat: number
        lng: number
      }
      southwest: {
        lat: number
        lng: number
      }
    }
  }

  address_components?: AddressComponent[]

  photos?: Photo[]

  opening_hours?: {
    open_now: boolean
    periods?: OpeningPeriod[]
    weekday_text?: string[]
  }

  current_opening_hours?: {
    open_now: boolean
    periods?: OpeningPeriod[]
    weekday_text?: string[]
  }

  reviews?: Review[]

  plus_code?: {
    compound_code?: string
    global_code?: string
  }

  types?: string[]

  icon?: string
  icon_background_color?: string
  icon_mask_base_uri?: string

  wheelchair_accessible_entrance?: boolean
}