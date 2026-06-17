---
title: "The Data Science of Student Retention: Why Prediction Isn't Enough"
date: "2026-06-17"
description: "Universities want to predict which students will drop out. The math isn't the hard part — the data limitations, bias trade-offs, and human solutions are."
tags: ["higher education", "classification", "data ethics"]
draft: false
---

I work at Utah Valley University. Our enrollment has been growing year over year, and as universities continue expanding their online programs, that growth isn't slowing down. Especially for an open-enrollment school like UVU. One problem we've been looking into is how to improve student retention.

This isn't unique to UVU. If you've been paying attention to higher education in the news, there's been a lot of discussion about the ROI of a degree. Universities want students to graduate, get jobs, and feel like their investment was worth it. When a student leaves after a few years with no degree, they feel like they wasted their money. And that's a negative mark on the school, the program, and higher education in general. Universities are built on bringing value to students, so making sure students actually get that value is critical.

From my own experience as a recent graduate, more often than not students drop out for outside influences. It is also more likely that a student will drop out earlier in their degree, which makes sense. The farther you go, the more money you have sunk into the degree and you feel more inclined to finish it. As newer students take their general classes, they come across harder courses than they have likely ever faced and sometimes they don't want to continue. In short, it is outside influences like jobs, marriage, etc. or difficult courses that make them feel that they cannot continue.


## It's a Classification Problem, But the Math Isn't the Hard Part

If you're a data analyst in any capacity you are most likely already thinking the following: if we could predict which students are about to drop out, we could intervene before it happens. Take whatever data is available, run it through a classification model (Neural Network, Random Forest, Logistic Regression) and assign each student a risk score. This is a standard classification problem, and there's no shortage of models we could throw at it.

The key to this problem, and many real world data science problems, is the fact that we don't have the perfect data to use.

When I look at a data problem where I already have a goal and know the deliverable, I like to ask myself three questions:

1. If I had whatever data I wanted, what would I need to solve this problem?
2. What data is currently available? What's missing? Can I get what's missing?
3. What makes sense as a solution with the resources we currently have?

Let's walk through each of these.


## Question 1: The Ideal Data

The ideal situation would be to know how a student feels, how they're performing, and what's going on in their life that might lead them to withdraw. Are they satisfied with their program? Are they on track to graduate? What are their demographics and financials? If we had a full picture of each student's situation, it would be much easier to support them before they leave.

That full picture doesn't exist. So we work with what we have.


## Question 2: What Data Is Actually Available?

This is where we hit roadblocks. Most colleges have three tiers of student data, each with serious limitations.

### Tier 1: Demographics and GPA

Every university has basic demographic data (age, race/ethnicity, gender, first-generation status) along with general performance indicators like GPA. These are the easiest inputs to plug into a model, and they're also the most misleading.

When we build classification models on demographic data, we quickly end up with biased algorithms that flag populations we already know face systemic barriers in higher education: first-generation students, adult learners, students from underrepresented racial and ethnic backgrounds. The model can't be used this way, and this problem is rampant in every industry. In some research I am working on right now, there are a ton of lawsuits and legal issues regarding medical models that were trained on mostly White (Non-Hispanic) participants.

Research backs this up. Studies have shown that prediction algorithms trained on historical data can disproportionately predict failure for Black and Hispanic students, even when those students ultimately graduate (Gandara et al., 2024). The model learns from an institution's historical struggles with supporting certain demographics, and then predicts those demographics will continue to struggle. Relying on history alone is flawed because things change. We see this all the time in the finance industry. Many models built with tons of historical stock market data are ineffective after 2020 because so much about how trading has changed. Models become highly inaccurate unless you introduce some way for the model to see the different changes when they happen. This isn't always easy, and you can also introduce your own bias really easily so you have to be aware.

### The Prediction Trade-Off

This bias problem forces analysts into a difficult trade-off between sensitivity and precision. Or in plain terms, between two types of errors that you have probably heard of before:

**False Positives**: We tune the model to catch every student who might drop out. The cost? We flag a bunch of students who are actually fine, overwhelming support staff and wasting resources on students who don't need help while diluting the support available for those who do.

**False Negatives**: We tune the model to only flag students we're highly confident will drop out. The cost? We let struggling students slip through the cracks because the model wasn't sure enough to flag them.

Universities have limited support staff and budgets. A model that generates too many false positives is operationally useless. But a model that minimizes false positives is accepting more false negatives. Leaving real at-risk students unsupported. There's no easy choice here, and the demographic bias makes it worse: the false negatives tend to cluster in the populations that need the most help.

