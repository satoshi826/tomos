import { useAccessToken } from '@/auth/hooks'
import { positionToAreaKey } from '@/domain/hooks'
import { postTopic } from '@/infra/api'
import { useCFRS } from '@/lib/useCFRS'
import { useForm } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'
import { MAX_TOPIC_TITLE_LENGTH } from 'shared/constants'
import { truncateAreaPosition } from 'shared/functions'
import type { Position } from 'shared/types'
import { z } from 'zod'
import { Button } from '../common/button'
import { Dialog, DialogActions } from '../common/dialog'
import { Input } from '../common/input'
import { useSnackbar } from '../common/snackbar'

type Props = {
  open: boolean
  onClose: () => void
  position: Position
}

export function TopicCreateDialog({ open, onClose, position }: Props) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onClose={onClose} title={t('topic.create')}>
      <Body onClose={onClose} position={position} />
    </Dialog>
  )
}

const topicInputSchema = z.object({
  title: z.string().nonempty('').max(MAX_TOPIC_TITLE_LENGTH, 'max_length'),
})

function Body({ onClose, position }: { onClose: () => void; position: { x: number; y: number } }) {
  const { t } = useTranslation()
  const setSnackbar = useSnackbar()
  const cfrs = useCFRS()
  const accessToken = useAccessToken()

  const form = useForm({
    defaultValues: { title: '' },
    validators: {
      onChange: topicInputSchema,
      onMount: topicInputSchema,
    },
    onSubmit: async ({ value: { title } }) => {
      try {
        await postTopic(position.x, position.y, title, accessToken.access_token)
        setSnackbar(t('topic.created'))
      } catch (error) {
        console.error('Failed to create topic:', error)
        setSnackbar(t('error.basic'), 'error')
      } finally {
        cfrs.refetch(positionToAreaKey(truncateAreaPosition(position)))
        onClose()
      }
    },
  })

  return (
    <form action={form.handleSubmit}>
      <form.Field
        name="title"
        children={({ state: { value, meta }, handleChange }) => {
          const error = meta.errors?.find((e) => e && e.message === 'max_length')
          return (
            <Input
              placeholder={t('topic.title_placeholder')}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              hint={error ? t('error.max_length', { len: MAX_TOPIC_TITLE_LENGTH }) : undefined}
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
                {t('topic.do_create')}
              </Button>
            )
          }}
        />
      </DialogActions>
    </form>
  )
}
