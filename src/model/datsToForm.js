import { defaultDatsValidationSchema } from './datsSpec'
import { defaultLorisDatsValues } from './loris_datsSpec'

function readExtraProperties(data, category) {
  return Object.keys(data.extraProperties).includes(category)
    ? data.extraProperties[category]
    : { ...defaultDatsValidationSchema, ...defaultLorisDatsValues }[category]
}

class DatsToForm {
  constructor(data) {
    this.data = data
  }

  getJson() {
    const json = {
      title: this.data.title || '',
      creators:
        this.data.creators.map((a) => {
          return {
            ...a,
            type: Object.keys(a).includes('fullName')
              ? 'Person'
              : 'Organization',
            role: a.roles?.[0].value || '',
            orcid: a.extraProperties?.[0].values?.[0].value
          }
        }) || [],
      contact: readExtraProperties(this.data, 'contact'),
      description: this.data.description || '',
      types: this.data.types.map((a) => a?.information?.value) || [],
      version: this.data.version || '',
      licenses: this.data.licenses.map((a) => a?.name) || [],
      keywords: this.data.keywords?.map((a) => a?.value) || [],
      formats: this.data.distributions[0]?.formats || [],
      size: {
        value: this.data.distributions[0]?.size || '',
        units: this.data.distributions[0]?.unit?.value.toUpperCase() || ''
      },
      access: {
        landingPage: this.data.distributions[0]?.access?.landingPage || 'N/A',
        authorization:
          this.data.distributions[0]?.access?.authorizations?.[0]?.value ||
          'public'
      },
      privacy: this.data.privacy || '',
      files: readExtraProperties(this.data, 'files'),
      subjects: readExtraProperties(this.data, 'subjects'),
      origin: readExtraProperties(this.data, 'origin'),
      conpStatus: readExtraProperties(this.data, 'conpStatus'),
      // derivedFrom:
      //   this.data.extraProperties
      //     ?.filter((p) => p.category === 'derivedFrom')[0]
      //     ?.values.map((a) => a.value)[0] || '',
      // parentDatasetId:
      //   this.data.extraProperties
      //     ?.filter((p) => p.category === 'parent_dataset_id')[0]
      //     ?.values.map((a) => a.value)[0] || '',
      primaryPublications: this.data.primaryPublications || [],
      dimensions:
        this.data.dimensions?.map((a) => {
          return {
            name: a.name.value,
            description: a.description
          }
        }) || [],
      identifier: this.data.identifier || {
        identifier: '',
        identifierSource: ''
      },
      logo: readExtraProperties(this.data, 'logo'),
      registrationPageURL: readExtraProperties(
        this.data,
        'registrationPageURL'
      ),
      dates:
        this.data.dates?.map((dateVal) => ({
          date: dateVal.date,
          description: dateVal.type.value
        })) || [],
      citations: [],
      producedBy: '',
      isAbout:
        this.data.isAbout?.map((a) => {
          return {
            ...a,
            type:
              Object.keys(a).includes('identifier') &&
              a.identifier.identifier.match(/taxonomy/)
                ? 'Species'
                : 'Other Entity',
            name: a.name
          }
        }) || [],
      hasPart: '',
      acknowledges: this.data.acknowledges?.[0].funders || [],
      refinement: '',
      aggregation: this.data.aggregation || '',
      spatialCoverage: this.data.spatialCoverage || [],
      reb_info:
        this.data.privacy === open
          ? readExtraProperties(this.data, 'reb_info')
          : '',
      experimentsFunctionAssessed:
        readExtraProperties(this.data, 'experimentFunctionAssessed') || [],
      experimentsLanguages:
        readExtraProperties(this.data, 'experimentLanguages') || [],
      experimentsValidationMeasures:
        readExtraProperties(this.data, 'experimentValidationMeasures') || [],
      experimentsValidationPopulations:
        readExtraProperties(this.data, 'experimentValidationPopulations') || [],
      experimentsAccessibility:
        readExtraProperties(this.data, 'experimentAccessibility') || [],
      experimentsModalities:
        readExtraProperties(this.data, 'experimentModalities') || [],
      experimentsRequiredDevices:
        readExtraProperties(this.data, 'experimentRequiredDevices') || [],
      experimentsRequiredSoftware:
        readExtraProperties(this.data, 'experimentRequiredSoftware')?.map(
          (val) => {
            const match = val.match(/^(?<software>.*)version (?<version>.*)$/u)
            return { software: match[1], version: match[2] }
          }
        ) || [],
      experimentsStimuli:
        readExtraProperties(this.data, 'experimentStimuli') || [],
      experimentsAdditionalRequirements:
        readExtraProperties(this.data, 'experimentAdditionalRequirements') || []
    }

    // if (json.logo.includes('www')) {
    //   json.logo = {
    //     type: 'url',
    //     url: json.logo,
    //     fileName: ''
    //   }
    // } else {
    //   json.logo = {
    //     type: 'fileName',
    //     url: '',
    //     fileName: json.logo
    //   }
    // }

    json.dates = json.dates.map((date) => {
      return Object.assign(date, { date: new Date(date.date) })
    })

    json.primaryPublications = json.primaryPublications.map((pp) => {
      return Object.assign(pp, {
        dates: (pp?.dates || []).map((date) => {
          /*
           * Return Object.assign(date, { date: new Date(date.date) })
           * return Object.assign(date, { date: date.date });
           */
          return Object.assign(date, { date: date.date.split('-')[0] })
        })
      })
    })

    // LORIS START
    json.loris = readExtraProperties(this.data, 'loris')
    // LORIS END

    return json
  }
}

export default DatsToForm
