interface JobTitleProps {
  title: string
  className?: string
}

export function JobTitle({ title, className = "" }: JobTitleProps) {
  return (
    <h1 className={`text-4xl font-bold text-foreground mb-3 ${className}`}>
      {title}
    </h1>
  )
}

