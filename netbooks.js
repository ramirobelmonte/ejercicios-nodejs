require('dotenv').config();
const notifier = require('node-notifier');
const puppeteer = require('puppeteer-core');

async function netbook(){
  const browser = await puppeteer.launch({headless: true, executablePath:process.env.PATH_BROWSER});
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://especiales.tiendabna.com.ar');
  await page.waitForSelector('a.img.d-block');
  let href = await page.evaluate(() => Object.fromEntries(document.querySelectorAll('a.img.d-block'), element => [['title', element.title],['url', element.title]]));
  console.log(href)
//  for(url of href[0])
  browser.close();
};
netbook();
