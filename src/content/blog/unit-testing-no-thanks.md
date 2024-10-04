---
title: 'Unit testing? No, thanks'
description: 'Everybody talks about unit testing. But are they really useful, compared to other types of tests, like E2E tests?'
pubDate: 'Oct 04 2024'
heroImage: '/unit-testing.jpg'
category: 'decode-spot'
type: 'post'
---

At one point, I had to hit the wild goal of 90% test coverage. But guess what? It was all unit tests. And guess again…
yep, everything still blew up in production!

Get ready! It's time to start Decode!

## Why Unit Testing is useless (compared to other testing types)

1. Limited scope

   Unit testing focuses on testing individual components or functions in isolation. This often means mocking
   dependencies, which results in tests that don't reflect real-world scenarios. In contrast, integration tests validate
   how different modules work together, offering more comprehensive coverage by testing real interactions.

   Unit tests can pass even if the whole application is broken, due to issues between components, databases, or
   third-party APIs. This is a critical limitation of unit testing, it doesn’t capture the bigger picture.

2. False sense of security

   Developers may feel overly confident in their codebase if unit tests pass, even though these tests don’t check
   whether the entire system runs correctly. This sense of security can be dangerous when end-to-end (E2E) tests
   are neglected, as these type of tests are designed to evaluate the system from the user's perspective.

   While unit tests might ensure that individual components behave as expected in isolation, they fail to validate real
   user flows, where interactions between different layers of the system (frontend, backend, databases) are essential.

3. High maintenance cost

   In many cases, unit tests need to be updated whenever there are changes to the internal implementation of the
   codebase, even if the external behavior hasn’t changed. This high maintenance cost can become a drain on resources.
   End-to-end testing, by contrast, focuses on user-facing behavior and tends to be more resilient to internal
   refactors, reducing the frequency of necessary test updates.

   Unit tests can often require developers to write tests for every small change, which can lead to test fatigue and
   frustration when developers have to continuously update or fix tests after refactoring, even if nothing is broken
   from the user’s perspective.

4. Neglecting real use cases

   Unit tests focus on the "happy path" of individual components, often ignoring the edge cases and real-world user
   scenarios. Since these tests tend to mock external services (like APIs or databases), they don't account for network
   failures, performance issues, or unexpected user behavior. Integration and E2E tests are more effective at simulating
   real-world conditions, ensuring that the entire system is robust under different scenarios.

   For example, an E2E test might reveal that a sequence of interactions between two components fails under certain
   conditions, even though unit tests for each component pass individually.

5. Focus on implementation, not behaviour

   Unit tests typically test internal logic, which can lead to tests that are too closely tied to implementation
   details. This results in fragile tests that break when refactoring, even if the whole behavior of the application
   remains unchanged. By comparison, behavior-driven tests (e.g., with tools like Cucumber) focus on how the system
   behaves from a user's perspective. These higher-level tests ensure that the system behaves as intended without being
   concerned with how the code is structured internally.

   This difference in focus, means that unit tests may fail to capture the actual value, that the software provides to
   end users, which is the core concern of most software projects.

## The case for other testing types

While unit testing has its place, other testing methodologies might offer more value in many scenarios:

- Integration Tests: Test how components work together. These tests ensure that APIs, databases, and third-party
  services interact as expected. Integration testing provides confidence that the different system’s components, work in
  harmony.

- End-to-End Tests (E2E): Focus on testing the whole system from a user's perspective, from start to finish. These
  tests mimic real user actions, ensuring the entire system behaves correctly in production.

## Conclusion

Unit testing is not entirely useless, but compared to other testing methodologies, it can fall short in capturing the
true essence of how a system behaves in real-world conditions. Integration tests and end-to-end tests, offer broader and
deeper insights into the health of an application by testing real-world scenarios, that unit tests alone cannot address.

By emphasizing other forms of testing over unit tests, teams can invest their time in higher-value tests that offer more
substantial assurances that the application is behaving as expected in the real world.

That's it for today. And Decode... finished.