import { css, Global } from '@emotion/react'
import React from 'react'
import { Slots } from '../../domain/equips'
import { ActiveSkill } from '../../domain/skill'

interface Props {
  equip: {
    weaponSlot: Slots
    head: string
    body: string
    arm: string
    wst: string
    leg: string
    charm: {
      skills: ActiveSkill
      slots: Slots
    },
    decos: string[]
    skills: ActiveSkill
  }
}

const globalStyle = css`
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');

html {
  font-size: 24px;
}

body {
  font-family: 'Noto Sans JP', sans-serif;
  font-feature-settings: "palt";
  color: rgba(0, 0, 0, 0.87);
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: normal;
  text-align: center;
}

.titleLink {
  color: #556cd6;
  text-decoration: none;
}

.table-container {
  border-radius: 4px;
  border: 1px solid rgba(200, 200, 200, 1);
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

th, td {
  font-weight: 400;
  border-bottom: 1px solid rgba(200, 200, 200, 1);
  text-align: left;
  padding: 16px;
}

.skillsHeader {
  border-left: 1px solid rgba(200, 200, 200, 1);
  text-align: center;
}

.skillsCell {
  border-left: 1px solid rgba(200, 200, 200, 1);
  vertical-align: top;
}

.skills {
  column-count: 2;
}
`

const showSlots = (slots: Slots | undefined) =>
  slots?.map((s) => s ? `【${s}】` : null)

export default function OgImage({ equip }: Props) {
  const skills = Object.entries(equip.skills).sort(([, a], [, b]) => b - a)

  const charmName = equip.charm
    ? Object.entries(equip.charm.skills).map(([name, point]) => <div key={name}>{`${name} Lv${point}`}</div>)
    : null

  return (
    <html>
      <body>
        <h1 className="title">
          {'装備共有 '}
          <a className="titleLink">#Riseシミュ</a>
        </h1>
        <div>
          <div className="table-container">
            <table>
              <tbody>
                <tr>
                  <th>武器</th>
                  <td>スロット{equip.weaponSlot[0] ? showSlots(equip.weaponSlot) : 'なし'}</td>
                  <th className="skillsHeader">発動スキル</th>
                </tr>
                <tr>
                  <th>頭装備</th>
                  <td>{equip.head}</td>
                  <td rowSpan={6} className="skillsCell">
                    <div className="skills">
                      {skills.map(([skill, point]) =>
                        <div key={skill}>
                          {`${skill} Lv${point}`}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>胴装備</th>
                  <td>{equip.body}</td>
                </tr>
                <tr>
                  <th>腕装備</th>
                  <td>{equip.arm}</td>
                </tr>
                <tr>
                  <th>腰装備</th>
                  <td>{equip.wst}</td>
                </tr>
                <tr>
                  <th>足装備</th>
                  <td>{equip.leg}</td>
                </tr>
                <tr>
                  <th>護石</th>
                  <td>
                    {charmName}
                    {`スロット${showSlots(equip.charm?.slots)?.join('') || 'なし'}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </body>
      <Global styles={globalStyle} />
    </html>
  )
}
