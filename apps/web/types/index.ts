import type {
  User,
  Question,
  Answer,
  Comment,
  Vote,
  Tag,
  QuestionTag,
} from "@/lib/db";

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

export type QuestionWithAuthorAndVotes = Question & {
  author: User;
  _count: {
    comments: number;
    answers: number;
  };
  upvotes: number;
  downvotes: number;
};

export type PageProps = {
  params: { id: string };
};

export type VotesCount = {
  resourceId: string;
  likes: number;
  dislikes: number;
};
