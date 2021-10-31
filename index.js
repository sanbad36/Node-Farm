const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');



const tempOverview = fs.readFileSync( `${__dirname}/templates/template-overview.html`,'utf-8' );
const tempCard = fs.readFileSync( `${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

// Read the Main data json
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);


//  creating server with routes

const server = http.createServer((req, res) => {
    
    // parsing the url and extracting the pathname and query string 
    const { query, pathname } = url.parse(req.url, true);

    
    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        // replacing the HTML tempate present in the card , with the exact data. 
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        // now we are replacing the original overview or home page with the html string which we received from the card html after filling the templates with the data 
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }

    // Product page, will be called with the query string, and accodingly we render the page with the id of that data in the json
    else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        // Here we are extracting only that data which matches the query string. 
        const product = dataObj[query.id];
        
        // replacing the product template only with that extracted data. 
        const output = replaceTemplate(tempProduct, product);
        res.end(output); 
    } 
    
    }  
       // Not Found 
       else {
        res.writeHead(404, {
            'Content-type': 'text/html',
        });
        res.end('<h1>Page not found!</h1>');
    }
});

// Here the server is listing the client request. 
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});
