"use client"

import { useDroppable } from "@dnd-kit/core"
import { ReactNode } from "react"

interface DroppableColumnProps {
  id: string
  children: ReactNode
  className?: string
}

export function DroppableColumn({ id, children, className = "" }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        ${className}
        ${isOver ? "bg-purple-50 ring-2 ring-purple-300" : ""}
        transition-all duration-200
      `}
    >
      {children}
    </div>
  )
}

