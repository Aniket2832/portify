import { create } from 'zustand'

const defaultData = {
  hero: { name: '', tagline: '', bio: '' },
  skills: [],
  projects: [],
  experience: [],
  contact: { email: '', github: '', linkedin: '' },
}

const defaultSections = [
  { id: 'hero', label: 'Hero', icon: '◈' },
  { id: 'skills', label: 'Skills', icon: '◎' },
  { id: 'projects', label: 'Projects', icon: '⊞' },
  { id: 'experience', label: 'Experience', icon: '≡' },
  { id: 'contact', label: 'Contact', icon: '✉' },
]

export const useEditorStore = create((set) => ({
  portfolioId: null,
  title: 'My Portfolio',
  slug: '',
  published: false,
  template: 'minimal',
  accentColor: '#6366f1',
  data: defaultData,
  sections: defaultSections,
  activeSection: 'hero',
  saved: true,
  saving: false,

  setPortfolio: (id, title, slug, published, template, accentColor, data, sections) => set({
    portfolioId: id,
    title,
    slug,
    published,
    template: template || 'minimal',
    accentColor: accentColor || '#6366f1',
    data: { ...defaultData, ...data },
    sections: sections?.length ? sections : defaultSections,
    saved: true,
  }),

  setActiveSection: (id) => set({ activeSection: id }),
  updateData: (section, value) => set((state) => ({ data: { ...state.data, [section]: value }, saved: false })),
  reorderSections: (sections) => set({ sections, saved: false }),
  setTitle: (title) => set({ title, saved: false }),
  setSlug: (slug) => set({ slug }),
  setPublished: (published) => set({ published }),
  setTemplate: (template) => set({ template, saved: false }),
  setAccentColor: (accentColor) => set({ accentColor, saved: false }),
  setSaving: (saving) => set({ saving }),
  setSaved: (saved) => set({ saved }),
}))