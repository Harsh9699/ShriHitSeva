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
    .map(word => word.replace(/[^\w\s\u0900-\u097F]/g, '')) // Allow Hindi chars and alphanumeric
    .filter(word => word.length > 2 && !stopWords.has(word));

  if (keywords.length === 0) {
    return null; // No meaningful keywords to search
  }

  let matches: VaaniMatch[] = [];

  // Helper to score a Vaani
  const scoreVaani = (vaani: Vaani, sectionTitle: string) => {
    let score = 0;
    const searchableText = `${vaani.title} ${vaani.text} ${vaani.meaning || ''} ${sectionTitle}`.toLowerCase();
    
    for (const keyword of keywords) {
      if (searchableText.includes(keyword)) {
        score += 1;
        // Boost score if keyword appears in meaning or title
        if ((vaani.meaning && vaani.meaning.toLowerCase().includes(keyword)) || vaani.title.toLowerCase().includes(keyword)) {
          score += 2;
        }
      }
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
