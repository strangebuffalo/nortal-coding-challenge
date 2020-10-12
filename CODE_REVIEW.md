# Code Review
## General
- book-search.component should be broken into more components
- Routing is defined directly in books-feature.module.ts; should be moved to books-feature-routing.module.ts
- total-count.component.ts implements ngOnInit but doesn't do anything with it; remove implementation
- Show user some indication of loading search results
## A11y
### Lighthouse Report
#### Names and Labels
- Button to execute search does not have an accessible name
#### Contrast
- Background and foreground colors do not have sufficient contrast ratio
### Manual Report
- Button used to open reading list has no label
- Button used to close reading list has no label
- Link to execute search for "Javascript" has no label