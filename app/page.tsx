'use client'

import { Instagram, Linkedin, Github, Mail, Send } from 'lucide-react'

const socialLinks = [
  { name: 'Telegram', icon: Send, href: 'https://t.me/murodov_azizmurod' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/murodov_azizmurod' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/azizmurod-murodov/' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/murodovazizmurod' },
  { name: 'Email', icon: Mail, href: 'mailto:murodovazizmurod@gmail.com' },
]

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
      <div className="fade-in text-center">
        <h1 className="text-xl sm:text-2xl font-medium mb-2 name-animation">murodov azizmurod</h1>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-8 sm:mb-12">backend & devops developer</p>
        
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 sm:gap-1.5 text-xs hover:opacity-70 transition-opacity group"
              >
                <Icon className="w-3 h-3 sm:w-3 sm:h-3" />
                <span className="border-b border-current pb-0.5">{social.name}</span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

