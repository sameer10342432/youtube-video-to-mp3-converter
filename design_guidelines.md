# YouTube to MP3 Converter - Design Guidelines

## Design Approach

**System Choice: Material Design 3 with utility-focused adaptation**

This conversion tool prioritizes efficiency, clarity, and trust. Material Design 3 provides the necessary feedback systems (progress indicators, state changes) while maintaining a clean, professional aesthetic that reassures users during the conversion process.

Reference inspiration: Draw from successful converter tools like CloudConvert and OnlineVideoConverter for their streamlined, single-purpose interfaces.

## Typography System

**Font Family:**
- Primary: Inter (Google Fonts)
- Monospace: JetBrains Mono (for file names, technical info)

**Type Scale:**
- Hero heading: text-4xl md:text-5xl, font-bold
- Section heading: text-2xl md:text-3xl, font-semibold  
- Body text: text-base, font-normal
- Labels: text-sm, font-medium
- Technical info: text-sm, font-mono

## Layout & Spacing System

**Tailwind Spacing Primitives:** Use units of 4, 6, 8, 12, 16, 24

**Container Strategy:**
- Main container: max-w-3xl mx-auto (focused, single-column experience)
- Section padding: py-12 md:py-16
- Component spacing: space-y-8 for vertical rhythm
- Card padding: p-6 md:p-8

**Grid System:**
- Single column layout throughout (no multi-column needed for this utility)
- Mobile-first responsive approach

## Component Library

### Hero Section
- Centered layout with max-w-2xl
- Large heading explaining the tool's purpose
- Subheading with key benefits (Fast, Free, No Registration)
- Prominent converter card immediately below (no need to scroll)
- Background: Subtle gradient or geometric pattern
- Height: Natural content height, not forced viewport

### Converter Card (Primary Component)
- Elevated card with shadow (shadow-xl)
- Rounded corners: rounded-2xl
- Contains:
  - URL input field (large, prominent, with placeholder)
  - Convert button (full width on mobile, auto on desktop)
  - Progress bar component (hidden until active)
  - File info display (size, duration when available)
  - Download button (appears when ready)

### Input Field
- Large touch target: h-14
- Border: 2px solid with focus ring
- Rounded: rounded-xl
- Padding: px-4
- Font size: text-lg
- Clear button (X) when text is present

### Convert Button
- Height: h-14
- Full rounded: rounded-full
- Font: text-lg font-semibold
- Width: w-full md:w-auto md:px-12
- Disabled state when invalid URL

### Progress Indicator
- Linear progress bar with percentage
- Shows current step: "Fetching video... / Extracting audio... / Converting to MP3..."
- Animated pulse during processing
- File size estimate below progress bar

### Download Section
- Success state with checkmark icon
- File name display in monospace
- File size badge
- Large download button
- Secondary "Convert Another" button below

### Feature Cards (Below Converter)
- Grid: grid-cols-1 md:grid-cols-3
- Icons: Use Heroicons (consistent throughout)
- Each card: rounded-xl, p-6
- Icon size: w-12 h-12
- Features: "Fast Conversion", "High Quality Audio", "No Registration Required"

### Error States
- Alert component: rounded-lg, p-4
- Error icon + message
- Helpful suggestion text
- Retry button when applicable

### Footer
- Simple, minimal footer
- Terms & Privacy links
- Disclaimer about copyright compliance
- Social links (optional)
- Max-width: max-w-7xl

## Animations

**Minimal, purposeful motion only:**
- Input focus: Smooth border transition (150ms)
- Button press: Scale down slightly (95%)
- Progress bar: Smooth width animation
- Success state: Gentle fade-in with slide-up
- No scroll animations or decorative effects

## Images

**Hero Background Image:**
- Subtle abstract audio waveform visualization or music-themed pattern
- Low opacity overlay to ensure text readability
- Position: Behind hero text, full-width
- Size: Desktop hero height (~60vh), natural on mobile

**Feature Section Icons:**
- Use Heroicons library for all icons
- No custom images needed in feature cards

**No additional images required** - this utility tool prioritizes clarity and speed over visual storytelling.

## Accessibility

- All form inputs include visible labels
- Error messages use ARIA live regions
- Progress updates announced to screen readers
- Keyboard navigation throughout (Tab order: Input → Convert → Download)
- Focus indicators clearly visible
- Button states (disabled/loading) properly communicated
- Touch targets minimum 44x44px on mobile

## Key Design Principles

1. **Trust Through Clarity:** Every state change is clearly communicated
2. **Single-Task Focus:** No distractions, converter is the hero
3. **Progressive Disclosure:** Show info only when relevant (file details appear after validation)
4. **Speed Perception:** Fast transitions and immediate feedback reduce perceived wait time
5. **Mobile-First Utility:** Touch-friendly targets, thumb-zone placement for primary actions