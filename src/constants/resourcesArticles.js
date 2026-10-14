import { SITE_NAME } from './site';

/**
 * Long-form articles for AdSense content quality + SEO.
 * Keep copy original, practical, and free of keyword stuffing.
 */
export const RESOURCES_ARTICLES = [
  {
    slug: 'why-browser-pdf-tools',
    path: '/resources/why-browser-pdf-tools',
    title: `Why Browser-Based PDF Tools Are Safer Than Upload Sites | ${SITE_NAME}`,
    description:
      'Learn how client-side PDF tools work, why they protect invoices and IDs better than upload converters, and when to use PDFCraft on croppdf.netlify.app.',
    keywords: 'browser pdf tools, private pdf online, client-side pdf, no upload pdf',
    published: '2026-08-01',
    updated: '2026-08-24',
    category: 'Privacy',
    h1: 'Why browser-based PDF tools are safer than upload sites',
    summary:
      'Most free PDF websites ask you to upload files to a remote server. PDFCraft takes a different approach: your documents stay in the browser from open to download.',
    sections: [
      {
        heading: 'The hidden risk of “free online PDF converters”',
        paragraphs: [
          'When a site asks you to upload a PDF, your file is sent over the internet to a machine you do not control. That machine may store the file temporarily, log metadata, or keep backups for abuse prevention. Even when a provider promises deletion, you still trusted a third party with contracts, tax invoices, shipping labels, student IDs, or medical forms.',
          'For many everyday tasks—merging two reports, compressing a scan for email, rotating a scan from a phone—the upload step is unnecessary. Modern browsers can read PDF bytes, render pages on a canvas, and write a new PDF entirely on your device.',
        ],
      },
      {
        heading: 'How client-side processing works on PDFCraft',
        paragraphs: [
          `${SITE_NAME} loads open-source libraries such as pdf.js and pdf-lib into your tab. When you choose a file, the browser reads it into memory. Transformations (merge, split, crop, compress, encrypt) happen locally. The download button simply saves a blob from that same session.`,
          'Closing the tab ends the session. We do not operate a document processing API that receives your PDFs. Our servers deliver the website assets (HTML, JavaScript, images). Advertising partners may use cookies for relevant ads, but they never receive the PDF bytes you process—see our Privacy Policy for details.',
        ],
      },
      {
        heading: 'When private tools matter most',
        paragraphs: [
          'Use browser-based tools when documents contain personal data: Aadhaar or passport scans, bank statements, employee agreements, customer addresses on shipping labels, or unpublished research. Students and freelancers benefit when they need a quick fix without installing desktop software or creating yet another account.',
          'Upload-based services can still make sense for huge enterprise workflows with audited contracts. For personal and small-business PDF chores, keeping files local is the simpler default.',
        ],
      },
      {
        heading: 'Practical tips for a smooth experience',
        paragraphs: [
          'Use a current version of Chrome, Edge, Firefox, or Safari. Keep individual files within the size limits shown on each tool page so the browser stays responsive. For password-protected PDFs, unlock only on a device you trust. After you finish, clear downloads from shared computers.',
          `Start with Merge, Split, Compress, or Crop from the homepage toolkit, or read the Help Guide for step-by-step walkthroughs. Every tool on croppdf.netlify.app follows the same privacy-first model.`,
        ],
      },
    ],
  },
  {
    slug: 'compress-merge-split-everyday',
    path: '/resources/compress-merge-split-everyday',
    title: `Everyday PDF Workflows: Compress, Merge & Split Without Software | ${SITE_NAME}`,
    description:
      'Learn when to compress PDFs for email, how to merge reports in order, and how to split long scans into smaller files—using free private tools in your browser.',
    keywords: 'compress pdf email, merge pdf online free, split pdf pages, pdf workflow guide',
    published: '2026-08-15',
    updated: '2026-08-24',
    category: 'Workflows',
    h1: 'Everyday PDF workflows: compress, merge, and split',
    summary:
      'Three tasks cover most personal and office PDF needs. Here is how to choose the right tool and get predictable results without installing software.',
    sections: [
      {
        heading: 'Compress when email or portals reject large files',
        paragraphs: [
          'Phone scans and photo-heavy PDFs balloon in size. Many email providers and government or university portals cap attachments around 10–25 MB. Compress PDF on PDFCraft offers quality presets so you can trade a little visual fidelity for a smaller file. Start with the recommended preset; use extreme only when size still exceeds the limit.',
          'Compression runs locally. After download, open the result once to confirm text remains readable. Extremely low settings can blur small fonts—re-run with a higher-quality preset if needed.',
        ],
      },
      {
        heading: 'Merge when reviewers want a single attachment',
        paragraphs: [
          'Hiring managers, landlords, and clients often prefer one PDF instead of five attachments. Merge PDF lets you add multiple files, drag to reorder, then download a combined document. Put the cover letter or summary first, then supporting pages, so readers see context immediately.',
          'If one source file is password-protected, unlock it first (with the password you know), then merge. PDFCraft does not crack unknown passwords.',
        ],
      },
      {
        heading: 'Split when you only need a few pages',
        paragraphs: [
          'Long scanned books, multi-chapter reports, or bulk invoices are easier to share as ranges. Split PDF accepts ranges such as 1-3, 5, 8-10 and produces separate downloads. Use it before emailing only the chapters someone requested, or before sending a single invoice page from a monthly batch.',
          'For rearranging pages inside one file without splitting into many downloads, use Organize PDF to reorder or delete pages, then save once.',
        ],
      },
      {
        heading: 'A simple weekly routine',
        paragraphs: [
          'Download or scan documents into a folder, compress anything destined for email, merge related files for archives, and split only what others need. Protect sensitive finals with a password before sharing outside your team. Rotate crooked phone scans before merging so the combined PDF looks professional.',
          `All of these tools are free on croppdf.netlify.app and process files in the browser. Explore the full catalog or open the Help Guide whenever you need a refresher.`,
        ],
      },
    ],
  },
];

export function getResourceArticle(slug) {
  return RESOURCES_ARTICLES.find((a) => a.slug === slug) || null;
}
