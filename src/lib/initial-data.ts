import { VaultItem } from "@/types/vault";

export const INITIAL_VAULT_ITEMS: VaultItem[] = [
  {
    id: "item-1",
    title: "Passport & National ID Scan",
    category: "document",
    fileType: "application/pdf",
    size: 2450000,
    thumbnailUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
    tags: ["personal", "identity", "travel"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    metadata: {
      pageCount: 2,
      notes: "Official identity documents backup.",
    },
  },
  {
    id: "item-2",
    title: "Cyberpunk Cityscape Sunset",
    category: "photo",
    fileType: "image/jpeg",
    size: 4200000,
    content: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop",
    tags: ["photography", "wallpaper", "art"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    metadata: {
      dimensions: "3840 x 2160",
    },
  },
  {
    id: "item-3",
    title: "Minimal Studio Desk Setup",
    category: "photo",
    fileType: "image/png",
    size: 3800000,
    content: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    tags: ["workspace", "minimal", "design"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    metadata: {
      dimensions: "4000 x 3000",
    },
  },
  {
    id: "item-4",
    title: "Project Architecture & Roadmap 2026",
    category: "note",
    fileType: "text/markdown",
    size: 1540,
    content: `# Divyansh's Personal Vault Architecture

- **Security Model**: Client-side AES-256 encrypted local storage with server HttpOnly session cookies.
- **Performance targets**: Next.js App Router, SSR pre-hydration, 100/100 Lighthouse score.
- **Key Modules**:
  1. Photo Lightbox & Multi-format gallery.
  2. PDF / Document encrypted preview.
  3. Quick Markdown & Text Scratchpad.
  4. Encrypted credentials vault.
`,
    tags: ["architecture", "code", "ideas"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "item-5",
    title: "Main Server SSH Private Keys",
    category: "secret",
    fileType: "key",
    size: 450,
    content: "-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn\nNhAAAAAwEAAQAAAYEA3vZ8... [Encrypted Vault Secret]\n-----END OPENSSH PRIVATE KEY-----",
    tags: ["server", "security", "ssh"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    metadata: {
      username: "root@dbvault.internal",
      notes: "Production server access keypair. Keep confidential.",
    },
  },
  {
    id: "item-6",
    title: "Financial Statements Q3 2026",
    category: "document",
    fileType: "application/pdf",
    size: 5120000,
    thumbnailUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
    tags: ["finance", "reports", "important"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    metadata: {
      pageCount: 14,
    },
  },
  {
    id: "item-7",
    title: "Mountain Fog Minimalist Photography",
    category: "photo",
    fileType: "image/jpeg",
    size: 5900000,
    content: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    tags: ["nature", "wallpaper", "minimal"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    metadata: {
      dimensions: "6000 x 4000",
    },
  },
];
