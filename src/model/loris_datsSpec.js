import * as yup from 'yup'

const lorisDatsSchema = yup.object().shape({
  lorisId: yup.string().required(),
  externalId: yup.string().required(),
  shortName: yup.string().required(),
  alias: yup.string().required(),
  candidateAgeMin: yup.number().positive(),
  candidateAgeMax: yup.number().positive(),
  visits: yup.array().of(
    yup.object().shape({
      visitLabel: yup.string().required(),
      windowMinDays: yup.number().positive(),
      windowMaxDays: yup.number().positive(),
      optimumMinDays: yup.number().positive(),
      optimumMaxDays: yup.number().positive(),
      windowMidpointDays: yup.number().positive()
    })
  ),
  instruments: yup.array().of(
    yup.object().shape({
      name: yup.string().required(),
      label: yup.string().required(),
      survey: yup.boolean()
    })
  )
})

const defaultLorisDatsValues = {
  lorisId: '',
  externalId: '',
  shortName: '',
  alias: '',
  candidateAgeMin: '',
  candidateAgeMax: '',
  visits: [],
  instruments: []
}

export { lorisDatsSchema, defaultLorisDatsValues }
