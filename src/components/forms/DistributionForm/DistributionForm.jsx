import React from 'react'
import { Divider } from '@material-ui/core'
import { Field } from 'formik'
import { Checkbox } from 'formik-material-ui'
import Section from '../../layout/Section'
import FieldArraySection from '../../layout/FieldArraySection'
import SingleFieldSection from '../../layout/SingleFieldSection'
import JsonSectionTitle from '../../layout/JsonSectionTitle'
import JsonSelectField from '../../fields/JsonSelectField'
import JsonTextField from '../../fields/JsonTextField'
import fieldDescriptions from '../../../model/fieldDescriptions.json'

export default function DistributionForm(props) {
  const { values, isExperiment } = props

  return (
    <React.Fragment>
      <FieldArraySection
        isExperiment={isExperiment}
        isRequired={!isExperiment}
        jsonField={JsonTextField}
        nameAttr='formats'
        setupProps={fieldDescriptions.formats}
        values={values.formats}
      />

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.size}
        />

        <JsonTextField
          isExperiment={isExperiment}
          isRequired
          nameAttr='size.value'
          setupProps={fieldDescriptions.size}
          value={values.size}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.units}
          subsection
        />

        <JsonSelectField
          isExperiment={isExperiment}
          isRequired
          nameAttr='size.units'
          setupProps={fieldDescriptions.units}
          value={values.size.units.value}
        />
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.access}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.landingPage}
          subsection
        />

        <JsonTextField
          isExperiment={isExperiment}
          isRequired
          nameAttr='access.landingPage'
          setupProps={fieldDescriptions.landingPage}
          value={values.access.landingPage}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.authorizations}
          subsection
        />

        <JsonSelectField
          isExperiment={isExperiment}
          isRequired
          nameAttr='access.authorization'
          setupProps={fieldDescriptions.authorizations}
          value={values.access.authorizations}
        />
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.files}
        />

        <JsonTextField
          isExperiment={isExperiment}
          isRequired
          nameAttr='files.counted'
          setupProps={fieldDescriptions.files}
          value={values.size}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions.filesProjected}
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='files.projected'
          setupProps={fieldDescriptions.filesProjected}
          value={values.size}
        />
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.subjects}
        />

        {isExperiment ? (
          <label>
            <Field
              component={Checkbox}
              name='subjects.applicable'
              type='checkbox'
            />
            Applicable to this experiment
          </label>
        ) : null}

        {values.subjects.applicable ? (
          <React.Fragment>
            <JsonTextField
              fullWidth
              isExperiment={isExperiment}
              isRequired
              nameAttr='subjects.counted'
              setupProps={fieldDescriptions.subjects}
              value={values.subjects.counted}
            />

            <JsonSectionTitle
              isExperiment={isExperiment}
              setupProps={fieldDescriptions.subjectsProjected}
            />

            <JsonTextField
              fullWidth
              isExperiment={isExperiment}
              nameAttr='subjects.projected'
              setupProps={fieldDescriptions.subjectsProjected}
              value={values.subjects.projected}
            />
          </React.Fragment>
        ) : null}
      </Section>

      <Divider variant='middle' />

      <SingleFieldSection
        isExperiment={isExperiment}
        isRequired
        jsonField={JsonSelectField}
        nameAttr='conpStatus'
        setupProps={fieldDescriptions.conpStatus}
      />
    </React.Fragment>
  )
}
