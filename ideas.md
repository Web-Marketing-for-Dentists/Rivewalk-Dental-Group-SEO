# Riverwalk Dental Group — faithful recreation

The current task replaces the previous Dr Abrahams landing page in this attached project with an editable copy of https://www.riverwalkdentalgroup.com/. The prior design remains recoverable through the project's previous checkpoint.

## Design direction

The live Riverwalk site is the design authority. Preserve its turquoise navigation, muted coastal-teal headings, white background, Varela Round display font, Noto Serif body font, square-edged buttons, spacing, original photography and autoplay office-tour video. No new visual direction or rewritten marketing content is introduced.

## Scope

Copy all 58 unique public pages from the source sitemap and footer links, retaining their original paths. Copy the 70 original public media files into independent project-managed storage. Keep page markup directly editable under `client/src/content/`. The original compiled CSS is preserved under `client/src/styles/riverwalk.css`.

## Intentional differences

- Original Google Tag Manager, Facebook pixel, PatientLoop tracking and Basin vendor scripts are not reused. These integrations require the practice's own access and configuration.
- Contact forms never submit to the original vendor endpoint. They validate input and clearly report that this preview does not send messages until a new `VITE_CONTACT_FORM_ENDPOINT` is configured.
- Hidden mobile navigation is made inert for better keyboard behavior. Reduced-motion preferences are respected.
- A malformed original favicon URL is repaired.
- A legacy laser-dentistry link is normalized to the preventive-care page, matching the source site's existing redirect.
- Preview/staging indexing is disabled by default. Production builds provide full static HTML, per-page SEO metadata, structured data, and a unique 58-URL sitemap. Set `VITE_ALLOW_INDEXING=true` only when replacing the original domain.
