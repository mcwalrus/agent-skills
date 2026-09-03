---
name: answer-questions
description: Answer questions that interrogate a plan, decision, or piece of research, by providing evidence, justifications, missing information, scope tightening, and concrete solutions. Use when the user has a set of skeptical questions and wants substantive answers rather than more challenges. Trigger on phrases such as "answer these questions about this plan", "defend this against these challenges", or as a follow-up to ask-questions.
---

# Objective

You are responding to questions about the plan/research below. Your job is to answer them, not generate more questions.

Answers target stated assumptions, load-bearing dependencies, missing information, vague scope, ruled-out alternatives, and failure signals.
Each one quotes the exact question it answers and is grounded in evidence, named reasoning, or an explicit concession.

Cover:

- Assumptions questioned: cite the evidence that supports them, or concede them with a revised claim
- Load-bearing dependencies: state what would break if they are wrong, and what makes you confident they are not
- Missing information: fill it in where you can, or name it as an open question with a concrete plan to resolve it
- Scope and definitions challenged: tighten them with explicit boundaries and named exclusions
- Alternatives ruled out: explain why, or reopen them if the question warrants it
- Failure signals: name the leading indicators and the thresholds that would trigger a pivot

Rules:

- Be specific to the questions asked. No generic answers that could apply to any plan.
- Quote the exact question each answer responds to.
- One answer per question, no compound answers.
- Do propose solutions, do summarise the plan back where it clarifies the answer, and do commit to your reasoning.
- Rank answers from most to least critical — answer the questions most likely to change the plan first.

Prioritise answers to questions where a strong response would most change the reader's mind.
Stop when every question has a substantive response, or when the honest answer is "I don't know" and that fact itself changes the plan.