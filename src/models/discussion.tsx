import mongoose from "mongoose";

export interface Highlight {
  highlight_id: number;
  start: string;
  startOffset: number;
  end: string;
  endOffset: number;
  thread_id: number;
  comment_id: number;
  to_thread_id: number;
}

export interface Comment {
  comment_id: number;
  thread_id: number;
  user_name: string;
  content: string;
  created_on: number;
  highlights: Highlight[];
  is_conclusion: boolean;
}

export interface Thread {
  thread_id: number;
  from_thread_id: number;
  from_comment_id: number;
  from_highlight_id: number;
  quote_by: string;
  quote: string;
  comments: Comment[];
}

export interface Discussions extends mongoose.Document {
  created_on: number;
  thread_id: number;
  title: string;
  read_only: boolean;
  content: string;
  highlights: Highlight[];
  user_name: string;
  comments: Comment[];
  threads: Thread[];
}

const DiscussionSchema = new mongoose.Schema<Discussions>({
  created_on: { type: Number },
  thread_id: { type: Number },
  title: { type: String },
  read_only: { type: Boolean },
  content: { type: String },
  highlights: [
    {
      highlight_id: Number,
      start: String,
      startOffset: Number,
      end: String,
      endOffset: Number,
      thread_id: Number,
      comment_id: Number,
      to_thread_id: Number,
    },
  ],
  user_name: { type: String },
  comments: [
    {
      comment_id: Number,
      thread_id: Number,
      user_name: String,
      content: String,
      created_on: Number,
      highlights: [
        {
          highlight_id: Number,
          start: String,
          startOffset: Number,
          end: String,
          endOffset: Number,
          thread_id: Number,
          comment_id: Number,
          to_thread_id: Number,
        },
      ],
      is_conclusion: Boolean,
    },
  ],
  threads: [
    {
      thread_id: Number,
      from_thread_id: Number,
      from_comment_id: Number,
      from_highlight_id: Number,
      quote_by: String,
      quote: String,
      comments: [
        {
          comment_id: Number,
          thread_id: Number,
          user_name: String,
          content: String,
          created_on: Number,
          highlights: [
            {
              highlight_id: Number,
              start: String,
              startOffset: Number,
              end: String,
              endOffset: Number,
              thread_id: Number,
              comment_id: Number,
              to_thread_id: Number,
            },
          ],
          is_conclusion: Boolean,
        },
      ],
    },
  ],
});

export default mongoose.models.Discussion ||
  mongoose.model<Discussions>("Discussion", DiscussionSchema);
