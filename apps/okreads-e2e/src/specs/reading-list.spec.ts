import { $, browser, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });
});

describe('When: I use the finished reading feature', () => {
  it('Then: I should see my reading list update to show a finished state', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    // search for book to add to list
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    // add book to reading list
    const addBookButton = await $('[data-testing="book-item"] button:not([disabled="true"])');
    await addBookButton.click();

    // open reading list
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
    
    // mark book as finished
    const finishBookButton = await $('.reading-list-item button:not([color="warn"])');
    await finishBookButton.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('.reading-list-item--details--finished-date'),
        'Finished'
      )
    );
    
    // clean up our reading list for subsequent tests
    const removeBookButton = await $('.reading-list-item button[color="warn"]');
    await removeBookButton.click();
  });
  
  it('Then: I should see my book search update to show that the book is finished', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    // search for book to add to list
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    // add book to reading list
    const addBookButton = await $('[data-testing="book-item"] button:not([disabled="true"])');
    await addBookButton.click();

    // open reading list
    let readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
    
    // mark book as finished
    const finishBookButton = await $('.reading-list-item button:not([color="warn"])');
    await finishBookButton.click();

    // close the reading list
    const closeListButton = await $('.reading-list-container h2 button');
    await closeListButton.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('.book .mat-button-wrapper'),
        'Finished'
      )
    );
    
    // open reading list and clean up the list for subsequent tests
    readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
    const removeBookButton = await $('.reading-list-item button[color="warn"]');
    await removeBookButton.click();
  });
});
