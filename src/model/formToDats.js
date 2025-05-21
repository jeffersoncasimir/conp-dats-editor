import { format, parseISO, isValid } from 'date-fns'

class FormToDats {
  constructor(data) {
    this.data = data
  }

  getJson() {
    const json = {
      title: this.data.title,
      description: this.data.description,
      identifier: this.data.identifier,
      dates: this.data.dates.map((date) => {
        return {
          date: `${format(date.date, 'yyyy-MM-dd')} 00:00:00`,
          type: {
            value: date.description.toLowerCase()
          }
        }
      }),
      creators: this.data.creators.map((creator) => {
        const c = creator
        if (c.type === 'Person' && Object.keys(c).includes('name')) {
          c.fullName = c.name
          delete c.name
        } else if (
          c.type === 'Organization' &&
          Object.keys(c).includes('fullName')
        ) {
          c.name = c.fullName
          delete c.fullName
        }
        /*
         * If (creator.role)
         *   c.roles = [
         *     {
         *       value: creator.role
         *     }
         *   ]
         */
        if (c.type === 'Person' && creator.orcid) {
          c.extraProperties = [
            {
              category: 'ORCID',
              values: [
                {
                  value: creator.orcid
                }
              ]
            }
          ]
        }
        /*
         * Why delete? Messes up form
         * delete c.type
         * delete c.role
         * delete c.orcid
         */
        return c
      }),
      types: this.data.types.map((type) => {
        return {
          information: {
            value: type
          }
        }
      }),
      version: this.data.version,
      privacy: this.data.privacy,
      licenses: this.data.licenses.map((license) => {
        return {
          name: license
        }
      }),
      distributions: [
        {
          formats: this.data.formats.map((format) => {
            const nifti = ['NIFTI', 'NII', 'NIIGZ']
            const gifti = ['GIFTI', 'GII']
            const f = format.toUpperCase().replace(/\./g, '')
            if (nifti.includes(f)) {
              return 'NIfTI'
            } else if (gifti.includes(f)) {
              return 'GIfTI'
            } else if (f === 'BIGWIG') {
              return 'bigWig'
            } else if (f === 'RNA-SEQ') {
              return 'RNA-Seq'
            }
            return f
          }),
          size: parseFloat(this.data.size.value),
          unit: {
            value: this.data.size.units
          },
          access: {
            landingPage: this.data.access.landingPage,
            authorizations: [
              {
                value: this.data.access.authorization
              }
            ]
          }
        }
      ],
      primaryPublications: this.data.primaryPublications.map((pp) => {
        return Object.assign(pp, {
          dates: pp.dates.map((date) => {
            /*
             * Let parsedDate;
             * if (Date.parse(date.date)) { // Vérifier si date.date est déjà une date valide
             *   parsedDate = new Date(date.date);
             * } else {
             *   parsedDate = parseISO(date.date); // Essayer de parser comme ISO si ce n'est pas une date valide
             * }
             */

            return Object.assign(date, {
              // Date: isValid(parsedDate) ? `${format(parsedDate, 'yyyy-MM-dd')} 00:00:00` : "Date invalide",
              date: `${date.date}`,
              type: {
                // Value: date.type.value.toLowerCase()
                value:
                  date.type && date.type.value
                    ? date.type.value.toLowerCase()
                    : ' '
              }
            })
          })
        })
      }),
      isAbout: this.data.isAbout.map((item) => {
        const i = item
        const species = {
          'Homo sapiens': '9606',
          'Mus musculus': '10090',
          'Callithrix jacchus': '9483',
          'Ondatra zibethicus': '10060',
          'Macaca mulatta': '9544'
        }
        if (i.type === 'Species' && Object.keys(species).includes(i.name)) {
          i.identifier = {
            identifier: `https://www.ncbi.nlm.nih.gov/taxonomy/${
              species[i.name]
            }`,
            identifierSource: 'NCBI Taxonomy Database'
          }
        }
        delete i.type
        return i
      }),
      spatialCoverage: this.data.spatialCoverage,
      aggregation: this.data.aggregation,
      dimensions: this.data.dimensions.map((item) => {
        return {
          name: {
            value: item.name
          },
          description: item.description
        }
      }),
      acknowledges: [
        {
          name: 'Grants',
          funders: this.data.acknowledges
        }
      ],

      keywords: this.data.keywords.map((keyword) => {
        return {
          value: keyword
        }
      })
    }

    const extraProperties = {
      subjects: this.data.subjects,
      files: this.data.files,
      conpStatus: this.data.conpStatus,
      origin: this.data.origin,
      logo: this.data.logo,
      registrationPageURL: this.data.registrationPageURL,
      contact: this.data.contact,
      derivedFrom: this.data.derivedFrom,
      parentDatasetId: this.data.parentDatasetId,
      experimentFunctionAssessed: this.data.experimentFunctionAssessed,
      experimentLanguages: this.data.experimentLanguages,
      experimentValidationMeasures: this.data.experimentValidationMeasures,
      experimentValidationPopulations:
        this.data.experimentValidationPopulations,
      experimentAccessibility: this.data.experimentAccessibility,
      experimentModalities: this.data.experimentModalities,
      experimentRequiredDevices: this.data.experimentRequiredDevices,
      experimentRequiredSoftware: this.data.experimentRequiredSoftware,
      experimentStimuli: this.data.experimentStimuli,
      experimentAdditionalRequirements:
        this.data.experimentAdditionalRequirements,
      loris: this.data.loris
    }

    if (this.data.privacy === 'open') {
      let ethicsStatement =
        'In submitting this dataset for inclusion, I declare that'

      switch (this.data.reb_info.option) {
        case 'option_1':
          ethicsStatement +=
            `${ethicsStatement} participants have provided a valid informed consent to` +
            ` the de-identification and deposit of their data` +
            ` in an open-access portal.`
          break
        case 'option_2':
          ethicsStatement +=
            `${ethicsStatement} a waiver or other authorization to deposit these` +
            ` de-identified data in an open-access portal was` +
            ` obtained from a research ethics body` +
            ` (REB, IRB, REC, etc.).`
          break
        case 'option_3':
          ethicsStatement +=
            `${ethicsStatement} local law or a relevant institutional authorization` +
            ` otherwise enables the deposit of these data in an` +
            ` open-access portal.`
          break
        case 'option_4':
          ethicsStatement += `${ethicsStatement} these data are not derived from human participants.`
          break
        default:
          break
      }

      extraProperties.reb_info = {
        ...this.data.reb_info,
        option: this.data.reb_info.option,
        statement: ethicsStatement
      }
    }

    json.extraProperties = extraProperties

    if (json.isAbout.length === 0) {
      delete json.isAbout
    }
    if (json.spatialCoverage.length === 0) {
      delete json.spatialCoverage
    }
    if (json.aggregation === '') {
      delete json.aggregation
    }
    if (json.dimensions.length === 0) {
      delete json.dimensions
    }
    if (json.acknowledges[0].funders.length === 0) {
      delete json.acknowledges
    }
    if (json.keywords.length === 0) {
      delete json.keywords
    }
    if (json.dates.length === 0) {
      delete json.dates
    }
    if (json.identifier.identifier === '') {
      delete json.identifier
    }
    if (json.primaryPublications.length === 0) {
      delete json.primaryPublications
    }
    if (json.extraProperties.loris.length === 0) {
      delete json.extraProperties.loris
    }

    Object.keys(json).forEach((key) => json[key] === null && delete json[key])

    return json
  }
}

export default FormToDats
