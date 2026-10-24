import { Page, TestInfo } from '@playwright/test';

export async function captureScreenshot( page: Page, testInfo: TestInfo, name: string) 
{
  const screenshot = await page.screenshot({
    fullPage: true,
    animations: 'disabled',
  });

  await testInfo.attach(name, {
    body: screenshot,
    contentType: 'image/png',
  });
}
