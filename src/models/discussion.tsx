import mongoose from "mongoose";

export interface Highlight {
  highlight_id: number;
  offset: number;
  length: number;
  from_thread_id: number;
  to_thread_id: number;
}

export interface Comment {
  comment_id: number;
  user_name: string;
  content: string;
  created_on: number;
  highlights: Highlight[];
  whole_to_thread_id: number;
}

export interface Thread {
  thread_id: number;
  parent_thread_id: number;
  quote_by: string;
  quote: string;
  comments: Comment[];
}

export interface Discussions extends mongoose.Document {
  created_on: number;
  thread_id: number;
  title: string;
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
  content: { type: String },
  highlights: [
    {
      highlight_id: Number,
      offset: Number,
      length: Number,
      from_thread_id: Number,
      to_thread_id: Number,
    },
  ],
  user_name: { type: String },
  comments: [
    {
      comment_id: Number,
      user_name: String,
      content: String,
      created_on: { type: Number },
      highlights: [
        {
          highlight_id: Number,
          offset: Number,
          length: Number,
          from_thread_id: Number,
          to_thread_id: Number,
        },
      ],
      whole_to_thread_id: Number,
    },
  ],
  threads: [
    {
      thread_id: Number,
      parent_thread_id: Number,
      quote_by: String,
      quote: String,
      comments: [
        {
          comment_id: Number,
          user_name: String,
          content: String,
          created_on: { type: Number },
          highlights: [
            {
              highlight_id: Number,
              offset: Number,
              length: Number,
              from_thread_id: Number,
              to_thread_id: Number,
            },
          ],
          whole_to_thread_id: Number,
        },
      ],
    },
  ],
});

export default mongoose.models.Discussion ||
  mongoose.model<Discussions>("Discussion", DiscussionSchema);
