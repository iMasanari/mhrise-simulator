import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@material-ui/core'
import { ContentCopy, Link as LinkIcon, Twitter } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import React, { useEffect, useRef, useState } from 'react'
import twitter from 'twitter-text'
import { Charm, Equip } from '../../../domain/equips'

const useStyles = makeStyles(() => ({
  paper: {
    alignItems: 'flex-start',
  },
}))

interface Props {
  open: boolean
  onClose: (charm?: Charm) => void
  equip: Equip
}

const getValidTweetLink = (text: string, url: string) => {
  const encodedUrl = encodeURI(url)
  let body = text.slice(0, 280)

  while (true) {
    const tweet = `${body === text ? body : body + '…'}\n#モンハンライズ #Riseシミュ`
    const res = twitter.parseTweet(`${tweet} ${encodedUrl}`)

    if (res.valid || !body) {
      return `http://twitter.com/share?url=${encodedUrl}&text=${encodeURIComponent(tweet)}`
    }

    body = body.slice(0, -1)
  }
}

export default function ShareDialog({ open, onClose, equip }: Props) {
  const classes = useStyles()
  const [shareId, setShareId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    inputRef.current?.select()
  }, [shareId])

  const createUrl = async () => {
    setLoading(true)

    const data = {
      weaponSlots: equip.weaponSlot,
      head: equip.head?.name,
      body: equip.body?.name,
      arm: equip.arm?.name,
      wst: equip.wst?.name,
      leg: equip.leg?.name,
      charm: equip.charm,
      decos: equip.decos.map(v => v.name),
    }

    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const { id } = await res.json()

      setShareId(id)
    }
    catch {
      setError(true)
    }
    finally {
      setLoading(false)
    }
  }

  const copyUrl = () => {
    const input = inputRef.current

    if (!input) return

    input.select()
    document.execCommand('copy')
    setCopySnackbarOpen(true)
  }

  const clickUrl = () => {
    inputRef.current?.select()
  }

  const tweetLink = () => {
    const text = Object.entries(equip.skills).map(([key, value]) => `${key}Lv${value}`).join(' ')

    window.open(getValidTweetLink(text, `${location.origin}/shares/${shareId}`))
  }

  return (
    <Dialog open={open} onClose={() => onClose()} classes={{ scrollPaper: classes.paper }} fullWidth>
      <DialogTitle>結果の共有(β)</DialogTitle>
      <DialogContent>
        <Typography>
          {'この装備の内容を共有するリンクを生成します。'}
        </Typography>
        {shareId ? (
          <TextField
            inputRef={inputRef}
            value={`${location.origin}/shares/${shareId}`}
            onClick={clickUrl}
            size="small"
            fullWidth
            sx={{ my: 2 }}
            inputProps={{ readOnly: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={copyUrl}>
                    <ContentCopy />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <Button startIcon={<LinkIcon />} variant="outlined" fullWidth disabled={loading} onClick={createUrl} sx={{ my: 2 }}>
            {'共有リンクの生成'}
          </Button>
        )}
        <Typography gutterBottom variant="body2">
          {'※生成したリンクはこのサイトのトップページや防具ページ等に掲載されることがあります'}
        </Typography>
        <Typography gutterBottom variant="body2">
          {'※開発等の理由により、生成したリンクを無効化する可能性があります'}
        </Typography>
        {shareId && (
          <Box sx={{ textAlign: 'center' }}>
            <Button startIcon={<Twitter />} variant="outlined" size="large" sx={{ mt: 1 }} onClick={tweetLink}            >
              {'ツイートする'}
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>
          {'閉じる'}
        </Button>
      </DialogActions>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={copySnackbarOpen}
        onClose={() => setCopySnackbarOpen(false)}
        autoHideDuration={5000}
      >
        <Alert onClose={() => setCopySnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {'コピーしました'}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={error}
        onClose={() => setError(false)}
        autoHideDuration={5000}
      >
        <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
          <AlertTitle>通信エラーが発生しました</AlertTitle>
          {'時間をおいて、再度実行してください。'}
        </Alert>
      </Snackbar>
    </Dialog >
  )
}
