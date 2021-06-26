import { css, Theme } from '@emotion/react'
import { Box, Typography } from '@material-ui/core'
import React from 'react'
import skillList from '../../../generated/skills.json'
import { Equip } from '../../domain/equips'
import Link from '../atoms/Link'
import SkillLevel from './SkillLevel'

const detailsStyle = (theme: Theme) => css`
  ${theme.breakpoints.down('sm')} {
    display: none;
  }
`

interface Props {
  equip: Equip
}

const skillMap = new Map(skillList.map(skill => [skill.name, skill]))

export default function ResultSkills({ equip }: Props) {
  const skills = Object.entries(equip.skills).sort(([, a], [, b]) => b - a)

  return (
    <div>
      {skills.map(([skill, points]) =>
        <Box key={skill} mb={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box mr={1}>
            <Typography noWrap>
              <Link href={`/skills/${skill}`}>{skill}</Link>
              {` Lv${points}`}
            </Typography>
            <SkillLevel items={skillMap.get(skill)?.details.map(v => v.point) || []} value={points} />
          </Box>
          <Typography fontSize="small" color="textSecondary" textOverflow="ellipsis" noWrap overflow="hidden" css={detailsStyle}>
            {skillMap.get(skill)?.details.find(v => v.point === points)?.description}
          </Typography>
        </Box>
      )}
    </div>
  )
}
