/* eslint max-lines: "off" */

import React, { useEffect } from 'react'
import { Formik, Form } from 'formik'
import {
  Grid,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress
} from '@material-ui/core'

import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'

import DatsErrors from './components/DatsErrors/DatsErrors'
import DatsUploader from './components/DatsUploader/DatsUploader'
import GeneralForm from './components/forms/GeneralForm/GeneralForm'
import DistributionForm from './components/forms/DistributionForm/DistributionForm'
import ExperimentsForm from './components/forms/ExperimentsForm/ExperimentsForm'
import ExtraPropertiesForm from './components/forms/ExtraPropertiesForm/ExtraPropertiesForm'
import {
  ReadmeEditor,
  genDefaultReadme
} from './components/forms/ReadmeEditor/ReadmeEditor'
import CreateDatsSuccess from './components/CreateDatsSuccess/CreateDatsSuccess'
import FormToDats from './model/formToDats'
import DatsToForm from './model/datsToForm'
import {
  defaultDatsValidationSchema,
  defaultDatsValues
} from './model/datsSpec'

import { lorisDatsSchema, defaultLorisDatsValues } from './model/loris_datsSpec'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative'
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: '65vw',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  section: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  },
  subsection: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
}))

const datasetSteps = [
  'General Info',
  'Distribution',
  'Extra Properties',
  'Review & Download',
  'Readme Editor'
]

const experimentSteps = [
  ...datasetSteps.slice(0, 3),
  'Experiment Properties',
  datasetSteps[3],
  'Readme Editor'
]

