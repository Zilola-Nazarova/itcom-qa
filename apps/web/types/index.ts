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

export type RenderTag = Tag & {
  questionCount: number;
  growth: number;
};

export type FullAnswer = Answer & {
  author: User;
  votes: Vote[];
  comments: FullComment[];
};

export type QuestionTagWithTag = QuestionTag & {
  tag: Tag;
};

export type QuestionDetails = Question & {
  author: User;
  tags: Tag[];
  answers: FullAnswer[];
  votes: Vote[];
  comments: FullComment[];
};

export type QuestionsList = Question & {
  author: User;
  tags: Tag[];
  _count: {
    comments: number;
    answers: number;
  };
  upvotes: number;
  downvotes: number;
};
export type QuestionsWithPagination = QuestionsList[] & {
  data: QuestionsList[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  pagination: {
    last_visible_page: number;
  };
}
export type PageProps = {
  params: { id: string };
};

export type VotesCount = {
  resourceId: string;
  likes: number;
  dislikes: number;
};

export type Sort = {
  value: string;
  name: string;
}