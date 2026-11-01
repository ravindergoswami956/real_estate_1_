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
    location: 'DLF Phase 5, Gurugram',
    review: 'Apex Realty Group offered absolute transparency when we bought our luxury residence. Thorough title verification, direct developer negotiation, and timely registration at the tehsil without any stress.',
    rating: 5,
    date: 'October 2026'
  },
  {
    id: 'test-2',
    author: 'Priya Narang',
    role: 'Luxury Villa Buyer',
    location: 'Golf Course Road Corridor',
    review: 'Their understanding of Gurugram’s luxury micro-markets is unmatched. They patiently took us through physical site visits, pointed out subtle structural differences, and helped us secure a fair valuation. Highly recommended.',
    rating: 5,
    date: 'September 2026'
  },
  {
    id: 'test-3',
    author: 'Commander (Retd.) S. K. Batra',
    role: 'Commercial Investor',
    location: 'Horizon Executive Suites, Golf Course Rd',
    review: 'Having their executive advisory office on Golf Course Road gives immense peace of mind. Transparent paperwork, zero hidden costs, and genuine gentlemanly advisory. A 5-star rating is well-earned.',
    rating: 5,
    date: 'August 2026'
  }
];
