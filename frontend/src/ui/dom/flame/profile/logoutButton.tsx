import { logout } from '@/auth/api'
import { useResetAccessToken } from '@/auth/hooks'
import type { ClassName } from '@/util/type'
import { useTranslation } from 'react-i18next'
import { Button } from '../../common/button'
import { useSnackbar } from '../../common/snackbar'

export function LogoutButton({ className }: { className?: ClassName }) {
  const { t } = useTranslation()
  const setSnackbar = useSnackbar()
  const resetAccessToken = useResetAccessToken()
  const handleClick = async () => {
    logout().then(() => {
      resetAccessToken()
      setSnackbar(t('user.logout_success'))
    })
  }

  return (
    <Button onClick={handleClick} className={className} icon="logout" variant="outlined">
      {t('user.logout')}
    </Button>
  )
}
