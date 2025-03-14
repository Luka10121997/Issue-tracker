'use client'
import Link from 'next/link'
import React from 'react'
import { BiSolidBug } from "react-icons/bi";
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const links = [
    {
      label: 'Dashboard', href: '/'
    },

    { label: 'Issues', href: '/issues/list' }
  ]

  const currentPath = usePathname()

  return (
    <nav className='flex space-x-6 border-b mb-5 border-spacing-10 px-5 h-10 items-center'>
      <Link href='/'><BiSolidBug /></Link>
      <ul className='flex space-x-6'>
        {links.map(link =>
          <Link
            key={link.href}
            className={classNames({
              'text-zinc-900': link.href === currentPath,
              'text-zinc-500': link.href !== currentPath,
              'hover:text-zinc-800 transition-colors': true
            })} href={link.href}>{link.label}</Link>)}

      </ul>
    </nav>
  )
}

export default NavBar