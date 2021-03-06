import { css, Theme } from '@emotion/react'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Container, Divider, Drawer, IconButton, List, Slide, Toolbar, useScrollTrigger } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DrawerItem from './DrawerItem'
import NavItem from './NavItem'
import SiteTitle from './SiteTitle'

const appBarStyle = css`
  overflow: hidden;
`

const titleStyle = css`
  flex-grow: 1;
`

const sidebarToolbarStyle = css`
  justify-content: flex-end;
  width: 250px;
`

const sectionDesktopStyle = (theme: Theme) => css`
  display: none;
  ${theme.breakpoints.up('sm')} {
    display: flex;
  }
`

const sectionMobileStyle = (theme: Theme) => css`
  display: flex;
  ${theme.breakpoints.up('sm')} {
    display: none
  }
`

const navItems = [
  { href: '/', title: 'スキルシミュ' },
  { href: '/armors', title: '防具一覧' },
  { href: '/decos', title: '装飾品一覧' },
  { href: '/skills', title: 'スキル一覧' },
]

interface Props {
  title: string
}

export default function Header({ title }: Props) {
  const router = useRouter()
  const trigger = useScrollTrigger()
  const [isOpen, setOpen] = useState(false)

  const isRoot = router.asPath === '/'

  const toggleOpen = () => {
    setOpen(isOpen => !isOpen)
  }

  const delayClose = () => {
    setTimeout(() => setOpen(false), 200)
  }

  useEffect(() => setOpen(false), [router.asPath])

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar css={appBarStyle} position="fixed" color="default" elevation={1}>
          <Toolbar component={Container} maxWidth="md" disableGutters>
            <SiteTitle
              css={titleStyle}
              isHeading={isRoot}
              title={title}
            />
            <nav css={sectionDesktopStyle}>
              {navItems.map(v =>
                <NavItem key={v.href} href={v.href}>
                  {v.title}
                </NavItem>
              )}
            </nav>
            <div css={sectionMobileStyle}>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleOpen}>
                <MenuIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </Slide >
      <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
        <div role="presentation">
          <Toolbar css={sidebarToolbarStyle}>
            <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleOpen}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {navItems.map(v =>
              <DrawerItem key={v.href} href={v.href} onClick={delayClose}>
                {v.title}
              </DrawerItem>
            )}
          </List>
        </div>
      </Drawer>
      <Toolbar />
    </>
  )
}
