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
  alert(JSON.stringify(o));
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

$(function() {
  $('#nsSub').click(function() {
    var temp = $('#newSong').serializeObject();
    alert(JSON.stringify(temp));
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

    alert(JSON.stringify(newSong));

    /*$.post('/query', SLCT, function(Fname) {
      var jsonHtmlTable = ConvertJsonToTable(Fname, 'jsonTable', "table table-bordered table-hover", 'Download');
      $('#jsonTable').remove();
      $('#tForm').append(jsonHtmlTable);
      $('.table').dragableColumns();
      jQuery.each(newAttr, function(i, val) {
        $("#" + val).hide();
      });
    }, 'json');*/
    return false;
  });
});
