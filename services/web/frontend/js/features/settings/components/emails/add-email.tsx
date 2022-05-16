import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col } from 'react-bootstrap'
import Cell from './cell'
import Layout from './add-email/layout'
import Input, { InstitutionInfo } from './add-email/input'
import AddAnotherEmailBtn from './add-email/add-another-email-btn'
import InstitutionFields from './add-email/institution-fields'
import SsoLinkingInfo from './add-email/sso-linking-info'
import AddNewEmailBtn from './add-email/add-new-email-btn'
import useAsync from '../../../../shared/hooks/use-async'
import { useUserEmailsContext } from '../../context/user-email-context'
import { isSsoAvailable } from '../../utils/sso'
import { postJSON } from '../../../../infrastructure/fetch-json'
import { University } from '../../../../../../types/university'
import { CountryCode } from '../../data/countries-list'

function AddEmail() {
  const { t } = useTranslation()
  const [isFormVisible, setIsFormVisible] = useState(
    () => window.location.hash === '#add-email'
  )
  const [newEmail, setNewEmail] = useState('')
  const [newEmailMatchedInstitution, setNewEmailMatchedInstitution] =
    useState<InstitutionInfo | null>(null)
  const [countryCode, setCountryCode] = useState<CountryCode | null>(null)
  const [universities, setUniversities] = useState<
    Partial<Record<CountryCode, University[]>>
  >({})
  const [universityName, setUniversityName] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('')
  const { isLoading, isError, error, runAsync } = useAsync()
  const {
    state,
    setLoading: setUserEmailsContextLoading,
    getEmails,
  } = useUserEmailsContext()

  useEffect(() => {
    setUserEmailsContextLoading(isLoading)
  }, [setUserEmailsContextLoading, isLoading])

  const handleShowAddEmailForm = () => {
    setIsFormVisible(true)
  }

  const handleEmailChange = (value: string, institution?: InstitutionInfo) => {
    setNewEmail(value)
    setNewEmailMatchedInstitution(institution || null)
  }

  const handleAddNewEmail = () => {
    const selectedKnownUniversity = countryCode
      ? universities[countryCode]?.find(({ name }) => name === universityName)
      : undefined

    const knownUniversityData = universityName &&
      selectedKnownUniversity && {
        university: {
          id: selectedKnownUniversity.id,
        },
        role,
        department,
      }

    const unknownUniversityData = universityName &&
      !selectedKnownUniversity && {
        university: {
          name: universityName,
          country_code: countryCode,
        },
        role,
        department,
      }

    runAsync(
      postJSON('/user/emails', {
        body: {
          email: newEmail,
          ...knownUniversityData,
          ...unknownUniversityData,
        },
      })
    )
      .then(() => {
        getEmails()
      })
      .catch(() => {})
  }

  if (!isFormVisible) {
    return (
      <Layout isError={isError} error={error}>
        <Col md={4}>
          <Cell>
            <AddAnotherEmailBtn onClick={handleShowAddEmailForm} />
          </Cell>
        </Col>
      </Layout>
    )
  }

  return (
    <Layout isError={isError} error={error}>
      <form>
        <Col md={4}>
          <Cell>
            <label htmlFor="affiliations-email" className="sr-only">
              {t('email')}
            </label>
            <Input onChange={handleEmailChange} />
          </Cell>
        </Col>
        {isSsoAvailable(newEmailMatchedInstitution) ? (
          <Col md={8}>
            <Cell>
              <SsoLinkingInfo
                email={newEmail}
                institutionInfo={newEmailMatchedInstitution}
              />
            </Cell>
          </Col>
        ) : (
          <>
            <Col md={5}>
              <Cell>
                <InstitutionFields
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                  universities={universities}
                  setUniversities={setUniversities}
                  universityName={universityName}
                  setUniversityName={setUniversityName}
                  role={role}
                  setRole={setRole}
                  department={department}
                  setDepartment={setDepartment}
                />
              </Cell>
            </Col>
            <Col md={3}>
              <Cell className="text-md-right">
                <AddNewEmailBtn
                  email={newEmail}
                  disabled={isLoading || state.isLoading}
                  onClick={handleAddNewEmail}
                />
              </Cell>
            </Col>
          </>
        )}
      </form>
    </Layout>
  )
}

export default AddEmail
