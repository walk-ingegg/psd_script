IMG_EXTENSION = "*.psd";
ACTION_NAME = "vicc_trim";
SET_NAME = "vicc_trim";

var myDoc = app.activeDocument;
var inPath = myDoc.path + "/" + myDoc.name;
alert(inPath);
doOpen(inPath);
/**
   ファイルを開く
**/
function doOpen(fileName) {
  var fileRef = new File(fileName);
  open(fileRef);
  fileRef = null;
}
