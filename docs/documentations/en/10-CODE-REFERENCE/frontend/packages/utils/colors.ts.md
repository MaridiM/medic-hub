# File: packages\utils\colors.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/packages/utils/colors.ts`

## Category
Frontend

## File Type
TS (colors.ts)

## Size
3574 characters, 98 lines

## Full Code

```typescript
/**
 * Determines whether a color is dark based on its brightness.
 *
 * @param {string} rgbHex - Color in HEX format (for example, "#1a73e8").
 * @returns {boolean} Returns `true` if the color is dark, otherwise `false`.
 *
 * @example
 * // Dark color
 * const isDark = isDarkColor("#1a73e8");
 * console.log(isDark); // true
 *
 * @example
 * // Light color
 * const isDark = isDarkColor("#f1c40f");
 * console.log(isDark); // false
 *
 * @description
 * The function calculates color brightness using the W3C standard formula:
 *   - Brightness is computed as the weighted average of the RGB components.
 *   - Weight coefficients for R, G, B:
 *     - Red (R): 299
 *     - Green (G): 587
 *     - Blue (B): 114
 *   - Brightness = (R * 299 + G * 587 + B * 114) / 1000
 *   - If brightness is below 128, the color is treated as dark.
 *
 * Useful for choosing text colors (light or dark) so they stay readable against the background.
 */
export function isDarkColor(rgbHex: string): boolean {
    // Remove '#' at the start of the HEX string
    const hex = rgbHex.replace('#', '')

    // Split color into the R, G, B components
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    // Calculate the relative brightness (per W3C standard)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000

    // If brightness is below 128, the color is dark
    return brightness < 128
}

/**
 * Generates a random color in either `rgb` or `hex` format.
 *
 * @param {boolean} rgb - Controls the format of the returned color:
 *   - If `true`, returns an `rgb(r, g, b)` string with increased brightness.
 *   - If `false` (default), returns a `hex` string (`#RRGGBB`) with increased brightness.
 * @returns {string} A generated color value:
 *   - Format `rgb(r, g, b)` (for example, "rgb(255, 200, 180)") when `rgb = true`.
 *   - Format `hex` (for example, "#ffc8b4") when `rgb = false`.
 *
 * @example
 * // Generate an RGB color
 * const rgbColor = generateColor(true);
 * console.log(rgbColor); // e.g. "rgb(255, 200, 180)"
 *
 * @example
 * // Generate a HEX color
 * const hexColor = generateColor();
 * console.log(hexColor); // e.g. "#ffc8b4"
 *
 * @description
 * The function creates random values for the red, green, and blue components in the range 0–255,
 * then increases the brightness by adding 50 (clamped to a maximum of 255).
 * This produces brighter, more saturated colors.
 *
 * It is useful for generating random colors suitable for styling UI elements,
 * backgrounds, avatars, and other visual components.
 */
export function generateColor(rgb: boolean = false): string {
    if (rgb) {
        // Generate random component values for RGB
        const r = Math.floor(Math.random() * 256) // Red (0-255)
        const g = Math.floor(Math.random() * 256) // Green (0-255)
        const b = Math.floor(Math.random() * 256) // Blue (0-255)

        // Increase brightness
        const brighten = (color: number) => Math.min(color + 50, 255)

        return `rgb(${brighten(r)}, ${brighten(g)}, ${brighten(b)})`
    }

    // Helper for generating random component values within 0–255
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)

    const brighten = (color: number) => Math.min(color + 50, 255)

    // Convert to HEX
    const toHex = (color: number) => color.toString(16).padStart(2, '0')

    return `#${toHex(brighten(r))}${toHex(brighten(g))}${toHex(brighten(b))}`
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.842Z*
