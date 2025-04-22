import React from 'react'
import { FieldArray, useFormikContext, getIn } from 'formik'
import { Button, Box } from '@material-ui/core'
import parseValues from '../../model/fieldParsing'
import FieldGroup from './FieldGroup'
import Section from './Section'
import JsonSectionTitle from './JsonSectionTitle'
import JsonTextField from '../fields/JsonTextField'
import lorisFieldDescriptions from '../../model/loris_fieldDescriptions.json'

export default function ShapedFieldArray(props) {
  const {
    isExperiment,
    isRequired,
    setupProps,
    nameAttr,
    shape,
    shapeFieldName,
    values
  } = props
  const selfString = isExperiment ? 'experiment' : 'dataset'
  const { fieldName } = parseValues(setupProps, selfString)
  const requiredStar = isRequired ? ' *' : ''
  const { errors, touched, setFieldValue } = useFormikContext()

  return (
    <Section>
      <JsonSectionTitle isExperiment={isExperiment} setupProps={setupProps} />

      <FieldArray name={nameAttr}>
        {(arrayHelpers) => (
          <Box display='flex flex-column'>
            {values.map((value, index) => {
              const fieldPath = `${nameAttr}[${index}]`
              const errorText = getIn(errors, fieldPath) // Get error message
              const touchedField = getIn(touched, fieldPath) // Check if field was touched
              const isError = touchedField && Boolean(errorText) // Display error only if field was touched

              return (
                <FieldGroup
                  arrayHelpers={arrayHelpers}
                  index={index}
                  key={`${nameAttr}_${index}`}
                  name={`${nameAttr}_${index}`}
                >
                  {Object.keys(shape.fields).map((field) => {
                    return (
                      <JsonTextField
                        isExperiment={isExperiment}
                        key={`${nameAttr}.${index}.${field}`}
                        nameAttr={`${nameAttr}.${index}.${field}`}
                        setupProps={
                          lorisFieldDescriptions[`${shapeFieldName}.${field}`]
                        }
                      />
                    )
                  })}
                </FieldGroup>
              )
            })}

            <Box py={1}>
              <Button
                color='secondary'
                onClick={() =>
                  arrayHelpers.push(
                    Object.keys(shape.fields).reduce((fields, field) => {
                      fields[field] = ''
                      return fields
                    }, {})
                  )
                }
                variant='outlined'
              >
                {values.length > 0
                  ? `Add another ${fieldName}`
                  : `Add a ${fieldName} ${requiredStar}`}
              </Button>
            </Box>
          </Box>
        )}
      </FieldArray>
    </Section>
  )
}
