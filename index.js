require('dotenv').config(); //Variables de entorno en un archivo .env en la raiz
const notifier = require('node-notifier'); //Modulo notificaciones
const puppeteer = require('puppeteer-core'); //Modulo para el scraping

async function scraping(){

  //Notificacion de espera
  notifier.notify({
	title: 'Argentina Programa',
	message: 'Esto demora un poco',
	icon: 'utilities-terminal-symbolic'
  });

  const browser = await puppeteer.launch({headless: true, executablePath:process.env.PATH_BROWSER});
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://www1.masterconsultas.com.ar/socios/context/init_input.action');//Url de la web
  await page.waitForSelector('input#usernameId');//Espera a que cargue el formulario
  await page.type('input#usernameId',process.env.USER_NAME);
  await page.waitForTimeout(500);
  await page.type('input#password',process.env.PASSWORD);
  await page.waitForTimeout(500);
  await page.click('input#submitLogin');//Click para acceder
  await page.waitForSelector('table#gridAvanceSelfServiceIssuerSub1');//Esperamos a la tabla de saldo
  await page.$eval('table#gridAvanceSelfServiceIssuerSub1>tbody>tr:nth-child(3)>td~td',(el) => el.innerText)
		.then((valor)=>{
			notifier.notify({
				title: 'Argentina Programa',
				message: "Tu saldo: " + parseInt(valor),
				icon: 'process-completed-symbolic'
 			})
		})
		.catch((error)=>{
			notifier.notify({
				title: error.name,
				message: error.message,
				icon: 'process-error-symbolic'
 			});
		})
  browser.close();
};

scraping().catch(
  (e) => {
	notifier.notify({
		title:"¡OH NO!: "+e.name,
		message:e.message,
		icon: 'process-error-symbolic'
	})
	process.exit();
  }
);
