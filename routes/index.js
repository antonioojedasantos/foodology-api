var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');

/* GET home page. */
router.get(
  '/restaurants/all/:address', 
  async function(req, res, next) {
    try{
      
      const { address } = req.params;
      console.log( address );

      const browser = await puppeteer.launch(/*{ headless : false}*/);
      const page = await browser.newPage();

      await page.goto('https://www.rappi.com.mx/restaurantes');
      await page.waitForTimeout(5000);
      
      await page.type('[data-testid=FieldDefault]', address );
      await page.waitForTimeout(5000);

      await page.click('.ItemAutoComplete-sc-1ll4vt7 span');

      await page.waitForSelector('[class=opened]');
      await page.waitForTimeout(10000);


      const datos = JSON.parse(await page.evaluate(() =>{
        
        const elements = document.querySelector('[id=__NEXT_DATA__]').innerText;
        
         return elements;
      }));

      //console.log(datos.props.pageProps.restaurants.stores);
      await browser.close();

      

      res.status(200).json({
        data:datos.props.pageProps.restaurants.stores,
        message: 'Lista de resturantes',
        status_code: 200
      });

    }catch(err) {
      next(err);
    }
   
    
    
   
});


module.exports = router;
