import 'dotenv/config';
import mongoose from 'mongoose';

import dbConnect from '../lib/dbConnect.js';
import Category from '../models/Category.js';
import Content from '../models/Content.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

type SlugDoc = { _id: mongoose.Types.ObjectId; slug: string };

const upsertBySlug = async <T extends SlugDoc>(Model: any, data: Partial<T>) => {
  if (!data.slug) {
    throw new Error('Missing slug for seed data.');
  }
  return Model.findOneAndUpdate({ slug: data.slug }, data, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
};

const ensureSeedUser = async () => {
  const email = 'alex@learningweb.dev';
  const existing = await User.findOne({ email });
  if (existing) {
    return existing;
  }
  return User.create({
    name: 'Alex Learner',
    email,
    password: 'Password123!',
  });
};

const run = async () => {
  await dbConnect();

  const categories = [
    { name: 'Database', slug: 'database', description: 'Database design and modeling.' },
    { name: 'Frontend', slug: 'frontend', description: 'UI and styling tutorials.' },
    { name: 'AI & ML', slug: 'ai-ml', description: 'AI fundamentals and tooling.' },
    { name: 'Productivity', slug: 'productivity', description: 'Learning and study workflows.' },
    { name: 'Development', slug: 'development', description: 'Modern software engineering practices.' },
    { name: 'Data Science', slug: 'data-science', description: 'Python, analytics, and data tooling.' },
    { name: 'Design', slug: 'design', description: 'Product and UX design fundamentals.' },
  ];

  const categoryDocs = await Promise.all(categories.map((category) => upsertBySlug(Category, category)));
  const categoryMap = new Map(categoryDocs.map((doc) => [doc.slug, doc]));

  const courses = [
    {
      title: 'LLM Fundamentals',
      slug: 'llm-fundamentals',
      description: 'Core concepts and patterns for working with LLMs.',
      level: 'beginner',
      categories: [categoryMap.get('ai-ml')?._id],
      is_published: true,
    },
    {
      title: 'RAG Systems',
      slug: 'rag-systems',
      description: 'Retrieval, embeddings, and vector databases.',
      level: 'intermediate',
      categories: [categoryMap.get('ai-ml')?._id],
      is_published: true,
    },
  ];

  const courseDocs = await Promise.all(courses.map((course) => upsertBySlug(Course, course)));
  const courseMap = new Map(courseDocs.map((doc) => [doc.slug, doc]));

  const seedUser = await ensureSeedUser();

  const posts = [
    {
      type: 'post',
      title: 'Advanced State Management in 2024',
      slug: 'advanced-state-management-in-2024',
      thumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBp6FiMHdIiZqlOVOXIngTsu9dF2lqGX78j_4nrA1WFsDcjjRGEMKdB_xFQ95tRlktAtMTsrsGPlousKtBVb4wkGgo6g0k2cYAyfuFF4RWlGUp7eBP2Dh7pUKquZvKR5_I98mlS16Z4ztNJ8Ij3vz7Ysg0d02QERCC-zPaU1UaxqP7k7DRgP4x1x_gMEcVsKHGGaXi0fMRNWAyVHzYmtkWnrlU7qDFLz_VT5VCqmfFXvgKdWh7Rl_msR36Wx6lpELFn4fBNfGjcEsXr',
      image_alt: 'Developer workspace with code editor and charts',
      excerpt:
        'Explore the newest patterns in React state management, including Context API updates, Redux Toolkit, and atomic state libraries.',
      description:
        'A practical guide to choosing the right state architecture for modern React apps.',
      content_blocks: [
        'Map your state domains before choosing tools.',
        'Keep server state and UI state separated.',
        'Use fine-grained stores for performance hotspots.',
      ],
      read_time: '9 min read',
      author: {
        name: 'John Doe',
        role: 'Frontend Lead',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDBuHSDyQ9Z9RhSu_4zIqhN1jP0Y_csDDSli5PNJDmFH3yExp5JMgueOPnmXEhI4V7eldSx8Gy3xW-w65PxMbfhzZFl4-YABtGOjlKi6-XiVGR8slbXFypSnN7lpZ9wIcvVZXEbxlIoU8uNyDhKejGZH1muzChJ3CmTq2y9f2RDYifSvDVuFh5wRq6qE5OE-Ty85v-oUtY0bPfxVYmVqu4zrFwKOYweMPpxnNJ2H9MfM7G-Ubwp3i1l5Yt_Ov1jUgguiqff17sAyVkn',
      },
      owner_id: seedUser?._id,
      categories: [categoryMap.get('development')?._id],
      tags: ['#React', '#Frontend'],
      objectives: [
        'Choose the right state tool for each layer',
        'Avoid prop drilling and redundant state',
        'Improve performance with memoized selectors',
      ],
      body: `Modern React apps rarely use a single state tool. Start by separating UI state (modal open, tab selection) from server state (data fetched from APIs). Server state belongs in a cache like React Query, while UI state can stay local or in Context.

For shared UI state across many components, reach for a centralized store. Redux Toolkit is still great for complex workflows and debugging, while lightweight stores like Zustand or Jotai can reduce boilerplate for smaller apps.

Focus on performance by keeping state close to where it is used. Derived data should be memoized, selectors should be stable, and large lists should avoid rerender storms. A small refactor from deep prop drilling to a dedicated store often yields the biggest wins.`,
      project_application: {
        title: 'Apply to a project',
        steps: [
          'List the state domains in your product.',
          'Assign each domain to local, context, or store.',
          'Refactor one feature to validate the new structure.',
        ],
        expected_result: 'A clear state map and a working refactor plan.',
      },
      exercises: [
        {
          title: 'State tool selection',
          type: 'quiz',
          instructions: 'Pick the best state tool and explain why in one sentence.',
          default_input:
            '1) Global theme toggle\n2) Server data list\n3) Wizard form state',
        },
        {
          title: 'Refactor local to shared',
          type: 'code',
          instructions: 'Move shared state into a store and expose a selector.',
          initial_code: `const [count, setCount] = useState(0);`,
          solution_code: `const useCounter = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));`,
        },
      ],
      status: 'published',
    },
    {
      type: 'post',
      title: 'Mastering Python Decorators',
      slug: 'mastering-python-decorators',
      thumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAmng-DSXrNWrkjZnLXtfcHmdn2pG0159L0mCdWgft3Id2AxZp6ADUoLjoh1MtN72ne2Y9F9v5cO1SkNki0EJxwuLpaOFHJOhDyQ-nx4R0PMBi30HxA1CrFOSN_TtTqHTYVa2TMFnaXcGBUbE1tBqq4w3-uYThaKWjEg9hIDLN6ua2uAZI59bNaUWcvW0LE5vSJjsU0lX0ac2pkEhQQfjKIZfS6CJcMwFfEcKe62kTAFg83BxViUmpfltD7pnQLjEvExdSEvNHy6K1p',
      image_alt: 'Python code on a laptop screen',
      excerpt: 'Decorators are a significant part of Python. This guide breaks them down step-by-step with practical examples.',
      description:
        'Understand how to write and apply decorators for reusable Python patterns.',
      content_blocks: [
        'Decorators wrap functions to add behavior.',
        'Closures keep configuration local and clean.',
        'Use functools to preserve metadata.',
      ],
      read_time: '8 min read',
      author: {
        name: 'Alex Learner',
        role: 'Data Science Mentor',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAqEV6q1VMv3zrMYv01xJhp6n8dYMQ5Xu6ngf0_aIC_YBVxLwQzEbXyUt4irJwixib4VJOoCKtzaZfrMS4CvtaxbZZG-FL-fTzx0FXB5D1aJcwS8_tERzQkrrO4H1qLsSlJ0qdKbtn9_UXMykOyc5AaeB9vh6EVt7MySZcr9A3Io27xYMCsHOaNRY-fYTU2Km7oXVUjTiqIdyPx2jHOV_DyMkIjK9nua-gtau4pg4fYkyRkPkIrYrrbbbKDVd1O4kMy9tXpuecq4G7Y',
      },
      owner_id: seedUser?._id,
      categories: [categoryMap.get('data-science')?._id],
      tags: ['#Python', '#Coding'],
      objectives: ['Understand decorator syntax', 'Build reusable wrappers', 'Avoid common pitfalls'],
      body: `Decorators let you wrap a function with extra behavior without changing its body. This pattern is ideal for logging, timing, caching, or access control. The decorator receives a function and returns a new function.

Closures make decorators powerful. You can create a decorator factory that accepts arguments, which lets you reuse the same wrapper with different settings. Use functools.wraps to preserve the original function name and docstring.

In production code, keep decorators small and focused. If a decorator grows too large, it becomes hard to debug. Think of decorators as single-purpose building blocks that can be composed when needed.`,
      exercises: [
        {
          title: 'Decorator intuition',
          type: 'quiz',
          instructions: 'Identify where a decorator makes sense.',
          default_input:
            '1) Logging every API call\n2) Calculating report totals\n3) Caching slow functions',
        },
        {
          title: 'Write a timing decorator',
          type: 'code',
          instructions: 'Add timing output to any function.',
          initial_code: `def my_func():
    pass`,
          solution_code: `import time
import functools

def timed(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = fn(*args, **kwargs)
        print(f"{fn.__name__} took {time.time() - start:.2f}s")
        return result
    return wrapper`,
        },
      ],
      status: 'published',
    },
    {
      type: 'post',
      title: 'Principles of User Interface Design',
      slug: 'principles-of-user-interface-design',
      thumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDzn0Yg4uMmd9SmlvGFoqpI_4AH9DMn3X-cVHWyerM1hNyZWIM4wlkqxDSS0SXu2f4TnKafWHdrK1Dj3VpIJLOQP1RtDKyIGDbO0UuNJIFctGMtY4cQMFhEu33j_mxaMT1gfH9UDna4njSWKLfjynrY-hwADimwzNLgYcFrR9hOpYxpP8BbpLapzeIK6xzabW_IUh6juNey-w-7budGeJ3RCW2-vKcLU4eynrc6q4KmlQuWPbCGrjCUJozW_wl-pCs4KkN4V5FgcULQ',
      image_alt: 'Interface mockups and layout grids',
      excerpt: 'We explore the 10 heuristics of UI design and how to apply them to modern web applications.',
      description:
        'A practical checklist for building interfaces that feel clear, helpful, and trustworthy.',
      content_blocks: [
        'Hierarchy and spacing guide attention.',
        'Consistency reduces cognitive load.',
        'Feedback keeps users confident.',
      ],
      read_time: '11 min read',
      author: {
        name: 'Mia Kim',
        role: 'Product Designer',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDzn0Yg4uMmd9SmlvGFoqpI_4AH9DMn3X-cVHWyerM1hNyZWIM4wlkqxDSS0SXu2f4TnKafWHdrK1Dj3VpIJLOQP1RtDKyIGDbO0UuNJIFctGMtY4cQMFhEu33j_mxaMT1gfH9UDna4njSWKLfjynrY-hwADimwzNLgYcFrR9hOpYxpP8BbpLapzeIK6xzabW_IUh6juNey-w-7budGeJ3RCW2-vKcLU4eynrc6q4KmlQuWPbCGrjCUJozW_wl-pCs4KkN4V5FgcULQ',
      },
      owner_id: seedUser?._id,
      categories: [categoryMap.get('design')?._id],
      tags: ['#UIUX', '#Design'],
      objectives: ['Build clear visual hierarchy', 'Design predictable interactions', 'Create strong feedback loops'],
      body: `Great interfaces guide attention with hierarchy, spacing, and contrast. The most important actions should be obvious, while secondary details are available without distraction. Use layout grids to align content so the page feels calm and structured.

Consistency builds trust. Keep labels, buttons, and colors predictable across screens. When users learn a pattern once, they should recognize it everywhere else in the product.

Feedback is essential. Confirm actions with microcopy, loading states, and success messages. Users should never wonder if the system understood their input.`,
      exercises: [
        {
          title: 'UI heuristic match',
          type: 'quiz',
          instructions: 'Match each issue to the best heuristic.',
          default_input:
            '1) Missing loading state\n2) Inconsistent button styles\n3) Confusing navigation labels',
        },
        {
          title: 'Redesign a form',
          type: 'code',
          instructions: 'Rewrite the layout to improve spacing and labels.',
          initial_code: `<form>
  <input />
  <button>Submit</button>
</form>`,
          solution_code: `<form class="stack">
  <label>Email</label>
  <input type="email" placeholder="you@example.com" />
  <button>Submit</button>
</form>`,
        },
      ],
      status: 'published',
    },
    {
      type: 'post',
      title: 'Understanding Neural Networks',
      slug: 'understanding-neural-networks',
      thumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3lTaKDQU9d_uUV0IzgMHg32pCt4B_eUg2fficyQzRtk3bBO30r36Hq6SrC96v4G3nyUPXsWZj7qaz91zvlxRBxWg_Ds-gxwoPQOLi10P7R09V45cOrZJIY6RVdt30hjCjnvdMLAnsZghZ9CNuUhdRRbbvqL-gIud1Ih_0n_MaxUMCBBKx2iWZ8ptcFjUR-taW2Ff7GLzgU_R2qffl62U_x_HXj5QvKEUS0G7hHG3T4bwOH9jnomnXWEc34th38VQenh4fXt4WXgI4',
      image_alt: 'Neural network visualization with layers and nodes',
      excerpt: 'A deep dive into backpropagation and activation functions with practical visual intuition.',
      description:
        'Understand the core building blocks behind modern neural networks.',
      content_blocks: [
        'Neurons transform inputs into outputs.',
        'Activation functions add nonlinearity.',
        'Backpropagation trains the network.',
      ],
      read_time: '12 min read',
      author: {
        name: 'Dr. Ross',
        role: 'AI Researcher',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDJB_TsqpfKNIJ1Nuc1ZOwzMfkwefEMfoQ2p1Xm2rmVNHTYNcluM1Vqa3cdzCn7y94vOjeZtett8F2bHrzFvu1dEaLXHc5azI76InswRWURT9nfvpu6F8Ie3Lp2yBbdNcUHOCxTT-mK9Xxm_hIMudKFAPzMgXd2ZYzsP4dtYvppdKWossbLwG7EISxJLzqnNhCvSBW20j5jWd_m2h8UCL1tCv5dwgrJJkRzBhWS_nZwZjmzI9kCuqAz46XPUv7RacYkq5e68Z3jZYEL',
      },
      owner_id: seedUser?._id,
      categories: [categoryMap.get('ai-ml')?._id],
      tags: ['#AI', '#DeepLearning'],
      objectives: ['Understand neuron basics', 'Explain backpropagation', 'Compare common activations'],
      body: `Neural networks stack layers of neurons that transform input signals into outputs. Each neuron applies a weighted sum and then passes the result through an activation function. Without activation functions, the network would only learn linear relationships.

Backpropagation computes how much each weight contributed to the final error, then adjusts weights to reduce that error. This process repeats across many batches of data until the model converges.

Choosing the right activation function matters. ReLU is common for hidden layers, while sigmoid or softmax are used for specific output types. Understanding these choices helps you debug training issues faster.`,
      exercises: [
        {
          title: 'Activation matching',
          type: 'quiz',
          instructions: 'Choose the best activation for each scenario.',
          default_input:
            '1) Binary classification output\n2) Hidden layer in deep network\n3) Multi-class output',
        },
        {
          title: 'Outline backprop',
          type: 'code',
          instructions: 'Write a short backprop outline for a single neuron.',
          initial_code: `step_1 = ""
step_2 = ""`,
          solution_code: `step_1 = "Compute prediction and loss"
step_2 = "Compute gradient and update weights"`,
        },
      ],
      status: 'published',
    },
  ];

  await Promise.all(posts.map((post) => upsertBySlug(Content, post)));

  const lessons = [
    {
      type: 'lesson',
      title: 'Prompt Engineering Basics',
      slug: 'lesson-prompt-engineering-basics',
      excerpt: 'Build prompts that are clear, scoped, and easy to evaluate.',
      description: 'Build clear and repeatable prompts for LLM tasks.',
      content_blocks: [
        'Start with a clear task and success criteria.',
        'Provide examples when the output format matters.',
        'Use constraints to reduce ambiguity.',
      ],
      objectives: ['Write concise instructions', 'Provide context and examples', 'Evaluate outputs'],
      body: `Good prompts are structured. Start with the role or task, then provide context, then list the output format. If the model needs to reason, ask for reasoning explicitly, or provide a step-by-step plan.

Examples anchor the output. A single example in the prompt can align style, tone, and format. Make sure examples are short, relevant, and consistent with your desired outcome.

Constraints reduce confusion. Limit the length, specify a strict schema, or require bullet points. When the model knows the boundaries, the output becomes more reliable.

Finally, evaluate prompts with real inputs. Keep a small test set and run the same prompt multiple times to assess consistency.`,
      project_application: {
        title: 'Apply to a project',
        steps: [
          'Write a prompt to summarize a customer ticket.',
          'Add a JSON output format with three fields.',
          'Test with five sample tickets.',
        ],
        expected_result: 'A prompt template that produces consistent summaries.',
      },
      exercises: [
        {
          title: 'Prompt rewrite',
          type: 'code',
          instructions: 'Rewrite the prompt to be clear and structured.',
          initial_code: 'Summarize this.',
          solution_code:
            'You are a support assistant. Summarize the ticket in 3 bullet points. Output only bullets.',
        },
        {
          title: 'Prompt checklist',
          type: 'quiz',
          instructions: 'List three constraints you would add to improve reliability.',
          default_input: 'Task: classify customer sentiment',
        },
      ],
      course_id: courseMap.get('llm-fundamentals')?._id,
      categories: [categoryMap.get('ai-ml')?._id],
      tags: ['#llm', '#prompting'],
      read_time: '18 min lesson',
      status: 'published',
    },
    {
      type: 'lesson',
      title: 'Structured Output with JSON',
      slug: 'lesson-structured-output-json',
      excerpt: 'Ask for valid JSON that downstream systems can trust.',
      description: 'Ask LLMs to return valid JSON for downstream systems.',
      content_blocks: [
        'Define the schema before writing the prompt.',
        'Validate output and retry on errors.',
        'Keep fields small and predictable.',
      ],
      objectives: ['Define strict schemas', 'Validate outputs', 'Handle malformed responses'],
      body: `Structured output removes guesswork. Start with a JSON schema that describes exactly what you want: field names, types, and allowed values. Then include the schema in the prompt so the model can follow it.

Do not trust output blindly. Always validate the response. If the JSON is invalid, either retry with the error message or fall back to a safe default. This is critical for production systems.

When fields are complex, simplify. Break the task into smaller prompts, or ask for a list of objects rather than a nested structure. Simpler schemas produce fewer failures.

Keep the output consistent. Use fixed keys, avoid optional fields unless necessary, and provide an example response when the schema is not obvious.`,
      exercises: [
        {
          title: 'Define a schema',
          type: 'code',
          instructions: 'Create a JSON schema for a job application summary.',
          initial_code: `{
  "name": "",
  "role": "",
  "skills": []
}`,
          solution_code: `{
  "name": "string",
  "role": "string",
  "skills": ["string"],
  "years_experience": "number"
}`,
        },
        {
          title: 'Validation checklist',
          type: 'quiz',
          instructions: 'List three validation steps after receiving JSON output.',
          default_input: 'Focus on schema, required fields, and type safety.',
        },
      ],
      course_id: courseMap.get('llm-fundamentals')?._id,
      categories: [categoryMap.get('ai-ml')?._id],
      tags: ['#llm', '#json'],
      read_time: '20 min lesson',
      status: 'published',
    },
    {
      type: 'lesson',
      title: 'Vector Databases for RAG',
      slug: 'lesson-vector-databases-rag',
      excerpt: 'Store embeddings and retrieve top matches efficiently.',
      description: 'Store embeddings and retrieve top matches efficiently.',
      content_blocks: [
        'Choose the right embedding model for your domain.',
        'Tune chunk size for retrieval quality.',
        'Measure recall with real queries.',
      ],
      objectives: ['Pick similarity metrics', 'Tune chunking strategy', 'Measure retrieval quality'],
      body: `Vector databases store embeddings so you can perform similarity search. This is the core of retrieval-augmented generation, where you pull relevant context before asking the model to respond.

Chunking is the most important choice. Smaller chunks improve recall but can lose context. Larger chunks keep context but reduce precision. Test multiple sizes with real queries and measure the tradeoff.

Similarity metrics matter. Cosine similarity is common, but dot product or Euclidean distance can work better depending on the embedding model. Use the metric recommended by the model provider when possible.

Finally, evaluate retrieval separately from generation. If your retrieval is wrong, the model cannot fix it. Track recall, precision, and the time per query.`,
      exercises: [
        {
          title: 'Chunking strategy',
          type: 'quiz',
          instructions: 'Pick a chunk size for each dataset and explain why.',
          default_input:
            '1) Product manuals\n2) Short blog posts\n3) Legal contracts',
        },
        {
          title: 'RAG flow',
          type: 'flow',
          instructions: 'Outline the RAG steps from query to response.',
          flow_config: {
            steps: [
              'Receive user query',
              'Embed query',
              'Retrieve top k chunks',
              'Compose prompt',
              'Generate answer',
            ],
            logic: { k: 5, rerank: true },
          },
        },
      ],
      course_id: courseMap.get('rag-systems')?._id,
      categories: [categoryMap.get('ai-ml')?._id],
      tags: ['#rag', '#vector'],
      read_time: '22 min lesson',
      status: 'published',
    },
  ];

  const lessonDocs = await Promise.all(lessons.map((lesson) => upsertBySlug(Content, lesson)));
  const lessonMap = new Map(lessonDocs.map((doc) => [doc.slug, doc]));

  const llmCourse = courseMap.get('llm-fundamentals');
  if (llmCourse) {
    await Course.findByIdAndUpdate(
      llmCourse._id,
      {
        chapters: [
          {
            title: '01. Foundations',
            lessons: [
              lessonMap.get('lesson-prompt-engineering-basics')?._id,
              lessonMap.get('lesson-structured-output-json')?._id,
            ].filter(Boolean),
          },
        ],
      },
      { new: true }
    );
  }

  const ragCourse = courseMap.get('rag-systems');
  if (ragCourse) {
    await Course.findByIdAndUpdate(
      ragCourse._id,
      {
        chapters: [
          {
            title: '01. Retrieval Core',
            lessons: [lessonMap.get('lesson-vector-databases-rag')?._id].filter(Boolean),
          },
        ],
      },
      { new: true }
    );
  }

  await mongoose.disconnect();
  console.log('Seed data upserted successfully.');
};

run().catch((error) => {
  console.error('Seed failed:', error);
  mongoose.disconnect();
  process.exit(1);
});
