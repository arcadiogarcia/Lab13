
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(express.static(__dirname + '/static_content'));
app.use(bodyParser.json())
var request = require("request");
if(typeof Promise == "undefined"){
    Promise = require('promise');
}

function getTimetable(day, month, year) {
    return new Promise(function(resolve, reject) {
            request("http://www.eps.uam.es/nueva_web/lab_libres.php?dia=" +
        day +
        "&mes=" + month +
        "&anno=" + year, function(error, response, body) {
            var regexFindRows = /<tr class=".*">\s*?<td class="lab"><a href=".*?">.*?<\/a><\/td>[\s\S]*?<\/tr>/g;
            var regexFindName = /<td class="lab"><a href=".*?">(.*?)<\/a><\/td>/;
            var regexFindHora = /<td class="hora (hora_actual )?(ocupada )?" title="(.*?)">&nbsp;<\/td>/g;
            var results, rows = [];
            while ((results = regexFindRows.exec(body))) {
                rows.push(results[0]);
            }
            var timetable = {};
            rows.forEach(function(x) {
                var thisLab = [];
                var name = regexFindName.exec(x)[1];
                var values;
                while (values = regexFindHora.exec(x)) {
                    if (values != null) {
                        thisLab.push({
                            isNow: values[1] != null,
                            available: values[2] == null,
                            title: values[3]
                        });
                    }
                }
                timetable[name] = thisLab;
            });

            resolve(timetable);
        });
    });
}


app.get('/API/lab/list', function(req, res, next) {
    var date= new Date();
    getTimetable(date.getDate(),date.getMonth(),date.getFullYear()).then(function(result){
        var list=[];
        for(var k in result){
            list.push(k);
        }
            res.json(list);
    });
    //    res.json(events);
});



app.get('/API/lab/:day/:month/:year', function(req, res, next) {
    getTimetable(req.params.day, req.params.month, req.params.year).then(function(result){
            res.json(result);
    });
    //    res.json(events);
});


app.get('/API/lab/:day/:month/:year/:id', function(req, res, next) {
    getTimetable(req.params.day, req.params.month, req.params.year).then(function(result){
        var thisLab=result[req.params.id];
        if(thisLab){
            res.json(thisLab);
        }else{
            res.json({error:req.params.id+" is not a valid lab", errId:1})
        }
    });
    //    res.json(events);
});

app.listen(process.env.PORT || 8080);
