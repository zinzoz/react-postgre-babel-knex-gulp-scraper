//import express  from 'express';
//let router = express.Router();
import request  from 'request';
import cheerio   from 'cheerio';
import db   from './db';



export function scrapeWeb(){


let url = 'http://www.nasdaq.com/';
let indexq , valueq, netq;
let json = { index : "", value : "", net : ""};

//if( getTimenow() >= '09:30:00' &&  getTimenow() <= '16:00:00'){
setInterval( ()=> {



request(url, (error, response, html) => {
    if(!error){
        let $ = cheerio.load(html);

  $('#indexTable').find('script').filter( function(){
        let data = $(this);
         //console.log(data.text());
        indexq = data.text().replace("//<![CDATA[", "").replace(/"/g,'').split("nasdaqHomeIndexChart.storeIndexInfo(")[1].split(",")[0];
        valueq = data.text().replace("//<![CDATA[", "").replace(/"/g,'').split("nasdaqHomeIndexChart.storeIndexInfo(")[1].split(",")[1];
        netq = data.text().replace("//<![CDATA[", "").replace(/"/g,'').split("nasdaqHomeIndexChart.storeIndexInfo(")[1].split(",")[2]
        json.index =indexq;
        json.value = valueq;
        json.net = netq;
    })

    db.insert({index: indexq , value: valueq ,net:netq ,date:getDateTime()}, 'id').into('nasdaq')
      .catch((error)=> {
        console.error(error);
      }).then( ()=> {
        console.log("ok");
      });





}


})













}, 10000);

//}


function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;

}

function getTimenow() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;



    return  hour + ":" + min + ":" + sec;

}





}
