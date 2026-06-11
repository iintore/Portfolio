# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Design Decisions
- **Project Cards Layout**: Changed project cards from portrait/squarish to a clean landscape rectangular aspect ratio (`3:2` or `1.5/1` aspect-ratio on `.project-image`). Removed the card's internal padding and double border-shadow framing ("MacOS generator thumbnail" frame style) so that the thumbnail image spans edge-to-edge. Implemented a subtle `img` scale-up zoom hover transition instead of container scaling to keep the edge-to-edge boundary intact.

