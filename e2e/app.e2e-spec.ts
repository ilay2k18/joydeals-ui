import { JoydealsUiPage } from './app.po';

describe('joydeals-ui App', function() {
  let page: JoydealsUiPage;

  beforeEach(() => {
    page = new JoydealsUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
