import { $, $$, browser, ExpectedConditions } from 'protractor';

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

describe('When: I undo an add to my reading list', () => {

  async function readingListLength(): Promise<number> {
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
  
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  
    const readingListItems = await $$('.reading-list-item');
  
    const closeReadingListButton = await $('[data-testing="reading-list-container"] > h2 > button');
    await closeReadingListButton.click();
  
    return readingListItems.length;
  }

  it('Then: my reading list should be the same as before I added the book', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const initialReadingListLength = await readingListLength();

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const addBookButton = await $('[data-testing="book-item"] button:not([disabled="true"])');
    await addBookButton.click();

    // I did lots of searching and attempts with no success and found this as the solution
    // that helped others get past this point, but it still didn't work...
    // neither did waiting on ExpectedConditions.elementToBeClickable(undoAddButton)
    const undoAddButton = $('.mat-simple-snackbar-action button');
    browser.wait(ExpectedConditions.visibilityOf(undoAddButton), 5000);
    await undoAddButton.click();

    const currentReadingListLength = await readingListLength();
    expect(currentReadingListLength).toEqual(initialReadingListLength);
  });
});

describe('When: I undo a removal from my reading list', () => {

  it('Then: my reading list should be the same as before I removed the book', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    // add a book to our reading list in case it's empty
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();
    const addBookButton = await $('[data-testing="book-item"] button:not([disabled="true"])');
    await addBookButton.click();
    
    // open reading list
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );

    let readingListItems = await $$('.reading-list-item');
    const initialReadingListLength = readingListItems.length;

    const removeBookButton = await $('.reading-list-item button');
    await removeBookButton.click();
    
    const undoRemoveButton = await $('.mat-simple-snackbar-action');
    await browser.wait(ExpectedConditions.visibilityOf(undoRemoveButton), 5000);
    await undoRemoveButton.click();


    readingListItems = await $$('.reading-list-item');
    const currentReadingListLength = readingListItems.length;
    expect(currentReadingListLength).toEqual(initialReadingListLength);
  });
});
