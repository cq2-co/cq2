export const ChatData = {
  channel_id: 0,
  channel_name: "AI Chat",
  thread_id: 0,
  created_on: 1708620881590,
  team_id: 0,
  comments: [
    {
      comment_id: 3,
      user_id: "nathan",
      user_name: "Nathan",
      content:
        'Human raters make systematic errors - regular, compactly describable, predictable errors.... This is indeed one of the big problems of outer alignment, but there\'s lots of ongoing research and promising ideas for fixing it. Namely, using models to help amplify and improve the human feedback signal. Because P!=NP it\'s easier to verify proofs than to write them. Obviously alignment isn\'t about writing proofs, but the general principle does apply. You can reduce "behaving well" to "answering questions truthfully" by asking questions like "did the agent follow the instructions in this episode?", and use those to define the reward function. These questions are not formulated in formal language where verification is easy, but there\'s reason to believe that verification is also easier than proof-generation for informal arguments.',
      created_on: 1709893560940,
      highlights: [
        {
          highlight_id: 0,
          offset: 156,
          length: 66,
          from_thread_id: 0,
          to_thread_id: 3,
        },
        {
          highlight_id: 1,
          offset: 300,
          length: 62,
          from_thread_id: 0,
          to_thread_id: 8,
        },
      ],
      whole_to_thread_id: null,
    },
    {
      comment_id: 2,
      user_id: "nathan",
      user_name: "Nathan",
      content:
        "One claim is that Capabilities generalize further than alignment once capabilities start to generalize far. The argument is that an agent's world model and tactics will be automatically fixed by reasoning and data, but its inner objective won't be changed by these things. I agree with the preceding sentence, but I would draw a different (and more optimistic) conclusion from it. That it might be possible to establish an agent's inner objective when training on easy problems, when the agent isn't very capable, such that this objective remains stable as the agent becomes more powerful.\nAlso, there's empirical evidence that alignment generalizes surprisingly well: several thousand instruction following examples radically improve the aligned behavior on a wide distribution of language tasks (InstructGPT paper) a prompt with about 20 conversations gives much better behavior on a wide variety of conversational inputs (HHH paper). Making a contemporary language model well-behaved seems to be much easier than teaching it a new cognitive skill.",
      created_on: 1709893534133,
      highlights: [
        {
          highlight_id: 0,
          offset: 381,
          length: 208,
          from_thread_id: 0,
          to_thread_id: 2,
        },
      ],
      whole_to_thread_id: null,
    },
    {
      comment_id: 1,
      user_id: "nathan",
      user_name: "Nathan",
      content:
        "Several of the points here are premised on needing to do a pivotal act that is way out of distribution from anything the agent has been trained on. But it's much safer to deploy AI iteratively; increasing the stakes, time horizons, and autonomy a little bit each time. With this iterative approach to deployment, you only need to generalize a little bit out of distribution. Further, you can use Agent N to help you closely supervise Agent N+1 before giving it any power.",
      created_on: 1709893527606,
      highlights: [
        {
          highlight_id: 1,
          offset: 0,
          length: 147,
          from_thread_id: 0,
          to_thread_id: 7,
        },
        {
          highlight_id: 0,
          offset: 148,
          length: 323,
          from_thread_id: 0,
          to_thread_id: 1,
        },
      ],
      whole_to_thread_id: null,
    },
    {
      comment_id: 0,
      user_id: "nathan",
      user_name: "Nathan",
      content:
        "Found this to be an interesting list of challenges, but I disagree with a few points:",
      created_on: 1709893522186,
      highlights: [],
      whole_to_thread_id: null,
    },
  ],
  threads: [
    {
      thread_id: 3,
      parent_thread_id: 0,
      quote:
        "there's lots of ongoing research and promising ideas for fixing it",
      quote_by: "Nathan",
      quote_parent_comment_created_on: 1709893560940,
      comments: [
        {
          comment_id: 1,
          user_id: "ava",
          user_name: "Ava",
          content:
            "I sometimes see people suggest that the model should always or never conform to the human's systematic errors, but it seems to me like we need to somehow distinguish between systematic \"errors\" that are 'value judgments' (\"oh, it's not that the human prefers 5 deaths to 1 death, it's that they are opposed to this 'murder' thing that I should figure out\") and systematic errors that are 'bounded rationality' or 'developmental levels' (\"oh, it's not that the (very young) human prefers less water to more water, it's that they haven't figured out conservation of mass yet\"). It seems pretty sad if we embed all of our confusions into the AI forever--and also pretty sad if we end up not able to transfer any values because all of them look like confusions.",
          created_on: 1709893666915,
          highlights: [],
          whole_to_thread_id: null,
        },
        {
          comment_id: 0,
          user_id: "ava",
          user_name: "Ava",
          content:
            "I'm optimistic about this too, but... I want to make sure we're looking at the same problem, or something? I think my sense is best expressed in Stanovich and West, where they talk about four responses to the presence of systematic human misjudgments. The 'performance error' response is basically the 'epsilon-rationality' assumption; 1-ε of the time humans make the right call, and ε of the time they make a random call. While a fine model of performance errors, it doesn't accurately predict what's happening with systematic errors, which are predictable instead of stochastic.",
          created_on: 1709893664322,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 4,
      parent_thread_id: 1,
      quote:
        "Still, iterative deployment with gradually increasing stakes is much safer than deploying a model to do something totally unprecedented and high-stakes.",
      quote_by: "Nathan",
      quote_parent_comment_created_on: 1709893812362,
      comments: [
        {
          comment_id: 0,
          user_id: "ava",
          user_name: "Ava",
          content:
            "I agree with the \"X is safer than Y\" claim; I am uncertain whether it's practically available to us, and much more worried in worlds where it isn't available.",
          created_on: 1709893907133,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 1,
      parent_thread_id: 0,
      quote:
        "But it's much safer to deploy AI iteratively; increasing the stakes, time horizons, and autonomy a little bit each time. With this iterative approach to deployment, you only need to generalize a little bit out of distribution. Further, you can use Agent N to help you closely supervise Agent N+1 before giving it any power.",
      quote_by: "Nathan",
      quote_parent_comment_created_on: 1709893527606,
      comments: [
        {
          comment_id: 2,
          user_id: "nathan",
          user_name: "Nathan",
          content:
            "I agree that capabilities sometimes emerge abruptly and unexpectedly. Still, iterative deployment with gradually increasing stakes is much safer than deploying a model to do something totally unprecedented and high-stakes. There are multiple ways to make deployment more conservative and gradual. (E.g., incrementally increase the amount of work the AI is allowed to do without close supervision, incrementally increase the amount of KL-divergence between the new policy and a known-to-be-safe policy.)",
          created_on: 1709893812362,
          highlights: [
            {
              highlight_id: 0,
              offset: 70,
              length: 152,
              from_thread_id: 1,
              to_thread_id: 4,
            },
            {
              highlight_id: 1,
              offset: 304,
              length: 198,
              from_thread_id: 1,
              to_thread_id: 5,
            },
          ],
          whole_to_thread_id: null,
        },
        {
          comment_id: 1,
          user_id: "ava",
          user_name: "Ava",
          content:
            'A specific example: if you have a neural network with enough capacity to 1) memorize specific multiplication Q+As and 2) implement a multiplication calculator, my guess is that during training you\'ll see a discontinuity in how many pairs of numbers it can successfully multiply. It is not obvious to me whether or not there are relevant capabilities like this that we\'ll "find with neural nets" instead of "explicitly programming in"; probably we will just build AlphaZero so that it uses MCTS instead of finding MCTS with gradient descent, for example.',
          created_on: 1709893600439,
          highlights: [],
          whole_to_thread_id: null,
        },
        {
          comment_id: 0,
          user_id: "ava",
          user_name: "Ava",
          content:
            "My model of Patrick claims that there are some capabilities that are 'smooth', like \"how large a times table you've memorized\", and some are 'lumpy', like \"whether or not you see the axioms behind arithmetic.\" While it seems plausible that we can iteratively increase smooth capabilities, it seems much less plausible for lumpy capabilities. ",
          created_on: 1709893599385,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 5,
      parent_thread_id: 1,
      quote:
        "incrementally increase the amount of work the AI is allowed to do without close supervision, incrementally increase the amount of KL-divergence between the new policy and a known-to-be-safe policy.)",
      quote_by: "Nathan",
      quote_parent_comment_created_on: 1709893812362,
      comments: [
        {
          comment_id: 0,
          user_id: "ava",
          user_name: "Ava",
          content:
            'For this specific proposal, when I reframe it as "give the system a KL-divergence budget to spend on each change to its policy" I worry that it works against a stochastic attacker but not an optimizing attacker; it may be the case that every known-to-be-safe policy has some unsafe policy within a reasonable KL-divergence of it, because the danger can be localized in changes to some small part of the overall policy-space.',
          created_on: 1709893929630,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 2,
      parent_thread_id: 0,
      quote:
        "That it might be possible to establish an agent's inner objective when training on easy problems, when the agent isn't very capable, such that this objective remains stable as the agent becomes more powerful.",
      quote_by: "Nathan",
      quote_parent_comment_created_on: 1709893534133,
      comments: [
        {
          comment_id: 3,
          user_id: "nathan",
          user_name: "Nathan",
          content:
            "There are definitely some tricky issues here, but the problem might not be so bad with the current paradigm, where you start with a pretrained model (which doesn't really have goals and isn't good at long-horizon control), and fine-tune it (which makes it better at goal-directed behavior). In this case, most of the concepts are learned during the pretraining phase, not the fine-tuning phase where it learns goal-directed behavior.",
          created_on: 1709893866901,
          highlights: [
            {
              highlight_id: 0,
              offset: 50,
              length: 239,
              from_thread_id: 2,
              to_thread_id: 6,
            },
          ],
          whole_to_thread_id: null,
        },
        {
          comment_id: 2,
          user_id: "ava",
          user_name: "Ava",
          content:
            "Second, suppose the agent's inner objective is externally located: \"seek out mom pressing the reward button\". Then you run into 18, which argues that once the agent realizes that the 'reward button' is an object in its environment instead of a communication channel between the human and itself, it may optimize for the object instead of 'being able to hear what the human would freely communicate' or whatever philosophically complicated variable it is that we care about. [Note that attempts to express this often need multiple patches and still aren't fixed; \"mom approves of you\" can be coerced, \"mom would freely approve of you\" has a trouble where you have some freedom in identifying your concept of 'mom' which means you might pick one who happens to approve of you.]",
          created_on: 1709893632106,
          highlights: [],
          whole_to_thread_id: null,
        },
        {
          comment_id: 1,
          user_id: "ava",
          user_name: "Ava",
          content:
            'First, suppose the agent\'s inner objective is internally located: "seek out pleasant tastes." Then you run into 16 and 17, where you can\'t quite be sure what it means by "pleasant tastes", and you don\'t have a great sense of what "pleasant tastes" will extrapolate to at the next level of capabilities. [One running "joke" in EA is that, on some theories of what morality is about, the highest-value universe is one which contains an extremely large number of rat brains on heroin. I think this is the correct extrapolation / maximization of at least one theory which produces good behavior when implemented by humans today, which makes me pretty worried about this sort of extrapolation.]',
          created_on: 1709893628947,
          highlights: [],
          whole_to_thread_id: null,
        },
        {
          comment_id: 0,
          user_id: "ava",
          user_name: "Ava",
          content:
            "IMO this runs into two large classes of problems, both of which I put under the heading 'ontological collapse':",
          created_on: 1709893621066,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 6,
      parent_thread_id: 2,
      quote:
        "the problem might not be so bad with the current paradigm, where you start with a pretrained model (which doesn't really have goals and isn't good at long-horizon control), and fine-tune it (which makes it better at goal-directed behavior)",
      quote_by: "Nathan",
      quote_parent_comment_created_on: 1709893866901,
      comments: [
        {
          comment_id: 0,
          user_id: "ava",
          user_name: "Ava",
          content:
            "Yeah, I agree that this seems pretty good. I do naively guess that when you do the fine-tuning, it's the concepts that are most related to the goals who change the most (as they have the most gradient pressure on them); it'd be nice to know how much this is the case, vs. most of the relevant concepts being durable parts of the environment that were already very important for goal-free prediction.",
          created_on: 1709893960989,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 7,
      parent_thread_id: 0,
      quote:
        "Several of the points here are premised on needing to do a pivotal act that is way out of distribution from anything the agent has been trained on.",
      quote_by: "Nathan",
      quote_parent_comment_created_on: 1709893527606,
      comments: [
        {
          comment_id: 1,
          user_id: "nathan",
          user_name: "Nathan",
          content:
            "Do alignment & safety research, set up regulatory bodies and monitoring systems.",
          created_on: 1709894150144,
          highlights: [],
          whole_to_thread_id: null,
        },
        {
          comment_id: 0,
          user_id: "caleb",
          user_name: "Caleb",
          content:
            "To do what, exactly, in this nice iterated fashion, before Facebook AI Research destroys the world six months later?  What is the weak pivotal act that you can perform so safely?",
          created_on: 1709894143349,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
    {
      thread_id: 8,
      parent_thread_id: 0,
      quote: "Because P!=NP it's easier to verify proofs than to write them.",
      quote_by: "Nathan",
      quote_parent_comment_created_on: 1709893560940,
      comments: [
        {
          comment_id: 1,
          user_id: "nathan",
          user_name: "Nathan",
          content:
            "Not sure exactly what this means. I'm claiming that you can make raters less flawed, for example, by decomposing the rating task, and providing model-generated critiques that help with their rating. Also, as models get more sample efficient, you can rely more on highly skilled and vetted raters.",
          created_on: 1709894199428,
          highlights: [],
          whole_to_thread_id: null,
        },
        {
          comment_id: 0,
          user_id: "caleb",
          user_name: "Caleb",
          content:
            "When the rater is flawed, cranking up the power to NP levels blows up the P part of the system.",
          created_on: 1709894187175,
          highlights: [],
          whole_to_thread_id: null,
        },
      ],
    },
  ],
};
