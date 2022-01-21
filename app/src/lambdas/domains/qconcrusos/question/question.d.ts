type alternatives = {
  value: string;
  key: string;
};

type enunciation = {
  image: string;
  description: string;
};

export type question = {
  questionId: string;
  questionURL: string;
  organUrl: string;
  alternatives: [alternatives];
  juryUrl: string;
  enunciation: enunciation;
  examUrl: string;
  subjectName: string;
  organName: string;
  juryName: string;
  answer: string;
  filter: string;
  subjectURL: string;
  year: string;
  organUexamNamerl: string;
};
