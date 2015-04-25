$.fn.serializeObject = function() { // extract data from form to json
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

function chopTags(str, arr) {
  var arr = [];
  while (str != "") {
    if (str.indexOf(" ") == -1) {
      arr.push(str);
      str = "";
    }
    else {
      arr.push(str.slice(0, str.indexOf(" ")));
      str = str.slice(str.indexOf(" ") + 1);
    }
  }
  //str.indexOf(" ");
  return arr;
}

String.prototype.format = function()
{
  var args = arguments;

  return this.replace(/{(\d+)}/g, function(match, number)
  {
    return typeof args[number] != 'undefined' ? args[number] :
                                                '{' + number + '}';
  });
};
function ConvertJsonToTable(parsedJson, tableId, tableClassName, linkText)
{
    //Patterns for links and NULL value
    var italic = '<i>{0}</i>';
    var link = linkText ? '<a href="{0}">' + linkText + '</a>' :
                          '<a href="{0}">{0}</a>';

    //Pattern for table
    var idMarkup = tableId ? ' id="' + tableId + '"' :
                             '';

    var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
                                       '';

    var tbl = '<table border="1" cellpadding="1" cellspacing="1"' + idMarkup + classMarkup + '>{0}{1}</table>';

    //Patterns for table content
    var th = '<thead>{0}</thead>';
    var tb = '<tbody>{0}</tbody>';
    var tr = '<tr>{0}</tr>';
    var thRow = '<th>{0}</th>';
    var tdRow = '<td>{0}</td>';
    var thCon = '';
    var tbCon = '';
    var trCon = '';

    if (parsedJson)
    {
        var isStringArray = typeof(parsedJson[0]) == 'string';
        var headers;

        // Create table headers from JSON data
        // If JSON data is a simple string array we create a single table header
        if(isStringArray)
            thCon += thRow.format('value');
        else
        {
            // If JSON data is an object array, headers are automatically computed
            if(typeof(parsedJson[0]) == 'object')
            {
                headers = array_keys(parsedJson[0]);

                for (i = 0; i < headers.length; i++)
                    thCon += thRow.format(headers[i]);
            }
        }
        th = th.format(tr.format(thCon));

        // Create table rows from Json data
        if(isStringArray)
        {
            for (i = 0; i < parsedJson.length; i++)
            {
                tbCon += tdRow.format(parsedJson[i]);
                trCon += tr.format(tbCon);
                tbCon = '';
            }
        }
        else
        {
            if(headers)
            {
                var urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
                var javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/ig);

                for (i = 0; i < parsedJson.length; i++)
                {
                    for (j = 0; j < headers.length; j++)
                    {
                        var value = parsedJson[i][headers[j]];
                        var isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);

                        if(isUrl)   // If value is URL we auto-create a link
                            tbCon += tdRow.format(link.format(value));
                        else
                        {
                            if(value){
                            	if(typeof(value) == 'object'){
                            		//for supporting nested tables
                            		tbCon += tdRow.format(ConvertJsonToTable(eval(value.data), value.tableId, value.tableClassName, value.linkText));
                            	} else {
                            		tbCon += tdRow.format(value);
                            	}

                            } else {    // If value == null we format it like PhpMyAdmin NULL values
                                tbCon += tdRow.format(italic.format(value).toUpperCase());
                            }
                        }
                    }
                    trCon += tr.format(tbCon);
                    tbCon = '';
                }
            }
        }
        tb = tb.format(trCon);
        tbl = tbl.format(th, tb);

        return tbl;
    }
    return null;
}


/**
 * Return just the keys from the input array, optionally only for the specified search_value
 * version: 1109.2015
 *  discuss at: http://phpjs.org/functions/array_keys
 *  +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *  +      input by: Brett Zamir (http://brett-zamir.me)
 *  +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *  +   improved by: jd
 *  +   improved by: Brett Zamir (http://brett-zamir.me)
 *  +   input by: P
 *  +   bugfixed by: Brett Zamir (http://brett-zamir.me)
 *  *     example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} );
 *  *     returns 1: {0: 'firstname', 1: 'surname'}
 */
function array_keys(input, search_value, argStrict)
{
    var search = typeof search_value !== 'undefined', tmp_arr = [], strict = !!argStrict, include = true, key = '';

    if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
        return input.keys(search_value, argStrict);
    }

    for (key in input)
    {
        if (input.hasOwnProperty(key))
        {
            include = true;
            if (search)
            {
                if (strict && input[key] !== search_value)
                    include = false;
                else if (input[key] != search_value)
                    include = false;
            }
            if (include)
                tmp_arr[tmp_arr.length] = key;
        }
    }
    return tmp_arr;
}

$(function() {  // add new song form submit
  $('#nsSub').click(function() {
    var temp = $('#newSong').serializeObject();
    //alert(JSON.stringify(temp));
    var tmpCD = temp.CD;
    var tmpSC = temp.SC;
    var tmpST = temp.ST;
    var tmpMD = temp.MD;
    var CtyDst = chopTags(tmpCD);
    var Sceneh = chopTags(tmpSC);
    var Styleh = chopTags(tmpST);
    var Moodhh = chopTags(tmpMD);

    var newSong = {};
    newSong["district"] = CtyDst;
    newSong["scene"] = Sceneh;
    newSong["style"] = Styleh;
    newSong["mood"] = Moodhh;
    newSong["file"] = temp.file;
    newSong["name"] = temp.NM;
    newSong["year"] = temp.YR;
    newSong["artist"] = temp.AT;

    alert(JSON.stringify(newSong));
    $.post('/add', newSong, function(res) {
      var addRes = '';
      if (res.state == true)
        addRes = '<h2 id="result" align=center>Your music has been added, please enjoy it.</h2>';
      else
        addRes = '<h2 id="result" align=center>Sorry, music upload fail..</h2>';
      $('#result').remove();
      $('#ResCanvus').append(addRes);
      $("#myTab li:eq(3) a").tab('show');
    }, 'json');
    return false;
  });
});

$(function() {
  $('#stSub').click(function() {
    var temp = $('#selectTrack').serializeObject();
    //alert(JSON.stringify(temp));
    var tmpCD = temp.CD;
    var tmpSC = temp.SC;
    var tmpST = temp.ST;
    var tmpMD = temp.MD;
    var CtyDst = chopTags(tmpCD);
    var Sceneh = chopTags(tmpSC);
    var Styleh = chopTags(tmpST);
    var Moodhh = chopTags(tmpMD);

    var sltTrack = {};
    sltTrack["district"] = CtyDst;
    sltTrack["scene"] = Sceneh;
    sltTrack["style"] = Styleh;
    sltTrack["mood"] = Moodhh;
    sltTrack["name"] = temp.NM;
    sltTrack["year"] = temp.YR;
    sltTrack["artist"] = temp.AT;

    $.post('/sltTrack', sltTrack, function(res) {
      var jsonHtmlTable = ConvertJsonToTable(res, 'result', "table table-bordered table-hover", 'Download');
      $('#result').remove();
      $('#ResCanvus').append(jsonHtmlTable);
      $("#myTab li:eq(3) a").tab('show');
    }, 'json');
    return false;
  });
});
