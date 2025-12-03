'use client'

export default function LiveContent({ content }: { content: string }) {
  return (
    <div
      className="prose prose-sm max-w-none text-xs leading-relaxed [&_p]:mb-1.5 [&_p]:text-xs [&_img]:my-2 [&_img]:rounded [&_a]:text-xs"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

