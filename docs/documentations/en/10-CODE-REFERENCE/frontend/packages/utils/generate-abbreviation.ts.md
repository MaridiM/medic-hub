# File: packages\utils\generate-abbreviation.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/utils/generate-abbreviation.ts`

## Category
Frontend

## File Type
TS (generate-abbreviation.ts)

## Size
1760 characters, 49 lines

## Full Code

```typescript
/**
 * Generates an abbreviation based on the input string.
 *
 * @param {string} input - Input string containing one or more words.
 * @returns {string} Abbreviation constructed using the following rules:
 *   - If the string contains one word, return the first two characters in uppercase.
 *   - If the string contains two or more words, return the first characters of the first two words in uppercase.
 *   - If the string is empty, return an empty string.
 *
 * @example
 * // Single word
 * const abbreviation1 = generateAbbreviation("MaridiM");
 * console.log(abbreviation1); // "MA"
 *
 * @example
 * // Two words
 * const abbreviation2 = generateAbbreviation("MaridiM ronald");
 * console.log(abbreviation2); // "MR"
 *
 * @example
 * // Three or more words
 * const abbreviation3 = generateAbbreviation("MaridiM ronald frank");
 * console.log(abbreviation3); // "MR"
 *
 * @example
 * // Empty string
 * const abbreviation4 = generateAbbreviation("");
 * console.log(abbreviation4); // ""
 *
 * @description
 * Useful for creating abbreviations displayed in avatars, labels, and other UI elements.
 * The function extracts the first letters from one or two words depending on string length.
 */
export function generateAbbreviation(input: string): string {
    // Split the string into words
    const words = input.split(' ')

    if (words.length === 1) {
        // For a single word, return the first two characters
        return words[0].slice(0, 2).toUpperCase()
    } else if (words.length >= 2) {
        // For two or more words, take the first character of the first two words
        return (words[0][0] + words[1][0]).toUpperCase()
    }

    // If the string is empty or does not match the rules, return an empty string
    return ''
}

```

## Description

This file is part of the MedicHub Frontend (Next.js) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.846Z*
