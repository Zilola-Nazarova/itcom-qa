import {
  COMMENT_LIMITS,
  ANSWER_LIMITS,
  QUESTION_LIMITS,
} from "@/lib/constants";

export function validateQuestion(data: {
  title: string;
  content: string;
  tags: string[];
}) {
  const errors: {
    title: string;
    content: string;
    tags: string;
  } = { title: "", content: "", tags: "" };

  if (!data.title || data.title.trim().length < QUESTION_LIMITS.TITLE_MIN) {
    errors.title = `Title must be at least ${QUESTION_LIMITS.TITLE_MIN} characters.`;
  } else if (data.title.length > QUESTION_LIMITS.TITLE_MAX) {
    errors.title = `Title too long (max ${QUESTION_LIMITS.TITLE_MAX} characters).`;
  }

  if (!data.content || data.content.trim().length < QUESTION_LIMITS.CONTENT_MIN) {
    errors.content = `Content must be at least ${QUESTION_LIMITS.CONTENT_MIN} characters.`;
  } else if (data.content.length > QUESTION_LIMITS.CONTENT_MAX) {
    errors.content = `Content too long (max ${QUESTION_LIMITS.CONTENT_MAX} characters).`;
  }

  if (!data.tags || data.tags.length < QUESTION_LIMITS.TAG_MIN) {
    errors.tags = `Select at least ${QUESTION_LIMITS.TAG_MIN} tag.`;
  } else if (data.tags.length > QUESTION_LIMITS.TAG_MAX) {
    errors.tags = `No more than ${QUESTION_LIMITS.TAG_MAX} tags allowed.`;
  }

  return errors;
}

export function validateAnswer(data: { content: string }) {
  if (!data.content || data.content.trim().length < ANSWER_LIMITS.MIN) {
    return `Answer must be at least ${ANSWER_LIMITS.MIN} characters.`;
  }
  if (data.content.length > ANSWER_LIMITS.MAX) {
    return `Answer too long (max ${ANSWER_LIMITS.MAX} characters).`;
  }
  return null;
}

export function validateComment(data: { content: string }) {
  if (!data.content || data.content.trim().length < COMMENT_LIMITS.MIN) {
    return `Comment must be at least ${COMMENT_LIMITS.MIN}  characters.`;
  }
  if (data.content.length > 500) {
    return `Comment too long (max ${COMMENT_LIMITS.MAX} characters).`;
  }
  return null;
}
