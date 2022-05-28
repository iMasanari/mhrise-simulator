import { Typography, TypographyProps } from '@mui/material'
import { useMemo } from 'react'

interface Props extends TypographyProps<'time'> {
  dateTime: string
}

const format = (time: string) => {
  const dateObj = new Date(time)

  const year = dateObj.getFullYear()
  const month = `0${dateObj.getMonth() + 1}`.slice(-2)
  const date = `0${dateObj.getDate()}`.slice(-2)

  return `${year}年${month}月${date}日`
}

export default function Time(props: Props) {
  const date = useMemo(() => format(props.dateTime), [props.dateTime])

  return (
    <Typography component="time" {...props}>
      {date}
    </Typography>
  )
}
