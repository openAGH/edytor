import { useTranslation } from 'react-i18next'
import { Button, ButtonProps } from 'react-bootstrap'

function EmailAffiliatedWithInstitution({ onClick, ...props }: ButtonProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-1">
      {t('is_email_affiliated')}
      <br />
      <Button className="btn-inline-link" onClick={onClick} {...props}>
        {t('let_us_know')}
      </Button>
    </div>
  )
}

export default EmailAffiliatedWithInstitution
