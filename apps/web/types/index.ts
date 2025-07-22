import type {
  User,
  Question,
  Answer,
  Comment,
  Vote,
  Tag,
  QuestionTag,
} from '@/lib/db';

export type FullComment = Comment & {
  author: User;
};

export type FullAnswer = Answer & {
  author: User;
  votes: Vote[];
  comments: FullComment[];
};

export type QuestionTagWithTag = QuestionTag & {
  tag: Tag;
};

export type FullQuestion = Question & {
  author: User;
  tags: QuestionTagWithTag[];
  answers: FullAnswer[];
  votes: Vote[];
  comments: FullComment[];
};

export type QuestionWithAuthor = Question & {
  author: User;
};

export type PageProps = {
  params: { id: string };
};