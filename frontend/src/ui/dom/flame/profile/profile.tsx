import { useProfile } from '@/auth/hooks'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '../../common/icon'
import { iconButtonStyles } from '../../common/iconButton'
import { GoogleLoginButton } from './googleLoginButton'
import { MyColorSlider } from './myColorSlider'

export const ProfileButton = memo(function _ProfileButton() {
  const { t } = useTranslation()
  const profile = useProfile()
  return (
    <div className="dropdown dropdown-end ">
      {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
      <div tabIndex={0} role="button" className={iconButtonStyles} onClick={() => {}} onKeyDown={() => {}}>
        <Icon size="md">account_circle</Icon>
      </div>
      <div
        // biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
        tabIndex={0}
        className="dropdown-content card !gap-2 w-90 flex-col border border-divider-extension bg-base-200A px-5 py-6 shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="!flex w-16 items-center justify-center rounded-full bg-primary text-base-content">
              <Icon className="!text-6xl">account_circle</Icon>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="font-bold text-primary-lighter text-xl">{profile?.name ?? 'ななし'}</div>
            <div className="text-content text-sm">{`Id: ${profile?.id ?? 'loading...'}`}</div>
          </div>
        </div>
        <div className="mt-1 text-sm">{t('user.my_color')}</div>
        <MyColorSlider />
        <div className="mt-1 text-sm">アカウント</div>
        <GoogleLoginButton />
      </div>
    </div>
  )
})
