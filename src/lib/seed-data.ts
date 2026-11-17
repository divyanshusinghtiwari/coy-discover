import prisma from './prisma';

export const CURRENT_USER_ID = 'user-current';

export const MOCK_PROFILES = [
  {
    id: 'user-maya',
    name: 'Maya Patel',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Design engineer building human-first AI. Weekends: film photography & climbing at Dogpatch Boulders. Tell me your most controversial coffee opinion.',
    city: 'San Francisco',
    college: 'Stanford University',
    interests: JSON.stringify(['Film Photography', 'Bouldering', 'Specialty Coffee', 'AI Design', 'Indie Rock']),
    alreadyLikedMe: true, // Incoming like for current user!
  },
  {
    id: 'user-liam',
    name: 'Liam Chen',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Fintech by day, house music producer by night. Looking for someone to explore hidden vinyl shops and late-night taco trucks with.',
    city: 'San Francisco',
    college: 'UC Berkeley',
    interests: JSON.stringify(['Electronic Music', 'Vinyl Records', 'Tacos', 'Fintech', 'Cycling']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-zara',
    name: 'Zara Al-Mansoor',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Literature student & museum hopper. Always down for spontaneous gallery walks and natural wine bars in the West Village.',
    city: 'New York',
    college: 'Columbia University',
    interests: JSON.stringify(['Art Galleries', 'Natural Wine', 'Modern Literature', 'Thrifting', 'Poetry']),
    alreadyLikedMe: true, // Incoming like!
  },
  {
    id: 'user-rohan',
    name: 'Rohan Malhotra',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Full-stack dev at a fast-growing startup. Passionate about sourdough baking, marathon training, and indie board games.',
    city: 'Bangalore',
    college: 'IIT Bombay',
    interests: JSON.stringify(['Sourdough Baking', 'Marathons', 'Board Games', 'Open Source', 'Filter Coffee']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-chloe',
    name: 'Chloe Dubois',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Cinematographer and creative director. 35mm film collector. If you appreciate Wes Anderson color palettes, we will get along.',
    city: 'New York',
    college: 'NYU Tisch',
    interests: JSON.stringify(['Cinema', '35mm Film', 'Color Theory', 'French New Wave', 'Vintage Cameras']),
    alreadyLikedMe: true, // Incoming like!
  },
  {
    id: 'user-arjun',
    name: 'Arjun Sharma',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Product manager with a passion for scuba diving and jazz saxophone. Can make a mean butter chicken from scratch.',
    city: 'Mumbai',
    college: 'BITS Pilani',
    interests: JSON.stringify(['Scuba Diving', 'Jazz', 'Cooking', 'Product Strategy', 'Travel']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Macro analyst & architecture enthusiast. Currently hunting down the best matcha latte in every city I visit.',
    city: 'London',
    college: 'London School of Economics',
    interests: JSON.stringify(['Matcha', 'Brutalist Architecture', 'Economics', 'Pilates', 'Contemporary Art']),
    alreadyLikedMe: true, // Incoming like!
  },
  {
    id: 'user-marcus',
    name: 'Marcus Taylor',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Hardware hacker and trail runner. Dog dad to a golden retriever named Biscuit. Let us go paddle-boarding on Lady Bird Lake.',
    city: 'Austin',
    college: 'UT Austin',
    interests: JSON.stringify(['Dogs', 'Trail Running', 'Hardware', 'Kayaking', 'BBQ']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-ananya',
    name: 'Ananya Sen',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Art historian & podcast fanatic. Probably debating vintage film trivia or curating Spotify playlists for every mood.',
    city: 'Delhi',
    college: "St. Stephen's College",
    interests: JSON.stringify(['Art History', 'Indie Folk', 'Podcasts', 'Museums', 'Book Clubs']),
    alreadyLikedMe: true, // Incoming like!
  },
  {
    id: 'user-mateo',
    name: 'Mateo Rodriguez',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Specialty coffee roaster and ocean surfer. Fluent in Spanish, English, and sarcasm. Sunset beach bonfire enthusiast.',
    city: 'Los Angeles',
    college: 'UCLA',
    interests: JSON.stringify(['Surfing', 'Espresso', 'Beach Volleyball', 'Spanish Music', 'Campfires']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-tara',
    name: 'Tara Kapoor',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Brand strategist & amateur ceramicist. Will judge your pasta choice, but with love. In search of the best tiramisu.',
    city: 'Mumbai',
    college: 'Ashoka University',
    interests: JSON.stringify(['Ceramics', 'Italian Food', 'Brand Design', 'Pottery', 'Jazz Lounges']),
    alreadyLikedMe: true, // Incoming like!
  },
  {
    id: 'user-lucas',
    name: 'Lucas Silva',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Aerospace engineer who dreams of Mars. When not running simulations, I am playing acoustic guitar or hiking the Blue Ridge mountains.',
    city: 'Atlanta',
    college: 'Georgia Tech',
    interests: JSON.stringify(['Space Exploration', 'Acoustic Guitar', 'Hiking', 'Astrophysics', 'Camping']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-sophia',
    name: 'Sophia Kim',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Journalist with an eye for street photography and urban architecture. Deep-dish pizza loyalist with zero regrets.',
    city: 'Chicago',
    college: 'Northwestern University',
    interests: JSON.stringify(['Street Photography', 'Journalism', 'Architecture', 'Urban Exploring', 'Deep Dish']),
    alreadyLikedMe: true, // Incoming like!
  },
  {
    id: 'user-devansh',
    name: 'Devansh Verma',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Algorithmic trader by day, sci-fi bookworm by night. Marathon finisher. Let us debate Fermi paradox over spicy ramen.',
    city: 'Gurgaon',
    college: 'IIT Delhi',
    interests: JSON.stringify(['Sci-Fi Novels', 'Quantitative Finance', 'Ramen', 'Running', 'Chess']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-nina',
    name: 'Nina Vance',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Illustrator and printmaker. Obsessed with risograph printing, botanical gardens, and cozy indie coffee shops.',
    city: 'Providence',
    college: 'Rhode Island School of Design',
    interests: JSON.stringify(['Risograph', 'Illustration', 'Botanical Gardens', 'Plants', 'Matcha']),
    alreadyLikedMe: true, // Incoming like!
  },
  {
    id: 'user-gabriel',
    name: 'Gabriel Moreau',
    age: 27,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Pastry chef turned food writer. Seeking someone who appreciates slow Sunday mornings and fresh sourdough croissants.',
    city: 'Paris',
    college: 'Sorbonne University',
    interests: JSON.stringify(['Pastry', 'Food Writing', 'Wine Pairing', 'Baking', 'French Cinema']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-ishaan',
    name: 'Ishaan Joshi',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Documentary filmmaker. Capturing untold city stories. Big fan of vinyl records, spontaneous road trips, and roadside chai.',
    city: 'Delhi',
    college: 'Delhi University',
    interests: JSON.stringify(['Documentaries', 'Road Trips', 'Chai', 'Vintage Records', 'Storytelling']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-olivia',
    name: 'Olivia Bennett',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Neuroscience researcher. When out of the lab: rowing on the Charles, thrifting vintage jackets, or playing Settlers of Catan.',
    city: 'Boston',
    college: 'Harvard University',
    interests: JSON.stringify(['Neuroscience', 'Rowing', 'Thrifting', 'Board Games', 'Coffee']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-siddharth',
    name: 'Siddharth Roy',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Clean-tech founder. Passionate about solar energy, electric mobility, and backcountry camping under starry skies.',
    city: 'Palo Alto',
    college: 'Stanford Graduate School',
    interests: JSON.stringify(['Clean Tech', 'Stargazing', 'Camping', 'Sustainability', 'EVs']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-camille',
    name: 'Camille Laurent',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Bilingual translator & indie film critic. Lover of snowy winter walks, rich hot chocolate, and quaint independent bookstores.',
    city: 'Montreal',
    college: 'McGill University',
    interests: JSON.stringify(['Indie Cinema', 'Bookstores', 'Hot Chocolate', 'Winter Sports', 'Languages']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-kabir',
    name: 'Kabir Mehra',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Robotics engineer building autonomous underwater drones. Enjoys coastal cycling, South Indian filter coffee, and acoustic fingerstyle.',
    city: 'Chennai',
    college: 'IIT Madras',
    interests: JSON.stringify(['Robotics', 'Fingerstyle Guitar', 'Filter Coffee', 'Coastal Cycling', 'Drones']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-meera',
    name: 'Meera Nambiar',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'UX researcher & ceramic artist. Believes thoughtful design makes everyday rituals poetic. Let us visit an interactive art exhibit.',
    city: 'Ahmedabad',
    college: 'National Institute of Design',
    interests: JSON.stringify(['UX Research', 'Ceramics', 'Visual Arts', 'Design Thinking', 'Tea']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-alexander',
    name: 'Alexander Wright',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Theoretical physicist who also plays the cello. Big fan of pub quizzes, stargazing, and 18th-century biographies.',
    city: 'London',
    college: 'Cambridge University',
    interests: JSON.stringify(['Physics', 'Cello', 'Pub Trivia', 'Biographies', 'Classical Music']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-priya',
    name: 'Priya Nair',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Economics graduate & spoken word poet. Passionate about social impact initiatives, indie folk gigs, and spicy street momos.',
    city: 'Delhi',
    college: 'Lady Shri Ram College',
    interests: JSON.stringify(['Spoken Word', 'Social Impact', 'Indie Folk', 'Street Food', 'Economics']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-julian',
    name: 'Julian Ramos',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Software architect and mountaineer. Pacific Northwest native. Ask me about the most scenic backcountry trails in the Cascades.',
    city: 'Seattle',
    college: 'University of Washington',
    interests: JSON.stringify(['Mountaineering', 'Backpacking', 'Distributed Systems', 'IPAs', 'Snowboarding']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-samantha',
    name: 'Samantha Wu',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Food scientist experimenting with artisanal fermentation. Dog lover, sourdough enthusiast, and craft cocktail mixologist.',
    city: 'Ithaca',
    college: 'Cornell University',
    interests: JSON.stringify(['Fermentation', 'Mixology', 'Dogs', 'Culinary Science', 'Baking']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-vikram',
    name: 'Vikram Singhania',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Venture capitalist passionate about healthtech and preventive medicine. Enjoys squash, pour-overs, and weekend tennis matches.',
    city: 'Hyderabad',
    college: 'Indian School of Business',
    interests: JSON.stringify(['Venture Capital', 'Tennis', 'Squash', 'Pour-over Coffee', 'HealthTech']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-isabella',
    name: 'Isabella Rossi',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Fashion marketing manager and gelato connoisseur. Avid traveler, vintage collector, and admirer of Italian Renaissance architecture.',
    city: 'Milan',
    college: 'Bocconi University',
    interests: JSON.stringify(['Fashion', 'Italian Art', 'Gelato', 'Travel', 'Architecture']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-aakash',
    name: 'Aakash Mehta',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Remote game developer living by the coast. Dawn surfing, afternoon game design, nighttime stargazing with friends.',
    city: 'Goa',
    college: 'BITS Pilani Goa',
    interests: JSON.stringify(['Game Development', 'Surfing', 'Pixel Art', 'Beach Life', 'Synthwave']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-natasha',
    name: 'Natasha Roman',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Environmental policy advocate. Loves weekend kayak expeditions, cozy jazz cafes, and baking cinnamon rolls on rainy mornings.',
    city: 'Toronto',
    college: 'University of Toronto',
    interests: JSON.stringify(['Environmentalism', 'Kayaking', 'Jazz', 'Baking', 'Nature Hikes']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-daniel',
    name: 'Daniel Kim',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Computer vision researcher. Marathon runner, mechanical keyboard artisan, and explorer of late-night ramen spots.',
    city: 'Cambridge',
    college: 'MIT',
    interests: JSON.stringify(['Computer Vision', 'Custom Keyboards', 'Marathons', 'Ramen', 'Robotics']),
    alreadyLikedMe: false,
  },
  {
    id: 'user-riya',
    name: 'Riya Deshmukh',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ]),
    bio: 'Fashion stylist and contemporary dancer. Looking for someone with great banter, eclectic music taste, and an appreciation for acoustic jam sessions.',
    city: 'Pune',
    college: 'Symbiosis International',
    interests: JSON.stringify(['Contemporary Dance', 'Fashion Styling', 'Acoustic Jam', 'Live Gigs', 'Art Festivals']),
    alreadyLikedMe: false,
  },
];

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.user.deleteMany();

  // Create current user
  const currentUser = await prisma.user.create({
    data: {
      id: CURRENT_USER_ID,
      name: 'Alex Rivera',
      age: 24,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      ]),
      bio: 'Product Designer exploring architecture, street photography, and espresso bars around the world.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: JSON.stringify(['Design', 'Photography', 'Coffee', 'Travel', 'Art']),
      isCurrentUser: true,
    },
  });

  console.log(`✅ Current user seeded: ${currentUser.name} (${currentUser.id})`);

  let incomingLikesCount = 0;

  for (const item of MOCK_PROFILES) {
    const { alreadyLikedMe, ...profileData } = item;
    const profile = await prisma.user.create({
      data: {
        ...profileData,
        isCurrentUser: false,
      },
    });

    if (alreadyLikedMe) {
      await prisma.swipe.create({
        data: {
          swiperId: profile.id,
          swipedId: CURRENT_USER_ID,
          action: 'like',
        },
      });
      incomingLikesCount++;
    }
  }

  console.log(`✅ Seeded ${MOCK_PROFILES.length} mock candidate profiles.`);
  console.log(`💖 Seeded ${incomingLikesCount} pre-existing incoming likes directed at current user.`);
  console.log('✨ Seeding successfully completed!');
}
