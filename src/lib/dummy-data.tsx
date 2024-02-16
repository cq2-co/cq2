const DemoData = {
  discussion_id: 1,
  thread_id: 0,
  title: "CQ2 is a new tool for discussions; let's give it a shot?",
  content:
    "Hey team! I recently came across this new tool for discussions called CQ2, and it seems like it could solve a lot of the problems we've been facing. It allows creating n-level sliding pane threads around quotes as well as whole comments. We can see all the comments and parent threads of a specific thread in the same view. It's easier to tell if any key points were overlooked because it let's you clearly see which parts of the discussion became sub-discussions and which didn't. And, no more copy-pasting quotes! What do you all think? I'm also excited for the new features they're going to come up with in future.",
  timestamp: 1707465042346,
  highlights: [
    {
      highlight_id: 1,
      offset: 168,
      length: 68,
      from_thread_id: 0,
      to_thread_id: 1,
    },
    {
      highlight_id: 2,
      offset: 487,
      length: 28,
      from_thread_id: 0,
      to_thread_id: 2,
    },
  ],
  user_id: "caleb",
  user_name: "Caleb",
  channel_id: 1,
  team_id: 1,
  comments: [
    {
      comment_id: 1,
      user_id: "ava",
      user_name: "Ava",
      timestamp: 1707469177174,
      content:
        "Cool! Sounds like it could bring some much-needed structure to our discussions.",
      highlights: [],
      whole_to_thread_id: null,
    },
    {
      comment_id: 2,
      user_id: "nathan",
      user_name: "Nathan",
      content:
        "I'm on board too. It's a refreshing change from the current mess of quotes.",
      timestamp: 1707469179174,
      highlights: [],
      whole_to_thread_id: null,
    },
  ],
  threads: [
    {
      thread_id: 1,
      parent_thread_id: 0,
      quote:
        "n-level sliding pane threads around quotes as well as whole comments",
      quote_by: "Caleb",
      comments: [
        {
          comment_id: 1,
          user_id: "caleb",
          user_name: "Caleb",
          content:
            "Note that creating a thread around a specific quote is different and more precise than creating a thread from the whole comment, which you may have seen in some communication tools.",
          timestamp: 1707465042346,
          highlights: [],
          whole_to_thread_id: null,
        },
        {
          comment_id: 2,
          user_id: "kyoko",
          user_name: "Kyoko",
          content:
            "This is interesting! No other tool has n-level threads, right?",
          timestamp: 1707465042346,
          highlights: [
            {
              highlight_id: 1,
              offset: 21,
              length: 41,
              from_thread_id: 1,
              to_thread_id: 3,
            },
          ],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 2,
      parent_thread_id: 0,
      quote: "no more copy-pasting quotes!",
      quote_by: "Caleb",
      comments: [
        {
          comment_id: 1,
          user_id: "kyoko",
          user_name: "Kyoko",
          content:
            "That's a relief! But then how do we create new threads from quotes?",
          timestamp: 1707465042346,
          highlights: [
            {
              highlight_id: 1,
              offset: 26,
              length: 41,
              from_thread_id: 2,
              to_thread_id: 4,
            },
          ],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 3,
      parent_thread_id: 1,
      quote: "No other tool has n-level threads, right?",
      quote_by: "Kyoko",
      comments: [
        {
          comment_id: 1,
          user_id: "ava",
          user_name: "Ava",
          content:
            "As far as I know, yes. I've only seen as far as 1-level threads in some communication tools.",
          timestamp: 1707465042346,
          highlights: [],
          whole_to_thread_id: null,
        },
        {
          comment_id: 3,
          user_id: "caleb",
          user_name: "Caleb",
          content:
            "Kind of, yes. There are forums (like Reddit) with n-level threads in a tree-like structure but CQ2's n-level threads in the sliding pane interface is more apt for thoughtful and coherent discussions.",
          timestamp: 1707465052346,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 4,
      parent_thread_id: 2,
      quote: "how do we create new threads from quotes?",
      quote_by: "Kyoko",
      comments: [
        {
          comment_id: 1,
          user_id: "caleb",
          user_name: "Caleb",
          content:
            "You can just select the text you want to quote and click the 'Comment in new thread' button which pops up.",
          timestamp: 1707465052346,
          highlights: [],
          whole_to_thread_id: null,
        },
        {
          comment_id: 2,
          user_id: "nathan",
          user_name: "Nathan",
          content:
            "And you can create a new thread around a quote from the main post and from any comment!",
          timestamp: 1707465052346,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
  ],
};

export default DemoData;
