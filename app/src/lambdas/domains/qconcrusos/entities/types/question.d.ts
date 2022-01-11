export type Header = {
  id: string;
  url: string;
  subjectUrl?: string;
  subjectName?: string;
};

export type Info = {
  year: string;
  juryName?: string;
  juryUrl?: string;
  organName?: string;
  organUrl?: string;
  examName?: string;
  examUrl?: string;
};

export type Enunciation = {
  image?: string;
  description: string;
};

export type Alternative = {
  key: string;
  value: string;
};

export type Body = {
  enunciation: Enunciation;
  alternatives: Alternative[];
  answer: string;
};

export type Question = {
  header: Header;
  info: Info;
  body: Body;
  filter: string;
};
