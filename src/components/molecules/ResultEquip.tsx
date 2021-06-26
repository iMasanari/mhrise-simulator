import { css, Theme } from '@emotion/react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
import React from 'react'
import { Equip, Slots } from '../../domain/equips'
import Link from '../atoms/Link'

const decoCellStyle = (theme: Theme) => css`
  ${theme.breakpoints.down('sm')} {
    display: none;
  }
`

interface Props {
  equip: Equip
  size?: 'small' | 'medium'
}

const showSlots = (slots: Slots | undefined) =>
  slots?.map((s) => s ? `【${s}】` : null)

export default function ResultEquip({ equip, size }: Props) {
  const weapon = { slots: equip.weaponSlots }
  const armors = [weapon, equip.head, equip.body, equip.arm, equip.wst, equip.leg, equip.charm]
    .filter(Boolean as unknown as <T>(v: T) => v is NonNullable<T>)

  const slots = armors.flatMap(armor => armor.slots.map(s => [armor, s] as const))
    .sort(([, a], [, b]) => b - a)

  const decoList = equip.decos.map((deco, i) => [slots[i][0], deco] as const)

  const decos = [...new Set(equip.decos.map(v => v.name))]

  const charmName = equip.charm && [
    ...Object.entries(equip.charm.skills).map(([name, point]) => <div key={name}>{`${name} Lv${point}`}</div>),
    equip.charm.slots.length ? `スロット${showSlots(equip.charm.slots)?.join('')}` : null,
  ]

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size={size || 'medium'}>
        <TableBody>
          <TableRow>
            <TableCell component="th">武器</TableCell>
            <TableCell>スロット{equip.weaponSlots[0] ? showSlots(equip.weaponSlots) : 'なし'}</TableCell>
            <TableCell css={decoCellStyle}>{showSlots(equip.weaponSlots)}</TableCell>
            <TableCell css={decoCellStyle}>
              {decoList.filter(([v]) => v === weapon).map(([, v], i) =>
                <div key={i}>
                  <Link href={`/decos/${v.name}`} >{v.name}</Link>
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">頭装備</TableCell>
            <TableCell>
              {equip.head
                ? <Link href={`/armors/${equip.head.name}`} >{equip.head.name}</Link>
                : '装備なし'
              }
            </TableCell>
            <TableCell css={decoCellStyle}>{showSlots(equip.head?.slots)}</TableCell>
            <TableCell css={decoCellStyle}>
              {decoList.filter(([v]) => v === equip.head).map(([, v], i) =>
                <div key={i}>
                  <Link href={`/decos/${v.name}`} >{v.name}</Link>
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">胴装備</TableCell>
            <TableCell>
              {equip.body
                ? <Link href={`/armors/${equip.body.name}`} >{equip.body.name}</Link>
                : '装備なし'
              }
            </TableCell>
            <TableCell css={decoCellStyle}>{showSlots(equip.body?.slots)}</TableCell>
            <TableCell css={decoCellStyle}>
              {decoList.filter(([v]) => v === equip.body).map(([, v], i) =>
                <div key={i}>
                  <Link href={`/decos/${v.name}`}>{v.name}</Link>
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">腕装備</TableCell>
            <TableCell>
              {equip.arm
                ? <Link href={`/armors/${equip.arm.name}`} >{equip.arm.name}</Link>
                : '装備なし'
              }
            </TableCell>
            <TableCell css={decoCellStyle}>{showSlots(equip.arm?.slots)}</TableCell>
            <TableCell css={decoCellStyle}>
              {decoList.filter(([v]) => v === equip.arm).map(([, v], i) =>
                <div key={i}>
                  <Link href={`/decos/${v.name}`}>{v.name}</Link>
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">腰装備</TableCell>
            <TableCell>
              {equip.wst
                ? <Link href={`/armors/${equip.wst.name}`} >{equip.wst.name}</Link>
                : '装備なし'
              }
            </TableCell>
            <TableCell css={decoCellStyle}>{showSlots(equip.wst?.slots)}</TableCell>
            <TableCell css={decoCellStyle}>
              {decoList.filter(([v]) => v === equip.wst).map(([, v], i) =>
                <div key={i}>
                  <Link href={`/decos/${v.name}`} >{v.name}</Link>
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">足装備</TableCell>
            <TableCell>
              {equip.leg
                ? <Link href={`/armors/${equip.leg.name}`} >{equip.leg.name}</Link>
                : '装備なし'
              }
            </TableCell>
            <TableCell css={decoCellStyle}>{showSlots(equip.leg?.slots)}</TableCell>
            <TableCell css={decoCellStyle}>
              {decoList.filter(([v]) => v === equip.leg).map(([, v], i) =>
                <div key={i}>
                  <Link href={`/decos/${v.name}`} >{v.name}</Link>
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">護石</TableCell>
            <TableCell>{charmName}</TableCell>
            <TableCell css={decoCellStyle}>{showSlots(equip.charm?.slots)}</TableCell>
            <TableCell css={decoCellStyle}>
              {decoList.filter(([v]) => v === equip.charm).map(([, v], i) =>
                <div key={i}>
                  <Link href={`/decos/${v.name}`} >{v.name}</Link>
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">装飾品</TableCell>
            <TableCell colSpan={1}>
              {decos.map(v =>
                <div key={v}>
                  <Link href={`/decos/${v}`} >{v}</Link>
                  {` x${equip.decos.filter(deco => deco.name === v).length}`}
                </div>
              )}
              {!decos.length && 'なし'}
            </TableCell>
            <TableCell colSpan={2} css={decoCellStyle}></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
