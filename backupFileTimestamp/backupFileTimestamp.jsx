//init settings
var doc = app.activeDocument;
var docName = doc.name;
var docPath = doc.path;

var inPath = docName + "/" + docPath;
var backupPath = docPath + "/old_" + getTrimStr(docName, ".", 0);

/**
 メイン
 **/
// if (BridgeTalk.appName == "photoshop") {
//   main();
// }

function main() {
  doc.save(); //ファイルを上書き保存
  makeDir(backupPath);

  try {
    // 開いたファイルにアクションを適用
    doAction(ACTION_NAME, SET_NAME);

    //.psdの前の部分を抽出
    inName = activeDocument.name;
    inName = getTrimStr(inName, ".", 0);

    // 分割されたファイルを保存する
    saveAsJPG(outPath + "/" + inName + ".jpg");

    doFinish();
  } catch (e) {
    alert("fail to make backup. please check any problem");
  }

  doOpen(inPath);
}

/**
   ファイルを開く
**/
function doOpen(fileName) {
  var fileRef = new File(fileName);
  open(fileRef);
  fileRef = null;
}

/**
   PSDで保存する
**/
function saveAsPSD(outPath) {
  var fileObj = new File(outPath);

  var psdOpt = new PhotoshopSaveOptions();
  psdOpt.layers = true; // Preserve layers.
  psdOpt.embedColorProfile = true; // Preserve color profile.
  psdOpt.annotations = true; // Preserve annotations.
  psdOpt.alphaChannels = true; // Preserve alpha channels.
  psdOpt.spotColors = true; // Preserve spot colors.

  doc.saveAs(fileObj, psd_Opt, true);
}

/**
   SPointでstrの文字列を分解して、SNumberのブロックを取り出す
**/
function getTrimStr(str, SPoint, SNumber) {
  var result = "";

  var SArray = str.split(SPoint);
  var result = SArray[SNumber];

  return result;
}

/**
   ファイルを閉じる
**/
function doFinish() {
  activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

function getTimeStamp() {
  var now = new Date();

  var yea = String(now.getFullYear());
  var mon = String(now.getMonth() + 1);
  var dat = String(now.getDate());
  var hou = String(now.getHours());
  var min = String(now.getMinutes());
  var sec = String(now.getSeconds());
  yea = yea.slice(-2);
  mon = ("00" + mon).slice(-2);
  dat = ("00" + dat).slice(-2);
  hou = ("00" + hou).slice(-2);
  min = ("00" + min).slice(-2);
  sec = ("00" + sec).slice(-2);

  var nowTime = yea + mon + dat + "_" + hou + min + sec;
  return nowTime;
}

/**
   pathのフォルダが無ければ作る
**/
function makeDir(path) {
  newFolder = new Folder(path);
  if (!path.exists) {
    newFolder.create();
  }
}
