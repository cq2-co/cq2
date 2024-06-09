export const DummyDiscussionData = {
  _id: "demo",
  thread_id: 0,
  title: "AGI Ruin: A List of Lethalities",
  content:
    "<p>There are two fundamentally different approaches you can potentially take to alignment, which are unsolvable for two different sets of reasons; therefore, by becoming confused and ambiguating between the two approaches, you can confuse yourself about whether alignment is necessarily difficult. The first approach is to build a CEV-style Sovereign which wants exactly what we extrapolated-want and is therefore safe to let optimize all the future galaxies without it accepting any human input trying to stop it. The second course is to build corrigible AGI which doesn't want exactly what we want, and yet somehow fails to kill us and take over the galaxies despite that being a convergent incentive there.</p><p></p><p>(1) The first thing generally, or CEV specifically, is unworkable because the complexity of what needs to be aligned or meta-aligned for our Real Actual Values is far out of reach for our FIRST TRY at AGI. Yes I mean specifically that the dataset, meta-learning algorithm, and what needs to be learned, is far out of reach for our first try. It's not just non-hand-codable, it is unteachable on-the-first-try because the thing you are trying to teach is too weird and complicated.</p><p></p><p>(2) The second thing looks unworkable (less so than CEV, but still lethally unworkable) because corrigibility runs actively counter to instrumentally convergent behaviors within a core of general intelligence (the capability that generalizes far out of its original distribution). You're not trying to make it have an opinion on something the core was previously neutral on. You're trying to take a system implicitly trained on lots of arithmetic problems until its machinery started to reflect the common coherent core of arithmetic, and get it to say that as a special case 222 + 222 = 555. You can maybe train something to do this in a particular training distribution, but it's incredibly likely to break when you present it with new math problems far outside that training distribution, on a system which successfully generalizes capabilities that far at all.</p>",
  created_on: 1708620881590,
  highlights: [
    {
      highlight_id: 0,
      offset: 4,
      length: 480,
      paragraph_id: 2,
      from_thread_id: 0,
      to_thread_id: 1,
    },
  ],
  user_name: "Eliezer",
  comments: [],
  threads: [
    {
      thread_id: 3,
      from_thread_id: 1,
      quote:
        "<p>There are shards of planning and optimization and goal-oriented-ness in a cat's brain, but 'figure out what utopia would look like for a cat' is a far harder problem than 'identify all of the goal-encoding parts of the cat's brain and \"read off\" those goals'. E.g., does 'identifying utopia' in this context involve uplifting or extrapolating the cat? Why, or why not? And if so, how does that process work?</p>",
      quote_by: "Rob",
      comments: [
        {
          comment_id: 0,
          user_name: "Vanessa",
          content:
            "<p>I'm actually not sure that cats (as opposed to humans) are sufficiently \"general\" intelligence for the process to make sense. This is because I think humans are doing something like Turing RL (where consciousness plays the role of the \"external computer\"), and value learning is going to rely on that. The issue is, you don't only need to infer the agent's preferences but you also need to optimize them better than the agent itself. This might pose a difficulty, if, as I suggested above, imperfect agents have imperfectly defined preferences. While I can see several hypothetical solutions, the TRL model suggests a natural approach where the AI's capability advantage is reduced to having a better external computer (and/or better interface with that computer). This might not apply to cats which (I'm guessing) don't have this kind of consciousness because (I'm guessing) the evolution of consciousness was tied to language and social behavior.</p>",
          created_on: 1711134633913,
          highlights: [],

          is_conclusion: false,
        },
      ],
    },
    {
      thread_id: 1,
      from_thread_id: 0,
      quote:
        "<p>The first thing generally, or CEV specifically, is unworkable because the complexity of what needs to be aligned or meta-aligned for our Real Actual Values is far out of reach for our FIRST TRY at AGI. Yes I mean specifically that the dataset, meta-learning algorithm, and what needs to be learned, is far out of reach for our first try. It's not just non-hand-codable, it is unteachable on-the-first-try because the thing you are trying to teach is too weird and complicated.</p>",
      quote_by: "Eliezer",
      comments: [
        {
          comment_id: 0,
          user_name: "Vanessa",
          content:
            '<p>There is a big chunk of what you\'re trying to teach which not weird and complicated, namely: "find this other agent, and what their values are". Because, "agents" and "values" are natural concepts, for reasons strongly related to "there\'s a relatively simple core structure that explains why complicated cognitive machines work". Admittedly, my rough proposal (PreDCA) does have some "weird and complicated" parts because of the acausal attack problem.</p>',
          created_on: 1711134459685,
          highlights: [],

          is_conclusion: false,
        },
        {
          comment_id: 1,
          user_name: "Rob",
          content:
            "<p>This seems like it must be true to some degree, but \"there is a big chunk\" feels a bit too strong to me. Possibly we don't disagree, and just have different notions of what a \"big chunk\" is. But some things that make the chunk feel smaller to me:</p><p></p><p>(1) Humans are at least a little coherent, or we would never get anything done; but we aren't very coherent, so the project of piecing together 'what does the human brain as a whole \"want\"' can be vastly more difficult than the problem of figuring out what a coherent optimizer wants.</p><p></p><p>(2) There are shards of planning and optimization and goal-oriented-ness in a cat's brain, but 'figure out what utopia would look like for a cat' is a far harder problem than 'identify all of the goal-encoding parts of the cat's brain and \"read off\" those goals'. E.g., does 'identifying utopia' in this context involve uplifting or extrapolating the cat? Why, or why not? And if so, how does that process work?</p><p></p><p>(3) Getting a natural concept into an agent's goal is a lot harder than getting it into an agent's beliefs. Indeed, in the context of goals I'm not sure 'naturalness' actually helps at all, except insofar as natural kinds tend to be simple and simple targets are easier to hit? An obvious way naturalness could help, over and above simplicity, is if we have some value-loading technique that leverages or depends on \"this concept shows up in the AGI's world-model\". More natural concepts can show up in AGI world-models more often than simpler-but-less-natural concepts, because the natural concept is more useful for making sense of sensory data.</p>",
          created_on: 1711134520282,
          highlights: [
            {
              highlight_id: 0,
              offset: 4,
              length: 280,
              paragraph_id: 2,
              from_thread_id: 1,
              to_thread_id: 2,
            },
            {
              highlight_id: 1,
              offset: 4,
              length: 407,
              paragraph_id: 4,
              from_thread_id: 1,
              to_thread_id: 3,
            },
            {
              highlight_id: 2,
              offset: 4,
              length: 273,
              paragraph_id: 6,
              from_thread_id: 1,
              to_thread_id: 4,
            },
          ],

          is_conclusion: false,
        },
      ],
    },
    {
      thread_id: 2,
      from_thread_id: 1,
      quote:
        "<p>Humans are at least a little coherent, or we would never get anything done; but we aren't very coherent, so the project of piecing together 'what does the human brain as a whole \"want\"' can be vastly more difficult than the problem of figuring out what a coherent optimizer wants.</p>",
      quote_by: "Rob",
      comments: [
        {
          comment_id: 0,
          user_name: "Vanessa",
          content:
            '<p>This is a point where I feel like I do have a substantial disagreement with the "conventional wisdom" of LessWrong.</p><p></p><p>First, LessWrong began with a discussion of cognitive biases in human irrationality, so this naturally became a staple of the local narrative. On the other hand, I think that a lot of presumed irrationality is actually rational but deceptive behavior (where the deception runs so deep that it\'s part of even our inner monologue). There are exceptions, like hyperbolic discounting, but not that many.</p><p></p><p>Second, the only reason why the question "what X wants" can make sense at all, is because X is an agent. As a corollary, it only makes sense to the extent that X is an agent. Therefore, if X is not entirely coherent then X\'s preferences are only approximately defined, and hence we only need to infer them approximately. So, the added difficulty of inferring X\'s preferences, resulting from the partial incoherence of these preference, is, to large extent, cancelled out by the reduction in the required precision of the answer. The way I expect this cache out is, when the agent has g<∞, the utility function is only approximately defined, and we can infer it within this approximation. As g approaches infinity, the utility function becomes crisply defined and can be inferred crisply. See also additional nuance in my answer to the cat question below.</p><p></p><p>This is not to say we shouldn\'t investigate models like dynamically inconsistent preferences or "humans as systems of agents", but that I expect the number of additional complications of this sort that are actually important to be not that great.</p>',
          created_on: 1711134600301,
          highlights: [
            {
              highlight_id: 0,
              offset: 0,
              length: 320,
              paragraph_id: 4,
              from_thread_id: 2,
              to_thread_id: 5,
            },
          ],

          is_conclusion: false,
        },
      ],
    },
    {
      thread_id: 6,
      from_thread_id: 5,
      quote:
        "<p>Maybe I sort-of contain a lot of subagents, and 'my values' are the conjunction of my sub-agents' values (where they don't conflict), plus the output of an idealized negotiation between my sub-agents (where they do conflict).</p>",
      quote_by: "Rob",
      comments: [
        {
          comment_id: 0,
          user_name: "Vanessa",
          content:
            '<p>Maybe, and maybe this means we need to treat "composite agents" explicitly in our models. But, there is also a case to be made that groups of (super)rational agents effectively converge into a single utility function, and if this is true, then the resulting system can just as well be interpreted as a single agent having this effective utility function, which is a solution that should satisfy the system of agents according to their existing bargaining equilibrium.</p>',
          created_on: 1711135210732,
          highlights: [],

          is_conclusion: false,
        },
      ],
    },
    {
      thread_id: 7,
      from_thread_id: 5,
      quote:
        "<p>Alternatively, maybe I have a bunch of inconsistent preferences, but I have a complicated pile of meta-preferences that collectively imply some chain of self-modifications and idealizations that end up producing something more coherent and utility-function-ish after a long sequence of steps.</p>",
      quote_by: "Rob",
      comments: [
        {
          comment_id: 0,
          user_name: "Vanessa",
          content:
            "<p>If your agent converges to optimal behavior asymptotically, then I suspect it's still going to have infinite g and therefore an asymptotically-crisply-defined utility function.</p>",
          created_on: 1711135224345,
          highlights: [],

          is_conclusion: false,
        },
      ],
    },
    {
      thread_id: 4,
      from_thread_id: 1,
      quote:
        "<p>Getting a natural concept into an agent's goal is a lot harder than getting it into an agent's beliefs. Indeed, in the context of goals I'm not sure 'naturalness' actually helps at all, except insofar as natural kinds tend to be simple and simple targets are easier to hit?</p>",
      quote_by: "Rob",
      comments: [
        {
          comment_id: 0,
          user_name: "Vanessa",
          content:
            "<p>I'm not saying that the specific goals human have are natural: they are a complex accident of evolution. I'm saying that the general correspondence between agents and goals is natural.</p>",
          created_on: 1711134645740,
          highlights: [],

          is_conclusion: false,
        },
        {
          comment_id: 1,
          user_name: "Rob",
          content:
            "<p>Right, but this doesn't on its own help get that specific relatively-natural concept into the AGI's goals, except insofar as it suggests \"the correspondence between agents and goals\" is a simple concept, and any given simple concept is likelier to pop up in a goal than a more complex one.</p>",
          created_on: 1711135134075,
          highlights: [],

          is_conclusion: false,
        },
        {
          comment_id: 2,
          user_name: "Vanessa",
          content:
            "<p>Of course it doesn't help on its own. What I mean is, we are going to find a precise mathematical formalization of this concept and then hard-code this formalization into our AGI design.</p>",
          created_on: 1711135244317,
          highlights: [],

          is_conclusion: false,
        },
      ],
    },
    {
      thread_id: 5,
      from_thread_id: 2,
      quote:
        '<p>Second, the only reason why the question "what X wants" can make sense at all, is because X is an agent. As a corollary, it only makes sense to the extent that X is an agent. Therefore, if X is not entirely coherent then X\'s preferences are only approximately defined, and hence we only need to infer them approximately.</p>',
      quote_by: "Vanessa",
      comments: [
        {
          comment_id: 0,
          user_name: "Rob",
          content:
            "<p>I'm not sure if the first two lines are true; or if they're true, I'm not sure they're relevant. But assuming they're true, this strikes me as not capturing the aspect of human values that looks strange and complicated. Two ways I could imagine the strangeness and complexity cashing out as 'EU-maximizer-ish' are:</p><p></p><p>(1) Maybe I sort-of contain a lot of subagents, and 'my values' are the conjunction of my sub-agents' values (where they don't conflict), plus the output of an idealized negotiation between my sub-agents (where they do conflict).</p><p></p><p>(2) Alternatively, maybe I have a bunch of inconsistent preferences, but I have a complicated pile of meta-preferences that collectively imply some chain of self-modifications and idealizations that end up producing something more coherent and utility-function-ish after a long sequence of steps.</p><p></p><p>In both cases, the fact that my brain isn't a single coherent EU maximizer seemingly makes things a lot harder and more finnicky, rather than making things easier. These are cases where you could say that my initial brain is 'only approximately an agent', and yet this comes with no implication that there's any more room for error or imprecision than if I were an EU maximizer.</p>",
          created_on: 1711135102714,
          highlights: [
            {
              highlight_id: 2,
              offset: 0,
              length: 96,
              paragraph_id: 0,
              from_thread_id: 5,
              to_thread_id: 8,
            },
            {
              highlight_id: 0,
              offset: 4,
              length: 225,
              paragraph_id: 2,
              from_thread_id: 5,
              to_thread_id: 6,
            },
            {
              highlight_id: 1,
              offset: 4,
              length: 292,
              paragraph_id: 4,
              from_thread_id: 5,
              to_thread_id: 7,
            },
          ],

          is_conclusion: false,
        },
      ],
    },
    {
      thread_id: 9,
      from_thread_id: 8,
      quote:
        '<p>If we go down that path then it becomes the sort of conversation where I have no idea what common assumptions do we have, if any, that we could use to agree. As a general rule, I find it unconstructive, for the purpose of trying to agree on anything, to say things like "this (intuitively compelling) assumption is false" unless you also provide a concrete argument or an alternative of your own. Otherwise the discussion is just ejected into vacuum.</p>',
      quote_by: "Vanessa",
      comments: [
        {
          comment_id: 0,
          user_name: "Rob",
          content:
            "<p>Fair enough! I don't think I agree in general, but I think 'OK, but what's your alternative to agency?' is an especially good case for this heuristic.</p>",
          created_on: 1711782381468,
          highlights: [],

          is_conclusion: false,
        },
      ],
    },
    {
      thread_id: 8,
      from_thread_id: 5,
      quote:
        "<p>I'm not sure if the first two lines are true; or if they're true, I'm not sure they're relevant.</p>",
      quote_by: "Rob",
      comments: [
        {
          comment_id: 0,
          user_name: "Vanessa",
          content:
            '<p>If we go down that path then it becomes the sort of conversation where I have no idea what common assumptions do we have, if any, that we could use to agree. As a general rule, I find it unconstructive, for the purpose of trying to agree on anything, to say things like "this (intuitively compelling) assumption is false" unless you also provide a concrete argument or an alternative of your own. Otherwise the discussion is just ejected into vacuum. Which is to say, I find it self-evident that "agents" are exactly the sort of beings that can "want" things, because agency is about pursuing objectives and wanting is about the objectives that you pursue. If you don\'t believe this then I don\'t know what these words even mean for you.</p>',
          created_on: 1711782343516,
          highlights: [
            {
              highlight_id: 0,
              offset: 0,
              length: 450,
              paragraph_id: 0,
              from_thread_id: 8,
              to_thread_id: 9,
            },
            {
              highlight_id: 1,
              offset: 451,
              length: 205,
              paragraph_id: 0,
              from_thread_id: 8,
              to_thread_id: 10,
            },
          ],

          is_conclusion: false,
        },
      ],
    },
    {
      thread_id: 10,
      from_thread_id: 8,
      quote:
        '<p>Which is to say, I find it self-evident that "agents" are exactly the sort of beings that can "want" things, because agency is about pursuing objectives and wanting is about the objectives that you pursue.</p>',
      quote_by: "Vanessa",
      comments: [
        {
          comment_id: 0,
          user_name: "Rob",
          content:
            '<p>The first counter-example that popped into my head was "a mind that lacks any machinery for considering, evaluating, or selecting actions; but it does have machinery for experiencing more-pleasurable vs. less pleasurable states". This is a mind we should be able to build, even if it would never evolve naturally.</p>',
          created_on: 1711782416609,
          highlights: [],

          is_conclusion: false,
        },
        {
          comment_id: 1,
          user_name: "Rob",
          content:
            '<p>Possibly this still qualifies as an "agent" that "wants" and "pursues" things, as you conceive it, even though it doesn\'t select actions?</p>',
          created_on: 1711782418401,
          highlights: [],

          is_conclusion: false,
        },
      ],
    },
  ],
};
