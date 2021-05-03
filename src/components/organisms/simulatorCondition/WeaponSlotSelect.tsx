import { Select } from '@material-ui/core'
import React from 'react'
import { WeaponSlot } from '../../../domain/weapon'

interface Props {
  weaponSlot: WeaponSlot
  setWeaponSlot: (slot: WeaponSlot) => void
}

export default function WeaponSlotSelect({ weaponSlot, setWeaponSlot }: Props) {
  const setWeaponSlotValue = (e: React.ChangeEvent<{ value: string }>) =>
    setWeaponSlot(e.currentTarget.value.split('-').map(Number) as WeaponSlot)

  return (
    <Select native value={weaponSlot.join('-')} onChange={setWeaponSlotValue} size="small">
      <optgroup label="武器スロットなし">
        <option value="0-0-0">なし</option>
      </optgroup>
      <optgroup label="最大Lv1">
        <option value="1-0-0">【1】</option>
        <option value="1-1-0">【1】【1】</option>
        <option value="1-1-1">【1】【1】【1】</option>
      </optgroup>
      <optgroup label="最大Lv2">
        <option value="2-0-0">【2】</option>
        <option value="2-1-0">【2】【1】</option>
        <option value="2-1-1">【2】【1】【1】</option>
        <option value="2-2-0">【2】【2】</option>
        <option value="2-2-1">【2】【2】【1】</option>
        <option value="2-2-2">【2】【2】【2】</option>
      </optgroup>
      <optgroup label="最大Lv3">
        <option value="3-0-0">【3】</option>
        <option value="3-1-0">【3】【1】</option>
        <option value="3-1-1">【3】【1】【1】</option>
        <option value="3-2-0">【3】【2】</option>
        <option value="3-2-1">【3】【2】【1】</option>
        <option value="3-2-2">【3】【2】【2】</option>
        <option value="3-3-0">【3】【3】</option>
        <option value="3-3-1">【3】【3】【1】</option>
        <option value="3-3-2">【3】【3】【2】</option>
        <option value="3-3-3">【3】【3】【3】</option>
      </optgroup>
      <optgroup label="最大Lv4">
        <option value="4-0-0">【4】</option>
        <option value="4-1-0">【4】【1】</option>
        <option value="4-1-1">【4】【1】【1】</option>
        <option value="4-2-0">【4】【2】</option>
        <option value="4-2-1">【4】【2】【1】</option>
        <option value="4-2-2">【4】【2】【2】</option>
        <option value="4-3-0">【4】【3】</option>
        <option value="4-3-1">【4】【3】【1】</option>
        <option value="4-3-2">【4】【3】【2】</option>
        <option value="4-3-3">【4】【3】【3】</option>
        <option value="4-4-0">【4】【4】</option>
        <option value="4-4-1">【4】【4】【1】</option>
        <option value="4-4-2">【4】【4】【2】</option>
        <option value="4-4-3">【4】【4】【3】</option>
        <option value="4-4-4">【4】【4】【4】</option>
      </optgroup>
    </Select>
  )
}
