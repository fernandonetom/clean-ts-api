export interface AddSurveyModel {
  question: string
  answers: Answer[]
}

interface Answer {
  image?: string
  answer: string
}

export interface AddSurvey {
  add: (account: AddSurveyModel) => Promise<void>
}
