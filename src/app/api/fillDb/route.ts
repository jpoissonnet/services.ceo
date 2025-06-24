import { db, developers } from "@/lib/schema";

export const GET = async () => {
  await db.insert(developers).values([
    {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      bio: "I've done a lot of Stripe integration in TypeScript and worked a lot with Next.js. I enjoy building robust payment flows and scalable frontend architectures. My experience also includes optimizing React applications for performance and accessibility.",
      date_of_starting_working: "2021-03-15",
    },
    {
      name: "Bob Smith",
      email: "bob.smith@example.com",
      bio: "Experienced in building REST APIs with Node.js and Express, and have deployed scalable apps on AWS. I have set up CI/CD pipelines and automated deployments for multiple projects. My background also includes database design and cloud infrastructure management.",
      date_of_starting_working: "2020-07-01",
    },
    {
      name: "Charlie Lee",
      email: "charlie.lee@example.com",
      bio: "DevOps engineer with expertise in Docker, Kubernetes, and CI/CD pipelines using GitHub Actions. I have automated infrastructure provisioning and monitoring for high-availability systems. My work often involves collaborating with developers to streamline deployment workflows.",
      date_of_starting_working: "2019-11-20",
    },
    {
      name: "Diana Prince",
      email: "diana.prince@example.com",
      bio: "Fullstack engineer, strong in React, GraphQL, and serverless architectures on Vercel. I have led teams in building end-to-end web applications and integrating third-party APIs. My passion is delivering seamless user experiences and maintainable codebases.",
      date_of_starting_working: "2018-05-10",
    },
    {
      name: "Ethan Hunt",
      email: "ethan.hunt@example.com",
      bio: "Security-focused developer, implemented OAuth2 flows and JWT authentication in Python and Go. I regularly conduct security audits and penetration testing for web applications. My expertise includes encryption, secure coding practices, and compliance standards.",
      date_of_starting_working: "2017-09-23",
    },
    {
      name: "Fiona Gallagher",
      email: "fiona.gallagher@example.com",
      bio: "Mobile developer specializing in React Native and Flutter, with experience integrating Firebase. I have published several apps to both the App Store and Google Play. My skills include push notifications, analytics, and mobile UI/UX optimization.",
      date_of_starting_working: "2022-01-12",
    },
    {
      name: "George Miller",
      email: "george.miller@example.com",
      bio: "Cloud architect with deep knowledge of AWS Lambda, DynamoDB, and infrastructure as code using Terraform. I have migrated legacy systems to serverless architectures and improved cost efficiency. My experience covers designing fault-tolerant and scalable cloud solutions.",
      date_of_starting_working: "2016-04-18",
    },
    {
      name: "Hannah Kim",
      email: "hannah.kim@example.com",
      bio: "Machine learning engineer, built NLP pipelines with Python, spaCy, and deployed models with FastAPI. I have worked on recommendation systems and real-time data processing. My interests include deep learning, data visualization, and model interpretability.",
      date_of_starting_working: "2021-08-30",
    },
    {
      name: "Ivan Petrov",
      email: "ivan.petrov@example.com",
      bio: "C++ systems programmer, optimized high-performance trading systems and worked with low-latency networking. I have experience with multithreading, memory management, and real-time data feeds. My work often involves profiling and tuning for maximum efficiency.",
      date_of_starting_working: "2015-12-05",
    },
    {
      name: "Julia Roberts",
      email: "julia.roberts@example.com",
      bio: "QA automation engineer, set up Cypress and Playwright test suites for large-scale web applications. I have developed comprehensive testing strategies and integrated them into CI pipelines. My focus is on delivering high-quality, bug-free releases.",
      date_of_starting_working: "2019-02-14",
    },
    {
      name: "Kevin Tran",
      email: "kevin.tran@example.com",
      bio: "React Native developer, built cross-platform apps and integrated payment gateways like Stripe and PayPal. I have implemented real-time features using WebSockets and push notifications. My expertise includes mobile performance optimization and native module integration.",
      date_of_starting_working: "2020-10-07",
    },
    {
      name: "Laura Chen",
      email: "laura.chen@example.com",
      bio: "Backend developer, designed microservices with Go and PostgreSQL, and managed deployments with Docker Compose. I have experience with API design, authentication, and distributed systems. My work emphasizes reliability, scalability, and maintainability.",
      date_of_starting_working: "2018-11-29",
    },
    {
      name: "Mohammed Ali",
      email: "mohammed.ali@example.com",
      bio: "Blockchain developer, audited smart contracts in Solidity and built dApps with web3.js. I have contributed to DeFi projects and implemented secure wallet integrations. My interests include cryptography, decentralized storage, and Ethereum Layer 2 solutions.",
      date_of_starting_working: "2022-03-21",
    },
    {
      name: "Nina Simone",
      email: "nina.simone@example.com",
      bio: "Developer Relations specialist, created technical content and managed open source communities for JavaScript libraries. I have organized hackathons and contributed to developer onboarding resources. My strengths are in communication, advocacy, and community growth.",
      date_of_starting_working: "2017-06-17",
    },
    {
      name: "Oscar Wilde",
      email: "oscar.wilde@example.com",
      bio: "Technical writer, documented APIs and SDKs for Python and JavaScript, and improved onboarding guides. I have collaborated with engineering teams to clarify complex concepts. My writing focuses on clarity, accuracy, and developer experience.",
      date_of_starting_working: "2019-07-25",
    },
    {
      name: "Priya Patel",
      email: "priya.patel@example.com",
      bio: "Data engineer, built ETL pipelines with Apache Airflow and Spark, and managed data lakes on AWS S3. I have optimized data workflows for analytics and reporting. My expertise includes data modeling, warehousing, and pipeline automation.",
      date_of_starting_working: "2020-01-03",
    },
    {
      name: "Quentin Blake",
      email: "quentin.blake@example.com",
      bio: "Game developer, created 2D and 3D games in Unity and Unreal Engine, with multiplayer networking experience. I have worked on gameplay mechanics, physics, and asset pipelines. My passion is building engaging and interactive gaming experiences.",
      date_of_starting_working: "2016-08-11",
    },
    {
      name: "Rosa Diaz",
      email: "rosa.diaz@example.com",
      bio: "Frontend developer, focused on accessibility and performance, with deep experience in Vue.js and Tailwind CSS. I have led accessibility audits and implemented best practices for inclusive design. My work includes optimizing load times and responsive layouts.",
      date_of_starting_working: "2021-05-19",
    },
    {
      name: "Samir Gupta",
      email: "samir.gupta@example.com",
      bio: "Embedded systems engineer, developed IoT solutions with C, C++, and integrated with MQTT brokers. I have designed firmware for microcontrollers and worked on wireless sensor networks. My projects often involve real-time data collection and device management.",
      date_of_starting_working: "2018-03-27",
    },
    {
      name: "Tina Fey",
      email: "tina.fey@example.com",
      bio: "Product manager with a background in engineering, led cross-functional teams building SaaS products. I have defined product roadmaps and coordinated agile development cycles. My focus is on delivering value to users and aligning business goals with technology.",
      date_of_starting_working: "2015-10-15",
    },
    {
      name: "Ursula K. Le Guin",
      email: "ursula.k.le.guinn@example.com",
      bio: "API designer, created OpenAPI specs and implemented RESTful services in Fastify and TypeScript. I have worked on API versioning, documentation, and developer onboarding. My expertise includes designing scalable and maintainable API ecosystems.",
      date_of_starting_working: "2017-12-01",
    },
    {
      name: "Victor Hugo",
      email: "victor.hugo@example.com",
      bio: "Legacy systems expert, migrated monolithic PHP apps to modern Node.js microservices. I have refactored large codebases and improved system reliability. My experience includes database migrations and integration with third-party services.",
      date_of_starting_working: "2014-09-09",
    },
    {
      name: "Wendy Darling",
      email: "wendy.darling@example.com",
      bio: "UX/UI designer, prototyped interfaces in Figma and implemented designs in React and Styled Components. I have conducted user research and usability testing for web and mobile apps. My goal is to create intuitive and visually appealing user experiences.",
      date_of_starting_working: "2021-04-22",
    },
    {
      name: "Xavier Dolan",
      email: "xavier.dolan@example.com",
      bio: "Video streaming specialist, built scalable video platforms with HLS, ffmpeg, and Node.js. I have optimized video delivery for low latency and high quality. My work includes DRM integration and adaptive bitrate streaming.",
      date_of_starting_working: "2018-06-30",
    },
    {
      name: "Yara Shahidi",
      email: "yara.shahidi@example.com",
      bio: "Fullstack developer, built e-commerce platforms with Shopify, Next.js, and integrated Algolia search. I have experience with payment processing, inventory management, and SEO optimization. My projects focus on high conversion rates and seamless shopping experiences.",
      date_of_starting_working: "2020-02-17",
    },
    {
      name: "Zane Malik",
      email: "zane.malik@example.com",
      bio: "DevOps and SRE, automated infrastructure with Ansible and monitored systems using Prometheus and Grafana. I have implemented disaster recovery plans and improved system uptime. My expertise includes cloud cost optimization and incident response.",
      date_of_starting_working: "2016-11-05",
    },
  ]);
  return new Response("Developers inserted");
};
