export interface Testimonial {
  id: string;
  author: string;
  role: string;
  location: string;
  review: string;
  rating: number;
  date: string;
}

export const GENUINE_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Rajiv Malhotra',
    role: 'Home Buyer',
    location: 'Sushant Lok 2, Sector 57',
    review: 'Guruji Property offered absolute transparency when we bought our independent builder floor in Sector 57. Thorough title verification, direct builder negotiation, and timely registration at the tehsil without any stress.',
    rating: 5,
    date: 'October 2026'
  },
  {
    id: 'test-2',
    author: 'Priya Narang',
    role: 'Luxury Villa Buyer',
    location: 'Golf Course Road Corridor',
    review: 'Their understanding of Gurugram’s micro-markets is unmatched. They patiently took us through physical site visits, pointed out subtle structural differences, and helped us secure a fair valuation. Highly recommended.',
    rating: 5,
    date: 'September 2026'
  },
  {
    id: 'test-3',
    author: 'Commander (Retd.) S. K. Batra',
    role: 'Commercial Investor',
    location: 'Cyber City & MKM Market',
    review: 'Having their office right in MKM Market, Sector 57 gives immense peace of mind. Transparent paperwork, zero hidden costs, and genuine gentlemanly advisory. A 5-star rating is well-earned.',
    rating: 5,
    date: 'August 2026'
  }
];
