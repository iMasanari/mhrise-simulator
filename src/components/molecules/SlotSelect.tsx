import { Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import { Slots } from '../../domain/equips'

interface Props {
  slot: Slots
  setSlot: (slot: Slots) => void
  label?: string
}

export default function WeaponSlotSelect({ slot, setSlot, label }: Props) {
  const setSlotValue = (e: SelectChangeEvent) => {
    const value = e.target.value
    setSlot(value === '0' ? [] : value.split('-').map(Number))
  }

  return (
    <Select native value={slot.join('-') || '0'} onChange={setSlotValue} size="small" label={label}>
      <optgroup label="スロットなし">
        <option value="0">なし</option>
      </optgroup>
      <optgroup label="最大Lv1">
        <option value="1">【1】</option>
        <option value="1-1">【1】【1】</option>
        <option value="1-1-1">【1】【1】【1】</option>
      </optgroup>
      <optgroup label="最大Lv2">
        <option value="2">【2】</option>
        <option value="2-1">【2】【1】</option>
        <option value="2-1-1">【2】【1】【1】</option>
        <option value="2-2">【2】【2】</option>
        <option value="2-2-1">【2】【2】【1】</option>
        <option value="2-2-2">【2】【2】【2】</option>
      </optgroup>
      <optgroup label="最大Lv3">
        <option value="3">【3】</option>
        <option value="3-1">【3】【1】</option>
        <option value="3-1-1">【3】【1】【1】</option>
        <option value="3-2">【3】【2】</option>
        <option value="3-2-1">【3】【2】【1】</option>
        <option value="3-2-2">【3】【2】【2】</option>
        <option value="3-3">【3】【3】</option>
        <option value="3-3-1">【3】【3】【1】</option>
        <option value="3-3-2">【3】【3】【2】</option>
        <option value="3-3-3">【3】【3】【3】</option>
      </optgroup>
    </Select>
  )
}
