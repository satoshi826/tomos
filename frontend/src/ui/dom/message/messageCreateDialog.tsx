import { useAccessToken } from '@/auth/hooks'
import { positionToTopicKey } from '@/domain/hooks'
import { postMessage } from '@/infra/api'
import { useCFRS } from '@/lib/useCFRS'
import { useForm } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'
import { MAX_MESSAGE_LENGTH } from 'shared/constants'
import { truncateTopicPosition } from 'shared/functions'
import type { Position } from 'shared/types'
import { z } from 'zod'
import { Button } from '../common/button'
import { Dialog, DialogActions } from '../common/dialog'
import { useSnackbar } from '../common/snackbar'
import { Textarea } from '../common/textarea'

type Props = {
  open: boolean
  onClose: () => void
  position: Position
}

export function MessageCreateDialog({ open, onClose, position }: Props) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onClose={onClose} title={t('message.create')}>
      <Body onClose={onClose} position={position} />
    </Dialog>
  )
}

const messageInputSchema = z.object({
  content: z.string().nonempty('').max(MAX_MESSAGE_LENGTH, 'max_length'),
})

function Body({ onClose, position }: { onClose: () => void; position: { x: number; y: number } }) {
  const { t } = useTranslation()
  const accessToken = useAccessToken()
  const setSnackbar = useSnackbar()
  const cfrs = useCFRS()

  const form = useForm({
    defaultValues: { content: '' },
    validators: {
      onChange: messageInputSchema,
      onMount: messageInputSchema,
    },
    onSubmit: async ({ value: { content } }) => {
      try {
        await postMessage(position.x, position.y, content, accessToken.access_token)
        setSnackbar(t('message.created'))
      } catch (error) {
        console.error('Failed to create topic:', error)
        setSnackbar(t('error.basic'), 'error')
      } finally {
        cfrs.refetch(positionToTopicKey(truncateTopicPosition(position)))
        onClose()
      }
    },
  })

  return (
    <form action={form.handleSubmit}>
      <form.Field
        name="content"
        children={({ state: { value, meta }, handleChange }) => {
          const error = meta.errors?.find((e) => e && e.message === 'max_length')
          return (
            <Textarea
              placeholder={t('message.content_placeholder')}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              hint={error ? t('error.max_length', { len: MAX_MESSAGE_LENGTH }) : undefined}
              rows={5}
            />
          )
        }}
      />
      <DialogActions>
        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.isValid]}
          children={([isSubmitting, isValid]: [boolean, boolean]) => {
            return (
              <Button type="submit" icon="check" loading={isSubmitting} disabled={!isValid}>
                {t('message.do_create')}
              </Button>
            )
          }}
        />
      </DialogActions>
    </form>
  )
}
