"use client"

import React from 'react'
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from '@/lib/utils'

const gridLayoutVariants = cva(
  "grid w-full",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
        auto: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-auto-fill",
        custom: "", // For custom grid templates
      },
      gap: {
        none: "gap-0",
        xs: "gap-2",
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-10",
        responsive: "gap-4 md:gap-6 lg:gap-8",
      },
      rowGap: {
        none: "row-gap-0",
        xs: "row-gap-2",
        sm: "row-gap-4",
        md: "row-gap-6",
        lg: "row-gap-8",
        xl: "row-gap-10",
      },
      colGap: {
        none: "col-gap-0",
        xs: "col-gap-2",
        sm: "col-gap-4",
        md: "col-gap-6",
        lg: "col-gap-8",
        xl: "col-gap-10",
      },
      layout: {
        default: "",
        masonry: "masonry-grid", // Requires additional CSS
        autoFit: "grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]",
        autoFill: "grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
      flow: {
        row: "grid-flow-row",
        col: "grid-flow-col",
        dense: "grid-flow-dense",
        rowDense: "grid-flow-row-dense",
        colDense: "grid-flow-col-dense",
      },
    },
    defaultVariants: {
      cols: 3,
      gap: "md",
      layout: "default",
      align: "stretch",
      justify: "start",
      flow: "row",
    },
  }
)

export interface GridLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridLayoutVariants> {
  children: React.ReactNode
  minItemWidth?: number // For autoFit/autoFill layouts
  maxColumns?: number
  gridTemplateColumns?: string // For custom grid templates
  gridTemplateRows?: string
  gridTemplateAreas?: string
  gridAutoRows?: string
  gridAutoColumns?: string
  responsive?: boolean
}

export function GridLayout({
  className,
  cols,
  gap,
  rowGap,
  colGap,
  layout,
  align,
  justify,
  flow,
  children,
  minItemWidth = 300,
  maxColumns,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridAutoRows,
  gridAutoColumns,
  responsive = true,
  ...props
}: GridLayoutProps) {
  // Generate custom styles for advanced grid layouts
  const customStyles: React.CSSProperties = {}
  
  if (cols === 'custom' && gridTemplateColumns) {
    customStyles.gridTemplateColumns = gridTemplateColumns
  }
  
  if (gridTemplateRows) {
    customStyles.gridTemplateRows = gridTemplateRows
  }
  
  if (gridTemplateAreas) {
    customStyles.gridTemplateAreas = gridTemplateAreas
  }
  
  if (gridAutoRows) {
    customStyles.gridAutoRows = gridAutoRows
  }
  
  if (gridAutoColumns) {
    customStyles.gridAutoColumns = gridAutoColumns
  }
  
  // For autoFit/autoFill layouts with custom minItemWidth
  if ((layout === 'autoFit' || layout === 'autoFill') && minItemWidth) {
    const autoLayoutType = layout === 'autoFit' ? 'auto-fit' : 'auto-fill'
    const maxColConstraint = maxColumns ? `,${maxColumns}fr)` : ',1fr)'
    customStyles.gridTemplateColumns = `repeat(${autoLayoutType}, minmax(min(100%, ${minItemWidth}px)${maxColConstraint}`
  }
  
  return (
    <div
      className={cn(
        gridLayoutVariants({ cols, gap, rowGap, colGap, layout, align, justify, flow }),
        responsive && 'grid-responsive',
        className
      )}
      style={customStyles}
      {...props}
    >
      {children}
    </div>
  )
}

// Add this to your global CSS for masonry layout support
// .masonry-grid {
//   display: grid;
//   grid-template-rows: masonry;
//   align-tracks: stretch;
// }
// 
// @supports not (grid-template-rows: masonry) {
//   .masonry-grid {
//     columns: 1;
//   }
//   
//   @media (min-width: 640px) {
//     .masonry-grid {
//       columns: 2;
//     }
//   }
//   
//   @media (min-width: 1024px) {
//     .masonry-grid {
//       columns: 3;
//     }
//   }
//   
//   .masonry-grid > * {
//     break-inside: avoid;
//     margin-bottom: 1rem;
//   }
// } 