import { List, ListItem, ListItemText } from '@material-ui/core'
import React from 'react'
import { ActiveSkill } from '../../domain/skill'
import Link from '../atoms/Link'

interface Props {
  shares: { id: string, skills: ActiveSkill }[]
}

export default function ShareList({ shares }: Props) {
  return (
    <List>
      {shares.map(v =>
        <ListItem key={v.id}>
          <ListItemText>
            <ShareLink href={`/shares/${v.id}`} skills={v.skills} />
          </ListItemText>
        </ListItem>
      )}
      {!shares.length && (
        <ListItem>
          <ListItemText primary="データがありません" />
        </ListItem>
      )}
    </List>
  )
}

interface ShareLinkProps {
  href: string
  skills: ActiveSkill
}

const ShareLink = ({ href, skills }: ShareLinkProps) => {
  const skillList = Object.entries(skills).map(([name, point]) => ({ name, point }))
    .sort((a, b) => b.point - a.point)

  return (
    <Link href={href}>
      {skillList.map(({ name, point }) => `${name}Lv${point}`).join(' ')}
    </Link>
  )
}
