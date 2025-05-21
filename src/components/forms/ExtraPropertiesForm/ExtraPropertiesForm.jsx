import React, { useEffect } from 'react'
import {
  Button,
  Divider,
  FormControlLabel,
  Radio,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  makeStyles
} from '@material-ui/core'
import { DatePicker } from 'formik-material-ui-pickers'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { FieldArray, Field, useFormikContext } from 'formik'
import Section from '../../layout/Section'
import SectionTitle from '../../layout/SectionTitle'
import JsonSectionTitle from '../../layout/JsonSectionTitle'
import JsonTextField from '../../fields/JsonTextField'
import JsonOtherSelectField from '../../fields/JsonOtherSelectField'
import FieldGroup from '../../layout/FieldGroup'
import CustomTextField from '../../fields/CustomTextField'
import CustomRadioGroup from '../../fields/CustomRadioGroup'
import CustomSelectField from '../../fields/CustomSelectField'
import CustomCheckbox from '../../fields/CustomCheckbox'
import fieldDescriptions from '../../../model/fieldDescriptions.json'
import LorisPropertiesForm from './LorisPropertiesForm'

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: 200 // Ajustez cette valeur pour définir la largeur du menu déroulant
  },
  menuItem: {
    minWidth: 207 // Ajustez cette valeur pour définir la largeur des éléments du menu
  }
}))

