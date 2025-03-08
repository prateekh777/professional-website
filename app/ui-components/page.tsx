import { Metadata } from 'next'
import { UIShowcase } from '@/components/ui-showcase'

export const metadata: Metadata = {
  title: 'UI Components | Professional Website',
  description: 'Showcase of UI components used in the professional website',
}

export default function UIComponentsPage() {
  return (
    <main className="py-12">
      <UIShowcase />
    </main>
  )
} 