/* eslint max-statements: "off" */
export function DatsEditorForm(props) {
  const { validationSchema, initialActiveStep, extraFieldSet } = props
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(initialActiveStep || 0)
  const [dats, setDats] = React.useState()
  const [valuesState, setValuesState] = React.useState({
    ...defaultDatsValues,
    loris: defaultLorisDatsValues
  })
  const [isExperiment, setIsExperiment] = React.useState(false)
  const [useLoris, setUseLoris] = React.useState(extraFieldSet === 'loris')
  const steps = isExperiment ? experimentSteps : datasetSteps
  const postDatsSteps = isExperiment ? 2 : 2
  const [nextClicked, setNextClicked] = React.useState(false)
  // eslint-disable-next-line no-unused-vars
  const [validateOnChange, setValidateOnChange] = React.useState(false)
  // eslint-disable-next-line no-unused-vars
  const [formEmpty, setFormEmpty] = React.useState(false)

  const isLastStep = (step) => step === steps.length - (postDatsSteps + 1)
  const shouldShowClearButton = (step) =>
    step <= steps.length - (postDatsSteps + 1)
  const shouldShowNextButton = (step) => step <= steps.length - postDatsSteps
  const shouldShowUploader = (step) =>
    step <= steps.length - (postDatsSteps + 1)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('onload', useLoris)
  }, [])

  const onDatsReceived = (json) => {
    const formData = new DatsToForm(json).getJson()
    setValuesState(formData)
    if (formData.experimentsLanguages.length > 0) {
      setIsExperiment(true)
    } else {
      setIsExperiment(false)
    }

    setUseLoris(
      Object.keys(formData).includes('loris') &&
        Object.keys(formData.loris).some((field) => {
          return formData.loris[field] !== defaultLorisDatsValues[field]
        })
    )
  }

  const handleRadioChange = (event) => {
    setIsExperiment(event.target.value === 'experiment')
    setActiveStep(0)
  }

  function cleanModifiedErrors(modifiedErrors) {
    if (!isExperiment) {
      const fieldsToRemove = {
        1: ['size', 'access', 'files', 'conpStatus'],
        2: ['reb_info', 'contact', 'primaryPublications', 'subjects'],
        3: ['loris']
      }

      Object.entries(fieldsToRemove).forEach(([step, fields]) => {
        if (activeStep !== parseInt(step, 10)) {
          fields.forEach((field) => {
            if (modifiedErrors[field]) {
              delete modifiedErrors[field]
            }
          })
        }
      })
    } else if (isExperiment) {
      const fieldsToRemove = {
        1: ['size', 'access', 'files', 'conpStatus'],
        2: [
          'contact',
          'registrationPageURL',
          'reb_info',
          'primaryPublications',
          'subjects'
        ],
        3: [
          'types',
          'experimentsRequiredSoftware',
          'experimentsFunctionAssessed',
          'experimentsLanguages',
          'experimentsModalities'
        ]
      }

      Object.entries(fieldsToRemove).forEach(([step, fields]) => {
        if (activeStep !== parseInt(step, 10)) {
          fields.forEach((field) => {
            if (modifiedErrors[field]) {
              delete modifiedErrors[field]
            }
          })
        }
      })
    }

    return modifiedErrors
  }
  function renderStep(step, values) {
    switch (step) {
      case experimentSteps[0]:
        return (
          <GeneralForm
            classes={classes}
            isExperiment={isExperiment}
            nextClicked={nextClicked}
            values={values}
          />
        )
      case experimentSteps[1]:
        return (
          <DistributionForm
            classes={classes}
            isExperiment={isExperiment}
            values={values}
          />
        )
      case experimentSteps[2]:
        return (
          <ExtraPropertiesForm
            classes={classes}
            isExperiment={isExperiment}
            setUseLoris={setUseLoris}
            useLoris={useLoris}
            values={values}
          />
        )
      case experimentSteps[3]:
        return (
          <ExperimentsForm
            classes={classes}
            isExperiment={isExperiment}
            values={values}
          />
        )
      case experimentSteps[4]:
        return (
          <CreateDatsSuccess
            classes={classes}
            dats={dats}
            isExperiment={isExperiment}
            values={values}
          />
        )
      case experimentSteps[5]:
        return (
          <ReadmeEditor
            buttonClass={classes.button}
            readmeStart={genDefaultReadme(values)}
            wrapperClass={classes.wrapper}
          />
        )
      default:
        throw new Error('Unknown step')
    }
  }

  // eslint-disable-next-line complexity
  const handleNext = (errors, values, setFieldTouched) => {
    let modifiedErrors = { ...errors }
    setNextClicked(true)
    modifiedErrors = cleanModifiedErrors(modifiedErrors)

    if (Object.keys(modifiedErrors).length === 0) {
      setTimeout(() => {
        setActiveStep(activeStep + 1)
        window.scrollTo(0, 0)
      }, 200)
    } else {
      // Scroll to the first field with an error
      // eslint-disable-next-line prefer-destructuring
      let firstErrorKey = Object.keys(modifiedErrors)[0]
      let errorFieldSelector = `[name="${firstErrorKey}"]`
      let errorFieldElement = document.querySelector(errorFieldSelector)
      if (firstErrorKey === 'access') {
        firstErrorKey += '.landingPage'
      } else if (firstErrorKey === 'creators') {
        firstErrorKey += '.0.name'
      } else if (firstErrorKey === 'size') {
        firstErrorKey += '.value'
      } else if (firstErrorKey === 'contact') {
        firstErrorKey += '.name'
      } else if (firstErrorKey === 'primaryPublications') {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 20; i++) {
          if (
            errors.primaryPublications[i] &&
            errors.primaryPublications[i].title
          ) {
            firstErrorKey = `primaryPublications.${i}.title`
            break
          } else if (
            errors.primaryPublications[i] &&
            errors.primaryPublications[i].authors
          ) {
            firstErrorKey = `primaryPublications.${i}.authors.0.fullName`
            break
          } else if (errors.primaryPublications?.[i]?.dates?.[0]?.date) {
            firstErrorKey = `primaryPublications.${i}.dates.0.date`
            break
          } else if (errors.primaryPublications?.[i]?.identifier?.identifier) {
            firstErrorKey = `primaryPublications.${i}.identifier.identifier`
            break
          } else if (
            errors.primaryPublications?.[i]?.identifier?.identifierSource
          ) {
            firstErrorKey = `primaryPublications.${i}.identifier.identifierSource`
            break
          }
        }
      }
      if (firstErrorKey === 'primaryPublications.0.dates.0.date') {
        errorFieldSelector = `[id='mui-component-select-${firstErrorKey}']`
      } else {
        errorFieldSelector = `[data-testid="${firstErrorKey}"]`
      }
      errorFieldElement = document.querySelector(errorFieldSelector)

      if (errorFieldElement === null) {
        if (firstErrorKey === 'creators.0.name') {
          firstErrorKey = 'creators.0.fullName'
          errorFieldSelector = `[data-testid="${firstErrorKey}"]`
          errorFieldElement = document.querySelector(errorFieldSelector)
        } else {
          firstErrorKey += '.0'
          errorFieldSelector = `[data-testid="${firstErrorKey}"]`
          errorFieldElement = document.querySelector(errorFieldSelector)
        }
      }
      if (firstErrorKey === 'conpStatus' && errorFieldElement) {
        const parentDivElement = errorFieldElement.parentNode
        const childDivElement = parentDivElement.querySelector('div')

        childDivElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

        if (childDivElement.focus) {
          childDivElement.focus()
          childDivElement.blur()
          childDivElement.focus()
        }
      } else if (firstErrorKey === 'privacy' && errorFieldElement) {
        const parentDivElement = errorFieldElement.parentNode
        const childDivElement = parentDivElement.querySelector('div')

        childDivElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (childDivElement.focus) {
          childDivElement.focus()
          childDivElement.blur()
          childDivElement.focus()
        }
      } else if (firstErrorKey === 'licenses.0' && errorFieldElement) {
        setFieldTouched('licenses', true, false)
        const childDivElement = errorFieldElement.querySelector('div')
        if (childDivElement) {
          childDivElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
          if (childDivElement.focus) {
            childDivElement.focus()
            childDivElement.blur()
            childDivElement.focus()
          }
        }
      } else if (firstErrorKey === 'reb_info') {
        const childDivElement = document.querySelector(
          '#mui-component-select-reb_info'
        )
        if (childDivElement) {
          childDivElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
          if (childDivElement.focus) {
            childDivElement.focus()
            childDivElement.blur()
            childDivElement.focus()
          }
        }
      } else if (errorFieldElement) {
        errorFieldElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        if (errorFieldElement.focus) {
          errorFieldElement.focus()
          errorFieldElement.blur()
          errorFieldElement.focus()
        }
      }
    }
  }

  // eslint-disable-next-line complexity
  const handleConfirm = (errors, values) => {
    setNextClicked(true)
    setValidateOnChange(true)

    if (Object.keys(errors).length > 0) {
      // eslint-disable-next-line prefer-destructuring
      let firstErrorKey = Object.keys(errors)[0]
      let errorFieldSelector = `[name="${firstErrorKey}"]`
      let errorFieldElement = document.querySelector(errorFieldSelector)
      if (firstErrorKey === 'experimentsRequiredSoftware') {
        firstErrorKey += '.0.software'
      } else if (firstErrorKey === 'creators') {
        firstErrorKey += '.0.name'
      } else if (firstErrorKey === 'size') {
        firstErrorKey += '.value'
      } else if (firstErrorKey === 'primaryPublications') {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 20; i++) {
          if (
            errors.primaryPublications[i] &&
            errors.primaryPublications[i].title
          ) {
            firstErrorKey = `primaryPublications.${i}.title`
            break
          } else if (
            errors.primaryPublications[i] &&
            errors.primaryPublications[i].authors
          ) {
            firstErrorKey = `primaryPublications.${i}.authors.0.fullName`
            break
          } else if (errors.primaryPublications?.[i]?.dates?.[0]?.date) {
            firstErrorKey = `primaryPublications.${i}.dates.0.date`
            break
          } else if (errors.primaryPublications?.[i]?.identifier?.identifier) {
            firstErrorKey = `primaryPublications.${i}.identifier.identifier`
            break
          } else if (
            errors.primaryPublications?.[i]?.identifier?.identifierSource
          ) {
            firstErrorKey = `primaryPublications.${i}.identifier.identifierSource`
            break
          }
        }
      }
      if (firstErrorKey === 'primaryPublications.0.dates.0.date') {
        errorFieldSelector = `[id='mui-component-select-${firstErrorKey}']`
      } else {
        errorFieldSelector = `[data-testid="${firstErrorKey}"]`
      }
      errorFieldElement = document.querySelector(errorFieldSelector)
      if (errorFieldElement === null) {
        firstErrorKey += '.0'
        errorFieldSelector = `[data-testid="${firstErrorKey}"]`
        errorFieldElement = document.querySelector(errorFieldSelector)
      }
      if (
        (firstErrorKey === 'experimentsRequiredSoftware.0.software' ||
          firstErrorKey === 'experimentsFunctionAssessed.0' ||
          firstErrorKey === 'experimentsModalities.0') &&
        errorFieldElement
      ) {
        const childDivElement = errorFieldElement.querySelector('div')
        childDivElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (childDivElement.focus) {
          childDivElement.focus()
          childDivElement.blur()
          childDivElement.focus()
        }
      } else if (errorFieldElement) {
        errorFieldElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        if (errorFieldElement.focus) {
          errorFieldElement.focus()
          errorFieldElement.blur()
          errorFieldElement.focus()
        }
      }
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const handleClear = () => {
    setValuesState({ ...defaultDatsValues, loris: defaultLorisDatsValues })
    setActiveStep(0)
    window.scrollTo(0, 0)
  }

  const downloadDats = (formData) => {
    if (!valuesState || Object.keys(valuesState).length === 0) {
      alert('No data available to download.')
      return
    }
    const datsJson = new FormToDats(formData).getJson()
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(datsJson, null, 2)], {
      type: 'text/plain'
    })
    element.href = URL.createObjectURL(file)
    element.download = 'DATS.json'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  /* eslint react/jsx-newline: "off" */
  /* eslint react/jsx-max-depth: "off" */
  /* eslint react/forbid-component-props: "off" */
  /* eslint no-ternary: "off" */
  /* eslint no-nested-ternary: "off" */
  return (
    <React.Fragment>
      <CssBaseline />

      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography align='center' component='h1' variant='h4'>
            DATS Editor
          </Typography>

          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Formik
            context={{ isExperiment }}
            enableReinitialize
            initialValues={{ ...valuesState, isExperiment }}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true)
              const datsJson = new FormToDats(data)
              setDats(datsJson.getJson())
              setActiveStep(activeStep + 1)
              setSubmitting(false)
            }}
            validateOnChange
            validationSchema={
              validationSchema ||
              defaultDatsValidationSchema.concat(lorisDatsSchema)
            }
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleReset,
              setFieldTouched
            }) => (
              <Form>
                {shouldShowUploader(activeStep) ? (
                  <React.Fragment>
                    <div className={classes.section}>
                      <DatsUploader onDatsReceived={onDatsReceived} />
                    </div>

                    {/* <Grid
                      alignItems='center'
                      component='label'
                      container
                      justifyContent='center'
                      spacing={1}
                    >
                      <Grid item>Dataset</Grid>
                      <Grid item>
                        <Switch
                          checked={isExperiment}
                          name='isExperimentSwitch'
                          onChange={toggleIsExperiment}
                        />
                      </Grid>
                      <Grid item>Experiment</Grid>
                    </Grid> */}
                    <Grid
                      alignItems='center'
                      container
                      direction='column'
                      justifyContent='center'
                    >
                      <FormControl
                        className={classes.formControl}
                        component='fieldset'
                      >
                        <RadioGroup
                          aria-label='isExperiment'
                          name='isExperiment'
                          onChange={handleRadioChange}
                          value={isExperiment ? 'experiment' : 'dataset'}
                        >
                          <FormControlLabel
                            control={<Radio />}
                            label='Dataset'
                            style={{ fontSize: '1rem' }}
                            value='dataset'
                          />
                          <FormControlLabel
                            control={<Radio />}
                            label='Experiment'
                            style={{ fontSize: '1rem' }}
                            value='experiment'
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </React.Fragment>
                ) : null}

                {renderStep(steps[activeStep], values)}

                <div className={classes.buttons}>
                  {activeStep < 3 || (isExperiment && activeStep < 4) ? (
                    <Button
                      className={classes.button}
                      onClick={() => downloadDats(values)}
                      style={{
                        backgroundColor: '#3f51b5',
                        color: 'white',
                        marginRight: 'auto'
                      }}
                      variant='contained'
                    >
                      Save partial DATS
                    </Button>
                  ) : null}

                  {shouldShowClearButton(activeStep) ? (
                    <Button
                      className={classes.button}
                      onClick={() => {
                        handleClear()
                        handleReset()
                      }}
                      variant='contained'
                    >
                      Clear
                    </Button>
                  ) : null}

                  {activeStep !== 0 && (
                    <Button
                      className={classes.button}
                      onClick={handleBack}
                      variant='contained'
                    >
                      {shouldShowNextButton(activeStep) ? 'Back' : 'Edit'}
                    </Button>
                  )}

                  <div className={classes.wrapper}>
                    {isLastStep(activeStep) ? (
                      <Button
                        className={classes.button}
                        color='primary'
                        disabled={isSubmitting}
                        onClick={() => handleConfirm(errors, values)}
                        type='submit'
                        variant='contained'
                      >
                        Confirm
                      </Button>
                    ) : shouldShowNextButton(activeStep) ? (
                      <Button
                        className={classes.button}
                        color='primary'
                        onClick={() =>
                          handleNext(errors, values, setFieldTouched)
                        }
                        variant='contained'
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        className={classes.button}
                        color='primary'
                        onClick={() => {
                          handleClear()
                          handleReset()
                        }}
                        variant='contained'
                      >
                        Create a new DATS
                      </Button>
                    )}

                    {isSubmitting ? (
                      <CircularProgress
                        className={classes.buttonProgress}
                        size={24}
                      />
                    ) : null}
                  </div>
                </div>

                <DatsErrors
                  className={classes.section}
                  errors={errors}
                  formEmpty={formEmpty}
                  touched={touched}
                />
              </Form>
            )}
          </Formik>
        </Paper>
      </div>
    </React.Fragment>
  )
}
