'use client'
import Link from 'next/link'
import React from 'react'
import { BiSolidBug } from "react-icons/bi";
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react"
import { Avatar, Box, Container, DropdownMenu, Flex, Text } from '@radix-ui/themes';
import { Skeleton } from '@radix-ui/themes';

const NavBar = () => {

  return (
    <nav className='border-b mb-5 border-spacing-10 px-5 py-3'>
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <Link href='/'>
              <BiSolidBug />
            </Link>
            <NavLinks />
          </Flex>
          <AuthStatus />
        </Flex>
      </Container>
    </nav>
  )
}

const NavLinks = () => {

  const links = [
    {
      label: 'Dashboard', href: '/'
    },

    { label: 'Issues', href: '/issues/list' }
  ]

  const currentPath = usePathname()
  return (
    <ul className='flex space-x-6'>
      {links.map(link =>
        <li key={link.href}>
          <Link
            key={link.href}
            className={classNames({
              "nav-link": true,
              '!text-zinc-900': link.href === currentPath,
            })} href={link.href}>{link.label}</Link></li>)}
    </ul>
  )
}



const AuthStatus = () => {
  const { status, data: session } = useSession()

  if (status === "loading") return <Skeleton width="3rem" />
  if (status === "unauthenticated")
    return <Link className='nav-link' href="/api/auth/signin">Login</Link>

  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Avatar className='cursor-pointer' src={session!.user!.image!} fallback="?" size="2" radius='full' referrerPolicy='no-referrer'></Avatar>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content></DropdownMenu.Content>
        <DropdownMenu.Label>
          <Text size="2">
            {session!.user!.email}
          </Text>
        </DropdownMenu.Label>
        <DropdownMenu.Item>
          <Link href="/api/auth/signout">Log out</Link>
        </DropdownMenu.Item>
      </DropdownMenu.Root>

    </Box >
  )
}

export default NavBar