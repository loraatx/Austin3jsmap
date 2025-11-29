import { LandmarkData } from './types';

// Approximate relative positions for a stylized Austin map
// Center (0,0,0) is roughly the Capitol Building area
export const AUSTIN_LANDMARKS: LandmarkData[] = [
  {
    id: 'capitol',
    name: 'Texas State Capitol',
    description: 'The seat of government of the American state of Texas.',
    position: [0, 0, -10],
    type: 'building',
    scale: [4, 6, 4],
    color: '#E57373', // Reddish granite
  },
  {
    id: 'ut-austin',
    name: 'UT Austin',
    description: 'The University of Texas at Austin campus.',
    position: [0, 0, -35],
    type: 'district',
    scale: [12, 1, 12],
    color: '#BF5700', // Burnt Orange
  },
  {
    id: 'congress-ave',
    name: 'Congress Avenue',
    description: 'The main street of downtown Austin.',
    position: [0, 0.1, 10],
    type: 'district',
    scale: [2, 0.2, 40],
    color: '#9CA3AF',
  },
  {
    id: 'lady-bird-lake',
    name: 'Lady Bird Lake',
    description: 'A river-like reservoir on the Colorado River.',
    position: [0, -0.5, 30],
    type: 'water',
    scale: [100, 1, 15],
    color: '#3B82F6',
  },
  {
    id: 'zilker',
    name: 'Zilker Park',
    description: 'Austin\'s most popular metropolitan park.',
    position: [-35, 0, 35],
    type: 'park',
    scale: [25, 0.5, 20],
    color: '#10B981',
  },
  {
    id: 'dirty-6th',
    name: '6th Street',
    description: 'Historic street famous for its nightlife.',
    position: [10, 0, 5],
    type: 'district',
    scale: [15, 0.5, 2],
    color: '#F59E0B',
  },
  {
    id: 'rainey',
    name: 'Rainey Street',
    description: 'A historic district with bungalow style houses turned into bars.',
    position: [12, 0, 25],
    type: 'district',
    scale: [6, 0.5, 8],
    color: '#8B5CF6',
  },
  {
    id: 'soco',
    name: 'South Congress',
    description: 'A vibrant neighborhood known for its boutiques and eateries.',
    position: [0, 0, 55],
    type: 'district',
    scale: [4, 1, 20],
    color: '#EC4899',
  },
  {
    id: 'frost-tower',
    name: 'Frost Bank Tower',
    description: 'One of the most recognizable skyscrapers in Austin.',
    position: [4, 0, 2],
    type: 'building',
    scale: [2, 12, 2],
    color: '#A5B4FC',
  },
  {
    id: 'moody-center',
    name: 'Moody Center',
    description: 'Multi-purpose arena on the UT campus.',
    position: [5, 0, -25],
    type: 'building',
    scale: [6, 3, 6],
    color: '#FCD34D',
  },
];

export const INITIAL_SYSTEM_INSTRUCTION = `You are an expert local guide for Austin, Texas. 
You are embedded in a 3D map application. 
When the user selects a landmark, tell them interesting facts, history, or current vibes about it.
Keep your responses concise (under 3 sentences unless asked for more) and engaging.
If asked about places, mention nearby coffee shops, music venues, or bat watching spots if relevant.
Use the googleSearch tool to find up-to-date events or ratings if specifically asked.`;
