import { SITE_NAME, SITE_URL } from './site';

/**
 * Per-tool SEO + AdSense content.
 * Each entry powers <title>, meta description, JSON-LD, and on-page article/FAQ blocks.
 */
export const TOOL_SEO = {
  merge: {
    path: '/merge',
    title: `Merge PDF Online Free — Combine Multiple PDFs | ${SITE_NAME}`,
    description:
      'Merge PDF files online for free. Combine multiple PDFs into one document in any order. 100% browser-based — your files never leave your device.',
    keywords:
      'merge pdf, combine pdf, merge pdf online free, join pdf files, pdf merger, merge multiple pdf',
    h1: 'Merge PDF online',
    eyebrow: 'PDF Merge Tool',
    intro:
      'Combine multiple PDF files into a single document. Reorder pages before merging and download the result instantly — privately in your browser.',
    related: ['split', 'organize', 'compress'],
    sections: [
      {
        heading: 'Why merge PDFs with PDFCraft?',
        paragraphs: [
          'Merging PDFs is one of the most common document tasks — combining invoices, reports, scanned pages, or contract attachments into one file for email or filing. PDFCraft lets you merge PDF online without creating an account or uploading documents to a remote server.',
          'Unlike many online PDF mergers, every file stays in your browser memory. That means faster privacy for sensitive paperwork such as tax forms, medical records, or signed agreements.',
        ],
      },
      {
        heading: 'How to merge PDF files',
        paragraphs: [
          'Upload two or more PDF files using drag and drop or the file picker. Arrange them in the order you want with drag handles or move buttons. Click Merge to generate a single PDF and download it to your device.',
          'You can remove a file from the list at any time before merging. Large batches are limited to keep browser performance stable.',
        ],
      },
      {
        heading: 'Tips for clean merged documents',
        paragraphs: [
          'Put cover pages or tables of contents first, then body chapters. If page sizes differ, the merged file keeps each original page size. Compress the result afterward if you need a smaller attachment for email.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is it free to merge PDF files on PDFCraft?',
        a: 'Yes. Merge PDF is free to use. There is no signup and no per-file fee.',
      },
      {
        q: 'Are my PDFs uploaded to a server?',
        a: 'No. Merging runs entirely in your browser with client-side libraries. Files are not sent to PDFCraft servers.',
      },
      {
        q: 'Can I change the order of PDFs before merging?',
        a: 'Yes. Drag files or use the up/down controls to set the exact merge order.',
      },
      {
        q: 'What is the maximum number of files I can merge?',
        a: 'You can merge up to 20 PDFs in one session, with a combined size limit designed for reliable browser processing.',
      },
    ],
  },

  split: {
    path: '/split',
    title: `Split PDF Online Free — Extract Pages from PDF | ${SITE_NAME}`,
    description:
      'Split a PDF into separate files or extract page ranges online for free. Private, browser-based PDF splitter — no uploads required.',
    keywords: 'split pdf, extract pdf pages, split pdf online free, pdf splitter, separate pdf pages',
    h1: 'Split PDF online',
    eyebrow: 'PDF Split Tool',
    intro:
      'Divide one PDF into multiple files or extract only the pages you need. Choose ranges, then download — all processing stays on your device.',
    related: ['merge', 'organize', 'rotate'],
    sections: [
      {
        heading: 'When to split a PDF',
        paragraphs: [
          'Split PDFs when you need to send only a chapter, pull out an invoice page, or break a large scan into smaller attachments. PDFCraft’s split tool lets you select page ranges and download separate PDFs without uploading your document.',
        ],
      },
      {
        heading: 'How to split a PDF online',
        paragraphs: [
          'Upload your PDF, enter page ranges (for example 1-3, 5, 8-10), and run the split. Each range becomes its own downloadable PDF. Everything happens locally in your browser.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I extract a single page from a PDF?',
        a: 'Yes. Enter that page number as the range (for example “4”) and download a one-page PDF.',
      },
      {
        q: 'Does splitting reduce quality?',
        a: 'No. Pages are copied as PDF content. We do not re-encode pages as images when splitting.',
      },
      {
        q: 'Is the split PDF tool private?',
        a: 'Yes. Your file never leaves your browser during the split process.',
      },
    ],
  },

  compress: {
    path: '/compress',
    title: `Compress PDF Online Free — Reduce PDF File Size | ${SITE_NAME}`,
    description:
      'Compress PDF online to reduce file size for email and storage. Free browser-based PDF compressor with quality levels. Files stay on your device.',
    keywords: 'compress pdf, reduce pdf size, compress pdf online free, pdf compressor, shrink pdf',
    h1: 'Compress PDF online',
    eyebrow: 'PDF Compress Tool',
    intro:
      'Shrink large PDFs for easier sharing. Choose a compression level, preview the savings, and download a smaller file — processed locally.',
    related: ['merge', 'pdf-to-image', 'organize'],
    sections: [
      {
        heading: 'Why compress a PDF?',
        paragraphs: [
          'Email gateways and upload forms often reject large attachments. Compressing a PDF reduces file size so you can share scanned documents, slide decks, or image-heavy reports more easily.',
          'PDFCraft compresses in the browser. Note that aggressive compression may rasterize pages (text becomes part of an image) — choose High quality when you need sharper results.',
        ],
      },
      {
        heading: 'How PDF compression works here',
        paragraphs: [
          'Pick Extreme, Recommended, or High quality. The tool rebuilds pages at a chosen resolution and JPEG quality, then downloads the smaller PDF. Progress is shown page by page.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Will compression make text unsearchable?',
        a: 'Strong compression may rasterize pages, which can remove selectable text. Use a milder level when you need searchable PDFs.',
      },
      {
        q: 'Is compress PDF free?',
        a: 'Yes. You can compress PDFs on PDFCraft at no cost without creating an account.',
      },
      {
        q: 'Do you upload my file to compress it?',
        a: 'No. Compression runs locally in your browser.',
      },
    ],
  },

  crop: {
    path: '/crop',
    title: `Crop PDF Online Free — Trim PDF Margins | ${SITE_NAME}`,
    description:
      'Crop PDF pages online for free. Trim margins or focus on a region. Client-side cropping keeps your documents private — no server uploads.',
    keywords: 'crop pdf, trim pdf, crop pdf online free, remove pdf margins, pdf cropper',
    h1: 'Crop PDF online',
    eyebrow: 'PDF Crop Tool',
    intro:
      'Trim unwanted margins or focus on a region of each page. Draw a crop box, adjust handles, and download a tighter PDF — privately on your device.',
    related: ['label-crop', 'rotate', 'organize'],
    sections: [
      {
        heading: 'Crop PDFs without uploading',
        paragraphs: [
          'Scanned documents often include dark borders or excess whitespace. PDFCraft’s crop tool lets you select the visible area and apply it across pages. Processing uses your browser, so confidential files stay on your computer.',
        ],
      },
      {
        heading: 'How to crop a PDF',
        paragraphs: [
          'Upload a PDF, drag to draw a crop rectangle, resize with corner handles, then download. Escape clears the selection if you need to start over.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Does cropping lower image quality?',
        a: 'Cropping adjusts page boxes. It does not re-encode page content as a new image for the crop operation itself.',
      },
      {
        q: 'Can I crop shipping labels?',
        a: 'For Flipkart/Meesho A4 labels, use the dedicated Label Crop tool for automatic 4×6 output.',
      },
    ],
  },

  'label-crop': {
    path: '/label-crop',
    title: `Label Crop PDF — Flipkart & Meesho Shipping Labels | ${SITE_NAME}`,
    description:
      'Auto-crop Flipkart or Meesho A4 shipping labels into 4×6 thermal printer PDFs. Free, private, browser-based label cropper.',
    keywords:
      'label crop, flipkart label crop, meesho label pdf, 4x6 shipping label, thermal printer pdf',
    h1: 'Label Crop for shipping PDFs',
    eyebrow: 'Label Crop Tool',
    intro:
      'Turn A4 marketplace shipping labels into clean 4×6 thermal-ready PDFs. Choose Flipkart or Meesho, upload your label PDF, and download printer-friendly pages.',
    related: ['crop', 'organize', 'rotate'],
    sections: [
      {
        heading: 'Built for Indian marketplace labels',
        paragraphs: [
          'Sellers often receive A4 PDFs that mix the shipping label with invoices. Label Crop detects the label region and exports pages sized for common 4×6 thermal printers — without uploading order data to a server.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Which platforms are supported?',
        a: 'Choose Flipkart or Meesho first, then upload your A4 label PDF. Each preset uses the crop rules for that marketplace.',
      },
      {
        q: 'Is order data sent online?',
        a: 'No. Label detection and cropping run in your browser only.',
      },
    ],
  },

  edit: {
    path: '/edit',
    title: `Edit PDF Online Free — Add Text, Images & Shapes | ${SITE_NAME}`,
    description:
      'Edit PDF online for free: add text, images, shapes, and drawings. Annotate PDFs privately in your browser with PDFCraft.',
    keywords: 'edit pdf, annotate pdf, add text to pdf, pdf editor online free, draw on pdf',
    h1: 'Edit PDF online',
    eyebrow: 'PDF Edit Tool',
    intro:
      'Add text, images, shapes, and freehand drawings to your PDF. Export an annotated file without uploading your document.',
    related: ['rotate', 'organize', 'protect'],
    sections: [
      {
        heading: 'What you can edit',
        paragraphs: [
          'PDFCraft’s editor is designed for annotations and markups — stamps, notes, highlights via shapes, inserted images, and typed text. It is ideal for feedback, forms-style notes, and quick visual edits.',
          'For restructuring pages, use Organize PDF. For passwords, use Protect PDF after you finish editing.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I edit existing PDF text like Word?',
        a: 'This tool adds annotations on top of pages. It does not rewrite the original embedded text flow like a full desktop publisher.',
      },
      {
        q: 'Are edits private?',
        a: 'Yes. Editing and export run locally in your browser.',
      },
    ],
  },

  rotate: {
    path: '/rotate',
    title: `Rotate PDF Online Free — Fix Sideways Pages | ${SITE_NAME}`,
    description:
      'Rotate PDF pages left or right online for free. Fix scanned pages that are sideways or upside down. Private browser-based tool.',
    keywords: 'rotate pdf, rotate pdf pages, fix sideways pdf, rotate pdf online free',
    h1: 'Rotate PDF online',
    eyebrow: 'PDF Rotate Tool',
    intro:
      'Rotate pages 90° at a time to fix scans and exports. Apply to all pages or selected ranges, then download the corrected PDF.',
    related: ['organize', 'crop', 'split'],
    sections: [
      {
        heading: 'Fix orientation in seconds',
        paragraphs: [
          'Phone scans and mixed printers often produce sideways pages. Rotate PDF lets you correct orientation before sharing or printing — without installing desktop software.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I rotate only some pages?',
        a: 'Yes. Enter a page range to rotate selected pages, or rotate the entire document.',
      },
    ],
  },

  compare: {
    path: '/compare',
    title: `Compare PDF Online Free — Spot Document Differences | ${SITE_NAME}`,
    description:
      'Compare two PDF versions side by side. Spot text changes between document revisions. Free and private — files stay in your browser.',
    keywords: 'compare pdf, pdf diff, compare two pdfs, pdf version compare, spot pdf changes',
    h1: 'Compare PDF documents',
    eyebrow: 'PDF Compare Tool',
    intro:
      'Load an original and a revised PDF to review pages side by side or inspect text differences. Useful for contracts, policies, and proofreading.',
    related: ['merge', 'organize', 'edit'],
    sections: [
      {
        heading: 'Side-by-side and text diff views',
        paragraphs: [
          'Upload two files, align on a page, and switch between visual comparison and text-diff mode. Text extraction runs locally so drafts never leave your machine.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Does compare work on scanned image PDFs?',
        a: 'Visual side-by-side works for any pages that render. Text diff needs extractable text (not pure image scans without OCR).',
      },
    ],
  },

  organize: {
    path: '/organize',
    title: `Organize PDF Online Free — Reorder, Delete & Add Pages | ${SITE_NAME}`,
    description:
      'Organize PDF pages online: reorder, delete, or insert pages. Free drag-and-drop PDF organizer that runs privately in your browser.',
    keywords: 'organize pdf, reorder pdf pages, delete pdf pages, rearrange pdf, pdf page manager',
    h1: 'Organize PDF pages',
    eyebrow: 'PDF Organize Tool',
    intro:
      'Sort, remove, or insert pages with a visual page grid. Drag thumbnails into place and export a cleaned-up PDF.',
    related: ['merge', 'split', 'rotate'],
    sections: [
      {
        heading: 'Full control over page order',
        paragraphs: [
          'Organize PDF is the right tool when a scan is out of order, you need to drop blank pages, or you want to insert pages from another PDF. Thumbnail previews help you see the final structure before download.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I delete multiple pages at once?',
        a: 'Yes. Select pages in the grid, then remove them before exporting the organized PDF.',
      },
    ],
  },

  'pdf-to-image': {
    path: '/pdf-to-image',
    title: `PDF to Image Online Free — Convert PDF to PNG or JPG | ${SITE_NAME}`,
    description:
      'Convert PDF to PNG or JPEG online for free. Export pages as images or a ZIP. Private conversion in your browser — no uploads.',
    keywords: 'pdf to image, pdf to png, pdf to jpg, convert pdf to image, pdf to jpeg online free',
    h1: 'Convert PDF to images',
    eyebrow: 'PDF to Image',
    intro:
      'Export PDF pages as PNG or JPEG at the resolution you choose. Download single images or a ZIP of every page.',
    related: ['image-to-pdf', 'compress', 'split'],
    sections: [
      {
        heading: 'Use cases for PDF to image',
        paragraphs: [
          'Designers and social teams often need page snapshots. Students extract slides as images. Support teams attach a single page screenshot. PDFCraft converts locally so confidential decks stay private.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Which image formats are supported?',
        a: 'You can export pages as PNG or JPEG and download them individually or as a ZIP archive.',
      },
    ],
  },

  'image-to-pdf': {
    path: '/image-to-pdf',
    title: `Image to PDF Online Free — JPG PNG to PDF | ${SITE_NAME}`,
    description:
      'Convert JPG, PNG, or WEBP images to a single PDF online for free. Reorder images, then download. 100% browser-based.',
    keywords: 'image to pdf, jpg to pdf, png to pdf, convert images to pdf, photos to pdf online free',
    h1: 'Convert images to PDF',
    eyebrow: 'Image to PDF',
    intro:
      'Combine photos or screenshots into one PDF. Reorder images, then download a clean document — no upload required.',
    related: ['pdf-to-image', 'merge', 'compress'],
    sections: [
      {
        heading: 'From photos to a shareable PDF',
        paragraphs: [
          'Drop JPG, PNG, or WEBP files, drag to reorder, and create a multi-page PDF for emailing receipts, ID scans, or portfolios.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What image types can I convert?',
        a: 'JPG/JPEG, PNG, and WEBP are supported within the per-file and batch size limits.',
      },
    ],
  },

  'pdf-to-markdown': {
    path: '/pdf-to-markdown',
    title: `PDF to Markdown Online Free — Extract Text to MD | ${SITE_NAME}`,
    description:
      'Convert PDF text to Markdown online for free. Extract headings and lists when possible. Private, browser-based PDF to MD tool.',
    keywords: 'pdf to markdown, convert pdf to md, extract pdf text, pdf to md online free',
    h1: 'Convert PDF to Markdown',
    eyebrow: 'PDF to Markdown',
    intro:
      'Pull text from a PDF into Markdown for notes, docs, or blogs. Extraction runs locally on your device.',
    related: ['markdown-to-pdf', 'pdf-to-image', 'compare'],
    sections: [
      {
        heading: 'From PDF to editable Markdown',
        paragraphs: [
          'Useful when you want to reuse report text in a knowledge base or README. Complex layouts may need light cleanup after export.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Does this work on scanned PDFs?',
        a: 'Text extraction needs a text layer. Pure image scans without OCR will not yield useful Markdown.',
      },
    ],
  },

  'markdown-to-pdf': {
    path: '/markdown-to-pdf',
    title: `Markdown to PDF Online Free — MD to PDF Converter | ${SITE_NAME}`,
    description:
      'Convert Markdown to PDF online for free. Paste or upload .md, pick a typeface, and download a clean PDF. Runs in your browser.',
    keywords: 'markdown to pdf, md to pdf, convert markdown to pdf online free, readme to pdf',
    h1: 'Convert Markdown to PDF',
    eyebrow: 'Markdown to PDF',
    intro:
      'Paste Markdown or upload a .md file, choose a typeface, preview the result, and download a polished PDF.',
    related: ['pdf-to-markdown', 'image-to-pdf', 'merge'],
    sections: [
      {
        heading: 'Publish notes as PDF',
        paragraphs: [
          'Turn README files, meeting notes, or blog drafts into shareable PDFs with headings, lists, and code-friendly fonts — without a desktop toolchain.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I upload a .md file?',
        a: 'Yes. Switch to Upload mode or paste Markdown directly into the editor.',
      },
    ],
  },

  protect: {
    path: '/protect',
    title: `Protect PDF Online Free — Password Protect PDF | ${SITE_NAME}`,
    description:
      'Password protect a PDF online with AES-256 encryption. Lock printing or copying permissions. Free and private — encryption runs in your browser.',
    keywords: 'protect pdf, password protect pdf, encrypt pdf, lock pdf, pdf password online free',
    h1: 'Protect PDF with a password',
    eyebrow: 'PDF Protect Tool',
    intro:
      'Add a password and control printing, copying, and modifying. Encryption happens locally with AES-256 before you download the locked file.',
    related: ['unlock', 'edit', 'compress'],
    sections: [
      {
        heading: 'Secure PDFs before sharing',
        paragraphs: [
          'Use Protect PDF when emailing contracts, payslips, or confidential reports. Choose a strong password and store it safely — PDFCraft never sees your password or file.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What encryption is used?',
        a: 'PDFCraft uses AES-256 based encryption via browser crypto APIs for password protection.',
      },
      {
        q: 'Can I restrict printing?',
        a: 'Yes. You can allow or disallow printing, copying, and modifying when protecting the file.',
      },
    ],
  },

  unlock: {
    path: '/unlock',
    title: `Unlock PDF Online Free — Remove PDF Password | ${SITE_NAME}`,
    description:
      'Unlock a password-protected PDF online when you know the password. Remove PDF encryption privately in your browser.',
    keywords: 'unlock pdf, remove pdf password, decrypt pdf, open password pdf, unlock pdf online free',
    h1: 'Unlock PDF online',
    eyebrow: 'PDF Unlock Tool',
    intro:
      'Remove password protection from a PDF when you already know the password. Decryption runs locally — we never store your credentials.',
    related: ['protect', 'compress', 'merge'],
    sections: [
      {
        heading: 'Open PDFs you own',
        paragraphs: [
          'Unlock is for documents you are authorized to open. Enter the known password, decrypt in the browser, and download an unprotected copy for editing or merging.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can PDFCraft crack unknown passwords?',
        a: 'No. You must provide the correct password. The tool does not brute-force or bypass security.',
      },
    ],
  },
};

export const STATIC_SEO = {
  home: {
    path: '/',
    title: `${SITE_NAME} — Free Private PDF Tools Online (No Upload)`,
    description: `${SITE_NAME}: merge, split, compress, crop, convert, edit, protect & unlock PDFs free in your browser. Files never leave your device.`,
    keywords:
      'pdf tools, merge pdf, split pdf, compress pdf, crop pdf, edit pdf, protect pdf, free pdf online, private pdf',
  },
  tools: {
    path: '/tools',
    title: `All PDF Tools — Free Online Toolkit | ${SITE_NAME}`,
    description:
      'Browse every PDFCraft tool: organize, convert, edit, and secure PDFs. Free, fast, and private browser-based PDF utilities.',
    keywords: 'pdf toolkit, all pdf tools, free pdf utilities',
  },
  about: {
    path: '/about',
    title: `About ${SITE_NAME} — Privacy-First PDF Toolkit`,
    description:
      'Learn why PDFCraft processes PDFs in your browser, never on a server. Our mission is private, free document tools for everyone.',
    keywords: 'about pdfcraft, private pdf tools, client-side pdf',
  },
  contact: {
    path: '/contact',
    title: `Contact ${SITE_NAME} — Support & Feedback`,
    description: `Contact the PDFCraft team for support, feedback, or partnership questions. We reply by email.`,
    keywords: 'contact pdfcraft, pdf tools support',
  },
  privacy: {
    path: '/privacy',
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      'PDFCraft privacy policy: documents are processed locally. Learn how cookies and Google AdSense work on our site.',
    keywords: 'pdfcraft privacy policy, adsense cookies',
  },
  terms: {
    path: '/terms',
    title: `Terms of Service | ${SITE_NAME}`,
    description: `Terms of use for ${SITE_NAME} free browser-based PDF tools.`,
    keywords: 'pdfcraft terms of service',
  },
  guide: {
    path: '/guide',
    title: `PDF Help Guide & FAQ — How to Use ${SITE_NAME}`,
    description:
      'Step-by-step guides and FAQs for merging, splitting, compressing, cropping, converting, and protecting PDFs with PDFCraft.',
    keywords: 'pdf guide, how to merge pdf, how to compress pdf, pdf faq',
  },
  notFound: {
    path: '/404',
    title: `Page Not Found | ${SITE_NAME}`,
    description: 'The page you requested does not exist. Browse free PDF tools on PDFCraft.',
    keywords: '404',
    noIndex: true,
  },
};

export function getToolSeo(toolId) {
  return TOOL_SEO[toolId] || null;
}

export function absoluteUrl(path = '/') {
  if (!path.startsWith('/')) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path === '/' ? '/' : path}`;
}

export function allSitemapEntries() {
  const staticPaths = Object.values(STATIC_SEO)
    .filter((e) => !e.noIndex)
    .map((e) => e.path);
  const toolPaths = Object.values(TOOL_SEO).map((e) => e.path);
  return [...new Set([...staticPaths, ...toolPaths])];
}
