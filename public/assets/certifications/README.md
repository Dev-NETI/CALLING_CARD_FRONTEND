# Certification Logos

This folder contains certification badge images that will be displayed on the calling card.

## Usage

Place your certification logo images in this folder with the following naming convention:
- ISO 9001: `iso-9001.png`
- ISO 14001: `iso-14001.png`
- Other certifications: Use descriptive names in lowercase with hyphens

## Image Requirements

- Format: PNG with transparent background recommended
- Size: 80x80 pixels or larger (will be scaled down automatically)
- Quality: High resolution for crisp display

## Current Certifications

- `iso-9001.png` - ISO 9001 Quality Management certification badge

## Adding New Certifications

To add a new certification badge:
1. Add the image file to this folder
2. Update the FlippableCard component to reference the new image path
3. The component will automatically display the badge in the bottom-right corner of the front side
