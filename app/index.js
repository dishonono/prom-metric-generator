const express = require('express');
const promMid = require('express-prometheus-middleware');
const app = express();
var fs = require('fs');
const random = require('random')
const stringHash = require("string-hash");

const PORT = 3000;

const ALERT_RATIO = 100;
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
}));

var geoRandomFunc =random.geometric((p = 0.5))
var queryDurationFunc = function() {
  //return 100;
  return (geoRandomFunc()-0.95)*50*3 * 10;
}

var returnedDataFunc= function () {
  var rand = Math.random();
  if (rand<0.75) {
    return Math.round(Math.random()*5)
  } else if (rand<0.9) {
    return Math.round(Math.random()*100)
  } else if (rand<0.95) {
    return Math.round(Math.random()*4000)
  } else{
    return Math.round(Math.random()*40000)
  }
}

// var randoms= []
// for (var i=0; i<6000; i++) {
//   randoms.push(returnedDataFunc()) //returnedDataFunc())
// }
//  const percentile = require("percentile");
// // const { Console } = require('console');
// const result = percentile(
//   [10,20,30,40,50,60,70, 80,90,95,99], 
//   randoms
// );
//console.log(result);

// curl -X GET localhost:9091/hello?name=Chuck%20Norris
app.get('/', (req, res) => {
  console.log('GET /');
  const { name = 'Anon' } = req.query;
  res.json({ message: `Hello, ${name}!` });
});

app.use(express.static('public'))

app.use(express.raw({ type: "*/*" }));
app.post('/slack', (req, res) => {
  console.log('POST /slack');
  fs.writeFile(`/usr/app/alerts/incoming_alert_${(new Date()).toISOString()}.txt`, req.body, "binary", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });
  res.end();
});

app.post('/api/v2/alerts', async (req, res) => {
  
  console.log(`POST ${req.url}`);
  await sleep(10);
  // fs.writeFile(`/usr/app/alerts/incoming_raw_${(new Date()).toISOString()}.txt`, req.body, "binary", function (err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("The file was saved!");
  //   }
  // });
  res.end();
});

app.get('/api/v1/query', async (req, res) => {
  
  //console.log(`GET ${req.url}`);
  
  const data =  {
    "status" : "success",
    "data" : {
       "resultType" : "vector",
       "result" : [
       ]
    }
  };

  const ns = req.headers["namespace"];
  if (ns === "prometheus_alerts" || ns === "alerts") {
    //console.log("headers:"+ JSON.stringify(req.headers)); 
    let thingToHash = Math.floor((new Date()).getMinutes() / 10) +"_"+ req.headers["mdmaccountname"] + req.query.query 
    console.log(`GET ${req.url} ALERT WITH QUERY`);
    var numRecords = Math.floor(returnedDataFunc()/50);
    res.set('x-res-num', numRecords);
    for (i=0; i<numRecords;i++)
       data.data.result.push(createSample(i))  
    

  } else  if (ns === "prometheus_rules") {
    console.log(`GET ${req.url} RECRODING WITH QUERY`);
    var numRecords = returnedDataFunc();
    res.set('x-res-num', numRecords);
    for (i=0; i<numRecords;i++)
        data.data.result.push(createSample(i))
  } else {
    console.log(`GET ${req.url} QUERY WITH NS ${ns}`);
    res.set('x-res-num', 0);
  }

  await sleep(queryDurationFunc());

  res.json(data );
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

app.listen(PORT, () => {
  console.log(`Example api is listening on http://localhost:${PORT} bb`);
});


function createSample(i) {
  let ts = Date.now();
  return {
    "metric" : {
       "__name__" : "up",
       "job" : "node"+i,
       "instance" : "localhost:9100"
    },
    "value" : [ ts/1000, "1" ]
  };
}
/*

 {
               "metric" : {
                  "__name__" : "up",
                  "job" : "prometheus",
                  "instance" : "localhost:9090"
               },
               "value": [ 1435781451.781, "1" ]
            },
            {
               "metric" : {
                  "__name__" : "up",
                  "job" : "node",
                  "instance" : "localhost:9100"
               },
               "value" : [ 1435781451.781, "0" ]
            }

*/