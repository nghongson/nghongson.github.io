---
sidebar_position: 6
---

# Refactoring Code

Refactoring is a systematic process of improving codewithout creating new functionality that can transforma mess into clean code and simple design.

- Clean Code
- Code Smells
- Refactoring Process

## Technical debt

“Technical debt” in regards to unclean code was originally suggested by Ward Cunningham.
If you get a loan from a bank, this allows you to make purchases faster. You pay extra for expediting the process - you don’t just pay off the principal, but also the additional interest on the loan. Needless to say, you can even rack up so much interest that the amount of interest exceeds your total income, making full repayment impossible.

The same thing can happen with code. You can temporarily speed up without writing tests for new features, but this will gradually slow your progress every day until you eventually pay off the debt by writing tests.

### Causes of technical debt

- Business pressure
- Lack of understanding of the consequences of technical debt
- Failing to combat the strict coherence of components
- Lack of tests
- Lack of documentation
- Lack of interaction between team members
- Long-term simultaneous development in several branches
- Delayed refactoring
- Lack of compliance monitoring
- Incompetence

## When to refactor

**Rule of Three**
1. When you’re doing something for the first time, just get it done.
2. When you’re doing something similar for the second time, cringe at having to repeat but do the same thing anyway.
3. When you’re doing something for the third time, start refactoring.
**When adding a feature**
1. Refactoring helps you understand other people’s code
2. Refactoring makes it easier to add new features
**When fixing a bug**
1. Proactive refactoring as it eliminates the need for special refactoring tasks later
During a code review
1. The code review may be the last chance to tidy up the code before it becomes available to the public.