import { Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import React from 'react'
import { Equip, Slots } from '../../domain/equips'

interface Props {
  equip: Equip
  size?: 'small' | 'medium'
}

const showSlots = (slots: Slots | undefined) =>
  slots?.map((s) => s ? `【${s}】` : null)

export default function ResultEquip({ equip, size }: Props) {
  const skills = Object.entries(equip.skills).sort(([, a], [, b]) => b - a)

  const weapon = { slots: equip.weaponSlots }
  const armors = [weapon, equip.head, equip.body, equip.arm, equip.wst, equip.leg, equip.charm]
    .filter(Boolean as unknown as <T>(v: T) => v is NonNullable<T>)

  const slots = armors.flatMap(armor => armor.slots.map(s => [armor, s] as const))
    .sort(([, a], [, b]) => b - a)

  const decoList = equip.decos.map((deco, i) => [slots[i][0], deco] as const)

  const decos = [...new Set(equip.decos.map(v => v.name))]

  const charmName = equip.charm
    ? Object.entries(equip.charm.skills).map(([name, point]) => <div key={name}>{`${name} Lv${point}`}</div>)
    : null

  return (
    <Table size={size || 'medium'}>
      <TableBody>
        <TableRow>
          <TableCell component="th">武器</TableCell>
          <TableCell>スロット{equip.weaponSlots[0] ? showSlots(equip.weaponSlots) : 'なし'}</TableCell>
          <TableCell>{showSlots(equip.weaponSlots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === weapon).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">頭装備</TableCell>
          <TableCell>{equip.head?.name || '装備なし'}</TableCell>
          <TableCell>{showSlots(equip.head?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.head).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">胴装備</TableCell>
          <TableCell>{equip.body?.name || '装備なし'}</TableCell>
          <TableCell>{showSlots(equip.body?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.body).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">腕装備</TableCell>
          <TableCell>{equip.arm?.name || '装備なし'}</TableCell>
          <TableCell>{showSlots(equip.arm?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.arm).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">腰装備</TableCell>
          <TableCell>{equip.wst?.name || '装備なし'}</TableCell>
          <TableCell>{showSlots(equip.wst?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.wst).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">足装備</TableCell>
          <TableCell>{equip.leg?.name || '装備なし'}</TableCell>
          <TableCell>{showSlots(equip.leg?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.leg).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">護石</TableCell>
          <TableCell>{charmName}</TableCell>
          <TableCell>{showSlots(equip.charm?.slots)}</TableCell>
          <TableCell>
            {decoList.filter(([v]) => v === equip.charm).map(([, v], i) =>
              <div key={i}>{v.name}</div>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th">スキル</TableCell>
          <TableCell>
            {skills.map(([skill, point]) =>
              <div key={skill}>
                {`${skill} Lv${point}`}
              </div>
            )}
          </TableCell>
          <TableCell component="th">装飾品</TableCell>
          <TableCell>
            {decos.map(v =>
              <div key={v}>
                {`${v} x${equip.decos.filter(deco => deco.name === v).length}`}
              </div>
            )}
            {!decos.length && 'なし'}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
