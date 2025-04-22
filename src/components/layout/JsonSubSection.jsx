import React from 'react'
import JsonSectionTitle from './JsonSectionTitle'
import JsonTextField from '../fields/JsonTextField'
import Section from './Section'

export default function JsonSubSection(props) {
  const { isExperiment, isRequired, setupProps, nameAttr, fieldValue } = props

  return (
    <Section>
      <JsonSectionTitle
        isExperiment={isExperiment}
        isRequired={isRequired}
        setupProps={setupProps}
        subsection
      />

      <JsonTextField
        isExperiment={isExperiment}
        nameAttr={nameAttr}
        setupProps={setupProps}
        value={fieldValue}
      />
    </Section>
  )
}
