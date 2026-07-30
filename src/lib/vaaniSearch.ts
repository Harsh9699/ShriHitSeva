import { VAANI_SECTIONS } from '../constants/vaanis';
import { Vaani } from '../types';

export interface VaaniMatch {
  vaani: Vaani;
  sectionTitle: string;
  score: number;
}

/**
 * Searches the entire Vaani knowledge base for keywords matching the user's input.
 * Returns the best matching Vaani if found, otherwise null.
 */
export function findVaaniGuidance(userInput: string): VaaniMatch | null {
  const normalizedInput = userInput.toLowerCase();
  
  // Stop words to ignore common English and Hindi words
  const stopWords = new Set(['what', 'is', 'the', 'how', 'to', 'can', 'you', 'tell', 'me', 'about', 'a', 'an', 'in', 'of', 'and', 'or', 'for', 'ki', 'ka', 'ke', 'hai', 'hain', 'mujhe', 'batao', 'kya', 'please', 'give']);
  
  // Extract keywords
  const keywords = normalizedInput
    .split(/\s+/)
    .map(word => {
      // Normalize '1st', '2nd' etc to '1', '2'
      const numMatch = word.match(/^(\d+)(?:st|nd|rd|th)$/);
      if (numMatch) return numMatch[1];
      return word.replace(/[^\w\s\u0900-\u097F]/g, '');
    })
    .filter(word => word.length > 0 && !stopWords.has(word));

  if (keywords.length === 0) {
    return null; // No meaningful keywords to search
  }

  let matches: VaaniMatch[] = [];

  // Helper to score a Vaani
  const scoreVaani = (vaani: Vaani, sectionTitle: string) => {
    let score = 0;
    let hasSectionMatch = false;
    let hasNumberMatch = false;
    
    const searchableText = `${vaani.title} ${vaani.text} ${vaani.meaning || ''} ${sectionTitle}`.toLowerCase();
    const titleText = vaani.title.toLowerCase();
    const sectionText = sectionTitle.toLowerCase();
    
    for (const keyword of keywords) {
      const isNumber = /^\d+$/.test(keyword);

      if (searchableText.includes(keyword)) {
        score += 1;
        
        if (sectionText.includes(keyword)) {
          hasSectionMatch = true;
          score += 5; // Heavy boost for section name matches
        }

        if (titleText.includes(keyword)) {
          score += 3;
          if (isNumber) {
            // Check if it's an exact number match in title (e.g., '1' matches 'Shloka 1' but not 'Shloka 10')
            const exactNumberRegex = new RegExp(`\\b${keyword}\\b`);
            if (exactNumberRegex.test(titleText)) {
              hasNumberMatch = true;
              score += 20; // Massive boost for exact number match in title
            }
          }
        }
        
        if (vaani.meaning && vaani.meaning.toLowerCase().includes(keyword)) {
          score += 2;
        }
      }
    }

    // Synergy bonus: If they matched both the section (e.g. Radha Sudha Nidhi) AND the exact number (e.g. 1)
    if (hasSectionMatch && hasNumberMatch) {
      score += 50; 
    }

    if (score > 0) {
      matches.push({ vaani, sectionTitle, score });
    }
  };

  // Iterate over all sections and sub-sections
  for (const section of VAANI_SECTIONS) {
    // Score root-level vaanis
    if (section.vaanis) {
      for (const vaani of section.vaanis) {
        scoreVaani(vaani, section.title);
      }
    }
    
    // Score sub-section vaanis
    if (section.subSections) {
      for (const subSection of section.subSections) {
        for (const vaani of subSection.vaanis) {
          scoreVaani(vaani, `${section.title} - ${subSection.title}`);
        }
      }
    }
  }

  // Sort matches by score in descending order
  matches.sort((a, b) => b.score - a.score);

  // Return the best match if its score is meaningful
  if (matches.length > 0 && matches[0].score >= 1) {
    return matches[0];
  }

  return null;
}