export default function ExtraPropertiesForm(props) {
  const { values, setFieldValue } = useFormikContext()
  const { isExperiment, useLoris, setUseLoris } = props
  const isPrivacyOpen =
    values.privacy === 'registered' ||
    values.privacy === 'controlled' ||
    values.privacy === 'private'
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    new Array(currentYear - 1899),
    (val, index) => currentYear - index
  )
  const classes = useStyles()

  useEffect(() => {
    values.primaryPublications.forEach((publication, index) => {
      if (!publication.authors || publication.authors.length === 0) {
        setFieldValue(`primaryPublications.${index}.authors`, [
          {
            fullName: '',
            firstName: '',
            middleInitial: '',
            lastName: '',
            affiliations: []
          }
        ])
      }
      if (!publication.dates || publication.dates.length === 0) {
        setFieldValue(`primaryPublications.${index}.dates`, [
          {
            date: '',
            description: ''
          }
        ])
      }
    })
  }, [values.primaryPublications, setFieldValue])

  return (
    <React.Fragment>
      {/* LORIS START */}
      <Section>
        <CustomCheckbox
          checked={useLoris}
          id='useLoris'
          onClick={() => setUseLoris(!useLoris)}
        >
          Intended for LORIS
        </CustomCheckbox>
      </Section>

      {useLoris ? (
        <React.Fragment>
          <LorisPropertiesForm isExperiment={isExperiment} />

          <Divider variant='middle' />
        </React.Fragment>
      ) : null}

      {/* LORIS END */}

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.origin}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions['origin.institution']}
          subsection
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='origin.institution'
          setupProps={fieldDescriptions['origin.institution']}
          value={values.origin.institution}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions['origin.consortium']}
          subsection
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='origin.consortium'
          setupProps={fieldDescriptions['origin.consortium']}
          value={values.origin.consortium}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions['origin.city']}
          subsection
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='origin.city'
          setupProps={fieldDescriptions['origin.city']}
          value={values.origin.city}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions['origin.province']}
          subsection
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='origin.province'
          setupProps={fieldDescriptions['origin.province']}
          value={values.origin.province}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions['origin.country']}
          subsection
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='origin.country'
          setupProps={fieldDescriptions['origin.country']}
          value={values.origin.province}
        />
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions.derivedFromTitle}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions.derivedFrom}
          subsection
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='derivedFrom'
          setupProps={fieldDescriptions.derivedFrom}
          value={values.derivedFrom}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions.parentId}
          subsection
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='parentDatasetId'
          setupProps={fieldDescriptions.parentId}
          value={values.parentDatasetId}
        />
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions.primaryPublications}
        />

        <FieldArray name='primaryPublications'>
          {(arrayHelpers) => (
            <Box display='flex flex-column'>
              {values.primaryPublications.map((primaryPublication, index) => {
                return (
                  <FieldGroup
                    arrayHelpers={arrayHelpers}
                    column
                    index={index}
                    indexed
                    key={`primaryPublication_${index}`}
                    name={`primaryPublication_${index}`}
                  >
                    <JsonSectionTitle
                      isExperiment={isExperiment}
                      setupProps={
                        fieldDescriptions['primaryPublications.title']
                      }
                      subsection
                    />

                    <JsonTextField
                      isExperiment={isExperiment}
                      nameAttr={`primaryPublications.${index}.title`}
                      setupProps={
                        fieldDescriptions['primaryPublications.title']
                      }
                      value={values.primaryPublications[index].title}
                    />

                    <JsonSectionTitle
                      isExperiment={isExperiment}
                      setupProps={
                        fieldDescriptions[
                          'primaryPublications.publicationVenue'
                        ]
                      }
                      subsection
                    />

                    <JsonTextField
                      isExperiment={isExperiment}
                      nameAttr={`primaryPublications.${index}.publicationVenue`}
                      setupProps={
                        fieldDescriptions[
                          'primaryPublications.publicationVenue'
                        ]
                      }
                      value={values.primaryPublications[index].publicationVenue}
                    />

                    <FieldArray name={`primaryPublications.${index}.authors`}>
                      {(arrayHelpers) => (
                        <Section subsection>
                          <SectionTitle
                            name='Authors'
                            subsection
                            tooltip='Authors of the publication.'
                          />

                          {(values.primaryPublications[index]?.authors || [])
                            // Authors.length === 0 ? [{}] : authors
                            .map((author, idx) => {
                              return (
                                <FieldGroup
                                  arrayHelpers={arrayHelpers}
                                  column
                                  index={idx}
                                  indexed
                                  key={`author_${idx}`}
                                  name={`author_${idx}`}
                                >
                                  <CustomTextField
                                    label='Full Name'
                                    name={`primaryPublications.${index}.authors.${idx}.fullName`}
                                  />

                                  <CustomTextField
                                    label='First Name'
                                    name={`primaryPublications.${index}.authors.${idx}.firstName`}
                                  />

                                  <CustomTextField
                                    label='Middle Initial'
                                    name={`primaryPublications.${index}.authors.${idx}.middleInitial`}
                                  />

                                  <CustomTextField
                                    label='Last Name'
                                    name={`primaryPublications.${index}.authors.${idx}.lastName`}
                                  />

                                  <FieldArray
                                    name={`primaryPublications.${index}.authors.${idx}.affiliations`}
                                  >
                                    {(arrayHelpers) => (
                                      <Section subsection>
                                        <SectionTitle
                                          name='Affiliations'
                                          subsection
                                          tooltip='Author affiliations.'
                                        />

                                        {(
                                          values.primaryPublications[index]
                                            ?.authors[idx]?.affiliations || []
                                        )
                                          // Author.affiliations || []
                                          .map((affiliation, i) => {
                                            return (
                                              <FieldGroup
                                                arrayHelpers={arrayHelpers}
                                                column
                                                index={i}
                                                indexed
                                                key={`affiliation_${i}`}
                                                name={`affiliation_${i}`}
                                              >
                                                <CustomTextField
                                                  label='Affiliation'
                                                  name={`primaryPublications.${index}.authors.${idx}.affiliations.${i}.name`}
                                                />
                                              </FieldGroup>
                                            )
                                          })}

                                        <Box py={1}>
                                          <Button
                                            color='secondary'
                                            onClick={() => {
                                              arrayHelpers.push('')
                                            }}
                                            variant='outlined'
                                          >
                                            {(
                                              values.primaryPublications[index]
                                                ?.authors[idx]?.affiliations ||
                                              []
                                            ).length > 0
                                              ? 'Add another Affiliation'
                                              : 'Add an Affiliation'}
                                          </Button>
                                        </Box>
                                      </Section>
                                    )}
                                  </FieldArray>
                                </FieldGroup>
                              )
                            })}

                          <Box py={1}>
                            <Button
                              color='secondary'
                              onClick={() => {
                                arrayHelpers.push({
                                  fullName: '',
                                  firstName: '',
                                  middleInitial: '',
                                  lastName: '',
                                  affiliations: []
                                })
                              }}
                              variant='outlined'
                            >
                              {(
                                values.primaryPublications[index]?.authors || []
                              ).length > 0
                                ? 'Add another Author'
                                : 'Add an Author'}
                            </Button>
                          </Box>
                        </Section>
                      )}
                    </FieldArray>

                    <Section subsection>
                      <SectionTitle
                        name='Dates'
                        subsection
                        tooltip='Relevant dates for the publication. If you provide a date, it must come with a description of the date (i.e.: first submission, final approval, date of publication, ...).'
                      />

                      <FieldArray name={`primaryPublications.${index}.dates`}>
                        {(arrayHelpers) => (
                          <Box display='flex flex-column'>
                            {values.primaryPublications[index].dates.map(
                              (date, idx) => {
                                return (
                                  <FieldGroup
                                    arrayHelpers={arrayHelpers}
                                    index={index}
                                    key={`date_${idx}`}
                                    name={`date_${idx}`}
                                  >
                                    {/* <MuiPickersUtilsProvider
                                      utils={DateFnsUtils}
                                    >
                                      <Field
                                        component={DatePicker}
                                        format='MM/dd/yyyy'
                                        label='Date'
                                        name={`primaryPublications.${index}.dates.${idx}.date`}
                                      />
                                    </MuiPickersUtilsProvider> */}

                                    {/* <Field
                                      as={Select}
                                      label='Year'
                                      name={`primaryPublications.${index}.dates.${idx}.date`}
                                    >
                                      {years.map((year) => (
                                        <MenuItem key={year} value={year}>
                                          {year}
                                        </MenuItem>
                                      ))}
                                    </Field> */}

                                    <FormControl fullWidth>
                                      <InputLabel id={`date-${idx}-label`}>
                                        Year
                                      </InputLabel>

                                      <Field
                                        MenuProps={{
                                          PaperProps: {
                                            style: {
                                              width: 207 // Ajustez cette valeur pour définir la largeur du menu déroulant
                                            }
                                          }
                                        }}
                                        as={Select}
                                        className={classes.select}
                                        label='Year'
                                        labelId={`date-${idx}-label`}
                                        name={`primaryPublications.${index}.dates.${idx}.date`}
                                        value={date.date || ''}
                                      >
                                        <MenuItem
                                          className={classes.menuItem}
                                          value=''
                                        >
                                          {/* Cette option représente une chaîne vide */}
                                          <em>None</em>
                                        </MenuItem>

                                        {years.map((year) => (
                                          <MenuItem
                                            className={classes.menuItem}
                                            key={year}
                                            value={year}
                                          >
                                            {year}
                                          </MenuItem>
                                        ))}
                                      </Field>
                                    </FormControl>

                                    <CustomTextField
                                      label='Description'
                                      name={`primaryPublications.${index}.dates.${idx}.type.value`}
                                    />
                                  </FieldGroup>
                                )
                              }
                            )}

                            <Box py={1}>
                              <Button
                                color='secondary'
                                onClick={() => {
                                  arrayHelpers.push({
                                    date: new Date().toISOString(),
                                    /*
                                     * Date: new Date(
                                     *   new Date().setHours(0, 0, 0, 0)
                                     * ),
                                     */
                                    description: ''
                                  })
                                }}
                                variant='outlined'
                              >
                                {values.dates.length > 0
                                  ? 'Add another Date'
                                  : 'Add a Date'}
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </FieldArray>
                    </Section>

                    <JsonSectionTitle
                      isExperiment={isExperiment}
                      setupProps={
                        fieldDescriptions[
                          'primaryPublications.identifier.identifier'
                        ]
                      }
                      subsection
                    />

                    <JsonTextField
                      isExperiment={isExperiment}
                      label='DOI (https://dx.doi.org/10.xxxx/xxxxxx) or ARK (https://example.org/ark:/12345/abc12345)'
                      nameAttr={`primaryPublications.${index}.identifier.identifier`}
                      setupProps={
                        fieldDescriptions[
                          'primaryPublications.identifier.identifier'
                        ]
                      }
                      value={
                        values.primaryPublications[index].identifier.identifier
                      }
                    />

                    <JsonSectionTitle
                      isExperiment={isExperiment}
                      setupProps={
                        fieldDescriptions[
                          'primaryPublications.identifier.identifierSource'
                        ]
                      }
                      subsection
                    />

                    <JsonTextField
                      isExperiment={isExperiment}
                      nameAttr={`primaryPublications.${index}.identifier.identifierSource`}
                      setupProps={
                        fieldDescriptions[
                          'primaryPublications.identifier.identifierSource'
                        ]
                      }
                      value={
                        values.primaryPublications[index].identifier
                          .identifierSource
                      }
                    />
                  </FieldGroup>
                )
              })}

              <Box py={1}>
                <Button
                  color='secondary'
                  onClick={() => {
                    arrayHelpers.push({
                      title: '',
                      publicationVenue: '',
                      authors: [],
                      dates: [],
                      identifier: {
                        identifier: '',
                        identifierSource: ''
                      }
                    })
                  }}
                  variant='outlined'
                >
                  {values.primaryPublications.length > 0
                    ? 'Add another Primary Publication'
                    : 'Add a Primary Publication'}
                </Button>
              </Box>
            </Box>
          )}
        </FieldArray>
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions['identifier.identifier']}
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='identifier.identifier'
          setupProps={fieldDescriptions['identifier.identifier']}
          value={values.identifier.identifier}
        />

        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions['identifier.identifierSource']}
          subsection
        />

        <JsonTextField
          isExperiment={isExperiment}
          nameAttr='identifier.identifierSource'
          setupProps={fieldDescriptions['identifier.identifierSource']}
          value={values.identifier.identifierSource}
        />
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.contact}
        />

        <CustomTextField label='Name' name='contact.name' required />

        <CustomTextField label='Email' name='contact.email' required />
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions.logo}
        />

        <CustomRadioGroup label='Type' name='logo.type'>
          <FormControlLabel control={<Radio />} label='URL' value='url' />
          <FormControlLabel control={<Radio />} label='Filename' value='fileName' />
        </CustomRadioGroup>

        <CustomTextField
          label={values.logo.type === 'url' ? 'URL' : 'Path to File'}
          name='logo.value'
        />
      </Section>

      <Divider variant='middle' />

      {/* {!isExperiment && (
        <Section>
          <JsonSectionTitle
            isExperiment={isExperiment}
            isRequired
            setupProps={fieldDescriptions.registrationPage}
          />

          <CustomTextField label='registrationPage' name='registrationPageURL' required />
        </Section>
      )}

      <Divider variant='middle' /> */}
      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions.dates}
        />

        <FieldArray name='dates'>
          {(arrayHelpers) => (
            <Box display='flex flex-column'>
              {values.dates.map((date, index) => {
                return (
                  <FieldGroup
                    arrayHelpers={arrayHelpers}
                    index={index}
                    key={`date_${index}`}
                    name={`date_${index}`}
                  >
                    <JsonOtherSelectField
                      isExperiment={isExperiment}
                      nameAttr={`dates.${index}.description`}
                      setupProps={fieldDescriptions.dateDescriptions}
                      value={date.description}
                    />

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Field
                        component={DatePicker}
                        format='MM/dd/yyyy'
                        label='Date'
                        name={`dates.${index}.date`}
                      />
                    </MuiPickersUtilsProvider>
                  </FieldGroup>
                )
              })}

              <Box xs={6}>
                <Button
                  color='secondary'
                  onClick={() => {
                    arrayHelpers.push({
                      type: { value: '' },
                      date: new Date(new Date().setHours(0, 0, 0, 0))
                    })
                  }}
                  variant='outlined'
                >
                  {values.dates.length > 0 ? 'Add another Date' : 'Add a Date'}
                </Button>
              </Box>
            </Box>
          )}
        </FieldArray>
      </Section>

      <Divider variant='middle' />

      {isExperiment ? null : (
        <React.Fragment>
          <Section>
            <JsonSectionTitle
              isExperiment={isExperiment}
              setupProps={fieldDescriptions.producedBy}
            />

            <CustomTextField label='Produced By' name='producedBy' />
          </Section>

          <Divider variant='middle' />
        </React.Fragment>
      )}

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          isRequired
          setupProps={fieldDescriptions.isAbout}
        />

        <FieldArray name='isAbout'>
          {(arrayHelpers) => (
            <Box display='flex flex-column'>
              {values.isAbout.map((isAbout, index) => {
                return (
                  <FieldGroup
                    arrayHelpers={arrayHelpers}
                    index={index}
                    key={`isAbout_${index}`}
                    name={`isAbout_${index}`}
                  >
                    <CustomRadioGroup
                      label='Type'
                      name={`isAbout.${index}.type`}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        label='Species'
                        value='Species'
                      />

                      <FormControlLabel
                        control={<Radio />}
                        label='Other Entity'
                        value='Other Entity'
                      />
                    </CustomRadioGroup>

                    {isAbout.type === 'Species' ? (
                      <Section>
                        <CustomSelectField
                          label='Species Name'
                          name={`isAbout.${index}.name`}
                          required
                        >
                          <MenuItem value='Homo sapiens'>Homo Sapiens</MenuItem>

                          <MenuItem value='Mus musculus'>Mus musculus</MenuItem>

                          <MenuItem value='Callithrix jacchus'>
                            Callithrix jacchus
                          </MenuItem>

                          <MenuItem value='Ondatra zibethicus'>
                            Ondatra zibethicus
                          </MenuItem>

                          <MenuItem value='Macaca mulatta'>
                            Macaca mulatta
                          </MenuItem>
                        </CustomSelectField>
                      </Section>
                    ) : (
                      <Section>
                        <CustomTextField
                          label='Name'
                          name={`isAbout.${index}.name`}
                        />
                      </Section>
                    )}
                  </FieldGroup>
                )
              })}

              <Box py={1}>
                <Button
                  color='secondary'
                  onClick={() => {
                    arrayHelpers.push({ type: 'Species' })
                  }}
                  variant='outlined'
                >
                  {values.isAbout.length > 0
                    ? 'Add another Entity'
                    : 'Add an Entity'}
                </Button>
              </Box>
            </Box>
          )}
        </FieldArray>
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions.acknowledges}
        />

        <FieldArray name='acknowledges'>
          {(arrayHelpers) => (
            <Box display='flex flex-column'>
              {values.acknowledges.map((s, index) => {
                return (
                  <FieldGroup
                    arrayHelpers={arrayHelpers}
                    index={index}
                    key={`acknowledges_${index}`}
                    name={`acknowledges_${index}`}
                  >
                    <CustomTextField
                      label='Name'
                      name={`acknowledges.${index}.name`}
                    />

                    <CustomTextField
                      label='Abbreviation'
                      name={`acknowledges.${index}.abbreviation`}
                    />
                  </FieldGroup>
                )
              })}

              <Box py={1}>
                <Button
                  color='secondary'
                  onClick={() => {
                    arrayHelpers.push({
                      name: '',
                      abbreviation: ''
                    })
                  }}
                  variant='outlined'
                >
                  {values.acknowledges.length > 0
                    ? 'Add another Acknowledgement'
                    : 'Add an Acknowledgement'}
                </Button>
              </Box>
            </Box>
          )}
        </FieldArray>
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isExperiment={isExperiment}
          setupProps={fieldDescriptions.spatialCoverage}
        />

        <FieldArray name='spatialCoverage'>
          {(arrayHelpers) => (
            <Box display='flex flex-column'>
              {values.spatialCoverage.map((s, index) => {
                return (
                  <FieldGroup
                    arrayHelpers={arrayHelpers}
                    index={index}
                    key={`spatialCoverage_${index}`}
                    name={`spatialCoverage_${index}`}
                  >
                    <CustomTextField
                      label='Name'
                      name={`spatialCoverage.${index}.name`}
                    />

                    <CustomTextField
                      label='Description'
                      name={`spatialCoverage.${index}.description`}
                    />
                  </FieldGroup>
                )
              })}

              <Box py={1}>
                <Button
                  color='secondary'
                  onClick={() => {
                    arrayHelpers.push({
                      name: '',
                      description: ''
                    })
                  }}
                  variant='outlined'
                >
                  {values.spatialCoverage.length > 0
                    ? 'Add another Spatial Coverage'
                    : 'Add a Spatial Coverage'}
                </Button>
              </Box>
            </Box>
          )}
        </FieldArray>
      </Section>

      <Divider variant='middle' />

      <Section>
        <JsonSectionTitle
          isDisabled={isPrivacyOpen} // IsRequired basé sur la condition
          isExperiment={isExperiment}
          isRequired={!isPrivacyOpen} // IsRequired basé sur la condition
          setupProps={fieldDescriptions.reb_info}
        />

        <CustomSelectField
          disabled={isPrivacyOpen} // Griser le champ si privacy est 'open'
          label='Select a statement *'
          name='reb_info.option'
          style={{
            minWidth: 200,
            maxWidth: 700
          }}
        >
          <MenuItem
            disabled={isPrivacyOpen}
            style={{
              wordBreak: 'break-word',
              whiteSpace: 'unset',
              maxWidth: 700
            }}
            value='option_1'
          >
            Participants have provided a valid informed consent to the
            de-identification and deposit of their data in an open-access
            portal.
          </MenuItem>

          <MenuItem
            disabled={isPrivacyOpen}
            style={{
              wordBreak: 'break-word',
              whiteSpace: 'unset',
              maxWidth: 700
            }}
            value='option_2'
          >
            A waiver or other authorization to deposit these de-identified data
            in an open-access portal was obtained from a research ethics body
            (REB, IRB, REC, etc.).
          </MenuItem>

          <MenuItem
            disabled={isPrivacyOpen}
            style={{
              wordBreak: 'break-word',
              whiteSpace: 'unset',
              maxWidth: 700
            }}
            value='option_3'
          >
            Local law or a relevant institutional authorization otherwise
            enables the deposit of these data in an open-access portal.
          </MenuItem>

          <MenuItem
            disabled={isPrivacyOpen}
            style={{
              wordBreak: 'break-word',
              whiteSpace: 'unset',
              maxWidth: 700
            }}
            value='option_4'
          >
            These data are not derived from human participants.
          </MenuItem>
        </CustomSelectField>

        {isExperiment ? null : (
          <CustomTextField
            disabled={isPrivacyOpen} // Griser le champ si privacy est 'open'
            label='Ethics committee approval number'
            name='reb_info.approvalNumber'
          />
        )}
      </Section>
    </React.Fragment>
  )
}
