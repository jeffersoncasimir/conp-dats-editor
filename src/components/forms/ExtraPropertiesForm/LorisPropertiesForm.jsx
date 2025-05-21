import React from 'react'
import Section from '../../layout/Section'
import JsonSectionTitle from '../../layout/JsonSectionTitle'
import JsonSubSection from '../../layout/JsonSubSection'
import ShapedFieldArray from '../../layout/ShapedFieldArray'
import { useFormikContext } from 'formik'
import {
  defaultLorisDatsValues,
  lorisDatsSchema
} from '../../../model/loris_datsSpec'
import lorisFieldDescriptions from '../../../model/loris_fieldDescriptions.json'

export default function LorisPropertiesForm(props) {
  const groupName = 'loris'
  const { values } = useFormikContext()
  const { isExperiment } = props

  return (
    <React.Fragment>
      <JsonSectionTitle
        isExperiment={isExperiment}
        isRequired
        setupProps={lorisFieldDescriptions.loris}
      />

      {Object.keys(defaultLorisDatsValues).map((fieldName) => {
        const schemaField = lorisDatsSchema.fields.loris.fields[fieldName]

        if (schemaField.type === 'array') {
          return (
            <ShapedFieldArray
              isExperiment={isExperiment}
              key={`${groupName}.${fieldName}`}
              nameAttr={`${groupName}.${fieldName}`}
              setupProps={lorisFieldDescriptions[`${groupName}.${fieldName}`]}
              shape={schemaField.innerType}
              shapeFieldName={`${groupName}.${fieldName}`}
              values={
                values[groupName] && values[groupName][fieldName]
                  ? values[groupName][fieldName]
                  : []
              }
            />
          )
        }

        return (
          <JsonSubSection
            isExperiment={isExperiment}
            key={`${groupName}.${fieldName}`}
            nameAttr={`${groupName}.${fieldName}`}
            setupProps={lorisFieldDescriptions[`${groupName}.${fieldName}`]}
          />
        )
      })}
    </React.Fragment>
  )
}
