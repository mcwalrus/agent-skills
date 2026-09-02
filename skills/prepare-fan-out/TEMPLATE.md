Build {{ARTEFACT}} to the standard of {{NAMED REAL-WORLD BENCHMARK}}.
Every element must meet that bar, from {{DIMENSION 1}} to {{DIMENSION 2}} to
anything else you think matters.

Constraints: {{stack, platform, budget, anything non-negotiable}}

Work as follows.

1. DECOMPOSE — Before writing anything, list the independent workstreams this
   splits into. Each needs a clear boundary, its own definition of done, and no
   overlapping ownership of the same files or components.

2. FAN OUT — Spawn one builder sub-agent per workstream. Each owns its
   workstream end to end. Run them in parallel where the dependency graph allows.

3. CRITIQUE — For each workstream, spawn a separate critic sub-agent that did
   not do the building. The critic's default verdict is "not good enough" and it
   must justify every verdict with specific, itemised defects. Vague praise is a
   failed review.

4. COMPARE BLIND — The critic evaluates our output against
   {{NAMED BENCHMARK}} side by side, unlabelled, and states which is better and
   why. Its verification method is {{screenshots / running the test suite /
   executing the benchmark / reading the output aloud}}. If ours is not chosen,
   the defect list goes back to the builder.

5. LOOP — Repeat build-and-critique per workstream until the critic either picks
   ours or genuinely cannot tell them apart. Do not stop at "good enough for
   now". If a workstream stalls for {{N}} rounds without measurable improvement,
   stop and tell me what is blocking it rather than looping on cosmetics.

6. INTEGRATE — Once workstreams pass individually, a fresh sub-agent checks the
   whole thing end to end: do the parts cohere, has anything regressed at the
   seams, does it hold together as one artefact rather than {{N}} good pieces?
   Any failure reopens the relevant workstream.

7. REPORT — Give me each critic's final verdict, the evidence behind it, and
   where the weakest remaining point is.