### Tier 2: LMS Data (Canvas, Blackboard, etc.)

The next step up is Learning Management System data. Most people are familiar with Canvas, which is what UVU uses. LMS data gives us a more dynamic view of student behavior: Is the student missing assignments? Turning them in late? Down to the wire? Have they changed their behavior since the start of the semester?

These behavioral signals are more useful than demographics because they reflect what a student is actually doing right now, not just who they are. But LMS data has its own problems:

**Inconsistent setup across courses.** One professor might meticulously structure every module, quiz, and reading in Canvas. Another uses it as a glorified syllabus. When Canvas usage varies this much across a campus, "low engagement" in one course means the student is failing, while in another it just means the professor doesn't use the platform.

**In-person engagement is invisible.** A student might be highly engaged in a physical lecture, asking questions and participating in labs, but if the professor doesn't log those interactions in Canvas, the model sees a ghost. It might flag a thriving in-person student as high-risk simply because there's no digital trace of their participation.

In my own experience with Canvas data it is easy to see how this can become really confusing when trying to build a model. Courses are free to use whatever tools they want, so 3rd party tools like McGraw Hill which I see commonly are often used instead of Canvas quizzes. Because of this, we don't get the granular data we need. In addition, faculty are extremely busy. Grading is a very low priority and depending on the Professor, can be days to even weeks behind schedule.

So LMS data helps, but it still doesn't tell us how a student is feeling or what's going on behind the scenes. A student who abruptly drops out due to a family crisis, a financial emergency, or a mental health struggle won't show warning signs in Canvas until it's too late.

### Tier 3: Direct Student Feedback

The most valuable data source is the one that's hardest to get: asking students directly how they're doing.

Most universities run satisfaction surveys during or at the end of a course. The problem is timing. An end-of-semester survey doesn't help you prevent a mid-semester dropout. Running surveys multiple times throughout the semester is logistically difficult, and getting students to engage meaningfully is even harder. Professors have their own ideas and preferences, which means they also don't want to be forced into surveys they don't agree with, adding another hurdle we have to overcome.

There's also a tension between anonymity and actionability. Anonymous surveys get more honest responses, but you can't reach out to a struggling student if you don't know who they are. Non-anonymous surveys get lower response rates because students don't want to be flagged.

Despite all of this, surveys remain one of the best ways to understand student experience because students will literally tell you what they're struggling with. The challenge is building a system that collects that feedback frequently enough and honestly enough to actually feed a predictive model.


## Question 3: So What Actually Works?

Here's the reality: you can't always solve problems with a model, data set, or super aesthetic dashboard.

Data is incredibly useful for tracking, reporting, and forecasting. But data is really just information. Data itself rarely solves the problem you are facing, it just informs you and helps you make the best decision. A predictive model can point you toward a struggling student, but the model itself doesn't help that student. A risk score sitting in a dashboard does nothing if nobody acts on it.

The actual solutions are human:

**Support programs for at-risk demographics.** Most universities already have student success centers focused on first-generation, adult, or international students. I have seen firsthand that students really value these programs. They provide the scaffolding that helps students navigate a system that wasn't always designed for them.

**Professor awareness and outreach.** Professors interact with students regularly. They're the first point of contact between the university and the student. Great professors already do this naturally. They connect with their students, take feedback, and notice when someone is falling behind. When they reach out with genuine concern and support, it can change a student's entire trajectory.

Think back to your own education. Most people can name a teacher or mentor who made a real difference. Someone who noticed they were struggling and actually did something about it. When students have that kind of support, they're far more likely to push through the difficulties that would otherwise cause them to leave.

Although I was never "struggling" as a student, great professors still impacted me. In fact, I would be an accountant major if it weren't for mentors and professors who cared and saw that I could become a great data analyst and hopefully someday a data scientist. I have no idea what my life would be like without that influence.

The best approach combines all three: use the data to identify who might need help, build systems that surface those signals to the right people, and then invest in the human infrastructure to actually reach those students. The model doesn't have to be perfect to make things better for students.


## What Do You Think?

This is an area where I think creativity matters as much as technical skill. The data limitations are real, and there's no perfect model that solves student retention. But that doesn't mean we can't do better.

Is there a university you think has figured this out? An idea for improving the data we use in these models? A different approach entirely?

I'd love to hear your thoughts. Reach out to me on [LinkedIn](https://linkedin.com/in/samuel-redd-johnston) or through my [website](https://samwich-analytics.com) if you have an idea, comment, or just want to chat. Thanks for making it this far and if you have any feedback on the blog feel free to let me know how I can do better as well.

Thanks, until next time.
